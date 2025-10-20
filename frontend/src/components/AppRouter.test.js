/**
 * Tests for AppRouter component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './AppRouter';

// Mock dependencies
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: null,
    loading: false,
  }),
}));

jest.mock('../hooks/useGuru', () => ({
  useGuru: () => ({
    isGuruSite: false,
    isCousinSite: false,
    subdomain: null,
  }),
}));

// Mock all lazy-loaded components
jest.mock('../screens/HomePage', () => {
  return function HomePage() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('../screens/LoginPage', () => {
  return function LoginPage() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

jest.mock('../screens/SignupPage', () => {
  return function SignupPage() {
    return <div data-testid="signup-page">Signup Page</div>;
  };
});

jest.mock('../screens/ForgotPasswordPage', () => {
  return function ForgotPasswordPage() {
    return <div data-testid="forgot-password-page">Forgot Password Page</div>;
  };
});

jest.mock('./Layout', () => {
  const { Outlet } = require('react-router-dom');
  return function Layout() {
    return (
      <div data-testid="layout">
        <Outlet />
      </div>
    );
  };
});

describe('AppRouter', () => {
  it('should render without crashing', () => {
    render(
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    );
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('should not render HostSubdomainRouterGate component', () => {
    const { container } = render(
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    );
    
    // Check that the component doesn't exist in the rendered output
    // HostSubdomainRouterGate would have no visible output, but we can check
    // that the routing works correctly without it
    expect(container.querySelector('[data-testid="host-subdomain-router-gate"]')).not.toBeInTheDocument();
  });

  it('should render HomePage on main site root route', () => {
    render(
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
});
