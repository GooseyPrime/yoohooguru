import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background: ${props => props.theme.colors?.bg || '#f8f9fa'};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors?.border || '#e1e5e9'};
`;

const ErrorTitle = styled.h2`
  color: ${props => props.theme.colors?.text || '#212529'};
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors?.muted || '#6c757d'};
  margin-bottom: 1.5rem;
  max-width: 500px;
  line-height: 1.5;
`;

const RetryButton = styled.button`
  background: ${props => props.theme.colors?.primary || '#007bff'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: ${props => props.theme.colors?.primaryDark || '#0056b3'};
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, isFirebaseAuthError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Check if this is a Firebase auth error
    const isFirebaseAuthError = this.isFirebaseAuthError(error);
    
    // You can also log the error to an error reporting service here
    this.setState({
      error: error,
      errorInfo: errorInfo,
      isFirebaseAuthError: isFirebaseAuthError
    });
  }

  isFirebaseAuthError(error) {
    // Check for Firebase auth-related errors
    const firebaseAuthPatterns = [
      'Firebase',
      'firebase',
      'auth/internal-error',
      'GoogleAuthProvider',
      'signInWithPopup',
      'apis.google.com',
      'Content Security Policy'
    ];
    
    const errorString = error?.toString() || '';
    const stackString = error?.stack || '';
    
    return firebaseAuthPatterns.some(pattern => 
      errorString.includes(pattern) || stackString.includes(pattern)
    );
  }

  handleRetry() {
    // Clear the error state and try to re-render
    this.setState({ hasError: false, error: null, errorInfo: null, isFirebaseAuthError: false });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <ErrorContainer>
          <ErrorTitle>
            {this.state.isFirebaseAuthError ? 'Authentication Issue' : 'Oops! Something went wrong'}
          </ErrorTitle>
          <ErrorMessage>
            {this.state.isFirebaseAuthError ? 
              'We encountered an issue with Google Sign-in. This might be due to browser security settings or network connectivity. Please try refreshing the page or using email/password authentication instead.' :
              'We encountered an unexpected error. Don&apos;t worry, this has been logged and our team will look into it.'
            }
          </ErrorMessage>
          {this.state.isFirebaseAuthError && (
            <ErrorMessage style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
              💡 Tip: If you&apos;re using an ad blocker or strict privacy settings, try temporarily disabling them and refresh the page.
            </ErrorMessage>
          )}
          <RetryButton onClick={this.handleRetry.bind(this)}>
            Try Again
          </RetryButton>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '600px' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '1rem' }}>
                Error Details (Development)
              </summary>
              <pre style={{ 
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.875rem',
                border: '1px solid #e1e5e9'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;