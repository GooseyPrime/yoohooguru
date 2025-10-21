import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';

// Mock styled-components theme
const mockTheme = {
  colors: {
    bg: '#f8f9fa',
    border: '#e1e5e9',
    text: '#212529',
    muted: '#6c757d',
    primary: '#007bff',
    primaryDark: '#0056b3'
  }
};

// Component that throws an error for testing
const ThrowError = ({ errorType }) => {
  if (errorType === 'firebase') {
    throw new Error('Firebase: Error (auth/internal-error)');
  } else if (errorType === 'csp') {
    throw new Error('Content Security Policy: script-src violated by https://apis.google.com/js/api.js');
  } else if (errorType === 'general') {
    throw new Error('General error');
  }
  return <div>No error</div>;
};

// Helper to render ErrorBoundary with theme
const renderWithTheme = (children) => {
  return render(
    <div style={{ ...mockTheme }}>
      {children}
    </div>
  );
};

describe('ErrorBoundary', () => {
  // Suppress console errors during these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  test('renders children when there is no error', () => {
    renderWithTheme(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('displays generic error UI for general errors', () => {
    renderWithTheme(
      <ErrorBoundary>
        <ThrowError errorType="general" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  test('displays Firebase-specific error UI for Firebase errors', () => {
    renderWithTheme(
      <ErrorBoundary>
        <ThrowError errorType="firebase" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Authentication Issue')).toBeInTheDocument();
    expect(screen.getByText(/Google Sign-in/)).toBeInTheDocument();
    expect(screen.getByText(/browser security settings/)).toBeInTheDocument();
    expect(screen.getByText(/ad blocker or strict privacy settings/)).toBeInTheDocument();
  });

  test('displays Firebase-specific error UI for CSP errors', () => {
    renderWithTheme(
      <ErrorBoundary>
        <ThrowError errorType="csp" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Authentication Issue')).toBeInTheDocument();
    expect(screen.getByText(/Google Sign-in/)).toBeInTheDocument();
    expect(screen.getByText(/ad blocker or strict privacy settings/)).toBeInTheDocument();
  });

  test('retry button is present and clickable', () => {
    renderWithTheme(
      <ErrorBoundary>
        <ThrowError errorType="general" />
      </ErrorBoundary>
    );

    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
    expect(retryButton.tagName.toLowerCase()).toBe('button');
  });
});