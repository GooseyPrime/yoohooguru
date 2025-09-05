// Lightweight Stripe client
const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  if (isDevelopment) {
    console.warn('[stripe] STRIPE_SECRET_KEY not set. For local development, add STRIPE_SECRET_KEY=sk_test_... to your .env file. Stripe features will be disabled.');
  } else {
    console.warn('[stripe] STRIPE_SECRET_KEY not set. Set this in Railway or your production environment.');
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

module.exports = { stripe };