const express = require('express');
const { stripe } = require('../lib/stripe');
const { getDatabase } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.post('/start', authenticateUser, async (req, res) => {
  try {
    const { uid, email } = req.user;
    const db = getDatabase();
    const profSnap = await db.ref(`profiles/${uid}`).once('value');
    const profile = profSnap.val() || {};

    let accountId = profile.stripe_account_id;

    // Create Express account if missing
    if (!accountId) {
      const acct = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email,
        capabilities: {
          transfers: { requested: true },      // required for destination charges
          card_payments: { requested: true }   // optional, good for future flexibility
        },
        business_type: 'individual',
        settings: {
          payouts: {
            schedule: {
              interval: 'manual'  // Enable manual/instant payouts
            }
          }
        }
      });
      accountId = acct.id;
      await db.ref(`profiles/${uid}`).update({ stripe_account_id: accountId, payouts_ready: false });
    }

    const base = process.env.PUBLIC_BASE_URL || 'https://yoohoo.guru';
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${base}/connect/refresh`,
      return_url:  `${base}/connect/return`,
      type: 'account_onboarding'
    });

    res.json({ ok: true, url: link.url, accountId });
  } catch (err) {
    console.error('connect/start error', err);
    res.status(500).json({ ok: false, error: 'Failed to start onboarding' });
  }
});

router.get('/status', authenticateUser, async (req, res) => {
  try {
    const { uid } = req.user;
    const db = getDatabase();
    const profSnap = await db.ref(`profiles/${uid}`).once('value');
    const profile = profSnap.val() || {};
    const accountId = profile.stripe_account_id;
    if (!accountId) return res.json({ ok: true, connected: false });

    const acct = await stripe.accounts.retrieve(accountId);
    const { charges_enabled, payouts_enabled, details_submitted, requirements = {} } = acct;

    // mirror a simple boolean in the profile for quick UI gating (optional)
    await db.ref(`profiles/${uid}`).update({
      payouts_ready: Boolean(payouts_enabled && charges_enabled && details_submitted)
    });

    res.json({
      ok: true,
      connected: true,
      accountId,
      charges_enabled,
      payouts_enabled,
      details_submitted,
      currently_due: requirements.currently_due || []
    });
  } catch (err) {
    console.error('connect/status error', err);
    res.status(500).json({ ok: false, error: 'Failed to load status' });
  }
});

// Get account balance with instant available amounts
router.get('/balance', authenticateUser, async (req, res) => {
  try {
    const { uid } = req.user;
    const db = getDatabase();
    const profSnap = await db.ref(`profiles/${uid}`).get();
    const profile = profSnap.val() || {};
    const accountId = profile.stripe_account_id;
    
    if (!accountId) {
      return res.status(400).json({ 
        ok: false, 
        error: 'No connected account found. Please complete account setup first.' 
      });
    }

    // Get balance with instant_available expansion as shown in the issue
    const balance = await stripe.balance.retrieve({
      expand: ['instant_available.net_available']
    }, {
      stripeAccount: accountId
    });

    res.json({
      ok: true,
      accountId,
      balance: {
        available: balance.available,
        pending: balance.pending,
        instant_available: balance.instant_available,
        connect_reserved: balance.connect_reserved,
        livemode: balance.livemode
      }
    });
  } catch (err) {
    console.error('connect/balance error', err);
    res.status(500).json({ ok: false, error: 'Failed to retrieve balance' });
  }
});

// Create instant payout
router.post('/instant-payout', authenticateUser, async (req, res) => {
  try {
    const { uid } = req.user;
    const { amount, currency = 'usd' } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Valid amount is required for payout' 
      });
    }

    const db = getDatabase();
    const profSnap = await db.ref(`profiles/${uid}`).get();
    const profile = profSnap.val() || {};
    const accountId = profile.stripe_account_id;
    
    if (!accountId) {
      return res.status(400).json({ 
        ok: false, 
        error: 'No connected account found. Please complete account setup first.' 
      });
    }

    // Verify account is ready for payouts
    if (!profile.payouts_ready) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Account is not ready for payouts. Please complete account verification.' 
      });
    }

    // Create instant payout
    const payout = await stripe.payouts.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      method: 'instant'
    }, {
      stripeAccount: accountId
    });

    res.json({
      ok: true,
      payout: {
        id: payout.id,
        amount: payout.amount,
        currency: payout.currency,
        status: payout.status,
        method: payout.method,
        arrival_date: payout.arrival_date,
        fees: payout.fees
      }
    });
  } catch (err) {
    console.error('connect/instant-payout error', err);
    
    // Handle common Stripe errors gracefully
    if (err.type === 'StripeCardError' || err.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        ok: false, 
        error: err.message || 'Payout failed',
        code: err.code
      });
    }
    
    res.status(500).json({ ok: false, error: 'Failed to create instant payout' });
  }
});

module.exports = router;