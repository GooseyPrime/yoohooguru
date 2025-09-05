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

// Initialize Firebase only if properly configured
let auth, database;

if (isFirebaseConfigured()) {
  try {
    const { initializeApp } = require('firebase/app');
    const {
      getAuth,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      onAuthStateChanged,
      GoogleAuthProvider,
      signInWithPopup,
      sendPasswordResetEmail
    } = require('firebase/auth');
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
    
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
    auth = mockAuth;
  }
} else {
  console.log('Firebase not configured - using offline mode');
  auth = mockAuth;
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
    if (auth === mockAuth) return mockFunction();
    
    try {
      const { GoogleAuthProvider, signInWithPopup } = require('firebase/auth');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      toast.success('Signed in with Google!');
      return result;
    } catch (error) {
      toast.error('Failed to sign in with Google');
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}