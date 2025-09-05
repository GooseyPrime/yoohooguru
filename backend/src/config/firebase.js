const admin = require('firebase-admin');
const { logger } = require('../utils/logger');

let firebaseApp;

/**
 * Validates Firebase configuration for production environments
 */
const validateProductionFirebaseConfig = (config) => {
  const env = process.env.NODE_ENV;
  
  // Only validate in production and staging environments
  if (env !== 'production' && env !== 'staging') {
    return;
  }

  // Check for prohibited emulator/mock settings
  if (process.env.FIREBASE_EMULATOR_HOST) {
    throw new Error(
      `Firebase emulator host is configured (${process.env.FIREBASE_EMULATOR_HOST}) ` +
      `but NODE_ENV is ${env}. Emulators are prohibited in ${env} environments.`
    );
  }

  if (process.env.USE_MOCKS && process.env.USE_MOCKS !== 'false') {
    throw new Error(
      `USE_MOCKS is enabled (${process.env.USE_MOCKS}) but NODE_ENV is ${env}. ` +
      `Mocks are prohibited in ${env} environments.`
    );
  }

  // Validate that project ID doesn't contain demo/test values
  const projectId = config.projectId;
  if (!projectId) {
    throw new Error(`Firebase project ID is required in ${env} environment`);
  }

  const prohibitedPatterns = ['demo', 'test', 'mock', 'localhost', 'emulator', 'example', 'your_', 'changeme'];
  const hasProhibitedPattern = prohibitedPatterns.some(pattern => 
    projectId.toLowerCase().includes(pattern)
  );

  if (hasProhibitedPattern) {
    throw new Error(
      `Firebase project ID "${projectId}" contains prohibited pattern for ${env} environment. ` +
      `Production and staging must use live Firebase projects only.`
    );
  }

  // Validate project ID format (Firebase project IDs are lowercase alphanumeric with hyphens)
  if (!/^[a-z0-9-]+$/.test(projectId)) {
    throw new Error(
      `Firebase project ID "${projectId}" has invalid format. ` +
      `Project IDs must be lowercase alphanumeric with hyphens only.`
    );
  }

  logger.info(`✅ Firebase configuration validated for ${env} environment`);
  logger.info(`🔥 Using Firebase project: ${projectId}`);
};

const initializeFirebase = () => {
  try {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      const firebaseConfig = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        // Note: In production, service account credentials should be provided
        // via GOOGLE_APPLICATION_CREDENTIALS environment variable or
        // Google Cloud service account key
      };

      // Validate configuration for production environments
      validateProductionFirebaseConfig(firebaseConfig);

      firebaseApp = admin.initializeApp(firebaseConfig);
      logger.info('Firebase Admin SDK initialized successfully');
      
      // Log environment and configuration status
      const env = process.env.NODE_ENV || 'development';
      logger.info(`Environment: ${env}`);
      
      if (env === 'production' || env === 'staging') {
        logger.info('🚀 Running with live Firebase configuration (production-ready)');
      } else {
        logger.info('🛠️  Running with development Firebase configuration');
      }
    }
    
    return firebaseApp;
  } catch (error) {
    logger.error('Failed to initialize Firebase:', error);
    throw error;
  }
};

const getDatabase = () => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return admin.database();
};

const getAuth = () => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return admin.auth();
};

const getFirestore = () => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return admin.firestore();
};

module.exports = {
  initializeFirebase,
  getDatabase,
  getAuth,
  getFirestore
};