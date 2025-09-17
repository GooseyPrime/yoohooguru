import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGuru } from '../hooks/useGuru';
import Layout from './Layout';
import LoadingScreen from './LoadingScreen';

// Eagerly loaded components (critical for initial render)
import HomePage from '../screens/HomePage';
import LoginPage from '../screens/LoginPage';
import SignupPage from '../screens/SignupPage';

// Lazy loaded components
const GuruHomePage = React.lazy(() => import('../screens/guru/GuruHomePage'));
const DashboardPage = React.lazy(() => import('../screens/DashboardPage'));
const ProfilePage = React.lazy(() => import('../screens/ProfilePage'));
const SkillsPage = React.lazy(() => import('../screens/SkillsPage'));
const AngelsListPage = React.lazy(() => import('../screens/AngelsListPage'));
const AboutPage = React.lazy(() => import('../screens/AboutPage'));
const HowItWorksPage = React.lazy(() => import('../screens/HowItWorksPage'));
const PricingPage = React.lazy(() => import('../screens/PricingPage'));

// Individual lazy loaded Coming Soon page components
const HelpCenterPage = () => (
  <Suspense fallback={<LoadingScreen />}>
    {React.createElement(React.lazy(() => import('../screens/ComingSoonPages').then(module => ({ default: module.HelpCenterPage }))))}
  </Suspense>
);

const ContactUsPage = () => (
  <Suspense fallback={<LoadingScreen />}>
    {React.createElement(React.lazy(() => import('../screens/ComingSoonPages').then(module => ({ default: module.ContactUsPage }))))}
  </Suspense>
);

const SafetyPage = () => (
  <Suspense fallback={<LoadingScreen />}>
    {React.createElement(React.lazy(() => import('../screens/ComingSoonPages').then(module => ({ default: module.SafetyPage }))))}
  </Suspense>
);

const BlogPage = () => (
  <Suspense fallback={<LoadingScreen />}>
    {React.createElement(React.lazy(() => import('../screens/ComingSoonPages').then(module => ({ default: module.BlogPage }))))}
  </Suspense>
);

const SuccessStoriesPage = () => (
  <Suspense fallback={<LoadingScreen />}>
    {React.createElement(React.lazy(() => import('../screens/ComingSoonPages').then(module => ({ default: module.SuccessStoriesPage }))))}
  </Suspense>
);

const EventsPage = () => (
  <Suspense fallback={<LoadingScreen />}>
    {React.createElement(React.lazy(() => import('../screens/ComingSoonPages').then(module => ({ default: module.EventsPage }))))}
  </Suspense>
);

const ForumPage = () => (
  <Suspense fallback={<LoadingScreen />}>
    {React.createElement(React.lazy(() => import('../screens/ComingSoonPages').then(module => ({ default: module.ForumPage }))))}
  </Suspense>
);

const MentorshipPage = () => (
  <Suspense fallback={<LoadingScreen />}>
    {React.createElement(React.lazy(() => import('../screens/ComingSoonPages').then(module => ({ default: module.MentorshipPage }))))}
  </Suspense>
);

// Legal pages - lazy loaded
const PrivacyPolicyPage = React.lazy(() => import('../screens/PrivacyPolicyPage'));
const TermsAndConditionsPage = React.lazy(() => import('../screens/TermsAndConditionsPage'));

// Admin pages - lazy loaded
const AdminLoginPage = React.lazy(() => import('../screens/AdminLoginPage'));
const AdminDashboardPage = React.lazy(() => import('../screens/AdminDashboardPage'));
const LiabilityEnhancementDemo = React.lazy(() => import('./LiabilityEnhancementDemo'));

// Onboarding screens - lazy loaded as a group
const OnboardingStart = React.lazy(() => import('../screens/onboarding/OnboardingStart'));
const OnboardingProfile = React.lazy(() => import('../screens/onboarding/OnboardingProfile'));
const OnboardingCategories = React.lazy(() => import('../screens/onboarding/OnboardingCategories'));
const OnboardingRequirements = React.lazy(() => import('../screens/onboarding/OnboardingRequirements'));
const OnboardingDocuments = React.lazy(() => import('../screens/onboarding/OnboardingDocuments'));
const OnboardingPayout = React.lazy(() => import('../screens/onboarding/OnboardingPayout'));
const OnboardingReview = React.lazy(() => import('../screens/onboarding/OnboardingReview'));

// Account screens - lazy loaded
const PayoutsPanel = React.lazy(() => import('../screens/account/PayoutsPanel'));

// Modified Masters screens - lazy loaded
const ModifiedMasters = React.lazy(() => import('../screens/ModifiedMasters'));
const DashboardCoach = React.lazy(() => import('../screens/DashboardCoach'));
const DashboardUnderstudy = React.lazy(() => import('../screens/DashboardUnderstudy'));

// Host routing - lazy loaded
const HostSubdomainRouterGate = React.lazy(() => import('./HostSubdomainRouterGate'));

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

// Redirect to main site component for guru subdomains
function RedirectToMainSite({ path }) {
  React.useEffect(() => {
    window.location.href = `https://yoohoo.guru${path}`;
  }, [path]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div>
        <h3>Redirecting to YooHoo.guru...</h3>
        <p>You&apos;re being redirected to the main platform.</p>
      </div>
    </div>
  );
}

