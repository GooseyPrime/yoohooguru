/**
 * Tests for API utility functions
 */

// Mock the auth context
jest.mock('../../contexts/AuthContext', () => ({
  auth: {
    currentUser: null
  }
}));

describe('API URL construction', () => {
  let originalEnv;
  let originalFetch;

  beforeEach(() => {
    // Save original environment and fetch
    originalEnv = process.env.REACT_APP_API_URL;
    originalFetch = global.fetch;
    
    // Mock fetch to capture the URL being called
    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        headers: {
          get: (header) => {
            if (header === 'content-type') return 'application/json';
            return null;
          }
        },
        json: () => Promise.resolve({ success: true, data: {} })
      })
    );
  });

  afterEach(() => {
    // Restore original values
    process.env.REACT_APP_API_URL = originalEnv;
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('should prepend /api to path when REACT_APP_API_URL is set', async () => {
    // Simulate production environment
    process.env.REACT_APP_API_URL = 'https://api.yoohoo.guru';
    
    // Import api function after setting env var
    delete require.cache[require.resolve('../api')];
    const { apiGet } = require('../api');
    
    await apiGet('/skills');
    
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.yoohoo.guru/api/skills',
      expect.any(Object)
    );
  });

  test('should not double /api prefix when path already has it', async () => {
    process.env.REACT_APP_API_URL = 'https://api.yoohoo.guru';
    
    delete require.cache[require.resolve('../api')];
    const { apiGet } = require('../api');
    
    await apiGet('/api/skills');
    
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.yoohoo.guru/api/skills',
      expect.any(Object)
    );
  });

  test('should use default /api prefix in development', async () => {
    delete process.env.REACT_APP_API_URL;
    
    delete require.cache[require.resolve('../api')];
    const { apiGet } = require('../api');
    
    await apiGet('/skills');
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/skills',
      expect.any(Object)
    );
  });

  test('should work with query parameters', async () => {
    process.env.REACT_APP_API_URL = 'https://api.yoohoo.guru';
    
    delete require.cache[require.resolve('../api')];
    const { apiGet } = require('../api');
    
    await apiGet('/skills?popular=true');
    
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.yoohoo.guru/api/skills?popular=true',
      expect.any(Object)
    );
  });
});
