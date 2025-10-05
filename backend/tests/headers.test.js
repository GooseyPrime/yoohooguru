/**
 * Test for security and performance headers
 */

const request = require('supertest');

describe('Security and Performance Headers', () => {
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

  describe('Root endpoint (/)', () => {
    it('should include cache-control header', async () => {
      const response = await request(app)
        .get('/')
        .expect(404);

      expect(response.headers['cache-control']).toBeDefined();
      expect(response.headers['cache-control']).not.toBe('');
    });

    it('should include x-content-type-options header', async () => {
      const response = await request(app)
        .get('/')
        .expect(404);

      expect(response.headers['x-content-type-options']).toBeDefined();
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
  });

  describe('Favicon endpoint (/favicon.ico)', () => {
    it('should include cache-control header', async () => {
      const response = await request(app)
        .get('/favicon.ico')
        .expect(200);

      expect(response.headers['cache-control']).toBeDefined();
      expect(response.headers['cache-control']).not.toBe('');
      expect(response.headers['cache-control']).toContain('public');
    });

    it('should include x-content-type-options header', async () => {
      const response = await request(app)
        .get('/favicon.ico')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBeDefined();
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
  });

  describe('API endpoint (/api)', () => {
    it('should include cache-control header', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.headers['cache-control']).toBeDefined();
      expect(response.headers['cache-control']).not.toBe('');
    });

    it('should include x-content-type-options header', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBeDefined();
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
  });

  describe('Health endpoint (/health)', () => {
    it('should include cache-control header', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers['cache-control']).toBeDefined();
      expect(response.headers['cache-control']).not.toBe('');
    });

    it('should include x-content-type-options header', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBeDefined();
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
  });

  describe('Content Security Policy', () => {
    it('should include bigdatacloud.net in connect-src directive', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.headers['content-security-policy']).toBeDefined();
      expect(response.headers['content-security-policy']).toContain('https://api.bigdatacloud.net');
    });

    it('should include api-bdc.io in connect-src directive for BigDataCloud redirect', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.headers['content-security-policy']).toBeDefined();
      expect(response.headers['content-security-policy']).toContain('https://api-bdc.io');
    });

    it('should include unsplash.com in connect-src directive', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.headers['content-security-policy']).toBeDefined();
      expect(response.headers['content-security-policy']).toContain('https://api.unsplash.com');
      expect(response.headers['content-security-policy']).toContain('https://images.unsplash.com');
    });
  });
});