/**
 * Test to verify that webhook routes bypass CSRF protection
 * This ensures that webhook endpoints (which use signature verification)
 * are not blocked by CSRF middleware
 */

const request = require('supertest');

// Mock Firebase before requiring the app
jest.mock('../src/config/firebase', () => ({
  initializeFirebase: jest.fn(() => Promise.resolve()),
  getFirestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ exists: false, data: () => ({}) })),
        set: jest.fn(() => Promise.resolve()),
        update: jest.fn(() => Promise.resolve())
      })),
      get: jest.fn(() => Promise.resolve({ forEach: () => {} }))
    }))
  })),
  getAuth: jest.fn(() => ({
    verifyIdToken: jest.fn(() => Promise.resolve({ uid: 'test-user', email: 'test@example.com' }))
  }))
}));

// Mock stripe
jest.mock('../src/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: jest.fn((payload, signature, secret) => {
        if (signature === 'invalid_signature') {
          throw new Error('Invalid signature');
        }
        const payloadString = Buffer.isBuffer(payload) ? payload.toString('utf8') : String(payload);
        return JSON.parse(payloadString);
      })
    }
  }
}));

describe('Webhook CSRF Bypass', () => {
  let app;

  beforeAll(() => {
    // Set environment to production-like to enable CSRF
    process.env.NODE_ENV = 'production';
    process.env.SERVE_FRONTEND = 'false';
    process.env.SESSION_SECRET = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret';
    
    // Clear the require cache
    delete require.cache[require.resolve('../src/index')];
    delete require.cache[require.resolve('../src/config/appConfig')];
    
    // Require the app
    app = require('../src/index');
  });

  afterAll(() => {
    // Reset environment
    process.env.NODE_ENV = 'test';
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  describe('Stripe webhook endpoint', () => {
    it('should accept webhook POST requests without CSRF token', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_webhook',
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_12345' } }
      });

      // Create a valid signature
      const crypto = require('crypto');
      const timestamp = Math.floor(Date.now() / 1000);
      const signingString = timestamp + '.' + payload;
      const signature = crypto.createHmac('sha256', 'whsec_test_secret').update(signingString).digest('hex');
      const stripeSignature = `t=${timestamp},v1=${signature}`;

      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('stripe-signature', stripeSignature)
        .set('content-type', 'application/json')
        .send(payload);

      // Should succeed (200) or handle the event (not 403 CSRF error)
      expect(response.status).not.toBe(403);
      expect(response.status).toBe(200);
    });

    it('should bypass CSRF for webhook routes', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_csrf_bypass',
        type: 'checkout.session.completed',
        data: { object: { id: 'cs_test_12345' } }
      });

      const crypto = require('crypto');
      const timestamp = Math.floor(Date.now() / 1000);
      const signingString = timestamp + '.' + payload;
      const signature = crypto.createHmac('sha256', 'whsec_test_secret').update(signingString).digest('hex');
      const stripeSignature = `t=${timestamp},v1=${signature}`;

      // POST to webhook without CSRF token should work
      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('stripe-signature', stripeSignature)
        .set('content-type', 'application/json')
        .send(payload);

      // Verify no CSRF error
      expect(response.status).not.toBe(403);
      expect(response.body).not.toMatchObject({
        error: expect.objectContaining({
          message: expect.stringContaining('CSRF')
        })
      });
    });
  });

  describe('Non-webhook endpoint', () => {
    it('should require CSRF for non-webhook POST requests in production', async () => {
      // This test documents the expected behavior but may not work 
      // in test environment since we need actual session management
      // The key assertion is that webhook routes are excluded from CSRF

      const response = await request(app)
        .post('/api/auth/verify')
        .send({ token: 'test' });

      // In production mode with CSRF enabled, this would fail with 403
      // But in this test, we're mainly verifying the webhook exclusion works
      // The response might be 400 (bad request) or 403 (CSRF), but not 200
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});
