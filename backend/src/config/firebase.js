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
      // In CI/CD or environments where credentials are provided as discrete variables,
      // we must construct the service account object manually.
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // This is the critical fix for CI environments. It correctly formats the
        // private key by replacing escaped newlines with actual newlines.
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      };

      const firebaseConfig = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        // By removing the databaseURL, we prevent the SDK from making an unnecessary
        // connection attempt to the Realtime Database, which was causing the warnings.
        // Your app uses Firestore, so this property is not needed.
        // databaseURL: process.env.FIREBASE_DATABASE_URL,
        
        // Conditionally add the credential object ONLY if the necessary secrets are present.
        // This ensures the code remains compatible with environments (like Railway)
        // that use GOOGLE_APPLICATION_CREDENTIALS, where these vars won't be set.
        ...(serviceAccount.clientEmail && serviceAccount.privateKey && {
          credential: admin.credential.cert(serviceAccount)
        })
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
    } else {
      // If the app is already initialized (e.g., in another part of the test suite),
      // get the default app instance to ensure our module's state is correct.
      firebaseApp = admin.app();
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

