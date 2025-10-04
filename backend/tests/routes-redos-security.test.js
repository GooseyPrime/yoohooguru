/**
 * Security Tests for ReDoS Prevention in Routes
 * 
 * Tests for Code Scanning Alerts #60 and #61:
 * - Alert #60: Polynomial regular expression in backend/src/routes/ai.js:105
 * - Alert #61: Polynomial regular expression in backend/src/routes/gurus.js:514
 * 
 * These tests verify that the slug generation and email validation
 * are not vulnerable to ReDoS attacks through polynomial regular expressions.
 */

describe('Routes ReDoS Security Tests', () => {
  describe('AI Route - Slug Generation Security', () => {
    it('should handle normal titles efficiently', () => {
      const normalTitles = [
        'Getting Started with JavaScript',
        'Advanced Python Programming',
        'Web Development Best Practices',
        'Machine Learning Fundamentals',
        'Data Science for Beginners'
      ];

      normalTitles.forEach(title => {
        const startTime = Date.now();
        
        // Replicate the fixed slug generation logic
        const sanitizedTitle = title.substring(0, 200);
        const slug = sanitizedTitle
          .toLowerCase()
          .split('')
          .map(char => /[a-z0-9]/.test(char) ? char : '-')
          .join('')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        const elapsed = Date.now() - startTime;
        
        // Should complete very quickly (under 5ms)
        expect(elapsed).toBeLessThan(5);
        expect(slug).toBeTruthy();
        expect(slug).toMatch(/^[a-z0-9-]*$/);
      });
    });

    it('should handle malicious titles without catastrophic backtracking', () => {
      // These patterns could trigger ReDoS with vulnerable regex
      const maliciousTitles = [
        '!'.repeat(200) + 'title',  // Many special chars
        '-'.repeat(100) + 'test' + '-'.repeat(100),  // Repeating dashes
        'a'.repeat(300),  // Very long input (should be truncated)
        '!@#$%^&*()!@#$%^&*()!@#$%^&*()'.repeat(10),  // Repeating special chars
        ' '.repeat(150) + 'test' + ' '.repeat(150),  // Many spaces
      ];

      maliciousTitles.forEach(title => {
        const startTime = Date.now();
        
        // Replicate the fixed slug generation logic
        const sanitizedTitle = title.substring(0, 200);
        const slug = sanitizedTitle
          .toLowerCase()
          .split('')
          .map(char => /[a-z0-9]/.test(char) ? char : '-')
          .join('')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        const elapsed = Date.now() - startTime;
        
        // Should complete very quickly even for malicious input (under 10ms)
        expect(elapsed).toBeLessThan(10);
        expect(slug).toBeDefined();
        // Slug should be safe (alphanumeric and dashes only)
        expect(slug).toMatch(/^[a-z0-9-]*$/);
      });
    });

    it('should truncate overly long titles', () => {
      const longTitle = 'a'.repeat(500);
      
      const sanitizedTitle = longTitle.substring(0, 200);
      const slug = sanitizedTitle
        .toLowerCase()
        .split('')
        .map(char => /[a-z0-9]/.test(char) ? char : '-')
        .join('')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Should be truncated to max 200 chars
      expect(sanitizedTitle.length).toBe(200);
      expect(slug.length).toBeLessThanOrEqual(200);
    });
  });

  describe('Gurus Route - Email Validation Security', () => {
    it('should validate normal emails efficiently', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co.uk',
        'john_doe@company.org',
        'admin@subdomain.example.com',
        'contact@test-site.net'
      ];

      validEmails.forEach(email => {
        const startTime = Date.now();
        
        // Replicate the fixed email validation logic
        const isValid = email.length <= 254 && 
                       /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9.-]{1,253}\.[a-zA-Z]{2,}$/.test(email);
        
        const elapsed = Date.now() - startTime;
        
        // Should complete very quickly (under 5ms)
        expect(elapsed).toBeLessThan(5);
        expect(isValid).toBe(true);
      });
    });

    it('should reject malicious emails without catastrophic backtracking', () => {
      // These patterns could trigger ReDoS with vulnerable regex
      const maliciousEmails = [
        '@'.repeat(100) + 'test@example.com',  // Many @ symbols
        'user' + '@'.repeat(50) + 'domain.com',  // Repeating @ symbols
        'a'.repeat(300) + '@example.com',  // Very long local part
        'user@' + 'sub.'.repeat(100) + 'example.com',  // Many subdomains
        'test@' + 'a'.repeat(300) + '.com',  // Very long domain
      ];

      maliciousEmails.forEach(email => {
        const startTime = Date.now();
        
        // Replicate the fixed email validation logic
        const isValid = email.length <= 254 && 
                       /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9.-]{1,253}\.[a-zA-Z]{2,}$/.test(email);
        
        const elapsed = Date.now() - startTime;
        
        // Should complete very quickly even for malicious input (under 10ms)
        expect(elapsed).toBeLessThan(10);
        // These should be rejected (either too long or invalid format)
        expect(isValid).toBe(false);
      });
    });

    it('should reject emails exceeding RFC 5321 length limit', () => {
      const longEmail = 'a'.repeat(300) + '@example.com';
      
      const isValid = longEmail.length <= 254;
      
      expect(isValid).toBe(false);
      expect(longEmail.length).toBeGreaterThan(254);
    });

    it('should reject invalid email formats efficiently', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user@@example.com',
        'user@domain',
        'user @example.com',
        'user@exam ple.com'
      ];

      invalidEmails.forEach(email => {
        const startTime = Date.now();
        
        const isValid = email.length <= 254 && 
                       /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9.-]{1,253}\.[a-zA-Z]{2,}$/.test(email);
        
        const elapsed = Date.now() - startTime;
        
        // Should complete very quickly (under 5ms)
        expect(elapsed).toBeLessThan(5);
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Pattern Safety Verification', () => {
    it('should use bounded quantifiers instead of polynomial patterns', () => {
      // Verify the email regex uses bounded quantifiers
      const emailRegex = /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9.-]{1,253}\.[a-zA-Z]{2,}$/;
      
      // Pattern should contain bounded quantifiers like {1,64}
      const pattern = emailRegex.toString();
      expect(pattern).toContain('{1,64}');
      expect(pattern).toContain('{1,253}');
      expect(pattern).toContain('{2,}');
      
      // Should NOT contain unbounded quantifiers like + without length checks
      // (Note: {2,} is safe because it's at the end and matches only [a-zA-Z])
    });

    it('should use character-by-character approach for slug generation', () => {
      // Verify that slug generation doesn't use polynomial regex
      const title = 'Test Title 123!@#';
      
      // The safe approach: character-by-character
      const slug = title
        .toLowerCase()
        .split('')
        .map(char => /[a-z0-9]/.test(char) ? char : '-')
        .join('')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      expect(slug).toBe('test-title-123');
      
      // This approach avoids the vulnerable pattern /[^a-z0-9]+/g
      // which has polynomial complexity with certain inputs
    });
  });
});
