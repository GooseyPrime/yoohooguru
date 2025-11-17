const request = require('supertest');
const express = require('express');
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

describe('Route-level Rate Limiting', () => {
  describe('Auth Routes Rate Limiting', () => {
    let app;

    beforeEach(() => {
      app = express();
      app.use(express.json());
      app.set('trust proxy', true);

      // Simulate the profileLimiter from auth.js
      const profileLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 30, // Limit each IP to 30 requests per windowMs
        message: 'Too many profile requests from this IP, please try again later',
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: ipKeyGenerator
      });

      // Mock authenticated routes with rate limiting
      const mockAuth = (req, res, next) => {
        req.user = { uid: 'test-user-123', email: 'test@example.com' };
        next();
      };

      app.get('/api/auth/profile', profileLimiter, mockAuth, (req, res) => {
        res.json({ success: true, data: { uid: req.user.uid } });
      });

      app.put('/api/auth/profile', profileLimiter, mockAuth, (req, res) => {
        res.json({ success: true, message: 'Profile updated' });
      });

      app.put('/api/auth/profile/visibility', profileLimiter, mockAuth, (req, res) => {
        res.json({ success: true, message: 'Visibility updated' });
      });

      app.delete('/api/auth/account', profileLimiter, mockAuth, (req, res) => {
        res.json({ success: true, message: 'Account deletion scheduled' });
      });

      app.put('/api/auth/account/restore', profileLimiter, mockAuth, (req, res) => {
        res.json({ success: true, message: 'Account restored' });
      });

      app.post('/api/auth/merge/request', profileLimiter, mockAuth, (req, res) => {
        res.json({ success: true, message: 'Merge request created' });
      });
    });

    test('should apply rate limiting to GET /api/auth/profile', async () => {
      const clientIP = '203.0.113.1';

      // Make 30 successful requests
      for (let i = 0; i < 30; i++) {
        await request(app)
          .get('/api/auth/profile')
          .set('X-Forwarded-For', clientIP)
          .expect(200);
      }

      // The 31st request should be rate limited
      const response = await request(app)
        .get('/api/auth/profile')
        .set('X-Forwarded-For', clientIP)
        .expect(429);

      expect(response.text).toContain('Too many profile requests');
    });

    test('should apply rate limiting to PUT /api/auth/profile', async () => {
      const clientIP = '203.0.113.2';

      // Make 30 successful requests
      for (let i = 0; i < 30; i++) {
        await request(app)
          .put('/api/auth/profile')
          .set('X-Forwarded-For', clientIP)
          .send({ displayName: 'Test User' })
          .expect(200);
      }

      // The 31st request should be rate limited
      await request(app)
        .put('/api/auth/profile')
        .set('X-Forwarded-For', clientIP)
        .send({ displayName: 'Test User' })
        .expect(429);
    });

    test('should apply rate limiting to PUT /api/auth/profile/visibility', async () => {
      const clientIP = '203.0.113.3';

      // Make 30 successful requests
      for (let i = 0; i < 30; i++) {
        await request(app)
          .put('/api/auth/profile/visibility')
          .set('X-Forwarded-For', clientIP)
          .send({ hidden: true })
          .expect(200);
      }

      // The 31st request should be rate limited
      await request(app)
        .put('/api/auth/profile/visibility')
        .set('X-Forwarded-For', clientIP)
        .send({ hidden: true })
        .expect(429);
    });

    test('should apply rate limiting to DELETE /api/auth/account', async () => {
      const clientIP = '203.0.113.4';

      // Make 30 successful requests
      for (let i = 0; i < 30; i++) {
        await request(app)
          .delete('/api/auth/account')
          .set('X-Forwarded-For', clientIP)
          .send({ confirmEmail: 'test@example.com' })
          .expect(200);
      }

      // The 31st request should be rate limited
      await request(app)
        .delete('/api/auth/account')
        .set('X-Forwarded-For', clientIP)
        .send({ confirmEmail: 'test@example.com' })
        .expect(429);
    });

    test('should apply rate limiting to PUT /api/auth/account/restore', async () => {
      const clientIP = '203.0.113.5';

      // Make 30 successful requests
      for (let i = 0; i < 30; i++) {
        await request(app)
          .put('/api/auth/account/restore')
          .set('X-Forwarded-For', clientIP)
          .expect(200);
      }

      // The 31st request should be rate limited
      await request(app)
        .put('/api/auth/account/restore')
        .set('X-Forwarded-For', clientIP)
        .expect(429);
    });

    test('should apply rate limiting to POST /api/auth/merge/request', async () => {
      const clientIP = '203.0.113.6';

      // Make 30 successful requests
      for (let i = 0; i < 30; i++) {
        await request(app)
          .post('/api/auth/merge/request')
          .set('X-Forwarded-For', clientIP)
          .send({ targetEmail: 'target@example.com', provider: 'google.com' })
          .expect(200);
      }

      // The 31st request should be rate limited
      await request(app)
        .post('/api/auth/merge/request')
        .set('X-Forwarded-For', clientIP)
        .send({ targetEmail: 'target@example.com', provider: 'google.com' })
        .expect(429);
    });
  });

  describe('Guru Routes Rate Limiting', () => {
    let app;

    beforeEach(() => {
      app = express();
      app.use(express.json());
      app.set('trust proxy', true);

      // Simulate the guruPagesLimiter from gurus.js
      const guruPagesLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: 'Too many requests to guru pages, please try again later',
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: ipKeyGenerator
      });

      app.get('/:subdomain/home', guruPagesLimiter, (req, res) => {
        res.json({ success: true, subdomain: req.params.subdomain });
      });

      app.get('/news/:subdomain', guruPagesLimiter, (req, res) => {
        res.json({ success: true, subdomain: req.params.subdomain });
      });
    });

    test('should apply rate limiting to GET /:subdomain/home', async () => {
      const clientIP = '203.0.113.10';

      // Make 100 successful requests
      for (let i = 0; i < 100; i++) {
        await request(app)
          .get('/test-guru/home')
          .set('X-Forwarded-For', clientIP)
          .expect(200);
      }

      // The 101st request should be rate limited
      const response = await request(app)
        .get('/test-guru/home')
        .set('X-Forwarded-For', clientIP)
        .expect(429);

      expect(response.text).toContain('Too many requests to guru pages');
    });

    test('should apply rate limiting to GET /news/:subdomain', async () => {
      const clientIP = '203.0.113.11';

      // Make 100 successful requests
      for (let i = 0; i < 100; i++) {
        await request(app)
          .get('/news/test-guru')
          .set('X-Forwarded-For', clientIP)
          .expect(200);
      }

      // The 101st request should be rate limited
      await request(app)
        .get('/news/test-guru')
        .set('X-Forwarded-For', clientIP)
        .expect(429);
    });
  });
});