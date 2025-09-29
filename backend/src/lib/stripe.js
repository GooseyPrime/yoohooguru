// Lightweight Stripe client
const Stripe = require('stripe');
const crypto = require('crypto');

let stripe;

if (!process.env.STRIPE_SECRET_KEY) {
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  const isTest = process.env.NODE_ENV === 'test';
  
  if (isTest) {
    // In test environment, provide a functional mock for webhook signature verification
    stripe = {
      webhooks: {
        constructEvent: (payload, signature, secret) => {
          // Basic signature verification for tests
          if (!signature || !secret) {
            throw new Error('No signature or secret provided');
          }
          
          // Parse timestamp and signature from Stripe signature format
          const elements = signature.split(',');
          let timestamp, testSignature;
          
          for (const element of elements) {
            const [key, value] = element.split('=');
            if (key === 't') {
              timestamp = value;
            } else if (key === 'v1') {
              testSignature = value;
            }
          }
          
          if (!timestamp || !testSignature) {
            throw new Error('Invalid signature format');
          }
          
          // Verify the signature matches what we expect
          const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
          const signingString = timestamp + '.' + payloadString;
          const expectedSignature = crypto.createHmac('sha256', secret).update(signingString).digest('hex');
          
          if (expectedSignature !== testSignature) {
            throw new Error('Invalid signature');
          }
          
          // Return parsed event
          return typeof payload === 'string' ? JSON.parse(payload) : payload;
        }
      }
    };
  } else if (isDevelopment) {
    console.warn('[stripe] STRIPE_SECRET_KEY not set. For local development, add STRIPE_SECRET_KEY=sk_test_... to your .env file. Stripe features will be disabled.');
    stripe = null;
  } else {
    console.warn('[stripe] STRIPE_SECRET_KEY not set. Set this in Railway or your production environment.');
    stripe = null;
  }
} else {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16'
  });
}

module.exports = { stripe };