function AppRouter() {
  const { isGuruSite } = useGuru();

  // If we're on a guru subdomain, show guru-specific routes
  if (isGuruSite) {
    return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<LoadingScreen />}>
              <GuruHomePage />
            </Suspense>
          } />
          <Route path="about" element={
            <Suspense fallback={<LoadingScreen />}>
              <GuruHomePage />
            </Suspense>
          } />
          <Route path="blog" element={
            <Suspense fallback={<LoadingScreen />}>
              <GuruHomePage />
            </Suspense>
          } />
          <Route path="blog/:slug" element={
            <Suspense fallback={<LoadingScreen />}>
              <GuruHomePage />
            </Suspense>
          } />
          <Route path="services" element={
            <Suspense fallback={<LoadingScreen />}>
              <GuruHomePage />
            </Suspense>
          } />
          <Route path="contact" element={
            <Suspense fallback={<LoadingScreen />}>
              <GuruHomePage />
            </Suspense>
          } />
          
          {/* Redirect guru subdomain users to main site for these pages */}
          <Route path="login" element={<RedirectToMainSite path="/login" />} />
          <Route path="signup" element={<RedirectToMainSite path="/signup" />} />
          <Route path="dashboard" element={<RedirectToMainSite path="/dashboard" />} />
          <Route path="skills" element={<RedirectToMainSite path="/skills" />} />
          <Route path="angels-list" element={<RedirectToMainSite path="/angels-list" />} />
          
          {/* Catch-all route for guru subdomains */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    );
  }

  // Main site routes (existing functionality)
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        {/* SkillShare (public label) – technical route remains /skills */}
        <Route path="skills" element={
          <Suspense fallback={<LoadingScreen />}>
            <SkillsPage />
          </Suspense>
        } />
        <Route path="angels-list" element={
          <Suspense fallback={<LoadingScreen />}>
            <AngelsListPage />
          </Suspense>
        } />
        <Route path="about" element={
          <Suspense fallback={<LoadingScreen />}>
            <AboutPage />
          </Suspense>
        } />
        <Route path="how-it-works" element={
          <Suspense fallback={<LoadingScreen />}>
            <HowItWorksPage />
          </Suspense>
        } />
        <Route path="pricing" element={
          <Suspense fallback={<LoadingScreen />}>
            <PricingPage />
          </Suspense>
        } />
        
        {/* Coming Soon pages */}
        <Route path="help" element={<HelpCenterPage />} />
        <Route path="contact" element={<ContactUsPage />} />
        <Route path="safety" element={<SafetyPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="success-stories" element={<SuccessStoriesPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="forum" element={<ForumPage />} />
        <Route path="mentorship" element={<MentorshipPage />} />
        
        <Route path="liability-demo" element={
          <Suspense fallback={<LoadingScreen />}>
            <LiabilityEnhancementDemo />
          </Suspense>
        } />
        
        {/* Legal pages - supporting both new and existing URLs */}
        <Route path="privacy_policy" element={
          <Suspense fallback={<LoadingScreen />}>
            <PrivacyPolicyPage />
          </Suspense>
        } />
        <Route path="privacy" element={
          <Suspense fallback={<LoadingScreen />}>
            <PrivacyPolicyPage />
          </Suspense>
        } />
        <Route path="terms_and_conditions" element={
          <Suspense fallback={<LoadingScreen />}>
            <TermsAndConditionsPage />
          </Suspense>
        } />
        <Route path="terms" element={
          <Suspense fallback={<LoadingScreen />}>
            <TermsAndConditionsPage />
          </Suspense>
        } />
        
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
              <Suspense fallback={<LoadingScreen />}>
                <DashboardPage />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="profile" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <ProfilePage />
              </Suspense>
            </ProtectedRoute>
          } 
        />

        {/* Onboarding routes */}
        <Route 
          path="onboarding" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <OnboardingStart />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="onboarding/profile" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <OnboardingProfile />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="onboarding/categories" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <OnboardingCategories />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="onboarding/requirements" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <OnboardingRequirements />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="onboarding/documents" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <OnboardingDocuments />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="onboarding/payout" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <OnboardingPayout />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="onboarding/review" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <OnboardingReview />
              </Suspense>
            </ProtectedRoute>
          } 
        />

        {/* Account routes */}
        <Route 
          path="account/payouts" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <PayoutsPanel />
              </Suspense>
            </ProtectedRoute>
          } 
        />

        {/* Modified Masters routes */}
        <Route path="modified" element={
          <Suspense fallback={<LoadingScreen />}>
            <ModifiedMasters />
          </Suspense>
        } />
        <Route 
          path="dashboard/coach" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <DashboardCoach />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="dashboard/understudy" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <DashboardUnderstudy />
              </Suspense>
            </ProtectedRoute>
          } 
        />

        {/* Host Subdomain Router Gate - handles subdomain routing */}
        <Suspense fallback={<LoadingScreen />}>
          <HostSubdomainRouterGate />
        </Suspense>

        {/* Admin routes (outside of Layout) */}
        <Route path="admin/login" element={
          <Suspense fallback={<LoadingScreen />}>
            <AdminLoginPage />
          </Suspense>
        } />
        <Route path="admin" element={
          <Suspense fallback={<LoadingScreen />}>
            <AdminDashboardPage />
          </Suspense>
        } />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;