/**
 * Test for guru subdomain validation fixes
 * 
 * Tests that the guru routes properly handle invalid subdomains
 * from URL parameters (like Vercel deployment IDs) instead of 
 * returning 502 errors.
 */

const request = require('supertest');
const app = require('../src/index');

describe('Guru Subdomain Validation Fixes', () => {
  
  describe('Invalid subdomain handling', () => {
    it('should return 404 for invalid subdomain in URL - services endpoint', async () => {
      const response = await request(app)
        .get('/gurus/yoohooguru-frontend-fs8rc0oyo-intellme/services')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Invalid guru subdomain');
      expect(response.body.message).toContain('yoohooguru-frontend-fs8rc0oyo-intellme');
      expect(response.body.availableSubdomains).toContain('cooking');
    });

    it('should return 404 for invalid subdomain in URL - home endpoint', async () => {
      const response = await request(app)
        .get('/gurus/yoohooguru-frontend-fs8rc0oyo-intellme/home')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Invalid guru subdomain');
    });

    it('should return 404 for invalid subdomain in URL - news endpoint', async () => {
      const response = await request(app)
        .get('/api/gurus/news/yoohooguru-frontend-fs8rc0oyo-intellme')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Invalid guru subdomain');
    });

    it('should handle OPTIONS requests for invalid subdomains gracefully', async () => {
      const response = await request(app)
        .options('/gurus/yoohooguru-frontend-fs8rc0oyo-intellme/services')
        .set('Origin', 'http://localhost:3000');
      
      // Should still return CORS headers even for 404s
      expect(response.status).toBe(404);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });
  });

  describe('Valid subdomain handling', () => {
    it('should work correctly for valid subdomains - cooking', async () => {
      const response = await request(app)
        .get('/gurus/cooking/services')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.guru.character).toBe('Chef Guru');
    });

    it('should work correctly for valid subdomains - tech', async () => {
      const response = await request(app)
        .get('/gurus/tech/home')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.guru.character).toBe('Tech Guru');
    });

    it('should work correctly for news endpoint with valid subdomain', async () => {
      const response = await request(app)
        .get('/api/gurus/news/music')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.subdomain).toBe('music');
    });
  });

  describe('API vs non-API route consistency', () => {
    it('should handle invalid subdomains consistently across API and non-API routes', async () => {
      const invalidSubdomain = 'yoohooguru-frontend-fs8rc0oyo-intellme';
      
      // Test non-API route
      const nonApiResponse = await request(app)
        .get(`/gurus/${invalidSubdomain}/home`)
        .set('Origin', 'http://localhost:3000');
      
      // Test API route  
      const apiResponse = await request(app)
        .get(`/api/gurus/news/${invalidSubdomain}`)
        .set('Origin', 'http://localhost:3000');
      
      expect(nonApiResponse.status).toBe(404);
      expect(apiResponse.status).toBe(404);
      expect(nonApiResponse.body.error).toBe('Invalid guru subdomain');
      expect(apiResponse.body.error).toBe('Invalid guru subdomain');
    });
  });

  describe('CORS preflight handling for invalid subdomains', () => {
    it('should handle OPTIONS requests properly even for invalid subdomains', async () => {
      const response = await request(app)
        .options('/gurus/invalid-vercel-deployment-id/home')
        .set('Origin', 'http://localhost:3000');
      
      // CORS should still work for OPTIONS requests
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
      expect(response.headers['access-control-allow-methods']).toMatch(/GET/);
    });
  });
});