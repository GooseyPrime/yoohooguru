let admin;
try {
  admin = require('firebase-admin');
} catch (error) {
  if (process.env.NODE_ENV === 'test') {
    // firebase-admin not available in test environment via npx
    // Create a minimal mock for testing
    admin = {
      apps: { length: 0 },
      initializeApp: (config) => ({
        options: config
      }),
      app: () => ({}),
      auth: () => ({
        verifyIdToken: (_token) => Promise.resolve({
          uid: 'test-user-123',
          email: 'test@example.com'
        })
      }),
      firestore: () => ({
        collection: (_name) => ({
          doc: (_id) => ({
            get: () => Promise.resolve({ exists: false }),
            set: () => Promise.resolve(),
            update: () => Promise.resolve(),
            delete: () => Promise.resolve()
          }),
          get: () => Promise.resolve({ docs: [] }),
          add: () => Promise.resolve({ id: 'test-doc-id' }),
          where: () => ({
            get: () => Promise.resolve({ docs: [] })
          }),
          orderBy: () => ({
            get: () => Promise.resolve({ docs: [] }),
            limit: () => ({
              get: () => Promise.resolve({ docs: [] })
            })
          }),
          limit: () => ({
            get: () => Promise.resolve({ docs: [] })
          })
        }),
        batch: () => ({
          set: () => {},
          update: () => {},
          delete: () => {},
          commit: () => Promise.resolve()
        })
      }),
      credential: {
        cert: () => ({})
      }
    };
  } else {
    throw error;
  }
}
const { logger } = require('../utils/logger');

let firebaseApp;

/**
 * Validates that test environment is properly configured for emulator use
 * This prevents CI failures when emulators are used in non-test environments
 */
