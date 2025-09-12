import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
  // Note: No databaseURL - Firestore only configuration
};

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
};

let app, auth, db;

if (isFirebaseConfigured()) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    console.log('✅ Firebase initialized (Firestore-only)');
    console.log(`🔥 Using Firebase project: ${firebaseConfig.projectId}`);
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    auth = null;
    db = null;
  }
} else {
  console.warn('⚠️ Firebase not configured - using offline mode');
  console.log('💡 To enable authentication and data sync, set these environment variables:');
  console.log('   - REACT_APP_FIREBASE_API_KEY');
  console.log('   - REACT_APP_FIREBASE_AUTH_DOMAIN');  
  console.log('   - REACT_APP_FIREBASE_PROJECT_ID');
  console.log('📝 Copy .env.example to .env and add your Firebase config');
  
  // Provide null values for graceful degradation
  auth = null;
  db = null;
}

export { auth, db, isFirebaseConfigured };