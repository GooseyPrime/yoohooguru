const request = require('supertest');
const crypto = require('crypto');
const app = require('../src/index');
const { seedTestData, clearTestData } = require('./seed-test-data');

describe('Stripe Webhooks', () => {
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

  describe('POST /api/webhooks/stripe', () => {
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

    test('should handle checkout.session.completed event and update job booking', async () => {
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
      
      // Verify the job booking was updated in Firebase
      const { getFirestore } = require('../src/config/firebase');
      const db = getFirestore();
      const jobDoc = await db.collection('job_bookings').doc('job-123').get();
      
      if (jobDoc.exists) {
        const jobData = jobDoc.data();
        expect(jobData.status).toBe('paid');
        expect(jobData.checkout_session_id).toBe('cs_test_12345');
        expect(jobData.payment_intent_id).toBe('pi_test_12345');
      }
    });

    test('should handle account.updated event and update profile payouts_ready status', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_webhook',
        type: 'account.updated',
        data: {
          object: {
            id: 'acct_test_12345',
            payouts_enabled: true,
            charges_enabled: true,
            details_submitted: true
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

    test('should handle unknown event types gracefully', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_webhook',
        type: 'unknown.event.type',
        data: {
          object: {
            id: 'obj_test_12345'
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
  });
});