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
  process.env.NODE_ENV = 'test';
  process.env.FIREBASE_PROJECT_ID = 'demo-yoohooguru-test';
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-ci-cd-testing-only-not-for-production';
  process.env.STRIPE_SECRET_KEY = 'sk_test_placeholder';
  process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test_placeholder';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_placeholder';
  process.env.CORS_ORIGIN_PRODUCTION = 'http://localhost:3000,http://127.0.0.1:3000';
}

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

// Initialize Firebase for testing before any tests run
let firebaseInitialized = false;

beforeAll(async () => {
  try {
    const { initializeFirebase } = require('./src/config/firebase');
    await initializeFirebase();
    firebaseInitialized = true;
    console.log('✅ Firebase Emulator initialized for testing');
  } catch (error) {
    console.warn('❌ Firebase Emulator initialization failed:', error.message);
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