/**
 * Test for express-session and lusca CSRF integration
 * Verifies that session middleware is properly configured before lusca
 */

const request = require('supertest');

describe('Session and CSRF Configuration', () => {
  let app;

  beforeAll(() => {
    // Set test environment
    process.env.SERVE_FRONTEND = 'false';
    
    // Clear the require cache
    delete require.cache[require.resolve('../src/index')];
    delete require.cache[require.resolve('../src/config/appConfig')];
    
    // Require the app
    app = require('../src/index');
  });

  afterAll(() => {
    delete process.env.SERVE_FRONTEND;
  });

  describe('Health endpoint with session', () => {
    it('should not throw session error on /health route', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });

    it('should not require session cookie for GET requests', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Session cookie is not set for GET requests since saveUninitialized is false
      // and CSRF is disabled in test mode
      expect(response.body.status).toBe('OK');
    });
  });

  describe('API endpoint with session', () => {
    it('should not throw session error on /api route', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.message).toBeDefined();
    });

    it('should not require session cookie for GET requests', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      // Session cookie is not set for GET requests since saveUninitialized is false
      // and CSRF is disabled in test mode
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST requests without CSRF in test mode', () => {
    it('should process POST requests without CSRF tokens in test environment', async () => {
      // In test environment, CSRF is disabled to simplify testing
      // POST requests should work without CSRF tokens
      const response = await request(app)
        .post('/api/auth/verify')
        .send({})
        .expect(400); // 400 because token is missing, not 403 for CSRF

      // Verify it's a validation error, not CSRF error
      expect(response.body.success).toBe(false);
    });
  });
});
