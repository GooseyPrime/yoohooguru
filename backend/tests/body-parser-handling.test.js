/**
 * Test for body parser error handling
 */

const request = require('supertest');

describe('Body Parser Error Handling', () => {
  let app;

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

  it('should handle malformed JSON gracefully', async () => {
    const response = await request(app)
      .post('/api/auth/verify')
      .set('Content-Type', 'application/json')
      .send('{"invalid": json}') // Malformed JSON
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toBe('Invalid request body');
  });

  it('should handle valid JSON properly', async () => {
    const response = await request(app)
      .post('/api/auth/verify')
      .set('Content-Type', 'application/json')
      .send({ token: 'test-token' });

    // This should not return 400 for malformed body, it will return 400 or 401 for invalid token
    // which is expected behavior
    expect(response.status).not.toBe(500); // Should not be a server error
  });

  it('should handle empty body on endpoints expecting JSON', async () => {
    const response = await request(app)
      .post('/api/auth/verify')
      .set('Content-Type', 'application/json')
      .send();

    // Empty body is valid JSON (undefined), should be handled by route logic, not body parser
    expect(response.status).not.toBe(500);
  });
});
