/**
 * URL Validation Security Tests
 * 
 * Tests for validator.js CVE-2024-XXXXX bypass vulnerability
 * and general URL validation security
 */

const {
  validateUrl,
  validateRedirectUrl,
  validateResourceUrl,
  sanitizeUrl,
  isSafeUrl,
  SAFE_PROTOCOLS,
  TRUSTED_DOMAINS
} = require('../src/utils/urlValidation');

describe('URL Validation Security', () => {
  describe('Protocol Validation Bypass (validator.js CVE)', () => {
    it('should reject javascript protocol with :// delimiter', () => {
      // validator.js vulnerability: uses '://' as delimiter
      // Browser behavior: uses ':' as delimiter
      const maliciousUrls = [
        'javascript://example.com/%0Aalert(1)',
        'javascript://example.com%0Aalert(document.domain)',
        'javascript:alert(1)//https://example.com',
        'javascript:alert(1);//https://example.com'
      ];

      maliciousUrls.forEach(url => {
        const result = validateUrl(url);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('not allowed');
      });
    });

    it('should reject data protocol with :// delimiter', () => {
      const maliciousUrls = [
        'data://text/html,<script>alert(1)</script>',
        'data:text/html,<script>alert(1)</script>',
        'data://image/svg+xml,<svg onload=alert(1)>'
      ];

      maliciousUrls.forEach(url => {
        const result = validateUrl(url);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('not allowed');
      });
    });

    it('should reject vbscript protocol', () => {
      const maliciousUrls = [
        'vbscript://example.com/%0Amsgbox(1)',
        'vbscript:msgbox(1);//https://example.com'
      ];

      maliciousUrls.forEach(url => {
        const result = validateUrl(url);
        expect(result.valid).toBe(false);
      });
    });

    it('should reject file protocol', () => {
      const maliciousUrls = [
        'file:///etc/passwd',
        'file://example.com/etc/passwd',
        'file:///C:/Windows/System32/config/sam'
      ];

      maliciousUrls.forEach(url => {
        const result = validateUrl(url);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('not allowed');
      });
    });

    it('should accept only http and https protocols', () => {
      const validUrls = [
        'http://example.com',
        'https://example.com',
        'http://example.com:8080/path',
        'https://example.com/path?query=value'
      ];

      validUrls.forEach(url => {
        const result = validateUrl(url);
        expect(result.valid).toBe(true);
        expect(result.parsedUrl).toBeDefined();
      });
    });
  });

  describe('Domain Obfuscation Prevention', () => {
    it('should reject URLs with @ symbol (domain obfuscation)', () => {
      // @ can be used to hide the actual domain
      // Example: http://trusted.com@evil.com redirects to evil.com
      const maliciousUrls = [
        'https://trusted.com@evil.com/path',
        'https://user:pass@evil.com',
        'https://example.com@attacker.com'
      ];

      maliciousUrls.forEach(url => {
        const result = validateUrl(url);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('suspicious');
      });
    });

    it('should reject URLs with whitespace', () => {
      const maliciousUrls = [
        'https://example.com /path',
        'https://exam ple.com',
        'https://example.com\t/path'
      ];

      maliciousUrls.forEach(url => {
        const result = validateUrl(url);
        expect(result.valid).toBe(false);
      });
    });

    it('should reject URLs with null bytes', () => {
      const maliciousUrls = [
        'https://example.com%00.evil.com',
        'https://example.com\x00/path'
      ];

      maliciousUrls.forEach(url => {
        const result = validateUrl(url);
        expect(result.valid).toBe(false);
        // The URL parser itself rejects these, so error message may vary
        expect(result.error).toBeTruthy();
      });
    });

    it('should reject URLs with newline/carriage return', () => {
      const maliciousUrls = [
        'https://example.com%0a',
        'https://example.com%0d',
        'https://example.com%0A%0D'
      ];

      maliciousUrls.forEach(url => {
        const result = validateUrl(url);
        expect(result.valid).toBe(false);
        // The URL parser itself rejects these, so error message may vary
        expect(result.error).toBeTruthy();
      });
    });
  });

  describe('Open Redirect Prevention', () => {
    it('should validate redirect URLs against trusted domains', () => {
      const trustedUrls = [
        'https://yoohoo.guru/path',
        'https://www.yoohoo.guru/path',
        'https://api.yoohoo.guru/callback',
        'http://localhost:3000/auth/callback'
      ];

      trustedUrls.forEach(url => {
        const result = validateRedirectUrl(url);
        expect(result.valid).toBe(true);
        expect(result.sanitizedUrl).toBeDefined();
      });
    });

    it('should reject redirect URLs to untrusted domains', () => {
      const untrustedUrls = [
        'https://evil.com',
        'https://phishing-site.com',
        'https://yoohoo.guru.evil.com', // Domain confusion
        'https://evilyoohoo.guru'
      ];

      untrustedUrls.forEach(url => {
        const result = validateRedirectUrl(url);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('not in the allowed domains');
      });
    });

    it('should allow trusted subdomains', () => {
      const subdomainUrls = [
        'https://coach.yoohoo.guru',
        'https://angel.yoohoo.guru',
        'https://masters.yoohoo.guru'
      ];

      subdomainUrls.forEach(url => {
        const result = validateRedirectUrl(url, {
          trustedDomains: ['yoohoo.guru']
        });
        expect(result.valid).toBe(true);
      });
    });

    it('should allow relative paths as redirect URLs', () => {
      const relativePaths = [
        '/auth/callback',
        '/dashboard',
        '/profile/edit'
      ];

      relativePaths.forEach(path => {
        const result = validateRedirectUrl(path);
        expect(result.valid).toBe(true);
        expect(result.sanitizedUrl).toBe(path);
      });
    });

    it('should reject malformed relative paths', () => {
      const malformedPaths = [
        '//evil.com', // Protocol-relative URL
        '///path', // Too many slashes
        '/ /path' // Space in path
      ];

      malformedPaths.forEach(path => {
        const result = validateRedirectUrl(path);
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('Resource URL Validation', () => {
    it('should allow any domain for resource URLs', () => {
      const resourceUrls = [
        'https://www.youtube.com/watch?v=123',
        'https://github.com/user/repo',
        'https://stackoverflow.com/questions/123',
        'https://developer.mozilla.org/docs'
      ];

      resourceUrls.forEach(url => {
        const result = validateResourceUrl(url);
        expect(result.valid).toBe(true);
        expect(result.parsedUrl).toBeDefined();
      });
    });

    it('should still enforce protocol validation for resources', () => {
      const maliciousUrls = [
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'file:///etc/passwd'
      ];

      maliciousUrls.forEach(url => {
        const result = validateResourceUrl(url);
        expect(result.valid).toBe(false);
      });
    });

    it('should still prevent suspicious patterns in resource URLs', () => {
      const suspiciousUrls = [
        'https://example.com@evil.com',
        'https://example.com%00/path',
        'https://example.com%0a'
      ];

      suspiciousUrls.forEach(url => {
        const result = validateResourceUrl(url);
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('HTTPS Enforcement', () => {
    it('should enforce HTTPS when requireHttps is true', () => {
      const httpUrl = 'http://example.com';
      const httpsUrl = 'https://example.com';

      const httpResult = validateUrl(httpUrl, { requireHttps: true });
      expect(httpResult.valid).toBe(false);
      expect(httpResult.error).toContain('HTTPS');

      const httpsResult = validateUrl(httpsUrl, { requireHttps: true });
      expect(httpsResult.valid).toBe(true);
    });

    it('should enforce HTTPS for redirects in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const httpUrl = 'http://yoohoo.guru/path';
      const result = validateRedirectUrl(httpUrl);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('HTTPS');

      process.env.NODE_ENV = originalEnv;
    });

    it('should allow HTTP for redirects in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const httpUrl = 'http://localhost:3000/path';
      const result = validateRedirectUrl(httpUrl, {
        trustedDomains: ['localhost']
      });
      
      expect(result.valid).toBe(true);

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Domain Allowlist Validation', () => {
    it('should validate against domain allowlist when provided', () => {
      const allowedDomains = ['example.com', 'trusted.com'];
      
      const validUrl = 'https://example.com/path';
      const invalidUrl = 'https://evil.com/path';

      const validResult = validateUrl(validUrl, { allowedDomains });
      expect(validResult.valid).toBe(true);

      const invalidResult = validateUrl(invalidUrl, { allowedDomains });
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.error).toContain('not in the allowed domains');
    });

    it('should support subdomain validation', () => {
      const allowedDomains = ['example.com'];
      
      const subdomainUrl = 'https://subdomain.example.com/path';
      const result = validateUrl(subdomainUrl, {
        allowedDomains,
        allowSubdomains: true
      });

      expect(result.valid).toBe(true);
    });

    it('should reject subdomains when allowSubdomains is false', () => {
      const allowedDomains = ['example.com'];
      
      const subdomainUrl = 'https://subdomain.example.com/path';
      const result = validateUrl(subdomainUrl, {
        allowedDomains,
        allowSubdomains: false
      });

      expect(result.valid).toBe(false);
    });
  });

  describe('URL Sanitization', () => {
    it('should sanitize valid URLs', () => {
      const url = 'https://example.com/path?query=value';
      const sanitized = sanitizeUrl(url);
      
      expect(sanitized).toBe(url);
    });

    it('should return null for invalid URLs', () => {
      const maliciousUrls = [
        'javascript:alert(1)',
        'https://example.com@evil.com',
        'not-a-url'
      ];

      maliciousUrls.forEach(url => {
        const sanitized = sanitizeUrl(url);
        expect(sanitized).toBeNull();
      });
    });

    it('should normalize URLs during sanitization', () => {
      const url = 'HTTPS://EXAMPLE.COM/Path';
      const sanitized = sanitizeUrl(url);
      
      expect(sanitized).toBeDefined();
      expect(sanitized).toContain('https://');
    });
  });

  describe('Quick Safety Check', () => {
    it('should provide quick boolean safety check', () => {
      expect(isSafeUrl('https://example.com')).toBe(true);
      expect(isSafeUrl('http://example.com')).toBe(true);
      expect(isSafeUrl('javascript:alert(1)')).toBe(false);
      expect(isSafeUrl('https://example.com@evil.com')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should reject empty strings', () => {
      const result = validateUrl('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('non-empty string');
    });

    it('should reject non-string inputs', () => {
      const inputs = [null, undefined, 123, {}, []];
      
      inputs.forEach(input => {
        const result = validateUrl(input);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('string');
      });
    });

    it('should handle URLs with ports', () => {
      const urls = [
        'http://example.com:8080',
        'https://example.com:443',
        'http://localhost:3000'
      ];

      urls.forEach(url => {
        const result = validateUrl(url);
        expect(result.valid).toBe(true);
      });
    });

    it('should handle URLs with query strings', () => {
      const url = 'https://example.com/path?key1=value1&key2=value2';
      const result = validateUrl(url);
      
      expect(result.valid).toBe(true);
      expect(result.parsedUrl.search).toBe('?key1=value1&key2=value2');
    });

    it('should handle URLs with fragments', () => {
      const url = 'https://example.com/path#section';
      const result = validateUrl(url);
      
      expect(result.valid).toBe(true);
      expect(result.parsedUrl.hash).toBe('#section');
    });

    it('should trim whitespace from URLs', () => {
      const url = '  https://example.com  ';
      const result = validateUrl(url);
      
      expect(result.valid).toBe(true);
    });
  });

  describe('Case Sensitivity', () => {
    it('should handle protocol case-insensitively', () => {
      const urls = [
        'HTTP://example.com',
        'HTTPS://example.com',
        'HtTpS://example.com'
      ];

      urls.forEach(url => {
        const result = validateUrl(url);
        expect(result.valid).toBe(true);
      });
    });

    it('should handle domain case-insensitively in allowlist', () => {
      const url = 'https://EXAMPLE.COM';
      const result = validateUrl(url, {
        allowedDomains: ['example.com']
      });

      expect(result.valid).toBe(true);
    });
  });
});
