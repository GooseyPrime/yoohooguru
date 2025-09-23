/**
 * Test for favicon handling
 */

const request = require('supertest');

describe('Favicon Handling', () => {
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

  it('should serve favicon.ico successfully', async () => {
    const response = await request(app)
      .get('/favicon.ico')
      .expect(200);

    expect(response.headers['content-type']).toBe('image/gif');
    expect(response.headers['cache-control']).toBe('public, max-age=86400');
    expect(Buffer.isBuffer(response.body)).toBe(true);
  });

  it('should return consistent favicon for multiple requests', async () => {
    const response1 = await request(app)
      .get('/favicon.ico')
      .expect(200);

    const response2 = await request(app)
      .get('/favicon.ico')
      .expect(200);

    expect(response1.body).toEqual(response2.body);
  });
});