import * as admin from 'firebase-admin';

let firebaseApp: admin.app.App | null = null;

/**
 * Initialize Firebase Admin SDK for API routes
 * Reuses existing instance if already initialized
 */
export function initializeFirebaseAdmin(): admin.app.App {
  // Return existing instance if already initialized
  if (firebaseApp && admin.apps.length > 0) {
    return firebaseApp;
  }

  try {
    // Check if already initialized by another module
    if (admin.apps.length > 0) {
      firebaseApp = admin.app();
      return firebaseApp;
    }

    const env = process.env.NODE_ENV || 'development';

    // Test environment: Use Firebase Emulator
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
      console.log('🧪 Firebase Admin initialized for testing with EMULATOR');
      return firebaseApp;
    }

    // Production/Staging/Development: Use real Firebase credentials
    // Normalize privateKey to handle different environment variable formats
    const rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // If key already contains newlines, use as-is; otherwise replace literal '\n' with newlines
      // This handles both pre-formatted keys and env vars with literal \n text
      privateKey: rawKey.includes('\n') ? rawKey : rawKey.replace(/\\n/g, '\n'),
    };

    const firebaseConfig: admin.AppOptions = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      ...(serviceAccount.clientEmail && serviceAccount.privateKey &&
        serviceAccount.clientEmail.trim() !== '' && serviceAccount.privateKey.trim() !== '' && {
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
      })
    };

    firebaseApp = admin.initializeApp(firebaseConfig);
    console.log('✅ Firebase Admin SDK initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

/**
 * Get Firestore database instance
 */
export function getFirestore(): admin.firestore.Firestore {
  if (!firebaseApp) {
    initializeFirebaseAdmin();
  }
  return admin.firestore();
}

/**
 * Get Firebase Auth instance
 */
export function getAuth(): admin.auth.Auth {
  if (!firebaseApp) {
    initializeFirebaseAdmin();
  }
  return admin.auth();
}
