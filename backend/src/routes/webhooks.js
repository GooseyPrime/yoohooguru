const express = require('express');

const router = express.Router();

// Note: Stripe webhook handler moved to stripeWebhooks.js for better SDK integration
// This file is reserved for non-Stripe webhooks if needed in the future

module.exports = router;