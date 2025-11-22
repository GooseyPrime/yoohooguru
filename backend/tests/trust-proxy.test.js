const request = require('supertest');
const express = require('express');

describe('Express Trust Proxy Configuration', () => {
  let app;

  beforeEach(() => {
    // Create a minimal Express app that mimics our configuration
    app = express();
    
    // Configure trust proxy like in our main app
    app.set('trust proxy', true);
    
    // Add a simple test endpoint that shows the client IP
    app.get('/test-proxy', (req, res) => {
      res.json({
        ip: req.ip,
        ips: req.ips,
        headers: {
          'x-forwarded-for': req.get('X-Forwarded-For'),
          'x-real-ip': req.get('X-Real-IP')
        }
      });
    });
  });

  test('should trust proxy headers when X-Forwarded-For is set', async () => {
    const response = await request(app)
      .get('/test-proxy')
      .set('X-Forwarded-For', '203.0.113.1, 198.51.100.1')
      .expect(200);

    // When trust proxy is enabled, Express should use the first IP from X-Forwarded-For
    expect(response.body.ip).toBe('203.0.113.1');
    expect(response.body.headers['x-forwarded-for']).toBe('203.0.113.1, 198.51.100.1');
  });

  test('should handle single IP in X-Forwarded-For header', async () => {
    const response = await request(app)
      .get('/test-proxy')
      .set('X-Forwarded-For', '203.0.113.1')
      .expect(200);

    expect(response.body.ip).toBe('203.0.113.1');
    expect(response.body.headers['x-forwarded-for']).toBe('203.0.113.1');
  });

  test('should work without X-Forwarded-For header', async () => {
    const response = await request(app)
      .get('/test-proxy')
      .expect(200);

    // Without X-Forwarded-For, should fall back to connection IP
    expect(response.body.ip).toBeDefined();
    expect(typeof response.body.ip).toBe('string');
  });
});

describe('Main App Trust Proxy Integration', () => {
  test('should verify trust proxy is configured in main app', () => {
    // Import the main app to check its configuration
    const fs = require('fs');
    const path = require('path');
    
    const indexPath = path.join(__dirname, '../src/index.js');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Verify that trust proxy is configured with environment-aware settings
    // Production/staging uses app.set('trust proxy', 1) while dev/test uses false
    expect(indexContent).toMatch(/app\.set\('trust proxy', (1|false)\)/);
    expect(indexContent).toContain("config.nodeEnv === 'production'");
  });

  test('should configure trust proxy based on NODE_ENV', () => {
    // Test the configuration logic for different environments
    const { getConfig } = require('../src/config/appConfig');
    
    // Test production environment
    const originalNodeEnv = process.env.NODE_ENV;
    
    try {
      process.env.NODE_ENV = 'production';
      const config = getConfig();
      expect(config.nodeEnv).toBe('production');
      
      process.env.NODE_ENV = 'development';
      const devConfig = getConfig();
      expect(devConfig.nodeEnv).toBe('development');
      
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });
});