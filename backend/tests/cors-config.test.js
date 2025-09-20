const { getConfig, getCorsOrigins } = require('../src/config/appConfig');

describe('CORS Configuration', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Production CORS Configuration', () => {
    test('should only allow trusted origins in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.CORS_ORIGIN_PRODUCTION = 'https://yoohoo.guru,https://www.yoohoo.guru';
      
      const config = getConfig();
      const corsOrigins = getCorsOrigins(config);
      
      expect(corsOrigins).toEqual([
        'https://yoohoo.guru',
        'https://www.yoohoo.guru'
      ]);
      
      // Should not include any development origins
      expect(corsOrigins).not.toContain('http://localhost:3000');
      expect(corsOrigins).not.toContain('http://127.0.0.1:3000');
      
      // Should not include wildcard origins
      expect(corsOrigins.some(origin => origin.includes('*'))).toBe(false);
    });

    test('should use default production origins when CORS_ORIGIN_PRODUCTION not set', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.CORS_ORIGIN_PRODUCTION;
      
      const config = getConfig();
      const corsOrigins = getCorsOrigins(config);
      
      // Should use secure default origins
      expect(corsOrigins).toContain('https://yoohoo.guru');
      expect(corsOrigins).toContain('https://www.yoohoo.guru');
      
      // Should not include localhost or insecure origins
      expect(corsOrigins).not.toContain('http://localhost:3000');
      expect(corsOrigins.every(origin => origin.startsWith('https://'))).toBe(true);
    });

    test('should reject insecure origins in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.CORS_ORIGIN_PRODUCTION = 'http://insecure.com,https://secure.com';
      
      const config = getConfig();
      const corsOrigins = getCorsOrigins(config);
      
      // Filter should remove insecure origins or validation should reject them
      // This test ensures our CORS config is strict about HTTPS in production
      const hasInsecureOrigins = corsOrigins.some(origin => 
        origin.startsWith('http://') && !origin.includes('localhost')
      );
      
      expect(hasInsecureOrigins).toBe(false);
    });
  });

  describe('Development CORS Configuration', () => {
    test('should allow localhost origins in development', () => {
      process.env.NODE_ENV = 'development';
      
      const config = getConfig();
      const corsOrigins = getCorsOrigins(config);
      
      expect(corsOrigins).toContain('http://localhost:3000');
      expect(corsOrigins).toContain('http://127.0.0.1:3000');
    });

    test('should use custom development origins when provided', () => {
      process.env.NODE_ENV = 'development';
      process.env.CORS_ORIGIN_DEVELOPMENT = 'http://localhost:3001,http://localhost:3002';
      
      const config = getConfig();
      const corsOrigins = getCorsOrigins(config);
      
      expect(corsOrigins).toContain('http://localhost:3001');
      expect(corsOrigins).toContain('http://localhost:3002');
    });
  });

  describe('CORS Origin Validation', () => {
    test('should not allow wildcard origins in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.CORS_ORIGIN_PRODUCTION = 'https://yoohoo.guru,*';
      
      const config = getConfig();
      const corsOrigins = getCorsOrigins(config);
      
      // Should filter out wildcard origins
      expect(corsOrigins).not.toContain('*');
      expect(corsOrigins.some(origin => origin === '*')).toBe(false);
    });

    test('should trim whitespace from CORS origins', () => {
      process.env.NODE_ENV = 'production';
      process.env.CORS_ORIGIN_PRODUCTION = ' https://yoohoo.guru , https://www.yoohoo.guru ';
      
      const config = getConfig();
      const corsOrigins = getCorsOrigins(config);
      
      expect(corsOrigins).toContain('https://yoohoo.guru');
      expect(corsOrigins).toContain('https://www.yoohoo.guru');
      expect(corsOrigins).not.toContain(' https://yoohoo.guru ');
    });

    test('should filter out empty origins', () => {
      process.env.NODE_ENV = 'production';
      process.env.CORS_ORIGIN_PRODUCTION = 'https://yoohoo.guru,,https://www.yoohoo.guru';
      
      const config = getConfig();
      const corsOrigins = getCorsOrigins(config);
      
      expect(corsOrigins).toContain('https://yoohoo.guru');
      expect(corsOrigins).toContain('https://www.yoohoo.guru');
      expect(corsOrigins).not.toContain('');
      expect(corsOrigins.length).toBe(2);
    });
  });

  describe('Staging CORS Configuration', () => {
    test('should apply same strict rules as production', () => {
      process.env.NODE_ENV = 'staging';
      process.env.CORS_ORIGIN_PRODUCTION = 'https://staging.yoohoo.guru';
      
      const config = getConfig();
      const corsOrigins = getCorsOrigins(config);
      
      // Should use production CORS configuration in staging
      expect(corsOrigins).toEqual(['https://staging.yoohoo.guru']);
      
      // Should not include development origins
      expect(corsOrigins).not.toContain('http://localhost:3000');
    });
  });
});