const express = require('express');
const { stripe } = require('../lib/stripe');
const { getFirestore } = require('../config/firebase');
const { logger } = require('../utils/logger');

const router = express.Router();

// Health check endpoint for webhook debugging
router.get('/health', (req, res) => {
  const webhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = !!process.env.STRIPE_SECRET_KEY;
  
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    webhook_secret_configured: webhookSecret,
    stripe_key_configured: stripeKey,
    environment: process.env.NODE_ENV,
    endpoint: '/api/webhooks/stripe/'
  });
});

router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  // Enhanced logging for debugging
  logger.info(`📥 Webhook received - signature present: ${!!sig}, secret configured: ${!!endpointSecret}`);

  try {
    if (!stripe && process.env.NODE_ENV !== 'test') {
      logger.error('Stripe not configured - missing STRIPE_SECRET_KEY');
      return res.status(503).json({ 
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' 
      });
    }

    if (!endpointSecret) {
      logger.error('Webhook secret not configured - missing STRIPE_WEBHOOK_SECRET');
      return res.status(503).json({ 
        error: 'Stripe webhook secret not configured. Please set STRIPE_WEBHOOK_SECRET environment variable.' 
      });
    }

    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    logger.info(`✅ Webhook signature verified - event type: ${event.type}`);
  } catch (err) {
    logger.error('❌ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const db = getFirestore();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        logger.info(`🎯 Processing checkout.session.completed: ${session.id}`);
        // session.metadata could include jobId/listingId/etc.
        const jobId = session?.metadata?.jobId;
        if (jobId) {
          await db.collection('job_bookings').doc(jobId).update({
            status: 'paid',
            checkout_session_id: session.id,
            payment_intent_id: session.payment_intent || null,
            updated_at: new Date().toISOString()
          });
          logger.info(`✅ Updated job booking ${jobId} to paid status`);
        } else {
          logger.info(`ℹ️ No jobId in session metadata for ${session.id}`);
        }
        // Subscriptions will also come here if you sell Guru Pass.
        break;
      }

      case 'account.updated': {
        const acct = event.data.object;
        logger.info(`🏦 Processing account.updated: ${acct.id}`);
        // Find which profile has this accountId (store reverse index if you like)
        // Here we scan profiles once (ok for MVP scale). For scale, keep an index: accountId -> uid.
        const profilesSnap = await db.collection('profiles').get();
        const batch = db.batch();
        
        let updatedProfiles = 0;
        profilesSnap.forEach((doc) => {
          const p = doc.data() || {};
          if (p.stripe_account_id === acct.id) {
            const ready = Boolean(acct.payouts_enabled && acct.charges_enabled && acct.details_submitted);
            batch.update(db.collection('profiles').doc(doc.id), { payouts_ready: ready });
            updatedProfiles++;
          }
        });
        
        await batch.commit();
        logger.info(`✅ Updated ${updatedProfiles} profiles for account ${acct.id}`);
        break;
      }

      default:
        logger.info(`ℹ️ Unhandled event type: ${event.type}`);
        break;
    }

    logger.info(`✅ Webhook processed successfully: ${event.type}`);
    res.json({ received: true });
  } catch (err) {
    logger.error('❌ Webhook handler error:', err);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

module.exports = router;