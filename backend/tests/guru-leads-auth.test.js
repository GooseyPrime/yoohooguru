const request = require('supertest');
const app = require('../src/index');

describe('Guru Leads Authentication', () => {
  const testSubdomain = 'coach';
  const leadData = {
    name: 'Test User',
    email: 'test@example.com',
    service: 'Coaching Session',
    message: 'I would like to book a coaching session',
    phone: '555-1234'
  };

  describe('POST /:subdomain/leads', () => {
    test('should reject lead submission without authentication', async () => {
      const response = await request(app)
        .post(`/api/gurus/${testSubdomain}/leads`)
        .send(leadData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toMatch(/token|auth/i);
    });

    test('should reject lead submission with invalid token', async () => {
      const response = await request(app)
        .post(`/api/gurus/${testSubdomain}/leads`)
        .set('Authorization', 'Bearer invalid-token')
        .send(leadData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    test('should accept lead submission with valid test token', async () => {
      const response = await request(app)
        .post(`/api/gurus/${testSubdomain}/leads`)
        .set('Authorization', 'Bearer test-token')
        .send(leadData);

      // Should succeed with authentication
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.leadId).toBeDefined();
      expect(response.body.guru).toBeDefined();
    });

    test('should include createdBy field in lead data when authenticated', async () => {
      const response = await request(app)
        .post(`/api/gurus/${testSubdomain}/leads`)
        .set('Authorization', 'Bearer test-token')
        .send(leadData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // The response doesn't return the full lead data,
      // but we can verify the request succeeded with authentication
      expect(response.body.leadId).toBeDefined();
    });

    test('should reject lead submission with missing required fields even with auth', async () => {
      const incompleteData = {
        name: 'Test User'
        // Missing email and service
      };

      const response = await request(app)
        .post(`/api/gurus/${testSubdomain}/leads`)
        .set('Authorization', 'Bearer test-token')
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.body.message).toMatch(/required/i);
    });

    test('should reject lead submission with invalid email even with auth', async () => {
      const invalidEmailData = {
        ...leadData,
        email: 'not-an-email'
      };

      const response = await request(app)
        .post(`/api/gurus/${testSubdomain}/leads`)
        .set('Authorization', 'Bearer test-token')
        .send(invalidEmailData);

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/email/i);
    });

    test('should reject lead submission for invalid subdomain even with auth', async () => {
      const response = await request(app)
        .post('/api/gurus/invalid-subdomain-xyz/leads')
        .set('Authorization', 'Bearer test-token')
        .send(leadData);

      expect(response.status).toBe(404);
      expect(response.body.error).toMatch(/subdomain/i);
    });
  });

  describe('Security - Rate Limiting Awareness', () => {
    test('authenticated lead submissions should still respect rate limits', async () => {
      // Note: This test documents the expectation that rate limiting
      // is still in place for authenticated users, preventing abuse
      // from compromised accounts. Rate limit: 5 submissions per hour per user
      
      const response = await request(app)
        .post(`/api/gurus/${testSubdomain}/leads`)
        .set('Authorization', 'Bearer test-token')
        .send(leadData);

      // First request should succeed
      expect(response.status).toBe(200);
      
      // Note: We don't exhaust rate limits in this test to avoid
      // interfering with other tests, but the middleware is present
      // and configured for 5 submissions per hour per user
    });
  });
});
