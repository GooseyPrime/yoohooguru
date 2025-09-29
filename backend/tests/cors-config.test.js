
/**
 * Test CORS configuration functionality
 */

describe('CORS Configuration', () => {
  let originalNodeEnv;
  let originalCorsOriginProduction;

  beforeAll(() => {
    // Store original values
    originalNodeEnv = process.env.NODE_ENV;
    originalCorsOriginProduction = process.env.CORS_ORIGIN_PRODUCTION;
  });

  afterAll(() => {
    // Restore original values
    process.env.NODE_ENV = originalNodeEnv;
    if (originalCorsOriginProduction !== undefined) {
      process.env.CORS_ORIGIN_PRODUCTION = originalCorsOriginProduction;
    } else {
      delete process.env.CORS_ORIGIN_PRODUCTION;
    }
  });

  afterEach(() => {
    // Clear require cache to ensure clean config loading
    delete require.cache[require.resolve('../src/config/appConfig')];
  });

  describe('Production CORS Origins', () => {
    beforeEach(() => {
      // Set production environment but ensure test patterns aren't prohibited
      process.env.NODE_ENV = 'production';
      delete process.env.CORS_ORIGIN_PRODUCTION;
      // Set a valid production Firebase project ID to avoid validation failures
      process.env.FIREBASE_PROJECT_ID = 'ceremonial-tea-470904-f3';
      process.env.FIREBASE_API_KEY = 'test-api-key';
      process.env.JWT_SECRET = 'test-jwt-secret';
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret';
    });

    afterEach(() => {
      // Clean up environment variables
      delete process.env.FIREBASE_PROJECT_ID;
      delete process.env.FIREBASE_API_KEY;
      delete process.env.JWT_SECRET;
      delete process.env.STRIPE_WEBHOOK_SECRET;
    });

    it('should use default production origins when CORS_ORIGIN_PRODUCTION is not set', () => {
      const { getConfig } = require('../src/config/appConfig');
      const config = getConfig();
      
      expect(config.corsOriginProduction).toEqual([
        'https://yoohoo.guru',
        'https://www.yoohoo.guru',
        'https://api.yoohoo.guru',
        'https://*.yoohoo.guru',
        'https://*.vercel.app'
      ]);
    });

    it('should use custom origins when CORS_ORIGIN_PRODUCTION is set', () => {
      process.env.CORS_ORIGIN_PRODUCTION = 'https://custom1.com,https://custom2.com';
      
      const { getConfig } = require('../src/config/appConfig');
      const config = getConfig();
      
      expect(config.corsOriginProduction).toEqual([
        'https://custom1.com',
        'https://custom2.com'
      ]);
    });

    it('should handle empty CORS_ORIGIN_PRODUCTION by using defaults', () => {
      process.env.CORS_ORIGIN_PRODUCTION = '';
      
      const { getConfig } = require('../src/config/appConfig');
      const config = getConfig();
      
      expect(config.corsOriginProduction).toEqual([
        'https://yoohoo.guru',
        'https://www.yoohoo.guru',
        'https://api.yoohoo.guru',
        'https://*.yoohoo.guru',
        'https://*.vercel.app'
      ]);
    });
  });

  describe('CORS Origin Validation Function', () => {
    let corsFunction;

    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      delete process.env.CORS_ORIGIN_PRODUCTION;
      
      const { getConfig, getCorsOrigins } = require('../src/config/appConfig');
      const config = getConfig();
      corsFunction = getCorsOrigins(config);
    });

    it('should allow exact origin matches', (done) => {
      corsFunction('https://yoohoo.guru', (err, allowed) => {
        expect(err).toBeNull();
        expect(allowed).toBe(true);
        done();
      });
    });

    it('should allow wildcard matches for vercel.app', (done) => {
      corsFunction('https://myapp.vercel.app', (err, allowed) => {
        expect(err).toBeNull();
        expect(allowed).toBe(true);
        done();
      });
    });

    it('should allow api.yoohoo.guru explicitly', (done) => {
      corsFunction('https://api.yoohoo.guru', (err, allowed) => {
        expect(err).toBeNull();
        expect(allowed).toBe(true);
        done();
      });
    });

    it('should allow another wildcard match for vercel.app', (done) => {
      corsFunction('https://another-app.vercel.app', (err, allowed) => {
        expect(err).toBeNull();
        expect(allowed).toBe(true);
        done();
      });
    });

    it('should block non-matching origins', (done) => {
      corsFunction('https://badsite.com', (err, allowed) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('CORS policy violation');
        expect(allowed).toBeUndefined();
        done();
      });
    });

    it('should allow requests with no origin (mobile apps, Postman)', (done) => {
      corsFunction(null, (err, allowed) => {
        expect(err).toBeNull();
        expect(allowed).toBe(true);
        done();
      });
    });

    it('should allow requests with undefined origin', (done) => {
      corsFunction(undefined, (err, allowed) => {
        expect(err).toBeNull();
        expect(allowed).toBe(true);
        done();
      });
    });

    it('should validate all required origins from issue spec', (done) => {
      const requiredOrigins = [
        'https://api.yoohoo.guru',
        'https://www.yoohoo.guru',
        'https://some-app.vercel.app'
      ];
      
      let completedTests = 0;
      const totalTests = requiredOrigins.length;
      
      requiredOrigins.forEach(origin => {
        corsFunction(origin, (err, allowed) => {
          expect(err).toBeNull();
          expect(allowed).toBe(true);
          completedTests++;
          
          if (completedTests === totalTests) {
            done();
          }
        });
      });
    });
  });

  describe('Development CORS Origins', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      delete process.env.CORS_ORIGIN_DEVELOPMENT;
    });

    it('should use default development origins', () => {
      const { getConfig } = require('../src/config/appConfig');
      const config = getConfig();
      
      expect(config.corsOriginDevelopment).toEqual([
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://*.localhost:3000'
      ]);
    });

    it('should work with development origins', (done) => {
      const { getConfig, getCorsOrigins } = require('../src/config/appConfig');
      const config = getConfig();
      const corsFunction = getCorsOrigins(config);
      
      corsFunction('http://localhost:3000', (err, allowed) => {
        expect(err).toBeNull();
        expect(allowed).toBe(true);
        done();
      });
    });
  });
});