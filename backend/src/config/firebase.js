const admin = require('firebase-admin');
const { logger } = require('../utils/logger');

let firebaseApp;

const initializeFirebase = () => {
  try {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      // In production, use service account key file or environment variables
      // For development, you can use the Firebase emulator or service account
      const firebaseConfig = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        // Add service account configuration in production
      };

      firebaseApp = admin.initializeApp(firebaseConfig);
      logger.info('Firebase Admin SDK initialized successfully');
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