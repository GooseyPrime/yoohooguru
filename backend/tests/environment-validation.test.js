/**
 * Environment Validation Tests
 * 
 * These tests ensure that the environment configuration issues that caused
 * recurring CI failures are permanently resolved.
 * 
 * Issue #214: CI Failures - Permanent Repair Cycle for Recurring Emulator/Environment Test Failures
 */

const originalEnv = process.env.NODE_ENV;

describe('Environment Configuration Validation', () => {
  
  beforeEach(() => {
    // Clear Firebase module cache to test initialization
    jest.resetModules();
    
    // Reset environment variables
    delete process.env.FIRESTORE_EMULATOR_HOST;
    delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
    delete process.env.FIREBASE_EMULATOR_HOST;
  });
  
  afterEach(() => {
    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  describe('Test Environment Configuration', () => {
    it('should allow emulators in test environment', () => {
      process.env.NODE_ENV = 'test';
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
      process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
      
      expect(() => {
        const { initializeFirebase } = require('../src/config/firebase');
        initializeFirebase();
      }).not.toThrow();
    });

    it('should allow emulators in development environment', () => {
      process.env.NODE_ENV = 'development';
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
      process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
      
      expect(() => {
        const { initializeFirebase } = require('../src/config/firebase');
        initializeFirebase();
      }).not.toThrow();
    });
  });

  describe('Production Environment Protection', () => {
    it('should reject emulators in production environment', () => {
      process.env.NODE_ENV = 'production';
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
      process.env.CI = 'true'; // Simulate CI environment
      
      expect(() => {
        const { initializeFirebase } = require('../src/config/firebase');
        initializeFirebase();
      }).toThrow(/Environment configuration error.*Emulator hosts configured with NODE_ENV=production/);
    });

    it('should reject emulators in staging environment', () => {
      process.env.NODE_ENV = 'staging';
      process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
      process.env.CI = 'true'; // Simulate CI environment
      
      expect(() => {
        const { initializeFirebase } = require('../src/config/firebase');
        initializeFirebase();
      }).toThrow(/Environment configuration error.*Emulator hosts configured with NODE_ENV=staging/);
    });
  });

  describe('CI Environment Detection', () => {
    it('should validate environment in CI when emulators are present', () => {
      process.env.NODE_ENV = 'production';
      process.env.CI = 'true';
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
      
      expect(() => {
        const { initializeFirebase } = require('../src/config/firebase');
        initializeFirebase();
      }).toThrow(/Environment configuration error/);
    });

    it('should validate environment in GitHub Actions when emulators are present', () => {
      process.env.NODE_ENV = 'staging';
      process.env.GITHUB_ACTIONS = 'true';
      process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
      
      expect(() => {
        const { initializeFirebase } = require('../src/config/firebase');
        initializeFirebase();
      }).toThrow(/Environment configuration error/);
    });

    it('should pass validation in CI with correct test environment', () => {
      process.env.NODE_ENV = 'test';
      process.env.CI = 'true';
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
      process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
      
      expect(() => {
        const { initializeFirebase } = require('../src/config/firebase');
        initializeFirebase();
      }).not.toThrow();
    });
  });

  describe('Local Development Flexibility', () => {
    it('should skip validation in local development without CI flag', () => {
      process.env.NODE_ENV = 'production';
      // Use a valid production project ID format for this test
      process.env.FIREBASE_PROJECT_ID = 'yoohoo-production-12345';
      // No CI flag set
      delete process.env.CI;
      delete process.env.GITHUB_ACTIONS;
      // No emulator hosts set
      delete process.env.FIRESTORE_EMULATOR_HOST;
      delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
      
      expect(() => {
        const { initializeFirebase } = require('../src/config/firebase');
        initializeFirebase();
      }).not.toThrow();
    });

    it('should allow local development with appropriate NODE_ENV', () => {
      process.env.NODE_ENV = 'development';
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
      
      expect(() => {
        const { initializeFirebase } = require('../src/config/firebase');
        initializeFirebase();
      }).not.toThrow();
    });
  });

  describe('Regression Prevention', () => {
    it('should fail fast when environment drift occurs in CI', () => {
      // Simulate the exact scenario that caused recurring failures
      process.env.NODE_ENV = 'production'; // Wrong NODE_ENV
      process.env.CI = 'true'; // In CI
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'; // Emulator configured
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      expect(() => {
        const { initializeFirebase } = require('../src/config/firebase');
        initializeFirebase();
      }).toThrow();
      
      consoleSpy.mockRestore();
    });

    it('should provide clear error messages for debugging', () => {
      process.env.NODE_ENV = 'staging';
      process.env.CI = 'true';
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
      process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
      
      try {
        const { initializeFirebase } = require('../src/config/firebase');
        initializeFirebase();
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.message).toContain('Environment configuration error');
        expect(error.message).toContain('NODE_ENV=staging');
        expect(error.message).toContain('Emulator hosts configured');
      }
    });
  });
});