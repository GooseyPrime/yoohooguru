import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';
import HomePage from '../screens/HomePage';
import LoginPage from '../screens/LoginPage';
import SignupPage from '../screens/SignupPage';
import DashboardPage from '../screens/DashboardPage';
import ProfilePage from '../screens/ProfilePage';
import SkillsPage from '../screens/SkillsPage';
import PrivacyPolicyPage from '../screens/PrivacyPolicyPage';
import TermsAndConditionsPage from '../screens/TermsAndConditionsPage';
import AdminLoginPage from '../screens/AdminLoginPage';
import AdminDashboardPage from '../screens/AdminDashboardPage';
import LoadingScreen from './LoadingScreen';

// Onboarding screens
import OnboardingStart from '../screens/onboarding/OnboardingStart';
import OnboardingProfile from '../screens/onboarding/OnboardingProfile';
import OnboardingCategories from '../screens/onboarding/OnboardingCategories';
import OnboardingRequirements from '../screens/onboarding/OnboardingRequirements';
import OnboardingDocuments from '../screens/onboarding/OnboardingDocuments';
import OnboardingPayout from '../screens/onboarding/OnboardingPayout';
import OnboardingReview from '../screens/onboarding/OnboardingReview';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public Route (redirect to dashboard if authenticated)
function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="skills" element={<SkillsPage />} />
        
        {/* Legal pages - supporting both new and existing URLs */}
        <Route path="privacy_policy" element={<PrivacyPolicyPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="terms_and_conditions" element={<TermsAndConditionsPage />} />
        <Route path="terms" element={<TermsAndConditionsPage />} />
        
        {/* Authentication routes */}
        <Route 
          path="login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="signup" 
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          } 
        />

        {/* Protected routes */}
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />

        {/* Onboarding routes */}
        <Route 
          path="onboarding" 
          element={
            <ProtectedRoute>
              <OnboardingStart />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="onboarding/profile" 
          element={
            <ProtectedRoute>
              <OnboardingProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="onboarding/categories" 
          element={
            <ProtectedRoute>
              <OnboardingCategories />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="onboarding/requirements" 
          element={
            <ProtectedRoute>
              <OnboardingRequirements />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="onboarding/documents" 
          element={
            <ProtectedRoute>
              <OnboardingDocuments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="onboarding/payout" 
          element={
            <ProtectedRoute>
              <OnboardingPayout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="onboarding/review" 
          element={
            <ProtectedRoute>
              <OnboardingReview />
            </ProtectedRoute>
          } 
        />

        {/* Admin routes (outside of Layout) */}
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin" element={<AdminDashboardPage />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;