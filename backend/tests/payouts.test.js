const request = require('supertest');
const app = require('../src/index');

// Remove Firebase mocking - use real Firebase connections

// Mock authentication for testing
jest.mock('../src/middleware/auth', () => ({
  authenticateUser: (req, res, next) => {
    req.user = { uid: 'test-user-id' };
    next();
  },
  optionalAuth: (req, res, next) => {
    // Optional auth doesn't require a user
    next();
  },
  requireRole: (roles) => (req, res, next) => {
    next();
  }
}));

describe('Payouts API Tests', () => {
  describe('GET /api/payouts/balance', () => {
    it('should return not connected when no Stripe account', async () => {
      const response = await request(app)
        .get('/api/payouts/balance')
        .expect(200);

      expect(response.body).toEqual({
        ok: true,
        connected: false
      });
    });
  });

  describe('POST /api/payouts/instant', () => {
    it('should return error when not connected to Stripe', async () => {
      const response = await request(app)
        .post('/api/payouts/instant')
        .send({ amountCents: 1000, currency: 'usd' })
        .expect(400);

      expect(response.body).toEqual({
        ok: false,
        error: 'Stripe account not connected'
      });
    });
  });

  describe('POST /api/connect/express-login', () => {
    it('should return error when not connected to Stripe', async () => {
      const response = await request(app)
        .post('/api/connect/express-login')
        .expect(400);

      expect(response.body).toEqual({
        ok: false,
        error: 'Not connected to Stripe'
      });
    });
  });
});

describe('Feature Flags API Tests', () => {
  describe('GET /api/feature-flags', () => {
    it('should include instantPayouts flag', async () => {
      const response = await request(app)
        .get('/api/feature-flags')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.flags.instantPayouts).toBe(true);
    });
  });
});