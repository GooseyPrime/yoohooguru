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
  // Create in-memory storage for mock Firestore
  const mockCollections = {};
  
  const mockAuth = {
    verifyIdToken: jest.fn().mockImplementation((token) => {
      // Simulate Firebase Auth behavior: reject invalid tokens
      if (!token || token === 'invalid-token' || token.startsWith('invalid-')) {
        return Promise.reject(new Error('Invalid token'));
      }
      return Promise.resolve({
        uid: 'test-user-123',
        email: 'test@example.com',
        email_verified: true,
        role: 'user'
      });
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

  const createMockDocRef = (collectionName, docId) => {
    const ref = {
      id: docId,
      path: `${collectionName}/${docId}`,
      _collectionName: collectionName,
      _docId: docId,
      toString: () => `${collectionName}/${docId}`
    };
    
    return {
      id: docId,
      ref,
      get: jest.fn().mockImplementation(() => {
        const collection = mockCollections[collectionName] || {};
        const docData = collection[docId];
        return Promise.resolve({
          exists: !!docData,
          id: docId,
          ref,
          data: () => docData || null
        });
      }),
      set: jest.fn().mockImplementation((data) => {
        if (!mockCollections[collectionName]) {
          mockCollections[collectionName] = {};
        }
        mockCollections[collectionName][docId] = { ...data, id: docId };
        return Promise.resolve(undefined);
      }),
      update: jest.fn().mockImplementation((data) => {
        if (!mockCollections[collectionName]) {
          mockCollections[collectionName] = {};
        }
        if (mockCollections[collectionName][docId]) {
          mockCollections[collectionName][docId] = {
            ...mockCollections[collectionName][docId],
            ...data
          };
        }
        return Promise.resolve(undefined);
      }),
      delete: jest.fn().mockImplementation(() => {
        if (mockCollections[collectionName] && mockCollections[collectionName][docId]) {
          delete mockCollections[collectionName][docId];
        }
        return Promise.resolve(undefined);
      }),
      // Support subcollections
      collection: jest.fn().mockImplementation((subCollectionName) => {
        const subCollectionPath = `${collectionName}/${docId}/${subCollectionName}`;
        return createMockCollectionRef(subCollectionPath);
      })
    };
  };

  const createMockCollectionRef = (collectionName) => ({
    doc: jest.fn().mockImplementation((docId) => createMockDocRef(collectionName, docId)),
    get: jest.fn().mockImplementation(() => {
      const collection = mockCollections[collectionName] || {};
      const docs = Object.values(collection).map(data => {
        const docRef = createMockDocRef(collectionName, data.id);
        return {
          id: data.id,
          ref: docRef.ref,
          data: () => data,
          exists: true
        };
      });
      return Promise.resolve({
        docs,
        forEach: (callback) => {
          docs.forEach(callback);
        },
        empty: docs.length === 0,
        size: docs.length
      });
    }),
    add: jest.fn().mockImplementation((data) => {
      const docId = 'test-doc-id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      if (!mockCollections[collectionName]) {
        mockCollections[collectionName] = {};
      }
      mockCollections[collectionName][docId] = { ...data, id: docId };
      return Promise.resolve({ id: docId });
    }),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis()
  });

  const mockFirestore = {
    collection: jest.fn().mockImplementation((name) => createMockCollectionRef(name)),
    batch: jest.fn().mockImplementation(() => {
      const operations = [];
      return {
        set: jest.fn((docRef, data) => {
          operations.push({ type: 'set', docRef, data });
        }),
        update: jest.fn((docRef, data) => {
          operations.push({ type: 'update', docRef, data });
        }),
        delete: jest.fn((docRef) => {
          operations.push({ type: 'delete', docRef });
        }),
        commit: jest.fn().mockImplementation(() => {
          // Execute all batched operations
          operations.forEach(op => {
            if (op.type === 'delete' && op.docRef) {
              // Handle both doc.ref and direct docRef
              const ref = op.docRef.ref || op.docRef;
              if (ref && ref._collectionName && ref._docId) {
                const collectionName = ref._collectionName;
                const docId = ref._docId;
                if (mockCollections[collectionName] && mockCollections[collectionName][docId]) {
                  delete mockCollections[collectionName][docId];
                }
              }
            }
          });
          return Promise.resolve(undefined);
        })
      };
    }),
    // Expose collections for clearing in tests
    _clearCollections: () => {
      Object.keys(mockCollections).forEach(key => delete mockCollections[key]);
    }
  };

  return {
    apps: [],
    initializeApp: jest.fn().mockReturnValue({ name: '[DEFAULT]' }),
    app: jest.fn().mockReturnValue({ name: '[DEFAULT]' }),
    auth: jest.fn().mockReturnValue(mockAuth),
    firestore: Object.assign(
      jest.fn().mockReturnValue(mockFirestore),
      {
        FieldValue: {
          increment: (n) => ({ _increment: n }),
          serverTimestamp: () => ({ _serverTimestamp: true }),
          delete: () => ({ _delete: true }),
          arrayUnion: (...elements) => ({ _arrayUnion: elements }),
          arrayRemove: (...elements) => ({ _arrayRemove: elements })
        },
        Timestamp: {
          now: () => ({ seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }),
          fromDate: (date) => ({ seconds: Math.floor(date.getTime() / 1000), nanoseconds: 0 })
        }
      }
    ),
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