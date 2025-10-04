
const { getCorsOrigins, getConfig, getCorsOriginsArray } = require('../src/config/appConfig');

describe('CORS Configuration', () => {
  describe('CORS Origins Configuration', () => {
    it('should include expected origins in production configuration', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalCorsOriginProduction = process.env.CORS_ORIGIN_PRODUCTION;

      process.env.NODE_ENV = 'production';
      // Clear env var to test defaults
      delete process.env.CORS_ORIGIN_PRODUCTION;

      const config = getConfig();
      const corsOriginsArray = getCorsOriginsArray(config);

      expect(corsOriginsArray).toContain('https://yoohoo.guru');
      expect(corsOriginsArray).toContain('https://www.yoohoo.guru');
      expect(corsOriginsArray).toContain('https://*.vercel.app');

      process.env.NODE_ENV = originalNodeEnv;
      if (originalCorsOriginProduction) {
        process.env.CORS_ORIGIN_PRODUCTION = originalCorsOriginProduction;
      }
    });

    it('should include wildcard localhost in development configuration', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalCorsOriginDevelopment = process.env.CORS_ORIGIN_DEVELOPMENT;

      process.env.NODE_ENV = 'development';
      // Clear env var to test defaults
      delete process.env.CORS_ORIGIN_DEVELOPMENT;

      const config = getConfig();
      const corsOriginsArray = getCorsOriginsArray(config);

      expect(corsOriginsArray).toContain('http://*.localhost:3000');
      expect(corsOriginsArray).toContain('http://localhost:3000');
      expect(corsOriginsArray).toContain('http://127.0.0.1:3000');

      process.env.NODE_ENV = originalNodeEnv;
      if (originalCorsOriginDevelopment) {
        process.env.CORS_ORIGIN_DEVELOPMENT = originalCorsOriginDevelopment;
      }
    });

    it('should return a function for dynamic CORS validation', () => {
      const config = getConfig();
      const corsValidator = getCorsOrigins(config);

      expect(typeof corsValidator).toBe('function');
    });

    it('should validate origins correctly through the CORS function', (done) => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const config = getConfig();
      const corsValidator = getCorsOrigins(config);

      // Test valid origin
      corsValidator('http://localhost:3000', (err, allowed) => {
        expect(err).toBeNull();
        expect(allowed).toBe(true);

        // Test wildcard origin
        corsValidator('http://test.localhost:3000', (err2, allowed2) => {
          expect(err2).toBeNull();
          expect(allowed2).toBe(true);

          // Test invalid origin
          corsValidator('http://malicious.com', (err3, allowed3) => {
            expect(err3).toBeInstanceOf(Error);
            expect(allowed3).toBeUndefined();

            process.env.NODE_ENV = originalNodeEnv;
            done();
          });
        });
      });
    });
  });

  describe('Wildcard Pattern Matching', () => {
    const testWildcardMatch = (pattern, origin, shouldMatch) => {
      const regex = pattern
        .replace(/\\/g, '\\\\') // Escape backslashes
        .replace(/\./g, '\\.')  // Escape dots
        .replace(/\*/g, '.*');  // Convert * to .*

      const matches = new RegExp(`^${regex}$`).test(origin);
      if (shouldMatch) {
        expect(matches).toBe(true);
      } else {
        expect(matches).toBe(false);
      }
    };

    it('should match vercel.app subdomains correctly', () => {
      const pattern = 'https://*.vercel.app';

      testWildcardMatch(pattern, 'https://yoohooguru.vercel.app', true);
      testWildcardMatch(pattern, 'https://frontend-123.vercel.app', true);
      testWildcardMatch(pattern, 'https://any-subdomain.vercel.app', true);

      // Should not match non-vercel domains
      testWildcardMatch(pattern, 'https://malicious.com', false);
      testWildcardMatch(pattern, 'https://sub.malicious.com', false);
    });

    it('should match localhost subdomains correctly', () => {
      const pattern = 'http://*.localhost:3000';

      testWildcardMatch(pattern, 'http://art.localhost:3000', true);
      testWildcardMatch(pattern, 'http://coach.localhost:3000', true);
      testWildcardMatch(pattern, 'http://masters.localhost:3000', true);

      // Should not match wrong ports or domains
      testWildcardMatch(pattern, 'http://art.localhost:3001', false);
      testWildcardMatch(pattern, 'https://art.localhost:3000', false);
      testWildcardMatch(pattern, 'http://malicious.com:3000', false);
    });
  });
});