/**
 * Test for frontend serving configuration
 */

const request = require('supertest');

describe('Frontend Serving Configuration', () => {
  let app;

  describe('when SERVE_FRONTEND is false', () => {
    beforeAll(() => {
      // Set environment variable before requiring the app
      process.env.SERVE_FRONTEND = 'false';
      
      // Clear the require cache for the app and config modules
      delete require.cache[require.resolve('../src/index')];
      delete require.cache[require.resolve('../src/config/appConfig')];
      
      // Now require the app with the new configuration
      app = require('../src/index');
    });

    afterAll(() => {
      // Clean up
      delete process.env.SERVE_FRONTEND;
    });

    it('should return API info for root route instead of trying to serve frontend', async () => {
      const response = await request(app)
        .get('/')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route Not Found');
      expect(response.body).toHaveProperty('message', 'This is an API-only server. Frontend is deployed separately.');
      expect(response.body).toHaveProperty('api');
      expect(response.body.api).toHaveProperty('version');
      expect(response.body.api).toHaveProperty('baseUrl', '/api');
    });

    it('should return API info for any non-API route', async () => {
      const response = await request(app)
        .get('/some-frontend-route')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route Not Found');
      expect(response.body).toHaveProperty('message', 'This is an API-only server. Frontend is deployed separately.');
    });

    it('should still handle API routes normally', async () => {
      await request(app)
        .get('/health')
        .expect(200);
    });

    it('should return proper 404 for non-existent API routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'API Route Not Found');
    });
  });
});