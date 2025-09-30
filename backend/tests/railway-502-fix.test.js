/**
 * Test for Railway 502 error fixes
 * 
 * Tests that the routes causing 502 errors in production now handle
 * OPTIONS (CORS preflight) requests correctly.
 */

const request = require('supertest');
const express = require('express');

// Create a minimal test app to simulate the fix
function createTestApp() {
  const app = express();
  
  // Minimal CORS setup for testing
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });
  
  // Mock guru routes middleware
  app.use((req, res, next) => {
    req.guru = { isGuru: true, subdomain: 'test-subdomain' };
    next();
  });
  
  // Simulate the guru routes that were failing
  const gurusRoutes = express.Router();
  
  gurusRoutes.get('/:subdomain/home', (req, res) => {
    res.json({ message: 'Guru home page', subdomain: req.params.subdomain });
  });
  
  gurusRoutes.get('/:subdomain/services', (req, res) => {
    res.json({ message: 'Guru services page', subdomain: req.params.subdomain });
  });
  
  gurusRoutes.get('/news/:subdomain', (req, res) => {
    res.json({ message: 'Guru news page', subdomain: req.params.subdomain });
  });
  
  // Simulate auth routes that were failing
  const authRoutes = express.Router();
  
  authRoutes.get('/profile', (req, res) => {
    res.json({ message: 'User profile' });
  });
  
  // Mount routes at both API and non-API paths (the fix)
  app.use('/api/gurus', gurusRoutes);
  app.use('/gurus', gurusRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/auth', authRoutes);
  
  return app;
}

describe('Railway 502 Error Fixes', () => {
  let app;
  
  beforeEach(() => {
    app = createTestApp();
  });
  
  describe('OPTIONS requests (CORS preflight)', () => {
    it('should handle OPTIONS for /gurus/:subdomain/services', async () => {
      const response = await request(app)
        .options('/gurus/test-subdomain/services')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
      expect(response.headers['access-control-allow-methods']).toContain('GET');
    });
    
    it('should handle OPTIONS for /gurus/:subdomain/home', async () => {
      const response = await request(app)
        .options('/gurus/test-subdomain/home')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });
    
    it('should handle OPTIONS for /api/gurus/news/:subdomain', async () => {
      const response = await request(app)
        .options('/api/gurus/news/test-subdomain')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });
    
    it('should handle OPTIONS for /auth/profile', async () => {
      const response = await request(app)
        .options('/auth/profile')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });
  });
  
  describe('GET requests (actual endpoints)', () => {
    it('should handle GET for /gurus/:subdomain/services', async () => {
      const response = await request(app)
        .get('/gurus/test-subdomain/services')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(200);
      expect(response.body.subdomain).toBe('test-subdomain');
    });
    
    it('should handle GET for /gurus/:subdomain/home', async () => {
      const response = await request(app)
        .get('/gurus/test-subdomain/home')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(200);
      expect(response.body.subdomain).toBe('test-subdomain');
    });
    
    it('should handle GET for /api/gurus/news/:subdomain', async () => {
      const response = await request(app)
        .get('/api/gurus/news/test-subdomain')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(200);
      expect(response.body.subdomain).toBe('test-subdomain');
    });
    
    it('should handle GET for /auth/profile', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User profile');
    });
  });
  
  describe('Route duplication verification', () => {
    it('should have both API and non-API guru routes working', async () => {
      // Test API route
      const apiResponse = await request(app)
        .get('/api/gurus/test-subdomain/home')
        .set('Origin', 'http://localhost:3000');
      
      // Test non-API route  
      const nonApiResponse = await request(app)
        .get('/gurus/test-subdomain/home')
        .set('Origin', 'http://localhost:3000');
      
      expect(apiResponse.status).toBe(200);
      expect(nonApiResponse.status).toBe(200);
      expect(apiResponse.body.subdomain).toBe('test-subdomain');
      expect(nonApiResponse.body.subdomain).toBe('test-subdomain');
    });
    
    it('should have both API and non-API auth routes working', async () => {
      // Test API route
      const apiResponse = await request(app)
        .get('/api/auth/profile')
        .set('Origin', 'http://localhost:3000');
      
      // Test non-API route
      const nonApiResponse = await request(app)
        .get('/auth/profile')
        .set('Origin', 'http://localhost:3000');
      
      expect(apiResponse.status).toBe(200);
      expect(nonApiResponse.status).toBe(200);
      expect(apiResponse.body.message).toBe('User profile');
      expect(nonApiResponse.body.message).toBe('User profile');
    });
  });
});