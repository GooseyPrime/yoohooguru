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
        business_type: 'individual'
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

module.exports = router;