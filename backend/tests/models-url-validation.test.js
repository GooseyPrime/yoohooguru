/**
 * Integration tests for models.js URL validation
 * 
 * Tests the secure URL validation in resource link validation
 */

const {
  validateResourceLink,
  RESOURCE_TYPES
} = require('../src/types/models');

describe('Resource Link Validation (Integration)', () => {
  describe('Valid Resource Links', () => {
    it('should accept valid resource links', () => {
      const validResources = [
        {
          title: 'GitHub Repository',
          url: 'https://github.com/user/repo',
          type: RESOURCE_TYPES.SITE
        },
        {
          title: 'YouTube Video',
          url: 'https://www.youtube.com/watch?v=123',
          type: RESOURCE_TYPES.VIDEO
        },
        {
          title: 'Documentation',
          url: 'https://docs.example.com/guide',
          type: RESOURCE_TYPES.DOC
        },
        {
          title: 'Tool Link',
          url: 'http://localhost:3000/tool', // Allow HTTP for localhost
          type: RESOURCE_TYPES.TOOL
        }
      ];

      validResources.forEach(resource => {
        const result = validateResourceLink(resource);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });

  describe('Security: Protocol Bypass Prevention', () => {
    it('should reject javascript protocol in resource URLs', () => {
      const maliciousResources = [
        {
          title: 'XSS Attack',
          url: 'javascript:alert(1)',
          type: RESOURCE_TYPES.SITE
        },
        {
          title: 'XSS with :// delimiter',
          url: 'javascript://example.com/%0Aalert(1)',
          type: RESOURCE_TYPES.SITE
        }
      ];

      maliciousResources.forEach(resource => {
        const result = validateResourceLink(resource);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors[0]).toContain('validation failed');
      });
    });

    it('should reject data protocol in resource URLs', () => {
      const maliciousResources = [
        {
          title: 'Data URL Attack',
          url: 'data:text/html,<script>alert(1)</script>',
          type: RESOURCE_TYPES.SITE
        },
        {
          title: 'SVG XSS',
          url: 'data:image/svg+xml,<svg onload=alert(1)>',
          type: RESOURCE_TYPES.SITE
        }
      ];

      maliciousResources.forEach(resource => {
        const result = validateResourceLink(resource);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    it('should reject file protocol in resource URLs', () => {
      const maliciousResources = [
        {
          title: 'File Access',
          url: 'file:///etc/passwd',
          type: RESOURCE_TYPES.FILE
        }
      ];

      maliciousResources.forEach(resource => {
        const result = validateResourceLink(resource);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Security: Domain Obfuscation Prevention', () => {
    it('should reject URLs with @ symbol', () => {
      const maliciousResource = {
        title: 'Obfuscated Domain',
        url: 'https://trusted.com@evil.com/path',
        type: RESOURCE_TYPES.SITE
      };

      const result = validateResourceLink(maliciousResource);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject URLs with whitespace', () => {
      const maliciousResource = {
        title: 'Whitespace URL',
        url: 'https://exam ple.com/path',
        type: RESOURCE_TYPES.SITE
      };

      const result = validateResourceLink(maliciousResource);
      expect(result.valid).toBe(false);
    });
  });

  describe('Validation Error Messages', () => {
    it('should provide clear error for missing title', () => {
      const resource = {
        url: 'https://example.com',
        type: RESOURCE_TYPES.SITE
      };

      const result = validateResourceLink(resource);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Resource title is required and must be a string');
    });

    it('should provide clear error for missing URL', () => {
      const resource = {
        title: 'Test Resource',
        type: RESOURCE_TYPES.SITE
      };

      const result = validateResourceLink(resource);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Resource URL is required and must be a string');
    });

    it('should provide clear error for invalid URL format', () => {
      const resource = {
        title: 'Test Resource',
        url: 'not-a-valid-url',
        type: RESOURCE_TYPES.SITE
      };

      const result = validateResourceLink(resource);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('validation failed');
    });

    it('should provide clear error for invalid resource type', () => {
      const resource = {
        title: 'Test Resource',
        url: 'https://example.com',
        type: 'invalid-type'
      };

      const result = validateResourceLink(resource);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid resource type'))).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle resources without type (optional field)', () => {
      const resource = {
        title: 'Test Resource',
        url: 'https://example.com'
      };

      const result = validateResourceLink(resource);
      expect(result.valid).toBe(true);
    });

    it('should trim whitespace in valid URLs', () => {
      const resource = {
        title: 'Test Resource',
        url: '  https://example.com  ',
        type: RESOURCE_TYPES.SITE
      };

      const result = validateResourceLink(resource);
      expect(result.valid).toBe(true);
    });

    it('should handle URLs with ports', () => {
      const resource = {
        title: 'Local Dev Server',
        url: 'http://localhost:3000',
        type: RESOURCE_TYPES.TOOL
      };

      const result = validateResourceLink(resource);
      expect(result.valid).toBe(true);
    });

    it('should handle URLs with query strings', () => {
      const resource = {
        title: 'YouTube Video',
        url: 'https://www.youtube.com/watch?v=123&t=30s',
        type: RESOURCE_TYPES.VIDEO
      };

      const result = validateResourceLink(resource);
      expect(result.valid).toBe(true);
    });

    it('should handle URLs with fragments', () => {
      const resource = {
        title: 'Documentation Section',
        url: 'https://docs.example.com/guide#section-1',
        type: RESOURCE_TYPES.DOC
      };

      const result = validateResourceLink(resource);
      expect(result.valid).toBe(true);
    });
  });

  describe('Real-world Educational Resources', () => {
    it('should accept common educational resource URLs', () => {
      const educationalResources = [
        {
          title: 'MDN Web Docs',
          url: 'https://developer.mozilla.org/en-US/docs/Web',
          type: RESOURCE_TYPES.DOC
        },
        {
          title: 'Stack Overflow',
          url: 'https://stackoverflow.com/questions/123456',
          type: RESOURCE_TYPES.SITE
        },
        {
          title: 'Khan Academy',
          url: 'https://www.khanacademy.org/math/algebra',
          type: RESOURCE_TYPES.SITE
        },
        {
          title: 'Coursera Course',
          url: 'https://www.coursera.org/learn/machine-learning',
          type: RESOURCE_TYPES.SITE
        },
        {
          title: 'React Tutorial',
          url: 'https://react.dev/learn',
          type: RESOURCE_TYPES.DOC
        }
      ];

      educationalResources.forEach(resource => {
        const result = validateResourceLink(resource);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });
});
