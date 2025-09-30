const { initializeFirebase } = require('../src/config/firebase');

describe('Firebase Production Validation', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    // Clear any existing Firebase apps for clean testing
    try {
      const admin = require('firebase-admin');
      admin.apps.forEach(app => {
        try {
          app.delete();
        } catch (error) {
          // Ignore delete errors during cleanup
        }
      });
    } catch (error) {
      // firebase-admin may not be available in test environment
    }
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Development Environment', () => {
    test('should allow Firebase initialization in development', () => {
      process.env.NODE_ENV = 'development';
      process.env.FIREBASE_PROJECT_ID = 'dev-project';
      process.env.FIREBASE_DATABASE_URL = 'https://dev-project.firebaseio.com';
      // Clear credentials to test without Firebase connection
      process.env.FIREBASE_CLIENT_EMAIL = '';
      process.env.FIREBASE_PRIVATE_KEY = '';

      expect(() => initializeFirebase()).not.toThrow();
    });

    test('should allow demo values in development', () => {
      process.env.NODE_ENV = 'development';
      process.env.FIREBASE_PROJECT_ID = 'demo-project';
      process.env.FIREBASE_DATABASE_URL = 'https://demo-project.firebaseio.com';
      // Clear credentials to test without Firebase connection
      process.env.FIREBASE_CLIENT_EMAIL = '';
      process.env.FIREBASE_PRIVATE_KEY = '';

      expect(() => initializeFirebase()).not.toThrow();
    });
  });

  describe('Production Environment', () => {
    test('should reject demo project IDs in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.FIREBASE_PROJECT_ID = 'demo-project';
      process.env.FIREBASE_DATABASE_URL = 'https://demo-project.firebaseio.com';
      // Clear credentials to test validation logic
      process.env.FIREBASE_CLIENT_EMAIL = '';
      process.env.FIREBASE_PRIVATE_KEY = '';
      // Clear emulator settings for production test
      delete process.env.FIRESTORE_EMULATOR_HOST;
      delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
      delete process.env.FIREBASE_EMULATOR_HOST;

      expect(() => initializeFirebase()).toThrow(/contains prohibited pattern/);
    });

    test('should reject test project IDs in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.FIREBASE_PROJECT_ID = 'test-project';
      process.env.FIREBASE_DATABASE_URL = 'https://test-project.firebaseio.com';
      // Clear credentials to test validation logic
      process.env.FIREBASE_CLIENT_EMAIL = '';
      process.env.FIREBASE_PRIVATE_KEY = '';
      // Clear emulator settings for production test
      delete process.env.FIRESTORE_EMULATOR_HOST;
      delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
      delete process.env.FIREBASE_EMULATOR_HOST;

      expect(() => initializeFirebase()).toThrow(/contains prohibited pattern/);
    });

    test('should reject mock project IDs in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.FIREBASE_PROJECT_ID = 'mock-project';
      process.env.FIREBASE_DATABASE_URL = 'https://mock-project.firebaseio.com';
      // Clear credentials to test validation logic
      process.env.FIREBASE_CLIENT_EMAIL = '';
      process.env.FIREBASE_PRIVATE_KEY = '';
      // Clear emulator settings for production test
      delete process.env.FIRESTORE_EMULATOR_HOST;
      delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
      delete process.env.FIREBASE_EMULATOR_HOST;

      expect(() => initializeFirebase()).toThrow(/contains prohibited pattern/);
    });

    test('should reject emulator host in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.FIREBASE_PROJECT_ID = 'production-project';
      process.env.FIREBASE_DATABASE_URL = 'https://production-project.firebaseio.com';
      // Clear emulator settings first, then set the specific one to test
      delete process.env.FIRESTORE_EMULATOR_HOST;
      delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
      process.env.FIREBASE_EMULATOR_HOST = 'localhost:9000';
      // Clear credentials to test validation logic
      process.env.FIREBASE_CLIENT_EMAIL = '';
      process.env.FIREBASE_PRIVATE_KEY = '';

      expect(() => initializeFirebase()).toThrow(/emulator host is configured/);
    });

    test('should reject USE_MOCKS=true in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.FIREBASE_PROJECT_ID = 'production-project';
      process.env.FIREBASE_DATABASE_URL = 'https://production-project.firebaseio.com';
      process.env.USE_MOCKS = 'true';
      // Clear credentials to test validation logic
      process.env.FIREBASE_CLIENT_EMAIL = '';
      process.env.FIREBASE_PRIVATE_KEY = '';
      // Clear emulator settings for production test
      delete process.env.FIRESTORE_EMULATOR_HOST;
      delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
      delete process.env.FIREBASE_EMULATOR_HOST;

      expect(() => initializeFirebase()).toThrow(/USE_MOCKS is enabled/);
    });

    test('should allow valid production configuration', () => {
      process.env.NODE_ENV = 'production';
      process.env.FIREBASE_PROJECT_ID = 'yoohoo-prod';
      process.env.FIREBASE_DATABASE_URL = 'https://yoohoo-prod.firebaseio.com';
      // Clear credentials to test without Firebase connection
      process.env.FIREBASE_CLIENT_EMAIL = '';
      process.env.FIREBASE_PRIVATE_KEY = '';
      // Clear emulator settings for production test
      delete process.env.FIRESTORE_EMULATOR_HOST;
      delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
      delete process.env.FIREBASE_EMULATOR_HOST;
      // Set required production secrets
      process.env.JWT_SECRET = 'test-jwt-secret';
      process.env.FIREBASE_API_KEY = 'test-api-key';
      process.env.STRIPE_WEBHOOK_SECRET = 'test-webhook-secret';

      expect(() => initializeFirebase()).not.toThrow();
    });

    test('should require project ID in production', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.FIREBASE_PROJECT_ID;
      process.env.FIREBASE_DATABASE_URL = 'https://example.firebaseio.com';
      // Clear credentials to test validation logic
      process.env.FIREBASE_CLIENT_EMAIL = '';
      process.env.FIREBASE_PRIVATE_KEY = '';
      // Clear emulator settings for production test
      delete process.env.FIRESTORE_EMULATOR_HOST;
      delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
      delete process.env.FIREBASE_EMULATOR_HOST;

      expect(() => initializeFirebase()).toThrow(/project ID is required/);
    });

    test('should validate project ID format', () => {
      process.env.NODE_ENV = 'production';
      process.env.FIREBASE_PROJECT_ID = 'Production_Project_With_Capitals';
      process.env.FIREBASE_DATABASE_URL = 'https://example.firebaseio.com';
      // Clear credentials to test validation logic
      process.env.FIREBASE_CLIENT_EMAIL = '';
      process.env.FIREBASE_PRIVATE_KEY = '';
      // Clear emulator settings for production test
      delete process.env.FIRESTORE_EMULATOR_HOST;
      delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
      delete process.env.FIREBASE_EMULATOR_HOST;

      expect(() => initializeFirebase()).toThrow(/invalid format/);
    });
  });

  describe('Staging Environment', () => {
    test('should apply same validation as production', () => {
      process.env.NODE_ENV = 'staging';
      process.env.FIREBASE_PROJECT_ID = 'demo-project';
      process.env.FIREBASE_DATABASE_URL = 'https://demo-project.firebaseio.com';
      // Clear credentials to test validation logic
      process.env.FIREBASE_CLIENT_EMAIL = '';
      process.env.FIREBASE_PRIVATE_KEY = '';
      // Clear emulator settings for staging test
      delete process.env.FIRESTORE_EMULATOR_HOST;
      delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
      delete process.env.FIREBASE_EMULATOR_HOST;

      expect(() => initializeFirebase()).toThrow(/contains prohibited pattern/);
    });

    test('should allow valid staging configuration', () => {
      process.env.NODE_ENV = 'staging';
      process.env.FIREBASE_PROJECT_ID = 'yoohoo-staging';
      process.env.FIREBASE_DATABASE_URL = 'https://yoohoo-staging.firebaseio.com';
      // Clear credentials to test validation logic
      process.env.FIREBASE_CLIENT_EMAIL = '';
      process.env.FIREBASE_PRIVATE_KEY = '';
      // Clear emulator settings for staging test
      delete process.env.FIRESTORE_EMULATOR_HOST;
      delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
      delete process.env.FIREBASE_EMULATOR_HOST;
      // Set required staging secrets
      process.env.JWT_SECRET = 'test-jwt-secret';
      process.env.FIREBASE_API_KEY = 'test-api-key';
      process.env.STRIPE_WEBHOOK_SECRET = 'test-webhook-secret';

      expect(() => initializeFirebase()).not.toThrow();
    });
  });
});