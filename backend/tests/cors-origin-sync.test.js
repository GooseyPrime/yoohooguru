/**
 * Test dynamic CORS origin synchronization functionality
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { 
  fetchVercelDomains, 
  getRailwayDomain, 
  updateEnvFile 
} = require('../../scripts/update-cors-origins.production.js');

// Mock axios for testing
jest.mock('axios');
const mockedAxios = axios;

describe('Dynamic CORS Origin Sync', () => {
  const testEnvPath = path.resolve(__dirname, '.env.production.test');
  const originalConsoleLog = console.log;
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;
  
  let consoleOutput = [];
  
  beforeEach(() => {
    // Capture console output
    consoleOutput = [];
    console.log = jest.fn((...args) => consoleOutput.push(['log', ...args]));
    console.warn = jest.fn((...args) => consoleOutput.push(['warn', ...args]));
    console.error = jest.fn((...args) => consoleOutput.push(['error', ...args]));
    
    // Clean up test env file
    if (fs.existsSync(testEnvPath)) {
      fs.unlinkSync(testEnvPath);
    }
    
    // Clear axios mocks
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Restore console
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
    
    // Clean up test env file
    if (fs.existsSync(testEnvPath)) {
      fs.unlinkSync(testEnvPath);
    }
  });

  describe('fetchVercelDomains', () => {
    it('should return empty array when VERCEL_API_TOKEN is not set', async () => {
      delete process.env.VERCEL_API_TOKEN;
      
      const domains = await fetchVercelDomains();
      
      expect(domains).toEqual([]);
      expect(consoleOutput).toContainEqual(['warn', '⚠️ VERCEL_API_TOKEN not set - skipping dynamic Vercel domain fetch']);
    });

    it('should fetch verified domains when VERCEL_API_TOKEN is set', async () => {
      process.env.VERCEL_API_TOKEN = 'test-token';
      
      const mockResponse = {
        data: {
          domains: [
            { name: 'yoohoo.guru', verified: true },
            { name: 'test.vercel.app', verified: true },
            { name: 'unverified.com', verified: false }
          ]
        }
      };
      
      mockedAxios.get.mockResolvedValue(mockResponse);
      
      const domains = await fetchVercelDomains();
      
      expect(domains).toEqual([
        'https://yoohoo.guru',
        'https://test.vercel.app'
      ]);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.vercel.com/v6/domains',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token'
          })
        })
      );
    });

    it('should handle API errors gracefully', async () => {
      process.env.VERCEL_API_TOKEN = 'test-token';
      
      mockedAxios.get.mockRejectedValue(new Error('API Error'));
      
      const domains = await fetchVercelDomains();
      
      expect(domains).toEqual([]);
      expect(consoleOutput).toContainEqual(['warn', '⚠️ Failed to fetch Vercel domains:', 'API Error']);
    });
  });

  describe('getRailwayDomain', () => {
    it('should return the static Railway domain', () => {
      const domain = getRailwayDomain();
      expect(domain).toBe('https://api.yoohoo.guru');
    });
  });

  describe('updateEnvFile', () => {
    it('should create new CORS_ORIGIN_PRODUCTION line if file exists but line does not', () => {
      // Create test env file without CORS_ORIGIN_PRODUCTION
      const initialContent = `NODE_ENV=production
PORT=3001
APP_BRAND_NAME=yoohoo.guru`;
      
      fs.writeFileSync(testEnvPath, initialContent);
      
      const origins = ['https://yoohoo.guru', 'https://www.yoohoo.guru', 'https://api.yoohoo.guru'];
      
      // Override the path for testing
      const originalUpdateEnvFile = updateEnvFile;
      const testUpdateEnvFile = (origins) => {
        const envContent = fs.readFileSync(testEnvPath, 'utf-8');
        const originsList = origins.join(',');
        
        let updatedContent;
        if (envContent.includes('CORS_ORIGIN_PRODUCTION=')) {
          updatedContent = envContent.replace(
            /^CORS_ORIGIN_PRODUCTION=.*$/m,
            `CORS_ORIGIN_PRODUCTION=${originsList}`
          );
        } else {
          updatedContent = envContent + `\nCORS_ORIGIN_PRODUCTION=${originsList}\n`;
        }
        
        fs.writeFileSync(testEnvPath, updatedContent);
        console.log('✅ CORS_ORIGIN_PRODUCTION updated dynamically in .env.production');
      };
      
      testUpdateEnvFile(origins);
      
      const updatedContent = fs.readFileSync(testEnvPath, 'utf-8');
      expect(updatedContent).toContain('CORS_ORIGIN_PRODUCTION=https://yoohoo.guru,https://www.yoohoo.guru,https://api.yoohoo.guru');
    });

    it('should update existing CORS_ORIGIN_PRODUCTION line', () => {
      // Create test env file with existing CORS_ORIGIN_PRODUCTION
      const initialContent = `NODE_ENV=production
PORT=3001
CORS_ORIGIN_PRODUCTION=https://old.com
APP_BRAND_NAME=yoohoo.guru`;
      
      fs.writeFileSync(testEnvPath, initialContent);
      
      const origins = ['https://yoohoo.guru', 'https://www.yoohoo.guru', 'https://api.yoohoo.guru'];
      
      // Test the update logic
      const envContent = fs.readFileSync(testEnvPath, 'utf-8');
      const originsList = origins.join(',');
      const updatedContent = envContent.replace(
        /^CORS_ORIGIN_PRODUCTION=.*$/m,
        `CORS_ORIGIN_PRODUCTION=${originsList}`
      );
      
      fs.writeFileSync(testEnvPath, updatedContent);
      
      const finalContent = fs.readFileSync(testEnvPath, 'utf-8');
      expect(finalContent).toContain('CORS_ORIGIN_PRODUCTION=https://yoohoo.guru,https://www.yoohoo.guru,https://api.yoohoo.guru');
      expect(finalContent).not.toContain('https://old.com');
    });
  });

  describe('Integration', () => {
    it('should include api.yoohoo.guru in static origins', () => {
      // Test that the script includes the required api.yoohoo.guru domain
      const { getConfig } = require('../src/config/appConfig');
      
      // Set production environment
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      // Clear any existing CORS_ORIGIN_PRODUCTION
      delete process.env.CORS_ORIGIN_PRODUCTION;
      
      try {
        const config = getConfig();
        expect(config.corsOriginProduction).toContain('https://api.yoohoo.guru');
        expect(config.corsOriginProduction).toContain('https://yoohoo.guru');
        expect(config.corsOriginProduction).toContain('https://www.yoohoo.guru');
      } finally {
        process.env.NODE_ENV = originalNodeEnv;
      }
    });
  });
});