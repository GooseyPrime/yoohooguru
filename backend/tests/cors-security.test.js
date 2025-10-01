const { getCorsOrigins, getConfig } = require('../src/config/appConfig');

describe('CORS Security Validation', () => {
  describe('Overly Permissive Wildcard Prevention', () => {
    let originalNodeEnv, originalCorsOriginDev;

    beforeEach(() => {
      originalNodeEnv = process.env.NODE_ENV;
      originalCorsOriginDev = process.env.CORS_ORIGIN_DEVELOPMENT;
    });

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
      if (originalCorsOriginDev) {
        process.env.CORS_ORIGIN_DEVELOPMENT = originalCorsOriginDev;
      } else {
        delete process.env.CORS_ORIGIN_DEVELOPMENT;
      }
    });

    it('should reject overly permissive wildcards like http://*', (done) => {
      process.env.NODE_ENV = 'development';
      process.env.CORS_ORIGIN_DEVELOPMENT = 'http://localhost:3000,http://*,http://127.0.0.1:3000';

      const config = getConfig();
      const corsValidator = getCorsOrigins(config);

      // Verify that malicious.com is rejected even with http://* in config
      corsValidator('http://malicious.com', (err, allowed) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('CORS policy violation');
        expect(allowed).toBeUndefined();
        done();
      });
    });

    it('should reject multiple overly permissive patterns', (done) => {
      process.env.NODE_ENV = 'development';
      process.env.CORS_ORIGIN_DEVELOPMENT = 'https://*,http://*,*';

      const config = getConfig();
      const corsValidator = getCorsOrigins(config);

      // Should fall back to safe defaults and reject malicious origins
      corsValidator('http://malicious.com', (err, allowed) => {
        expect(err).toBeInstanceOf(Error);
        expect(allowed).toBeUndefined();
        done();
      });
    });

    it('should still allow legitimate wildcard patterns', (done) => {
      process.env.NODE_ENV = 'development';
      process.env.CORS_ORIGIN_DEVELOPMENT = 'http://*.localhost:3000,https://*.vercel.app';

      const config = getConfig();
      const corsValidator = getCorsOrigins(config);

      // Should allow subdomain.localhost:3000
      corsValidator('http://test.localhost:3000', (err, allowed) => {
        expect(err).toBeNull();
        expect(allowed).toBe(true);

        // But reject malicious.com
        corsValidator('http://malicious.com', (err2, allowed2) => {
          expect(err2).toBeInstanceOf(Error);
          expect(allowed2).toBeUndefined();
          done();
        });
      });
    });
  });
});