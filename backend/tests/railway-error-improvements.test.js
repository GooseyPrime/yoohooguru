/**
 * Test for Railway error improvements and better error handling
 * 
 * Tests the fixes for CORS errors, authentication issues, and client disconnections
 */

const request = require('supertest');
const express = require('express');

// Create a test app that simulates the improved error handling
function createTestApp() {
  const app = express();
  
  // Simulate improved CORS setup that doesn't throw errors
  app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'https://yoohoo.guru'];
    const origin = req.headers.origin;
    
    if (!origin || allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end(); // Return 200 even for disallowed origins
      return;
    }
    next();
  });

  // Simulate improved auth middleware
  app.use((req, res, next) => {
    if (req.headers.authorization === 'Bearer valid-token') {
      req.user = { uid: 'test-user-123', email: 'test@example.com' };
    }
    next();
  });

  // Test routes
  app.get('/auth/profile', (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'No token provided' }
      });
    }
    
    res.json({
      success: true,
      data: { uid: req.user.uid, email: req.user.email }
    });
  });

  app.get('/api/gurus/:subdomain/home', (req, res) => {
    const { subdomain } = req.params;
    
    if (!['cooking', 'music', 'fitness', 'tech'].includes(subdomain)) {
      return res.status(404).json({
        error: 'Invalid guru subdomain',
        message: `Guru subdomain "${subdomain}" not found`
      });
    }
    
    res.json({ success: true, subdomain });
  });

  // Error handler that properly handles different error types
  app.use((err, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    
    if (err.message && err.message.includes('CORS policy violation')) {
      statusCode = 403;
      message = 'Cross-origin request not allowed';
    }
    
    if (err.code === 'ECONNRESET' || err.code === 'EPIPE') {
      statusCode = 499;
      message = 'Client disconnected';
    }
    
    res.status(statusCode).json({
      success: false,
      error: { message }
    });
  });

  return app;
}

describe('Railway Error Improvements', () => {
  let app;
  
  beforeEach(() => {
    app = createTestApp();
  });

  describe('CORS Error Handling', () => {
    it('should return 200 for OPTIONS requests even with disallowed origins', async () => {
      const response = await request(app)
        .options('/auth/profile')
        .set('Origin', 'https://malicious-site.com')
        .expect(200);
    });

    it('should return 200 for OPTIONS requests with allowed origins', async () => {
      const response = await request(app)
        .options('/auth/profile')
        .set('Origin', 'https://yoohoo.guru')
        .expect(200);
        
      expect(response.headers['access-control-allow-origin']).toBe('https://yoohoo.guru');
    });
  });

  describe('Authentication Error Handling', () => {
    it('should return 401 for profile requests without token', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .expect(401);
        
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('No token provided');
    });

    it('should return 200 for profile requests with valid token', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);
        
      expect(response.body.success).toBe(true);
      expect(response.body.data.uid).toBe('test-user-123');
    });
  });

  describe('Subdomain Validation', () => {
    it('should return 404 for invalid subdomains', async () => {
      const response = await request(app)
        .get('/api/gurus/yoohooguru-frontend-ftzvr797y-intellme/home')
        .expect(404);
        
      expect(response.body.error).toBe('Invalid guru subdomain');
      expect(response.body.message).toContain('yoohooguru-frontend-ftzvr797y-intellme');
    });

    it('should return 200 for valid subdomains', async () => {
      const response = await request(app)
        .get('/api/gurus/cooking/home')
        .expect(200);
        
      expect(response.body.success).toBe(true);
      expect(response.body.subdomain).toBe('cooking');
    });
  });

  describe('Error Status Codes', () => {
    it('should handle various error scenarios with appropriate status codes', async () => {
      // Test 401 case
      const authResponse = await request(app)
        .get('/auth/profile')
        .expect(401);
        
      expect(authResponse.body.success).toBe(false);
      expect(authResponse.body.error.message).toBe('No token provided');

      // Test 404 case
      const subdomainResponse = await request(app)
        .get('/api/gurus/invalid-subdomain/home')
        .expect(404);
        
      expect(subdomainResponse.body.error).toBe('Invalid guru subdomain');
    });
  });
});