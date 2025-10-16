/**
 * Simplified test for guru subdomain validation fixes
 * 
 * Tests only the core fix for invalid subdomains to avoid Firebase issues.
 */

const request = require('supertest');
const express = require('express');

// Create a minimal test app that simulates the fix
function createTestApp() {
  const app = express();
  
  // Minimal CORS setup
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

  // Simulate subdomain validation
  const { isValidSubdomain, getSubdomainConfig } = require('../src/config/subdomains');
  
  function validateSubdomainParam(req, res, next) {
    const { subdomain } = req.params;
    
    if (!subdomain) {
      return res.status(400).json({
        error: 'Missing subdomain parameter'
      });
    }

    if (!isValidSubdomain(subdomain)) {
      return res.status(404).json({
        error: 'Invalid guru subdomain',
        message: `Guru subdomain "${subdomain}" not found`,
        availableSubdomains: ['cooking', 'tech', 'music', 'fitness']
      });
    }

    req.guru = {
      subdomain,
      config: getSubdomainConfig(subdomain),
      isGuru: true
    };

    next();
  }

  // Apply validation to problematic routes
  app.use('/gurus/:subdomain/home', validateSubdomainParam);
  app.use('/gurus/:subdomain/services', validateSubdomainParam);
  app.use('/api/gurus/news/:subdomain', (req, res, next) => {
    const { subdomain } = req.params;
    
    if (!isValidSubdomain(subdomain)) {
      return res.status(404).json({
        error: 'Invalid guru subdomain',
        message: `Guru subdomain "${subdomain}" not found`
      });
    }
    
    req.guru = { subdomain, config: getSubdomainConfig(subdomain) };
    next();
  });

  // Route handlers
  app.get('/gurus/:subdomain/home', (req, res) => {
    res.json({ success: true, guru: req.guru.config });
  });

  app.get('/gurus/:subdomain/services', (req, res) => {
    res.json({ success: true, guru: req.guru.config });
  });

  app.get('/api/gurus/news/:subdomain', (req, res) => {
    res.json({ success: true, subdomain: req.guru.subdomain });
  });

  return app;
}

describe('Guru Subdomain Validation Fix', () => {
  let app;
  
  beforeEach(() => {
    app = createTestApp();
  });

  describe('Invalid subdomain handling (the main fix)', () => {
    it('should return 404 for Vercel deployment ID in services endpoint', async () => {
      const response = await request(app)
        .get('/gurus/yoohooguru-frontend-fs8rc0oyo-intellme/services')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Invalid guru subdomain');
      expect(response.body.message).toContain('yoohooguru-frontend-fs8rc0oyo-intellme');
    });

    it('should return 404 for Vercel deployment ID in home endpoint', async () => {
      const response = await request(app)
        .get('/gurus/yoohooguru-frontend-fs8rc0oyo-intellme/home')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Invalid guru subdomain');
    });

    it('should return 404 for Vercel deployment ID in news endpoint', async () => {
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
      
      // OPTIONS should return 204 due to CORS middleware
      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });
  });

  describe('Valid subdomain still works', () => {
    it('should work for valid cooking subdomain', async () => {
      const response = await request(app)
        .get('/gurus/cooking/services')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should work for valid tech subdomain in news', async () => {
      const response = await request(app)
        .get('/api/gurus/news/tech')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.subdomain).toBe('tech');
    });
  });

  describe('Special platform subdomains (angel, coach, heroes)', () => {
    it('should work for angel subdomain in home endpoint', async () => {
      const response = await request(app)
        .get('/gurus/angel/home')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.guru.character).toBe('Angel\'s List');
    });

    it('should work for coach subdomain in services endpoint', async () => {
      const response = await request(app)
        .get('/gurus/coach/services')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.guru.character).toBe('Coach Guru');
    });

    it('should work for heroes subdomain in news endpoint', async () => {
      const response = await request(app)
        .get('/api/gurus/news/heroes')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.subdomain).toBe('heroes');
    });
  });
});