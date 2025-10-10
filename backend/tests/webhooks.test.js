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

// Mock the stripe lib module directly instead of the stripe package
jest.mock('../src/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: jest.fn((payload, signature, secret) => {
        // Simple test-friendly validation:
        // If signature is 'invalid_signature', throw error
        if (signature === 'invalid_signature') {
          throw new Error('Invalid signature');
        }
        
        // For any other signature (including valid ones), accept it
        // Convert payload to string if it's a Buffer, then parse as JSON
        let payloadString;
        if (Buffer.isBuffer(payload)) {
          payloadString = payload.toString('utf8');
        } else if (typeof payload === 'string') {
          payloadString = payload;
        } else if (typeof payload === 'object') {
          payloadString = JSON.stringify(payload);
        } else {
          payloadString = String(payload);
        }
        
        // Parse the JSON payload to return a proper event object
        try {
          const event = JSON.parse(payloadString);
          return event;
        } catch (error) {
          throw new Error('Invalid JSON payload');
        }
      })
    }
  }
}));

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
  let originalStripeSecretKey;

  beforeAll(() => {
    originalStripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    originalStripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    // Clear STRIPE_SECRET_KEY for tests to ensure we use the test mock
    delete process.env.STRIPE_SECRET_KEY;
    
    // Clear require cache to force re-evaluation of stripe lib
    delete require.cache[require.resolve('../src/lib/stripe')];
    delete require.cache[require.resolve('../src/routes/stripeWebhooks')];
    delete require.cache[require.resolve('../src/index')];
  });

  afterAll(() => {
    if (originalStripeWebhookSecret !== undefined) {
      process.env.STRIPE_WEBHOOK_SECRET = originalStripeWebhookSecret;
    }
    if (originalStripeSecretKey !== undefined) {
      process.env.STRIPE_SECRET_KEY = originalStripeSecretKey;
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
        .send(payload);

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
        .send(payload);

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
        .send(payload);

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
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.received).toBe(true);
    });

    test('should handle payout.updated events successfully', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_payout',
        type: 'payout.updated',
        data: {
          object: {
            id: 'po_test_12345',
            amount: 1414,
            currency: 'usd',
            status: 'paid'
          }
        }
      });

      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('content-type', 'application/json')
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.received).toBe(true);
    });
  });
});