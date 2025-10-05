/**
 * Tests for Feature Flags Service
 */

import featureFlags from './featureFlags';

// Mock fetch globally
global.fetch = jest.fn();

describe('FeatureFlagsService', () => {
  let consoleWarnSpy;
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    // Reset the service state
    featureFlags.flags = {};
    featureFlags.loaded = false;
    
    // Reset fetch mock
    global.fetch.mockClear();
    
    // Spy on console.warn
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    // Restore console.warn
    consoleWarnSpy.mockRestore();
    
    // Restore NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });

  describe('loadFlags', () => {
    test('loads flags successfully from API', async () => {
      const mockFlags = {
        features: {
          booking: true,
          messaging: false
        },
        version: '20250101.1200'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValue(mockFlags)
      });

      const flags = await featureFlags.loadFlags();

      expect(flags).toEqual(mockFlags.features);
      expect(featureFlags.loaded).toBe(true);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    test('handles non-JSON content-type in development mode', async () => {
      process.env.NODE_ENV = 'development';

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('text/html')
        }
      });

      const flags = await featureFlags.loadFlags();

      // Should return default flags
      expect(flags).toEqual(featureFlags.getDefaultFlags());
      expect(featureFlags.loaded).toBe(true);
      
      // Should log warning in development
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Feature flags endpoint returned non-JSON content')
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('URL:')
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Content-Type: text/html')
      );
    });

    test('does not log warning for non-JSON content-type in production mode', async () => {
      process.env.NODE_ENV = 'production';

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('text/html')
        }
      });

      const flags = await featureFlags.loadFlags();

      // Should return default flags
      expect(flags).toEqual(featureFlags.getDefaultFlags());
      expect(featureFlags.loaded).toBe(true);
      
      // Should NOT log warning in production
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    test('handles missing content-type header in development', async () => {
      process.env.NODE_ENV = 'development';

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue(null)
        }
      });

      const flags = await featureFlags.loadFlags();

      expect(flags).toEqual(featureFlags.getDefaultFlags());
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Content-Type: not set')
      );
    });

    test('handles HTTP error status in development', async () => {
      process.env.NODE_ENV = 'development';

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        }
      });

      const flags = await featureFlags.loadFlags();

      expect(flags).toEqual(featureFlags.getDefaultFlags());
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to load feature flags (500)')
      );
    });

    test('does not log warning for HTTP error in production', async () => {
      process.env.NODE_ENV = 'production';

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        }
      });

      const flags = await featureFlags.loadFlags();

      expect(flags).toEqual(featureFlags.getDefaultFlags());
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    test('handles JSON parse error in development', async () => {
      process.env.NODE_ENV = 'development';

      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      });

      const flags = await featureFlags.loadFlags();

      expect(flags).toEqual(featureFlags.getDefaultFlags());
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to parse feature flags JSON'),
        expect.any(String)
      );
    });

    test('handles network error in development', async () => {
      process.env.NODE_ENV = 'development';

      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const flags = await featureFlags.loadFlags();

      expect(flags).toEqual(featureFlags.getDefaultFlags());
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error loading feature flags'),
        expect.any(String)
      );
    });

    test('supports legacy flags format', async () => {
      const mockFlags = {
        flags: {
          booking: true,
          messaging: false
        }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValue(mockFlags)
      });

      const flags = await featureFlags.loadFlags();

      expect(flags).toEqual(mockFlags.flags);
      expect(featureFlags.loaded).toBe(true);
    });
  });

  describe('isEnabled', () => {
    test('returns flag value when loaded', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValue({
          features: { booking: true, messaging: false }
        })
      });

      await featureFlags.loadFlags();

      expect(featureFlags.isEnabled('booking')).toBe(true);
      expect(featureFlags.isEnabled('messaging')).toBe(false);
    });

    test('warns when checked before loaded in development', () => {
      process.env.NODE_ENV = 'development';

      featureFlags.isEnabled('booking');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('checked before flags were loaded')
      );
    });

    test('does not warn when checked before loaded in production', () => {
      process.env.NODE_ENV = 'production';

      featureFlags.isEnabled('booking');

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('getDefaultFlags', () => {
    test('returns default flags object', () => {
      const defaults = featureFlags.getDefaultFlags();

      expect(defaults).toHaveProperty('booking');
      expect(defaults).toHaveProperty('messaging');
      expect(defaults).toHaveProperty('reviews');
      expect(typeof defaults.booking).toBe('boolean');
    });
  });

  describe('isLoaded', () => {
    test('returns false initially', () => {
      expect(featureFlags.isLoaded()).toBe(false);
    });

    test('returns true after loading', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: jest.fn().mockResolvedValue({ features: {} })
      });

      await featureFlags.loadFlags();

      expect(featureFlags.isLoaded()).toBe(true);
    });
  });
});
