const express = require('express');
const rateLimit = require('express-rate-limit');
const { stripe } = require('../lib/stripe');
const { getFirestore } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Define a rate limiter: max 5 requests per minute per IP to this route
const expressLoginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: { ok: false, error: 'Too many attempts, please try again later.' }
});

// POST /api/connect/express-login
router.post('/express-login', expressLoginLimiter, authenticateUser, async (req, res) => {
  try {
    if (!stripe && process.env.NODE_ENV !== 'test') {
      return res.status(503).json({ 
        ok: false, 
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' 
      });
    }

    const db = getFirestore();
    const snap = await db.collection('profiles').doc(req.user.uid).get();
    const profile = snap.exists ? snap.data() : {};
    if (!profile.stripe_account_id) return res.status(400).json({ ok: false, error: 'Not connected to Stripe' });

    const link = await stripe.accounts.createLoginLink(profile.stripe_account_id);
    res.json({ ok: true, url: link.url });
  } catch (e) {
    console.error('express-login', e);
    res.status(500).json({ ok: false, error: 'Failed to create login link' });
  }
});

module.exports = router;