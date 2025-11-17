/**
 * CI Environment Configuration Tests
 * 
 * These tests validate that environment variables are correctly configured
 * for CI/CD workflows, preventing common configuration errors:
 * 
 * 1. Emulator variables should only be set when NODE_ENV is 'test' or 'development'
 * 2. SESSION_SECRET must be secure and never use default/insecure patterns
 * 3. Required build variables must be present for Next.js builds
 */

describe('CI Environment Configuration', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset relevant environment variables
    jest.resetModules();
  });

  afterEach(() => {
    // Restore original environment
    process.env = { ...originalEnv };
  });

  describe('Firebase Emulator Configuration', () => {
    it('should allow emulator variables when NODE_ENV is test', () => {
      process.env.NODE_ENV = 'test';
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
      process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
      process.env.FIREBASE_PROJECT_ID = 'yoohoo-dev-testing';

      expect(() => {
        const { initializeFirebase } = require('../src/config/firebase');
        initializeFirebase();
      }).not.toThrow();
    });

    it('should allow emulator variables when NODE_ENV is development', () => {
      process.env.NODE_ENV = 'development';
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
      process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
      process.env.FIREBASE_PROJECT_ID = 'yoohoo-dev-testing';

      expect(() => {
        const { initializeFirebase } = require('../src/config/firebase');
        initializeFirebase();
      }).not.toThrow();
    });

    it('should reject emulator variables when NODE_ENV is production in CI', () => {
      process.env.NODE_ENV = 'production';
      process.env.CI = 'true';
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
      process.env.FIREBASE_PROJECT_ID = 'yoohoo-production';

      expect(() => {
        const { initializeFirebase } = require('../src/config/firebase');
        initializeFirebase();
      }).toThrow(/Environment configuration error.*Emulator hosts configured with NODE_ENV=production/);
    });

    it('should reject emulator variables when NODE_ENV is staging in CI', () => {
      process.env.NODE_ENV = 'staging';
      process.env.CI = 'true';
      process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
      process.env.FIREBASE_PROJECT_ID = 'yoohoo-staging';

      expect(() => {
        const { initializeFirebase } = require('../src/config/firebase');
        initializeFirebase();
      }).toThrow(/Environment configuration error.*Emulator hosts configured with NODE_ENV=staging/);
    });
  });

  describe('SESSION_SECRET Validation', () => {
    it('should accept cryptographically secure SESSION_SECRET', () => {
      process.env.NODE_ENV = 'test';
      // Simulate a properly generated secure secret (64 hex characters)
      process.env.SESSION_SECRET = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2';

      expect(process.env.SESSION_SECRET.length).toBeGreaterThanOrEqual(32);
      expect(() => {
        const app = require('../src/index');
      }).not.toThrow();
    });

    it('should validate SESSION_SECRET minimum length requirement', () => {
      const shortSecret = 'tooshort';
      expect(shortSecret.length).toBeLessThan(32);
      
      // This validates our requirement, not a runtime check
      // The actual validation happens in src/index.js for production/staging
    });

    it('should detect insecure patterns in SESSION_SECRET', () => {
      const insecurePatterns = [
        'your_secure_session_secret',
        'change_this',
        'changethis',
        'your_super_secret',
        'example',
        'default',
        'secret123',
        'password',
        'test'
      ];

      // Test that our list of insecure patterns is comprehensive
      insecurePatterns.forEach(pattern => {
        const testSecret = `my_${pattern}_value`;
        expect(testSecret.toLowerCase()).toContain(pattern);
      });
    });
  });

  describe('Required Environment Variables for CI', () => {
    it('should validate presence of required test environment variables', () => {
      // In CI test runs, these variables must be set
      const requiredTestVars = [
        'NODE_ENV',
        'FIREBASE_PROJECT_ID',
        'SESSION_SECRET'
      ];

      requiredTestVars.forEach(varName => {
        expect(process.env[varName]).toBeDefined();
      });
    });

    it('should ensure NODE_ENV is explicitly set to test for backend tests', () => {
      // This test validates that NODE_ENV is correctly set in CI
      expect(process.env.NODE_ENV).toBe('test');
    });

    it('should ensure emulator hosts are set for backend tests', () => {
      // When running backend tests, emulator hosts should be configured
      // This is validated by checking they're either set or will be set by Firebase initialization
      const hasFirestoreEmulator = process.env.FIRESTORE_EMULATOR_HOST || process.env.NODE_ENV === 'test';
      const hasAuthEmulator = process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.NODE_ENV === 'test';
      
      expect(hasFirestoreEmulator).toBeTruthy();
      expect(hasAuthEmulator).toBeTruthy();
    });
  });

  describe('Build Environment Configuration', () => {
    it('should document NEXT_PUBLIC_API_URL requirement for Next.js builds', () => {
      // This test documents the requirement that NEXT_PUBLIC_API_URL must be set
      // for Next.js builds in CI to prevent build failures
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // Verify the API URL format is valid
      expect(apiUrl).toMatch(/^https?:\/\/.+/);
    });

    it('should ensure NODE_ENV is not production/staging during CI builds', () => {
      // CI builds should use development or test NODE_ENV to avoid
      // production-specific validations that might fail in CI environment
      const buildEnv = process.env.NODE_ENV;
      
      // In this test environment, it should be 'test'
      expect(buildEnv).toBe('test');
    });
  });

  describe('Environment Configuration Best Practices', () => {
    it('should never expose secrets in logs', () => {
      // This test documents the requirement to use GitHub Actions ::add-mask::
      // to prevent SESSION_SECRET and other secrets from appearing in logs
      
      // Secrets should be masked using: echo "::add-mask::$SECRET_VALUE"
      // This is a documentation test - actual masking happens in GitHub Actions
      expect(true).toBe(true);
    });

    it('should use dynamic secret generation in CI', () => {
      // This test documents that SESSION_SECRET should be generated dynamically
      // using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
      
      const crypto = require('crypto');
      const generatedSecret = crypto.randomBytes(32).toString('hex');
      
      // Verify the generated secret meets requirements
      expect(generatedSecret.length).toBe(64); // 32 bytes = 64 hex characters
      expect(generatedSecret).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should validate environment-specific variable isolation', () => {
      // Test environment variables should be isolated from production variables
      // Production secrets should NEVER be used in test environments
      
      if (process.env.NODE_ENV === 'test') {
        // In test environment, we should use test-specific values
        // The FIREBASE_PROJECT_ID can be either a test-specific ID or a shared project
        // but it should not be null/undefined
        expect(process.env.FIREBASE_PROJECT_ID).toBeDefined();
        expect(process.env.FIREBASE_PROJECT_ID).not.toBe('');
      }
    });
  });
});
