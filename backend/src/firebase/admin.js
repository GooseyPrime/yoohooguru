const admin = require('firebase-admin');
const logger = require('../utils/logger');

let firebaseApp = null;

const initializeFirebase = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
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
        // No databaseURL - Firestore only configuration
        
        // Conditionally add the credential object ONLY if the necessary secrets are present.
        // This ensures the code remains compatible with environments (like Railway)
        // that use GOOGLE_APPLICATION_CREDENTIALS, where these vars won't be set.
        // For test environment, skip credentials if they're empty to allow graceful testing
        ...(serviceAccount.clientEmail && serviceAccount.privateKey && 
            serviceAccount.clientEmail.trim() !== '' && serviceAccount.privateKey.trim() !== '' && {
          credential: admin.credential.cert(serviceAccount)
        })
      };

      // For production/staging, validate that we have proper configuration
      if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
        if (!process.env.FIREBASE_PROJECT_ID) {
          throw new Error('FIREBASE_PROJECT_ID is required in production');
        }
      }

      firebaseApp = admin.initializeApp(firebaseConfig);
      logger.info('Firebase Admin SDK initialized successfully (Firestore-only)');
      
      // Log environment and configuration status
      const env = process.env.NODE_ENV || 'development';
      logger.info(`Environment: ${env}`);
      logger.info(`🔥 Using Firebase project: ${process.env.FIREBASE_PROJECT_ID}`);
      logger.info('✅ Firestore-only configuration active');
      
    } else {
      firebaseApp = admin.apps[0];
    }
    
    return firebaseApp;
  } catch (error) {
    // In test environment, don't throw but return null for graceful degradation
    if (process.env.NODE_ENV === 'test') {
      logger.warn('Firebase initialization failed in test environment - continuing with null');
      logger.info('Tests will continue with limited Firebase functionality');
      return null;
    }
    logger.error('Failed to initialize Firebase:', error);
    throw error;
  }
};

const getAuth = () => {
  if (!firebaseApp) {
    if (process.env.NODE_ENV === 'test') {
      logger.warn('Firebase not initialized for testing - returning null');
      return null;
    }
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return admin.auth();
};

const getFirestore = () => {
  if (!firebaseApp) {
    if (process.env.NODE_ENV === 'test') {
      logger.warn('Firebase not initialized for testing - returning null');
      return null;
    }
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return admin.firestore();
};

module.exports = {
  initializeFirebase,
  getAuth,
  getFirestore
};