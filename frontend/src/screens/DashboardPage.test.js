import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import DashboardPage from './DashboardPage';

// Mock the auth context
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      uid: 'test-user-id',
      displayName: 'Test User',
      email: 'test@example.com'
    },
    loading: false
  })
}));

// Mock the components that might have complex dependencies
jest.mock('../components/SkillMatching', () => {
  return function SkillMatching() {
    return <div data-testid="skill-matching">Skill Matching Component</div>;
  };
});

jest.mock('../components/ResourcesSection', () => {
  return function ResourcesSection() {
    return <div data-testid="resources-section">Resources Section</div>;
  };
});

// Mock fetch for user profile API call
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: false,
    json: () => Promise.resolve({})
  })
);

describe('DashboardPage Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard page without errors', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    // Check that the welcome message is displayed
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });

  test('does not use window.location.href for internal navigation', () => {
    const originalLocationHref = window.location.href;
    
    // Spy on window.location.href to ensure it's not being set
    let locationHrefSetCount = 0;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        set href(url) {
          locationHrefSetCount++;
        },
        get href() {
          return originalLocationHref;
        }
      }
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    // Verify that window.location.href was not set during render
    expect(locationHrefSetCount).toBe(0);
  });
});
