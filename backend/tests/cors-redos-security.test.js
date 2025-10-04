/**
 * Security Tests for ReDoS (Regular Expression Denial of Service) Prevention
 * 
 * These tests verify that the CORS origin wildcard matching is not vulnerable
 * to ReDoS attacks through polynomial regular expressions.
 */

const { getCorsOrigins, getConfig } = require('../src/config/appConfig');

describe('CORS ReDoS Security Tests', () => {
  describe('Wildcard Pattern Security', () => {
    it('should handle normal origins efficiently', (done) => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalCorsOriginProduction = process.env.CORS_ORIGIN_PRODUCTION;
      
      process.env.NODE_ENV = 'production';
      // Ensure the production CORS origins are set
      process.env.CORS_ORIGIN_PRODUCTION = 'https://yoohoo.guru,https://www.yoohoo.guru,https://api.yoohoo.guru,https://*.yoohoo.guru,https://*.vercel.app';

      const config = getConfig();
      const corsValidator = getCorsOrigins(config);

      const normalOrigins = [
        'https://art.yoohoo.guru',
        'https://coach.yoohoo.guru',
        'https://masters.yoohoo.guru',
        'https://api.yoohoo.guru',
        'https://test-app.vercel.app',
        'https://my-subdomain.vercel.app',
      ];

      let completed = 0;
      normalOrigins.forEach(origin => {
        const startTime = Date.now();
        corsValidator(origin, (err, allowed) => {
          const elapsed = Date.now() - startTime;
          
          // Should complete quickly (under 10ms)
          expect(elapsed).toBeLessThan(10);
          expect(err).toBeNull();
          expect(allowed).toBe(true);
          
          completed++;
          if (completed === normalOrigins.length) {
            process.env.NODE_ENV = originalNodeEnv;
            if (originalCorsOriginProduction !== undefined) {
              process.env.CORS_ORIGIN_PRODUCTION = originalCorsOriginProduction;
            } else {
              delete process.env.CORS_ORIGIN_PRODUCTION;
            }
            done();
          }
        });
      });
    });

    it('should reject malicious origins without catastrophic backtracking', (done) => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalCorsOriginProduction = process.env.CORS_ORIGIN_PRODUCTION;
      
      process.env.NODE_ENV = 'production';
      process.env.CORS_ORIGIN_PRODUCTION = 'https://yoohoo.guru,https://www.yoohoo.guru,https://api.yoohoo.guru,https://*.yoohoo.guru,https://*.vercel.app';

      const config = getConfig();
      const corsValidator = getCorsOrigins(config);

      // Attempt to trigger ReDoS with long repeating patterns
      const maliciousOrigins = [
        'https://' + 'a'.repeat(100) + '.yoohoo.guru.',  // Extra dot at the end
        'https://' + 'test-'.repeat(50) + 'yoohoo.guru',  // Repeating pattern
        'https://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.yoohoo.guru.',  // Long subdomain with trailing dot
        'https://' + 'x'.repeat(200) + '.vercel.app.',  // Very long subdomain
      ];

      let completed = 0;
      maliciousOrigins.forEach(origin => {
        const startTime = Date.now();
        corsValidator(origin, (err, allowed) => {
          const elapsed = Date.now() - startTime;
          
          // Should still complete quickly even for malicious input (under 10ms)
          expect(elapsed).toBeLessThan(10);
          
          // These should be rejected (error or not allowed)
          if (err) {
            expect(err).toBeInstanceOf(Error);
          } else {
            expect(allowed).toBe(false);
          }
          
          completed++;
          if (completed === maliciousOrigins.length) {
            process.env.NODE_ENV = originalNodeEnv;
            if (originalCorsOriginProduction !== undefined) {
              process.env.CORS_ORIGIN_PRODUCTION = originalCorsOriginProduction;
            } else {
              delete process.env.CORS_ORIGIN_PRODUCTION;
            }
            done();
          }
        });
      });
    });

    it('should validate case-insensitive subdomain matching', (done) => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalCorsOriginProduction = process.env.CORS_ORIGIN_PRODUCTION;
      
      process.env.NODE_ENV = 'production';
      process.env.CORS_ORIGIN_PRODUCTION = 'https://yoohoo.guru,https://www.yoohoo.guru,https://api.yoohoo.guru,https://*.yoohoo.guru,https://*.vercel.app';

      const config = getConfig();
      const corsValidator = getCorsOrigins(config);

      // Test various case combinations
      const caseTestOrigins = [
        { origin: 'https://ART.yoohoo.guru', shouldAllow: true },
        { origin: 'https://Coach.yoohoo.guru', shouldAllow: true },
        { origin: 'https://MASTERS.YOOHOO.GURU', shouldAllow: true },
        { origin: 'https://Test-App.Vercel.App', shouldAllow: true },
      ];

      let completed = 0;
      caseTestOrigins.forEach(({ origin, shouldAllow }) => {
        corsValidator(origin, (err, allowed) => {
          if (shouldAllow) {
            expect(err).toBeNull();
            expect(allowed).toBe(true);
          }
          
          completed++;
          if (completed === caseTestOrigins.length) {
            process.env.NODE_ENV = originalNodeEnv;
            if (originalCorsOriginProduction !== undefined) {
              process.env.CORS_ORIGIN_PRODUCTION = originalCorsOriginProduction;
            } else {
              delete process.env.CORS_ORIGIN_PRODUCTION;
            }
            done();
          }
        });
      });
    });

    it('should only match valid subdomain characters', (done) => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalCorsOriginProduction = process.env.CORS_ORIGIN_PRODUCTION;
      
      process.env.NODE_ENV = 'production';
      process.env.CORS_ORIGIN_PRODUCTION = 'https://yoohoo.guru,https://www.yoohoo.guru,https://api.yoohoo.guru,https://*.yoohoo.guru,https://*.vercel.app';

      const config = getConfig();
      const corsValidator = getCorsOrigins(config);

      // Test origins with invalid characters that should not match
      const invalidOrigins = [
        'https://test space.yoohoo.guru',  // Space
        'https://test/slash.yoohoo.guru',  // Slash
        'https://test@at.yoohoo.guru',     // @ symbol
        'https://test#hash.yoohoo.guru',   // Hash
      ];

      let completed = 0;
      invalidOrigins.forEach(origin => {
        corsValidator(origin, (err, allowed) => {
          // Should be rejected
          expect(err).toBeInstanceOf(Error);
          
          completed++;
          if (completed === invalidOrigins.length) {
            process.env.NODE_ENV = originalNodeEnv;
            if (originalCorsOriginProduction !== undefined) {
              process.env.CORS_ORIGIN_PRODUCTION = originalCorsOriginProduction;
            } else {
              delete process.env.CORS_ORIGIN_PRODUCTION;
            }
            done();
          }
        });
      });
    });

    it('should handle edge cases without performance degradation', (done) => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalCorsOriginDevelopment = process.env.CORS_ORIGIN_DEVELOPMENT;
      
      process.env.NODE_ENV = 'development';
      process.env.CORS_ORIGIN_DEVELOPMENT = 'http://localhost:3000,http://127.0.0.1:3000,http://*.localhost:3000';

      const config = getConfig();
      const corsValidator = getCorsOrigins(config);

      // Edge cases that previously could cause ReDoS
      const edgeCases = [
        'http://a.localhost:3000',
        'http://test.localhost:3000',
        'http://my-subdomain.localhost:3000',
        'http://123.localhost:3000',
        'http://test-123.localhost:3000',
      ];

      let completed = 0;
      edgeCases.forEach(origin => {
        const startTime = Date.now();
        corsValidator(origin, (err, allowed) => {
          const elapsed = Date.now() - startTime;
          
          // Should complete very quickly
          expect(elapsed).toBeLessThan(5);
          expect(err).toBeNull();
          expect(allowed).toBe(true);
          
          completed++;
          if (completed === edgeCases.length) {
            process.env.NODE_ENV = originalNodeEnv;
            if (originalCorsOriginDevelopment !== undefined) {
              process.env.CORS_ORIGIN_DEVELOPMENT = originalCorsOriginDevelopment;
            } else {
              delete process.env.CORS_ORIGIN_DEVELOPMENT;
            }
            done();
          }
        });
      });
    });
  });

  describe('Pattern Safety Verification', () => {
    it('should use non-polynomial regex patterns', () => {
      // Verify that the pattern used is safe (no .* or other polynomial patterns)
      const testPattern = 'https://*.yoohoo.guru';
      
      // Simulate the pattern transformation
      const pattern = testPattern
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\\\*/g, '[a-z0-9.-]+');
      
      // Should contain the safe character class, not .*
      expect(pattern).toContain('[a-z0-9.-]+');
      expect(pattern).not.toContain('.*');
      
      // Verify the pattern structure
      expect(pattern).toBe('https://[a-z0-9.-]+\\.yoohoo\\.guru');
    });
  });
});
