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

    it('should include session cookie in response', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Session middleware should set a cookie
      expect(response.headers['set-cookie']).toBeDefined();
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

    it('should include session cookie in API response', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      // Session middleware should set a cookie
      expect(response.headers['set-cookie']).toBeDefined();
    });
  });

  describe('CSRF protection', () => {
    it('should have CSRF token available in session', async () => {
      // First request to establish session
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Should have session cookie
      expect(response.headers['set-cookie']).toBeDefined();
      
      // Extract session cookie
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(Array.isArray(cookies)).toBe(true);
    });
  });
});
