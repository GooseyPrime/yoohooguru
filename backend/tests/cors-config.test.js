
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
      process.env.NODE_ENV = 'production';
      delete process.env.CORS_ORIGIN_PRODUCTION;
    });

    it('should use default production origins when CORS_ORIGIN_PRODUCTION is not set', () => {
      const { getConfig } = require('../src/config/appConfig');
      const config = getConfig();
      
      expect(config.corsOriginProduction).toEqual([
        'https://yoohoo.guru',
        'https://www.yoohoo.guru',
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
        'http://127.0.0.1:3000'
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