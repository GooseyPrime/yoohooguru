const express = require('express');
const { body, validationResult } = require('express-validator');
const { stripe } = require('../lib/stripe');
const { getFirestore } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');
const { logger } = require('../utils/logger');
const { SUPPORTED_CURRENCIES, MIN_PAYOUT_AMOUNT_CENTS } = require('../utils/constants');

const router = express.Router();

/**
 * Get Stripe account ID for a user from Firestore
 * 
 * @param {string} uid - User ID to look up
 * @returns {Promise<string|null>} Stripe account ID or null if not found
 */
async function getAccountId(uid) {
  const db = getFirestore();
  const snap = await db.collection('profiles').doc(uid).get();
  const profile = snap.exists ? snap.data() : {};
  return profile.stripe_account_id || null;
}

// GET /api/payouts/balance
router.get('/balance', authenticateUser, async (req, res) => {
  try {
    if (!stripe && process.env.NODE_ENV !== 'test') {
      return res.status(503).json({ 
        ok: false, 
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' 
      });
    }

    const accountId = await getAccountId(req.user.uid);
    if (!accountId) return res.json({ ok: true, connected: false });

    const bal = await stripe.balance.retrieve({ stripeAccount: accountId });
    res.json({
      ok: true,
      connected: true,
      balance: {
        available: bal.available || [],
        instant_available: bal.instant_available || [],
        pending: bal.pending || []
      }
    });
  } catch (e) {
    logger.error('payouts/balance', { error: e.message, stack: e.stack });
    res.status(500).json({ ok: false, error: 'Failed to load balance' });
  }
});

// Validation for instant payout
const validateInstantPayout = [
  body('amountCents').optional().isInt({ min: MIN_PAYOUT_AMOUNT_CENTS }).withMessage(`Amount must be at least ${MIN_PAYOUT_AMOUNT_CENTS} cents`),
  body('currency').optional().isIn(SUPPORTED_CURRENCIES).withMessage(`Currency must be one of: ${SUPPORTED_CURRENCIES.join(', ')}`)
];

// POST /api/payouts/instant
// body: { amountCents?: number, currency?: 'usd' }
router.post('/instant', authenticateUser, validateInstantPayout, async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  
  try {
    if (!stripe && process.env.NODE_ENV !== 'test') {
      return res.status(503).json({ 
        ok: false, 
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' 
      });
    }

    const accountId = await getAccountId(req.user.uid);
    if (!accountId) return res.status(400).json({ ok: false, error: 'Stripe account not connected' });

    const currency = (req.body.currency || 'usd').toLowerCase();
    const bal = await stripe.balance.retrieve({ stripeAccount: accountId });

    const instantForCurrency = (bal.instant_available || []).find(a => a.currency === currency);
    if (!instantForCurrency) {
      return res.status(400).json({ ok: false, error: 'No instant-available balance for this currency' });
    }

    const maxInstant = instantForCurrency.amount; // in cents
    if (maxInstant <= 0) {
      return res.status(400).json({ ok: false, error: 'No instant balance available for payout' });
    }

    // Determine payout amount
    let amountCents = req.body.amountCents;
    if (!amountCents || amountCents <= 0) {
      amountCents = maxInstant; // payout all
    }
    
    if (amountCents > maxInstant) {
      return res.status(400).json({ 
        ok: false, 
        error: `Amount exceeds instant-available balance. Max: ${maxInstant} cents` 
      });
    }

    // Create instant payout
    const payout = await stripe.payouts.create({
      amount: amountCents,
      currency,
      method: 'instant'
    }, {
      stripeAccount: accountId
    });

    res.json({
      ok: true,
      data: {
        id: payout.id,
        amountCents: payout.amount,
        currency: payout.currency,
        status: payout.status,
        method: payout.method
      }
    });
  } catch (e) {
    logger.error('payouts/instant', { error: e.message, code: e.code, stack: e.stack });
    
    // Handle common Stripe errors with user-friendly messages
    let errorMessage = 'Failed to create instant payout';
    if (e.code === 'insufficient_funds') {
      errorMessage = 'Insufficient funds for instant payout';
    } else if (e.code === 'instant_payouts_unsupported') {
      errorMessage = 'Instant payouts not supported. Please add a debit card in your Stripe Dashboard';
    } else if (e.code === 'debit_not_supported') {
      errorMessage = 'Debit card payouts not supported. Please add a supported debit card';
    }
    
    res.status(400).json({ ok: false, error: errorMessage });
  }
});

module.exports = router;