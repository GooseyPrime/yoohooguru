import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SEOMetadata from '../components/SEOMetadata';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: bold;
  color: #e74c3c;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
`;

const ErrorMessage = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 1rem 0;
`;

const ErrorDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
  max-width: 500px;
`;

const BackButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

function NotFoundPage() {
  const currentUrl = window.location.href;

  useEffect(() => {
    // Signal 404 error state for analytics and SEO
    if (window.gtag) {
      window.gtag('event', 'page_not_found', {
        page_title: '404 Not Found',
        page_location: currentUrl
      });
    }

    // Log SEO warning for debugging
    console.warn(`SEO Warning: Page ${currentUrl} returned 404 Not Found. This may harm indexing.`);
    
    // Set proper status for search engines (using history API state)
    if (window.history && window.history.replaceState) {
      window.history.replaceState(
        { ...window.history.state, httpStatus: 404 },
        document.title,
        window.location.pathname
      );
    }
  }, [currentUrl]);

  return (
    <>
      <SEOMetadata
        title="Page Not Found - yoohoo.guru"
        description="The page you are looking for could not be found. Return to yoohoo.guru to explore our skill-sharing community."
        canonicalUrl={currentUrl}
        ogTitle="Page Not Found - yoohoo.guru"
        ogDescription="The page you are looking for could not be found. Return to yoohoo.guru to explore our skill-sharing community."
        ogUrl={currentUrl}
      />
      <NotFoundContainer>
        <ErrorCode>404</ErrorCode>
        <ErrorMessage>Page Not Found</ErrorMessage>
        <ErrorDescription>
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable. Let&apos;s get you back to exploring amazing skills!
        </ErrorDescription>
        <BackButton to="/">
          Return to Home
        </BackButton>
      </NotFoundContainer>
    </>
  );
}

export default NotFoundPage;