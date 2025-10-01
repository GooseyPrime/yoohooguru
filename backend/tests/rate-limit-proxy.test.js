const request = require('supertest');
const express = require('express');
const rateLimit = require('express-rate-limit');

describe('Rate Limiting with Trust Proxy', () => {
  let app;

  beforeEach(() => {
    app = express();
    
    // Configure trust proxy for production (trust all proxies like our main app)
    app.set('trust proxy', true);
    
    // Add rate limiting similar to our main app
    const limiter = rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 5, // limit each IP to 5 requests per windowMs
      message: 'Too many requests',
      standardHeaders: true,
      legacyHeaders: false,
    });
    
    app.use('/api/', limiter);
    
    app.get('/api/test', (req, res) => {
      res.json({ 
        success: true, 
        ip: req.ip,
        message: 'Rate limiting test endpoint' 
      });
    });
  });

  test('should apply rate limiting per IP when X-Forwarded-For header is present', async () => {
    const clientIP = '203.0.113.1';
    
    // Make multiple requests from the same IP
    for (let i = 0; i < 5; i++) {
      const response = await request(app)
        .get('/api/test')
        .set('X-Forwarded-For', clientIP)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.ip).toBe(clientIP);
    }
    
    // The 6th request should be rate limited
    const response = await request(app)
      .get('/api/test')
      .set('X-Forwarded-For', clientIP)
      .expect(429); // Too Many Requests
    
    expect(response.text).toContain('Too many requests');
  });

  test('should differentiate between different client IPs', async () => {
    const clientIP1 = '203.0.113.1';
    const clientIP2 = '203.0.113.2';
    
    // Make 5 requests from first IP
    for (let i = 0; i < 5; i++) {
      await request(app)
        .get('/api/test')
        .set('X-Forwarded-For', clientIP1)
        .expect(200);
    }
    
    // First IP should be rate limited
    await request(app)
      .get('/api/test')
      .set('X-Forwarded-For', clientIP1)
      .expect(429);
    
    // Second IP should still work (not rate limited)
    const response = await request(app)
      .get('/api/test')
      .set('X-Forwarded-For', clientIP2)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.ip).toBe(clientIP2);
  });

  test('should not throw ERR_ERL_UNEXPECTED_X_FORWARDED_FOR error', async () => {
    // This is the key test - ensuring we don't get the error from the problem statement
    const response = await request(app)
      .get('/api/test')
      .set('X-Forwarded-For', '203.0.113.1, 198.51.100.1')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    // With trust proxy: true, Express uses the leftmost IP (the real client)
    expect(response.body.ip).toBe('203.0.113.1');
  });

  test('should handle Railway-style proxy headers correctly', async () => {
    // Simulate Railway's proxy chain - client IP should be the leftmost
    const response = await request(app)
      .get('/api/test')
      .set('X-Forwarded-For', '203.0.113.1')  // Single client IP from Railway
      .expect(200);
    
    // Should use the client IP
    expect(response.body.success).toBe(true);
    expect(response.body.ip).toBe('203.0.113.1');
  });
});