import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGuru } from '../hooks/useGuru';
import Layout from './Layout';
import LoadingScreen from './LoadingScreen';
import SubdomainLandingPage from './SubdomainLandingPage';

// Eagerly loaded components (critical for initial render)
import HomePage from '../screens/HomePage';
import LoginPage from '../screens/LoginPage';
import SignupPage from '../screens/SignupPage';

// Subdomain configuration for landing pages
const subdomainConfigs = {
  cooking: { 
    character: 'Chef Guru', 
    category: 'culinary',
    primarySkills: ['cooking', 'baking', 'nutrition', 'meal-prep', 'food-styling'],
    affiliateCategories: ['kitchen-tools', 'cookbooks', 'ingredients', 'appliances'],
    theme: {
      primaryColor: '#e74c3c',
      secondaryColor: '#f39c12',
      accentColor: '#d35400',
      icon: '👨‍🍳',
      emoji: '🍳'
    },
    seo: {
      title: 'Chef Guru - Master Culinary Skills',
      description: 'Learn cooking, baking, and culinary arts from expert chefs. Master knife skills, cooking techniques, and recipes.',
      keywords: ['cooking lessons', 'culinary skills', 'chef training', 'baking classes', 'food preparation']
    }
  },
  music: { 
    character: 'Music Guru', 
    category: 'audio',
    primarySkills: ['guitar', 'piano', 'vocals', 'production', 'composition'],
    affiliateCategories: ['instruments', 'equipment', 'software', 'accessories'],
    theme: {
      primaryColor: '#9b59b6',
      secondaryColor: '#8e44ad',
      accentColor: '#663399',
      icon: '🎵',
      emoji: '🎹'
    },
    seo: {
      title: 'Music Guru - Learn Musical Instruments & Production',
      description: 'Master guitar, piano, vocals, and music production. Learn from professional musicians and producers.',
      keywords: ['music lessons', 'guitar lessons', 'piano lessons', 'music production', 'vocal training']
    }
  },
  fitness: { 
    character: 'Fitness Guru', 
    category: 'health',
    primarySkills: ['personal-training', 'yoga', 'strength-training', 'nutrition', 'wellness'],
    affiliateCategories: ['equipment', 'supplements', 'apparel', 'accessories'],
    theme: {
      primaryColor: '#27ae60',
      secondaryColor: '#2ecc71',
      accentColor: '#1e8449',
      icon: '💪',
      emoji: '🏋️'
    },
    seo: {
      title: 'Fitness Guru - Personal Training & Wellness',
      description: 'Get fit with personal training, yoga, strength training, and nutrition coaching from certified professionals.',
      keywords: ['personal training', 'fitness coaching', 'yoga classes', 'strength training', 'wellness coaching']
    }
  },
  tech: { 
    character: 'Tech Guru', 
    category: 'technology',
    primarySkills: ['programming', 'web-development', 'mobile-apps', 'data-science', 'ai-ml'],
    affiliateCategories: ['courses', 'books', 'software', 'hardware'],
    theme: {
      primaryColor: '#3498db',
      secondaryColor: '#2980b9',
      accentColor: '#1f4e79',
      icon: '💻',
      emoji: '⚡'
    },
    seo: {
      title: 'Tech Guru - Programming & Technology Skills',
      description: 'Learn programming, web development, mobile apps, and AI/ML from experienced tech professionals.',
      keywords: ['programming lessons', 'coding bootcamp', 'web development', 'mobile development', 'tech skills']
    }
  },
  art: { 
    character: 'Art Guru', 
    category: 'creative',
    primarySkills: ['drawing', 'painting', 'digital-art', 'sculpture', 'photography'],
    affiliateCategories: ['supplies', 'tools', 'courses', 'books'],
    theme: {
      primaryColor: '#e67e22',
      secondaryColor: '#f39c12',
      accentColor: '#d68910',
      icon: '🎨',
      emoji: '🖼️'
    },
    seo: {
      title: 'Art Guru - Master Visual Arts & Creative Skills',
      description: 'Learn drawing, painting, digital art, and photography from professional artists and creatives.',
      keywords: ['art lessons', 'drawing classes', 'painting tutorials', 'digital art', 'photography courses']
    }
  },
  language: { 
    character: 'Language Guru', 
    category: 'education',
    primarySkills: ['english', 'spanish', 'french', 'mandarin', 'conversation'],
    affiliateCategories: ['courses', 'books', 'apps', 'materials'],
    theme: {
      primaryColor: '#8e44ad',
      secondaryColor: '#9b59b6',
      accentColor: '#6c3483',
      icon: '🗣️',
      emoji: '🌍'
    },
    seo: {
      title: 'Language Guru - Master New Languages Fast',
      description: 'Learn languages with native speakers and certified teachers. Practice conversation and master grammar.',
      keywords: ['language learning', 'english lessons', 'spanish classes', 'conversation practice', 'foreign languages']
    }
  },
  business: { 
    character: 'Business Guru', 
    category: 'professional',
    primarySkills: ['entrepreneurship', 'marketing', 'sales', 'leadership', 'strategy'],
    affiliateCategories: ['courses', 'books', 'software', 'tools'],
    theme: {
      primaryColor: '#34495e',
      secondaryColor: '#2c3e50',
      accentColor: '#1b2631',
      icon: '💼',
      emoji: '📈'
    },
    seo: {
      title: 'Business Guru - Entrepreneurship & Professional Skills',
      description: 'Learn business skills, entrepreneurship, marketing, and leadership from successful business professionals.',
      keywords: ['business coaching', 'entrepreneurship', 'marketing strategy', 'leadership skills', 'sales training']
    }
  },
  design: { 
    character: 'Design Guru', 
    category: 'creative',
    primarySkills: ['graphic-design', 'ui-ux', 'branding', 'typography', 'layout'],
    affiliateCategories: ['software', 'courses', 'tools', 'books'],
    theme: {
      primaryColor: '#e91e63',
      secondaryColor: '#ad1457',
      accentColor: '#880e4f',
      icon: '✨',
      emoji: '🎨'
    },
    seo: {
      title: 'Design Guru - Graphic Design & UI/UX Skills',
      description: 'Master graphic design, UI/UX, branding, and visual design with professional designers.',
      keywords: ['graphic design', 'ui ux design', 'branding', 'logo design', 'visual design']
    }
  },
  writing: { 
    character: 'Writing Guru', 
    category: 'creative',
    primarySkills: ['creative-writing', 'copywriting', 'blogging', 'editing', 'storytelling'],
    affiliateCategories: ['courses', 'books', 'software', 'tools'],
    theme: {
      primaryColor: '#795548',
      secondaryColor: '#6d4c41',
      accentColor: '#5d4037',
      icon: '✍️',
      emoji: '📝'
    },
    seo: {
      title: 'Writing Guru - Master Creative & Professional Writing',
      description: 'Learn creative writing, copywriting, blogging, and storytelling from published authors and professionals.',
      keywords: ['writing lessons', 'creative writing', 'copywriting', 'blogging', 'storytelling']
    }
  },
  photography: { 
    character: 'Photography Guru', 
    category: 'creative',
    primarySkills: ['portrait', 'landscape', 'wedding', 'editing', 'equipment'],
    affiliateCategories: ['cameras', 'lenses', 'software', 'accessories'],
    theme: {
      primaryColor: '#607d8b',
      secondaryColor: '#546e7a',
      accentColor: '#455a64',
      icon: '📸',
      emoji: '📷'
    },
    seo: {
      title: 'Photography Guru - Master Photography Skills',
      description: 'Learn photography techniques, editing, and equipment use from professional photographers.',
      keywords: ['photography lessons', 'photo editing', 'camera techniques', 'portrait photography', 'landscape photography']
    }
  },
  gardening: { 
    character: 'Garden Guru', 
    category: 'lifestyle',
    primarySkills: ['vegetable-gardening', 'flower-gardening', 'landscaping', 'composting', 'plant-care'],
    affiliateCategories: ['tools', 'seeds', 'supplies', 'books'],
    theme: {
      primaryColor: '#4caf50',
      secondaryColor: '#388e3c',
      accentColor: '#2e7d32',
      icon: '🌱',
      emoji: '🌻'
    },
    seo: {
      title: 'Garden Guru - Master Gardening & Plant Care',
      description: 'Learn gardening, plant care, landscaping, and sustainable growing from expert gardeners.',
      keywords: ['gardening tips', 'plant care', 'vegetable gardening', 'landscaping', 'organic gardening']
    }
  },
  crafts: { 
    character: 'Crafts Guru', 
    category: 'creative',
    primarySkills: ['woodworking', 'knitting', 'pottery', 'jewelry-making', 'sewing'],
    affiliateCategories: ['supplies', 'tools', 'patterns', 'materials'],
    theme: {
      primaryColor: '#ff9800',
      secondaryColor: '#f57c00',
      accentColor: '#ef6c00',
      icon: '🛠️',
      emoji: '🎭'
    },
    seo: {
      title: 'Crafts Guru - Master Handmade Arts & Crafts',
      description: 'Learn woodworking, knitting, pottery, jewelry making, and more crafts from skilled artisans.',
      keywords: ['crafts tutorials', 'woodworking', 'knitting patterns', 'pottery classes', 'jewelry making']
    }
  },
  wellness: { 
    character: 'Wellness Guru', 
    category: 'health',
    primarySkills: ['meditation', 'mindfulness', 'stress-management', 'life-coaching', 'therapy'],
    affiliateCategories: ['books', 'courses', 'apps', 'accessories'],
    theme: {
      primaryColor: '#009688',
      secondaryColor: '#00796b',
      accentColor: '#00695c',
      icon: '🧘',
      emoji: '☯️'
    },
    seo: {
      title: 'Wellness Guru - Mental Health & Mindfulness',
      description: 'Learn meditation, mindfulness, stress management, and wellness practices from certified professionals.',
      keywords: ['meditation classes', 'mindfulness training', 'wellness coaching', 'stress management', 'mental health']
    }
  },
  finance: { 
    character: 'Finance Guru', 
    category: 'professional',
    primarySkills: ['investing', 'budgeting', 'tax-planning', 'real-estate', 'retirement'],
    affiliateCategories: ['courses', 'books', 'software', 'tools'],
    theme: {
      primaryColor: '#2e7d32',
      secondaryColor: '#388e3c',
      accentColor: '#1b5e20',
      icon: '💰',
      emoji: '📊'
    },
    seo: {
      title: 'Finance Guru - Investment & Money Management',
      description: 'Learn investing, budgeting, tax planning, and financial management from certified financial professionals.',
      keywords: ['financial planning', 'investment advice', 'budgeting tips', 'tax planning', 'retirement planning']
    }
  },
  home: { 
    character: 'Home Guru', 
    category: 'lifestyle',
    primarySkills: ['organization', 'cleaning', 'home-improvement', 'interior-design', 'maintenance'],
    affiliateCategories: ['tools', 'supplies', 'furniture', 'appliances'],
    theme: {
      primaryColor: '#5e35b1',
      secondaryColor: '#512da8',
      accentColor: '#4527a0',
      icon: '🏠',
      emoji: '🛋️'
    },
    seo: {
      title: 'Home Guru - Home Organization & Improvement',
      description: 'Learn home organization, cleaning, interior design, and home improvement from professional organizers.',
      keywords: ['home organization', 'interior design', 'home improvement', 'cleaning tips', 'home maintenance']
    }
  }
};

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
  const { isGuruSite, subdomain } = useGuru();

  // If we're on a guru subdomain, show guru-specific routes
  if (isGuruSite) {
    const config = subdomainConfigs[subdomain];
    
    return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <SubdomainLandingPage subdomain={subdomain} config={config} />
          } />
          <Route path="about" element={
            <SubdomainLandingPage subdomain={subdomain} config={config} />
          } />
          <Route path="blog" element={
            <SubdomainLandingPage subdomain={subdomain} config={config} />
          } />
          <Route path="blog/:slug" element={
            <SubdomainLandingPage subdomain={subdomain} config={config} />
          } />
          <Route path="services" element={
            <SubdomainLandingPage subdomain={subdomain} config={config} />
          } />
          <Route path="contact" element={
            <SubdomainLandingPage subdomain={subdomain} config={config} />
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