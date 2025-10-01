// Mock Firebase dependencies for webhook tests
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

// Mock Stripe for webhook signature verification
jest.mock('stripe', () => {
  return jest.fn(() => ({
    webhooks: {
      constructEvent: jest.fn((payload, signature, secret) => {
        // Simple test-friendly validation:
        // If signature is 'invalid_signature', throw error
        // Otherwise, accept it as valid
        if (signature === 'invalid_signature') {
          throw new Error('Invalid signature');
        }
        
        // For any other signature (including valid ones), accept it
        // Convert payload to string if it's a Buffer, then parse as JSON
        const payloadString = Buffer.isBuffer(payload) ? payload.toString() : 
                             (typeof payload === 'object' ? JSON.stringify(payload) : payload);
        
        const event = typeof payloadString === 'string' ? JSON.parse(payloadString) : payloadString;
        return event;
      })
    }
  }));
});

// Mock seed test data functions to avoid Firebase dependency
jest.mock('./seed-test-data', () => ({
  seedTestData: jest.fn(() => Promise.resolve()),
  clearTestData: jest.fn(() => Promise.resolve())
}));

const request = require('supertest');
const crypto = require('crypto');
const app = require('../src/index');
const { seedTestData, clearTestData } = require('./seed-test-data');

describe('Stripe Webhooks', () => {
  let originalStripeWebhookSecret;

  beforeAll(() => {
    originalStripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  });

  afterAll(() => {
    if (originalStripeWebhookSecret !== undefined) {
      process.env.STRIPE_WEBHOOK_SECRET = originalStripeWebhookSecret;
    }
  });

  beforeEach(async () => {
    await clearTestData();
    await seedTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  const createValidSignature = (payload, secret, timestamp) => {
    const signingString = timestamp + '.' + payload;
    const signature = crypto.createHmac('sha256', secret).update(signingString).digest('hex');
    return `t=${timestamp},v1=${signature}`;
  };

  describe('POST /api/webhooks/stripe - with STRIPE_WEBHOOK_SECRET', () => {
    beforeEach(() => {
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_placeholder';
    });

    test('should accept valid webhook with proper signature', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_webhook',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_12345',
            metadata: {
              jobId: 'job-123'
            },
            payment_intent: 'pi_test_12345'
          }
        }
      });

      const timestamp = Math.floor(Date.now() / 1000);
      const signature = createValidSignature(payload, 'whsec_test_placeholder', timestamp);

      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('stripe-signature', signature)
        .set('content-type', 'application/json')
        .send(Buffer.from(payload));

      expect(response.status).toBe(200);
      expect(response.body.received).toBe(true);
    });

    test('should reject webhook with invalid signature', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_webhook',
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_12345' } }
      });

      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('stripe-signature', 'invalid_signature')
        .set('content-type', 'application/json')
        .send(Buffer.from(payload));

      expect(response.status).toBe(400);
      expect(response.text).toContain('Webhook Error');
    });
  });

  describe('POST /api/webhooks/stripe - without STRIPE_WEBHOOK_SECRET', () => {
    beforeEach(() => {
      delete process.env.STRIPE_WEBHOOK_SECRET;
    });

    test('should process webhook without signature verification when secret is missing in test environment', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_webhook',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_12345',
            metadata: {
              jobId: 'job-123'
            },
            payment_intent: 'pi_test_12345'
          }
        }
      });

      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('content-type', 'application/json')
        .send(Buffer.from(payload));

      expect(response.status).toBe(200);
      expect(response.body.received).toBe(true);
    });

    test('should handle unknown event types gracefully when secret is missing', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_webhook',
        type: 'unknown.event.type',
        data: {
          object: {
            id: 'obj_test_12345'
          }
        }
      });

      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('content-type', 'application/json')
        .send(Buffer.from(payload));

      expect(response.status).toBe(200);
      expect(response.body.received).toBe(true);
    });
  });
});