import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Mock Firebase functions for when Firebase isn't configured
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    callback(null);
    return () => {};
  }
};

// Check if Firebase environment variables are available
const isFirebaseConfigured = () => {
  const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
  const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
  
  return apiKey && 
         apiKey !== 'your_firebase_api_key_here' &&
         apiKey !== 'demo-api-key' &&
         projectId && 
         projectId !== 'your_project_id' &&
         projectId !== 'demo-project';
};

// Validate Firebase configuration for production environments
const validateProductionFirebaseConfig = () => {
  const env = process.env.NODE_ENV;
  
  // Only validate in production builds
  if (env !== 'production') {
    return;
  }

  const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
  const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;

  // In production, Firebase must be properly configured
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase configuration is required in production. ' +
      'Mock authentication is prohibited in production environments.'
    );
  }

  // Check for prohibited demo/test patterns in production
  const prohibitedPatterns = ['demo', 'test', 'mock', 'localhost', 'emulator', 'example', 'your_', 'changeme'];
  
  const hasProhibitedProjectId = prohibitedPatterns.some(pattern => 
    projectId && projectId.toLowerCase().includes(pattern)
  );
  
  const hasProhibitedApiKey = prohibitedPatterns.some(pattern => 
    apiKey && apiKey.toLowerCase().includes(pattern)
  );

  if (hasProhibitedProjectId || hasProhibitedApiKey) {
    throw new Error(
      'Firebase configuration contains demo/test values in production. ' +
      'Production builds must use live Firebase projects only.'
    );
  }

  console.log('✅ Firebase configuration validated for production');
};

// Initialize Firebase only if properly configured
let auth, database;

if (isFirebaseConfigured()) {
  try {
    // Validate configuration for production environments
    validateProductionFirebaseConfig();

    const { initializeApp } = require('firebase/app');
    const { getAuth } = require('firebase/auth');
    const { getDatabase } = require('firebase/database');

    const firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    };

    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);
    
    console.log('✅ Firebase initialized successfully');
    console.log(`🔥 Project: ${firebaseConfig.projectId}`);
    console.log(`🌐 Auth Domain: ${firebaseConfig.authDomain}`);
    
    // Log environment status
    const env = process.env.NODE_ENV || 'development';
    if (env === 'production') {
      console.log('🚀 Running with live Firebase configuration (production)');
    } else {
      console.log(`🛠️  Running with Firebase configuration (${env})`);
    }
  } catch (error) {
    console.warn('❌ Firebase initialization failed:', error.message);
    console.warn('🔄 Falling back to offline mode');
    auth = mockAuth;
  }
} else {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    // In production, Firebase configuration is mandatory
    console.error('❌ Firebase configuration is required in production');
    throw new Error('Firebase configuration is required in production. Mock authentication is prohibited.');
  } else {
    console.log('⚠️ Firebase not configured - using offline mode');
    console.log('💡 To enable authentication, set these environment variables:');
    console.log('   - REACT_APP_FIREBASE_API_KEY');
    console.log('   - REACT_APP_FIREBASE_PROJECT_ID');
    console.log('   - REACT_APP_FIREBASE_AUTH_DOMAIN');
    console.log('📝 Copy .env.example to .env and add your Firebase config');
    auth = mockAuth;
  }
}

export { auth, database };

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Mock functions for when Firebase isn't available
  const mockFunction = async () => {

    toast.error('🔧 Firebase configuration required. Please contact the administrator to set up authentication.');
    throw new Error('Firebase not configured');
  };

  // Specific mock function for Google Auth with better messaging
  const mockGoogleAuth = async () => {
    toast.error('Google Sign-in is currently unavailable. Please configure Firebase with Google Auth to enable this feature.');
    throw new Error('Google Auth not configured');
  };

  // Sign up with email and password
  const signup = async (email, password, userData = {}) => {
    if (auth === mockAuth) return mockFunction();
    
    try {
      const { createUserWithEmailAndPassword } = require('firebase/auth');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in backend if API is available
      try {
        const token = await result.user.getIdToken();
        const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email,
            displayName: userData.displayName || '',
            skills: userData.skills || { offered: [], wanted: [] },
            location: userData.location || ''
          })
        });

        if (!response.ok) {
          console.warn('Failed to create user profile in backend');
        }
      } catch (apiError) {
        console.warn('Backend API not available:', apiError.message);
      }

      toast.success('Account created successfully!');
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    if (auth === mockAuth) return mockFunction();
    
    try {
      const { signInWithEmailAndPassword } = require('firebase/auth');
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      return result;
    } catch (error) {
      toast.error('Invalid email or password');
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    if (auth === mockAuth) return mockGoogleAuth();
    
    try {
      const { GoogleAuthProvider, signInWithPopup } = require('firebase/auth');
      const provider = new GoogleAuthProvider();
      
      // Add helpful error handling for common Google Auth issues
      const result = await signInWithPopup(auth, provider);
      
      // Create user profile in backend if API is available
      try {
        const token = await result.user.getIdToken();
        const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email: result.user.email,
            displayName: result.user.displayName || '',
            photoURL: result.user.photoURL || '',
            skills: { offered: [], wanted: [] },
            location: ''
          })
        });

        if (!response.ok) {
          console.warn('Failed to create user profile in backend');
        }
      } catch (apiError) {
        console.warn('Backend API not available:', apiError.message);
      }
      
      toast.success('Signed in with Google!');
      return result;
    } catch (error) {
      console.error('Google Auth Error:', error);
      
      // Provide specific error messages for common issues
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked. Please allow popups for this site and try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.error('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error('Google Sign-in is not enabled. Please contact support.');
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error('This domain is not authorized for Google Sign-in.');
      } else {
        toast.error('Failed to sign in with Google. Please try again.');
      }
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    if (auth === mockAuth) {
      setCurrentUser(null);
      setUserProfile(null);
      toast.success('Signed out successfully');
      return;
    }
    
    try {
      const { signOut } = require('firebase/auth');
      await signOut(auth);
      setUserProfile(null);
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    if (auth === mockAuth) return mockFunction();
    
    try {
      const { sendPasswordResetEmail } = require('firebase/auth');
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('Failed to send password reset email');
      throw error;
    }
  };

  // Get user profile
  const getUserProfile = async (user) => {
    if (!user || !process.env.REACT_APP_API_URL) return null;
    
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.data);
        return data.data;
      }
    } catch (error) {
      console.warn('Failed to fetch user profile:', error);
    }
    return null;
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      if (!process.env.REACT_APP_API_URL) throw new Error('API not configured');
      
      const token = await currentUser.getIdToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
        await getUserProfile(currentUser);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    let unsubscribe = () => {};
    
    if (auth && auth !== mockAuth) {
      try {
        const { onAuthStateChanged } = require('firebase/auth');
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          setCurrentUser(user);
          
          if (user) {
            await getUserProfile(user);
          } else {
            setUserProfile(null);
          }
          
          setLoading(false);
        });
      } catch (error) {
        console.warn('Auth state listener failed:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    login,
    signup,
    logout,
    resetPassword,
    loginWithGoogle,
    updateProfile,
    loading,
    isFirebaseConfigured: auth !== mockAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}