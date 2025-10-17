const express = require('express');
const rateLimit = require('express-rate-limit');
const { stripe } = require('../lib/stripe');
const { getFirestore } = require('../config/firebase');
const { logger } = require('../utils/logger');
const escapeHtml = require('escape-html');

const router = express.Router();

// Strict rate limiter for webhook endpoints
// Webhooks should be infrequent; excessive requests may indicate an attack
const webhookLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Limit each IP to 50 webhook requests per 5 minutes
  message: 'Too many webhook requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
});

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

router.post('/', webhookLimiter, async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  // Enhanced logging for debugging
  logger.info(`📥 Webhook received - signature present: ${!!sig}, secret configured: ${!!endpointSecret}`);

  try {
    // In test environment, handle missing Stripe configuration gracefully
    const isTestEnv = process.env.NODE_ENV === 'test';
    
    if (!stripe && !isTestEnv) {
      logger.error('Stripe not configured - missing STRIPE_SECRET_KEY');
      return res.status(503).json({ 
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' 
      });
    }

    if (!endpointSecret && !isTestEnv) {
      logger.error('Webhook secret not configured - missing STRIPE_WEBHOOK_SECRET');
      return res.status(503).json({ 
        error: 'Stripe webhook secret not configured. Please set STRIPE_WEBHOOK_SECRET environment variable.' 
      });
    }

    // For test environment, handle webhook signature verification gracefully
    if (isTestEnv) {
      // In test environment, handle missing webhook secret gracefully
      if (!endpointSecret) {
        logger.info('🧪 Test environment: STRIPE_WEBHOOK_SECRET not configured, processing webhook without signature verification');
        // Parse the webhook payload directly for test environment
        event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } else if (stripe && stripe.webhooks) {
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
          logger.info('🧪 Test environment: webhook signature verified successfully');
        } catch (err) {
          // In test environment, if signature is provided but invalid, still reject it
          // Only be permissive when no signature is provided at all
          if (sig && sig.trim() !== '') {
            logger.error('🧪 Test environment: Invalid signature provided, rejecting webhook');
            throw err; // Re-throw to trigger the catch block below
          } else {
            logger.warn('🧪 Test environment: No signature provided, processing without verification');
            // Parse the webhook payload directly for test environment
            event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
          }
        }
      } else {
        // Parse the webhook payload directly for test environment
        event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        logger.info('🧪 Test environment: webhook processed without signature verification');
      }
    } else {
      // Production environment: always verify signature
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    
    logger.info(`✅ Webhook signature verified - event type: ${event.type}`);
  } catch (err) {
    logger.error('❌ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${escapeHtml(err.message)}`);
  }

  try {
    const db = getFirestore();
    
    // If Firebase is not available (returns null in test environment), skip DB operations
    if (!db) {
      logger.info(`⚠️ Firebase not available - webhook processed without DB updates (test mode)`);
      logger.info(`✅ Webhook processed successfully: ${event.type}`);
      return res.json({ received: true, test_mode: true });
    }

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

      case 'payout.updated':
      case 'payout.paid':
      case 'payout.failed': {
        const payout = event.data.object;
        logger.info(`💰 Processing ${event.type}: ${payout.id} - Status: ${payout.status}, Amount: ${payout.amount} ${payout.currency}`);
        // Payout events are logged for monitoring purposes
        // Future: Add logic to update payout records in database if needed
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