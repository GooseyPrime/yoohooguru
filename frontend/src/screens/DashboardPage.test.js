import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import '@testing-library/jest-dom';
import DashboardPage from './DashboardPage';

// Mock theme for styled-components
const mockTheme = {
  colors: {
    bg: '#0F0A1E',
    surface: '#1A1530',
    elev: '#252142',
    text: '#F8FAFC',
    muted: '#B4C6E7',
    border: '#2D2754',
    pri: '#6366F1',
    succ: '#10B981',
    warn: '#F59E0B',
    err: '#EF4444',
    accent: '#8B5CF6'
  },
  radius: { sm: 6, md: 8, lg: 12, xl: 16 },
  shadow: {
    card: '0 4px 20px rgba(15,10,30,0.4)',
    lg: '0 8px 32px rgba(15,10,30,0.5)',
    xl: '0 12px 48px rgba(15,10,30,0.6)'
  },
  motion: {
    fast: '120ms', med: '180ms', slow: '240ms',
    in: 'cubic-bezier(.2,.7,.25,1)', out: 'cubic-bezier(.3,.1,.2,1)'
  },
  fonts: {
    sans: `'Inter var', Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`
  }
};

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
        <ThemeProvider theme={mockTheme}>
          <DashboardPage />
        </ThemeProvider>
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
        <ThemeProvider theme={mockTheme}>
          <DashboardPage />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Verify that window.location.href was not set during render
    expect(locationHrefSetCount).toBe(0);
  });
});
