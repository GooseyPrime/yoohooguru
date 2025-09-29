/**
 * Jest setup for backend tests with Firebase Emulator
 * Uses Firebase Emulator for all tests - no mocks, no real Firebase connections
 */

// Load test environment variables
require('dotenv').config({ path: '.env.test' });

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

// Initialize Firebase for testing before any tests run
const { initializeFirebase } = require('./src/config/firebase');

beforeAll(async () => {
  try {
    await initializeFirebase();
    console.log('✅ Firebase Emulator initialized for testing');
  } catch (error) {
    console.error('❌ Firebase Emulator initialization failed:', error.message);
    throw error;
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