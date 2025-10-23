const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { getConfig } = require('../config/appConfig');
const { logger } = require('../utils/logger');
const { SUPPORTED_CURRENCIES, MIN_PAYMENT_AMOUNT_CENTS } = require('../utils/constants');

const router = express.Router();

// Strict rate limiter for payment endpoints to prevent abuse
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 payment requests per windowMs
  message: 'Too many payment requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  // Remove custom keyGenerator to use the default IPv6-compatible one
});

// Get payment configuration
router.get('/config', (req, res) => {
  const config = getConfig();
  
  res.json({
    success: true,
    data: {
      publishableKey: config.stripePublishableKey,
      priceIds: {
        guruPass: config.stripeGuruPassPriceId,
        skillVerification: config.stripeSkillVerificationPriceId,
        trustSafety: config.stripeTrustSafetyPriceId
      },
      webhookEndpoint: `${config.apiBaseUrl}/api/webhooks/stripe`
    }
  });
});

// Main payments endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: { 
      message: 'Payments endpoint - Available',
      endpoints: {
        config: '/api/payments/config',
        webhook: '/api/webhooks/stripe'
      }
    }
  });
});

/**
 * Validation for payment intent creation
 * Note: amount should be provided in cents (e.g., 1000 = $10.00)
 */
const validatePaymentIntent = [
  body('amount').isInt({ min: MIN_PAYMENT_AMOUNT_CENTS }).withMessage(`Amount must be at least ${MIN_PAYMENT_AMOUNT_CENTS} cents`),
  body('currency').optional().isIn(SUPPORTED_CURRENCIES).withMessage(`Currency must be one of: ${SUPPORTED_CURRENCIES.join(', ')}`),
  body('description').optional().trim().isLength({ max: 200 }).withMessage('Description too long')
];

/**
 * Create payment intent (placeholder for future implementation)
 * @route POST /api/payments/create-payment-intent
 * @param {number} amount - Payment amount in cents (e.g., 1000 = $10.00)
 * @param {string} currency - Currency code (usd, eur, gbp)
 * @param {string} description - Optional payment description
 */
router.post('/create-payment-intent', paymentLimiter, validatePaymentIntent, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
    }

    // TODO: Implement Stripe payment intent creation
    logger.info('Payment intent creation requested', { 
      amount: req.body.amount, 
      currency: req.body.currency 
    });
    
    res.json({
      success: false,
      message: 'Payment intent creation - Coming soon'
    });
  } catch (error) {
    logger.error('Payment intent creation error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create payment intent' }
    });
  }
});

// Get subscription status (placeholder for future implementation)
router.get('/subscription/:userId', (req, res) => {
  // TODO: Implement subscription status check
  res.json({
    success: false,
    message: 'Subscription status check - Coming soon'
  });
});

module.exports = router;