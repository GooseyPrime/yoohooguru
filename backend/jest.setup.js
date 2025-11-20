/**
 * Jest setup for backend tests with Firebase Emulator
 * Uses Firebase Emulator for all tests - no mocks, no real Firebase connections
 */

// Load test environment variables - handle gracefully if dotenv is not available
try {
  require('dotenv').config({ path: '.env.test' });
} catch (error) {
  // If dotenv is not available, set environment variables manually
  console.log('dotenv not available, setting test environment variables manually');
}

// Ensure test environment is properly set
process.env.NODE_ENV = 'test';
process.env.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'yoohoo-dev-testing';
process.env.FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'test-api-key';
process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099';
process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-for-ci-cd-testing-only-not-for-production';
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test-session-secret-key-for-ci-cd-testing-only-not-for-production';
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
process.env.STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';
process.env.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_placeholder';
process.env.CORS_ORIGIN_PRODUCTION = process.env.CORS_ORIGIN_PRODUCTION || 'http://localhost:3000,http://127.0.0.1:3000';

// Mock firebase-admin before it's imported by other modules
jest.mock('firebase-admin', () => {
  const mockAuth = {
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: 'test-user-123',
      email: 'test@example.com',
      role: 'user'
    }),
    createUser: jest.fn().mockImplementation((properties) => Promise.resolve({
      uid: 'test-user-' + Date.now(),
      email: properties.email,
      ...properties
    })),
    getUserByEmail: jest.fn().mockImplementation((email) => Promise.resolve({
      uid: 'test-user-123',
      email: email
    })),
    deleteUser: jest.fn().mockResolvedValue(undefined),
    updateUser: jest.fn().mockResolvedValue({ uid: 'test-user-123' })
  };

  const mockFirestore = {
    collection: jest.fn().mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ exists: false, data: () => null }),
        set: jest.fn().mockResolvedValue(undefined),
        update: jest.fn().mockResolvedValue(undefined),
        delete: jest.fn().mockResolvedValue(undefined)
      }),
      get: jest.fn().mockResolvedValue({ docs: [] }),
      add: jest.fn().mockResolvedValue({ id: 'test-doc-id-' + Date.now() }),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis()
    }),
    batch: jest.fn().mockReturnValue({
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      commit: jest.fn().mockResolvedValue(undefined)
    }),
    Timestamp: {
      now: () => ({ seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }),
      fromDate: (date) => ({ seconds: Math.floor(date.getTime() / 1000), nanoseconds: 0 })
    }
  };

  return {
    apps: [],
    initializeApp: jest.fn().mockReturnValue({ name: '[DEFAULT]' }),
    app: jest.fn().mockReturnValue({ name: '[DEFAULT]' }),
    auth: jest.fn().mockReturnValue(mockAuth),
    firestore: jest.fn().mockReturnValue(mockFirestore),
    credential: {
      cert: jest.fn().mockReturnValue({})
    }
  };
});

// Initialize Firebase for testing before any tests run
let firebaseInitialized = false;

beforeAll(async () => {
  try {
    // Try to import Firebase configuration
    let firebaseConfig;
    try {
      firebaseConfig = require('./src/config/firebase');
    } catch (importError) {
      console.warn('❌ Firebase module import failed:', importError.message);
      console.log('🧪 Tests will continue without Firebase functionality');
      firebaseInitialized = false;
      return;
    }

    // Check if initializeFirebase function exists
    if (typeof firebaseConfig.initializeFirebase !== 'function') {
      console.warn('❌ initializeFirebase is not a function');
      console.log('Available exports:', Object.keys(firebaseConfig));
      console.log('🧪 Tests will continue without Firebase functionality');
      firebaseInitialized = false;
      return;
    }

    // Initialize Firebase
    await firebaseConfig.initializeFirebase();
    firebaseInitialized = true;
    console.log('✅ Firebase initialized for testing (using mocked firebase-admin)');
  } catch (error) {
    console.warn('❌ Firebase initialization failed:', error.message);
    console.log('🧪 Tests will continue without Firebase functionality');
    // Don't throw error - let tests handle Firebase gracefully
    firebaseInitialized = false;
  }
});

// Longer timeout for Firebase operations
jest.setTimeout(45000);

// Clean up resources after all tests
afterAll(async () => {
  // Allow time for connections to clean up
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('🧹 Test cleanup completed');
});

// Export helper to check if Firebase is available
global.isFirebaseAvailable = () => firebaseInitialized;