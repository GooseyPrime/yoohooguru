import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock Vercel Analytics
jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => <div data-testid="vercel-analytics" />
}));

// Mock Vercel Speed Insights
jest.mock('@vercel/speed-insights/react', () => ({
  SpeedInsights: () => <div data-testid="vercel-speed-insights" />
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster" />,
  success: jest.fn(),
  error: jest.fn()
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ children }) => <div data-testid="route">{children}</div>,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  Outlet: () => <div data-testid="outlet" />
}));

// Mock AuthContext
jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => ({
    signup: jest.fn(),
    loginWithGoogle: jest.fn(),
    isFirebaseConfigured: false,
    currentUser: null,
    loading: false,
    error: null
  })
}));

// Mock FeatureFlagsContext to avoid async state updates in tests
jest.mock('./contexts/FeatureFlagsContext', () => ({
  FeatureFlagsProvider: ({ children }) => <div data-testid="feature-flags-provider">{children}</div>,
  useFeatureFlags: () => ({
    flags: {},
    loading: false,
    isEnabled: jest.fn().mockReturnValue(false)
  })
}));

// Mock AppRouter
jest.mock('./components/AppRouter', () => {
  return function MockAppRouter() {
    return <div data-testid="app-router" />;
  };
});

// Mock ErrorBoundary
jest.mock('./components/ErrorBoundary', () => {
  return function MockErrorBoundary({ children }) {
    return <div data-testid="error-boundary">{children}</div>;
  };
});

describe('App Component - Vercel Analytics Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders App with Vercel Analytics component', () => {
    const { getByTestId } = render(<App />);
    
    // Verify that Analytics component is rendered
    expect(getByTestId('vercel-analytics')).toBeInTheDocument();
  });

  test('renders App with both Analytics and SpeedInsights components', () => {
    const { getByTestId } = render(<App />);
    
    // Verify both Vercel components are present
    expect(getByTestId('vercel-analytics')).toBeInTheDocument();
    expect(getByTestId('vercel-speed-insights')).toBeInTheDocument();
  });

  test('renders complete App structure with all components', () => {
    const { getByTestId } = render(<App />);
    
    // Verify the main app structure
    expect(getByTestId('error-boundary')).toBeInTheDocument();
    expect(getByTestId('auth-provider')).toBeInTheDocument();
    expect(getByTestId('router')).toBeInTheDocument();
    expect(getByTestId('app-router')).toBeInTheDocument();
    expect(getByTestId('vercel-speed-insights')).toBeInTheDocument();
    expect(getByTestId('vercel-analytics')).toBeInTheDocument();
    expect(getByTestId('toaster')).toBeInTheDocument();
  });
});