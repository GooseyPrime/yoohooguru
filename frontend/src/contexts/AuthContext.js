import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import toast from 'react-hot-toast';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && 
         firebaseConfig.apiKey !== 'your_firebase_api_key_here' &&
         firebaseConfig.projectId && 
         firebaseConfig.projectId !== 'your_project_id';
};

// Initialize Firebase only if properly configured
let app, auth, database;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
    console.warn('Firebase features will be disabled. Please check your configuration.');
  }
} else {
  console.warn('Firebase is not properly configured. Using placeholder values.');
  console.warn('Please update your environment variables with valid Firebase configuration.');
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

  // Sign up with email and password
  const signup = async (email, password, userData = {}) => {
    if (!auth) {
      toast.error('Authentication is not available. Please check Firebase configuration.');
      throw new Error('Firebase Auth not initialized');
    }
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in backend
      const token = await result.user.getIdToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
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
        throw new Error('Failed to create user profile');
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
    if (!auth) {
      toast.error('Authentication is not available. Please check Firebase configuration.');
      throw new Error('Firebase Auth not initialized');
    }
    
    try {
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
    if (!auth) {
      toast.error('Authentication is not available. Please check Firebase configuration.');
      throw new Error('Firebase Auth not initialized');
    }
    
    try {
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
    if (!auth) {
      toast.error('Authentication is not available. Please check Firebase configuration.');
      throw new Error('Firebase Auth not initialized');
    }
    
    try {
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
    if (!auth) {
      toast.error('Authentication is not available. Please check Firebase configuration.');
      throw new Error('Firebase Auth not initialized');
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('Failed to send password reset email');
      throw error;
    }
  };

  // Get user profile
  const getUserProfile = async (user) => {
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
      console.error('Failed to fetch user profile:', error);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
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
        // Refresh profile data
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
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await getUserProfile(user);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

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