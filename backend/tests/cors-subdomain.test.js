const { getCorsOrigins, getCorsOriginsArray, getConfig } = require('../src/config/appConfig');

describe('CORS Configuration', () => {
  describe('CORS Origins Configuration', () => {
    it('should include wildcard subdomains in production configuration', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const config = getConfig();
      const corsOrigins = getCorsOriginsArray(config);
      
      expect(corsOrigins).toContain('https://*.yoohoo.guru');
      expect(corsOrigins).toContain('https://yoohoo.guru');
      expect(corsOrigins).toContain('https://www.yoohoo.guru');
      
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('should include wildcard localhost in development configuration', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const config = getConfig();
      const corsOrigins = getCorsOriginsArray(config);
      
      expect(corsOrigins).toContain('http://*.localhost:3000');
      expect(corsOrigins).toContain('http://localhost:3000');
      expect(corsOrigins).toContain('http://127.0.0.1:3000');
      
      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('Wildcard Pattern Matching', () => {
    const testWildcardMatch = (pattern, origin, shouldMatch) => {
      const regex = pattern
        .replace(/\./g, '\\.')  // Escape dots
        .replace(/\*/g, '.*');  // Convert * to .*
      
      const matches = new RegExp(`^${regex}$`).test(origin);
      if (shouldMatch) {
        expect(matches).toBe(true);
      } else {
        expect(matches).toBe(false);
      }
    };

    it('should match yoohoo.guru subdomains correctly', () => {
      const pattern = 'https://*.yoohoo.guru';
      
      testWildcardMatch(pattern, 'https://art.yoohoo.guru', true);
      testWildcardMatch(pattern, 'https://coach.yoohoo.guru', true);
      testWildcardMatch(pattern, 'https://masters.yoohoo.guru', true);
      testWildcardMatch(pattern, 'https://any-subdomain.yoohoo.guru', true);
      
      // Should not match non-yoohoo domains
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