const validateTestEnvironmentSetup = () => {
  const env = process.env.NODE_ENV;
  
  // Only run validation in CI or when emulator hosts are set
  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
  const hasEmulatorHosts = process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST;
  
  if (!isCI && !hasEmulatorHosts) {
    return; // Skip validation in local development without emulators
  }
  
  // If emulators are configured, NODE_ENV must be 'test' or 'development'
  if (hasEmulatorHosts && env !== 'test' && env !== 'development') {
    logger.error('❌ ENVIRONMENT CONFIGURATION ERROR:');
    logger.error(`   NODE_ENV is '${env}' but Firebase emulators are configured.`);
    logger.error('   Emulators should only be used in test or development environments.');
    logger.error('');
    logger.error('   🔧 To fix this:');
    logger.error('   1. Set NODE_ENV=test for testing with emulators');
    logger.error('   2. Remove emulator environment variables for production/staging');
    logger.error('');
    logger.error('   📍 Current emulator configuration:');
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      logger.error(`   - FIRESTORE_EMULATOR_HOST=${process.env.FIRESTORE_EMULATOR_HOST}`);
    }
    if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
      logger.error(`   - FIREBASE_AUTH_EMULATOR_HOST=${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
    }
    
    throw new Error(
      `Environment configuration error: Emulator hosts configured with NODE_ENV=${env}. ` +
      `Emulators are only allowed in test and development environments.`
    );
  }
  
  // Log successful validation for CI debugging
  if (isCI && env === 'test') {
    logger.info('✅ Test environment configuration validated for CI');
    logger.info(`   NODE_ENV: ${env}`);
    if (hasEmulatorHosts) {
      logger.info('   Firebase emulators: configured');
    }
  }
};

/**
 * Validates Firebase configuration for production environments
 */
const validateProductionFirebaseConfig = (config) => {
  const env = process.env.NODE_ENV;
  
  // Skip validation in test and development environments
  if (env === 'test' || env === 'development') {
    return;
  }

  // Only validate in production and staging environments
  if (env !== 'production' && env !== 'staging') {
    return;
  }

  // Check for prohibited emulator/mock settings in production/staging ONLY
  if (process.env.FIREBASE_EMULATOR_HOST) {
    throw new Error(
      `Firebase emulator host is configured (${process.env.FIREBASE_EMULATOR_HOST}) ` +
      `but NODE_ENV is ${env}. Emulators are prohibited in ${env} environments.`
    );
  }

  if (process.env.FIRESTORE_EMULATOR_HOST) {
    throw new Error(
      `Firestore emulator host is configured (${process.env.FIRESTORE_EMULATOR_HOST}) ` +
      `but NODE_ENV is ${env}. Emulators are prohibited in ${env} environments.`
    );
  }

  if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    throw new Error(
      `Firebase Auth emulator host is configured (${process.env.FIREBASE_AUTH_EMULATOR_HOST}) ` +
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

  const prohibitedPatterns = ['demo', 'test', 'mock', 'localhost', 'emulator', 'example', 'your_', 'changeme', 'invalid'];
  const hasProhibitedPattern = prohibitedPatterns.some(pattern => 
    projectId.toLowerCase().includes(pattern)
  );

  if (hasProhibitedPattern) {
    throw new Error(
      `Firebase project ID "${projectId}" contains prohibited pattern for ${env} environment. ` +
      `Production and staging must use live Firebase projects only. ` +
      `Prohibited patterns: ${prohibitedPatterns.join(', ')}`
    );
  }

  // Validate project ID format (Firebase project IDs are lowercase alphanumeric with hyphens)
  if (!/^[a-z0-9-]+$/.test(projectId)) {
    throw new Error(
      `Firebase project ID "${projectId}" has invalid format. ` +
      `Project IDs must be lowercase alphanumeric with hyphens only.`
    );
  }

  // Validate required secrets for production/staging
  const requiredSecrets = ['JWT_SECRET', 'FIREBASE_API_KEY'];
  const missingSecrets = requiredSecrets.filter(secret => !process.env[secret]);
  
  if (missingSecrets.length > 0) {
    throw new Error(
      `Missing required environment variables for ${env} environment: ${missingSecrets.join(', ')}. ` +
      `All secrets must be properly configured in ${env}.`
    );
  }

  // Validate STRIPE_WEBHOOK_SECRET for production/staging
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error(
      `STRIPE_WEBHOOK_SECRET is required in ${env} environment. ` +
      `Stripe webhooks will fail without proper webhook secret configuration.`
    );
  }

  logger.info(`✅ Firebase configuration validated for ${env} environment`);
  logger.info(`🔥 Using Firebase project: ${projectId}`);
};

const initializeFirebase = () => {
  try {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      const env = process.env.NODE_ENV || 'development';
      
      // TEST ENVIRONMENT: Use Firebase Emulator
      if (env === 'test') {
        const firebaseConfig = {
          projectId: process.env.FIREBASE_PROJECT_ID || 'demo-yoohooguru-test'
        };

        // Set emulator environment variables if not already set
        if (!process.env.FIRESTORE_EMULATOR_HOST) {
          process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
        }
        if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
          process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
        }

        firebaseApp = admin.initializeApp(firebaseConfig);
        logger.info('🧪 Firebase initialized for testing with EMULATOR');
        logger.info(`📍 Firestore Emulator: ${process.env.FIRESTORE_EMULATOR_HOST}`);
        logger.info(`📍 Auth Emulator: ${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
        
        return firebaseApp;
      }

      // For non-test environments, validate that emulators aren't misconfigured
      validateTestEnvironmentSetup();

      // PRODUCTION/STAGING/DEVELOPMENT: Use real Firebase
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      };

      const firebaseConfig = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        ...(serviceAccount.clientEmail && serviceAccount.privateKey && 
            serviceAccount.clientEmail.trim() !== '' && serviceAccount.privateKey.trim() !== '' && {
          credential: admin.credential.cert(serviceAccount)
        })
      };

      // Validate configuration for production environments
      if (env === 'production' || env === 'staging') {
        validateProductionFirebaseConfig(firebaseConfig);
      }

      firebaseApp = admin.initializeApp(firebaseConfig);
      logger.info('Firebase Admin SDK initialized successfully');
      logger.info(`Environment: ${env}`);
      
      if (env === 'production' || env === 'staging') {
        logger.info('🚀 Running with live Firebase configuration (production-ready)');
        logger.info(`🔥 Using Firebase project: ${process.env.FIREBASE_PROJECT_ID}`);
        logger.info('✅ Firestore-only configuration active');
      } else {
        logger.info('🛠️  Running with development Firebase configuration');
      }
    } else {
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
  
  logger.warn('⚠️  DEPRECATION WARNING: getDatabase() is deprecated. Use getFirestore() instead.');
  
  if (!firebaseApp.options.databaseURL) {
    throw new Error(
      'Firebase Realtime Database is not configured for this application. ' +
      'The application is initialized for Firestore. Use getFirestore() instead.'
    );
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
