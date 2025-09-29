import React, { useEffect } from 'react';
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
  font-size: 4rem;
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

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

function SubdomainNotFoundPage({ subdomain, config }) {
  const currentUrl = window.location.href;
  const subdomainName = config?.character || `${subdomain.charAt(0).toUpperCase() + subdomain.slice(1)} Guru`;

  useEffect(() => {
    // Signal 404 error state for analytics and SEO
    if (window.gtag) {
      window.gtag('event', 'subdomain_page_not_found', {
        page_title: '404 Not Found',
        page_location: currentUrl,
        subdomain: subdomain
      });
    }

    // Log SEO warning for debugging
    console.warn(`SEO Warning: Subdomain page ${currentUrl} returned 404 Not Found. This may harm indexing.`);
    
    // Set proper status for search engines
    if (window.history && window.history.replaceState) {
      window.history.replaceState(
        { ...window.history.state, httpStatus: 404 },
        document.title,
        window.location.pathname
      );
    }
  }, [currentUrl, subdomain]);

  const handleBackToHome = () => {
    window.location.href = `https://${subdomain}.yoohoo.guru/`;
  };

  return (
    <>
      <SEOMetadata
        title={`Page Not Found - ${subdomainName}`}
        description={`The page you are looking for could not be found on ${subdomainName}. Return to explore ${subdomain} skills and expertise.`}
        canonicalUrl={currentUrl}
        ogTitle={`Page Not Found - ${subdomainName}`}
        ogDescription={`The page you are looking for could not be found on ${subdomainName}. Return to explore ${subdomain} skills and expertise.`}
        ogUrl={currentUrl}
      />
      <NotFoundContainer>
        <ErrorCode>404</ErrorCode>
        <ErrorMessage>Page Not Found</ErrorMessage>
        <ErrorDescription>
          The page you are looking for on {subdomainName} might have been removed, 
          had its name changed, or is temporarily unavailable.
        </ErrorDescription>
        <BackButton onClick={handleBackToHome}>
          Back to {subdomainName} Home
        </BackButton>
      </NotFoundContainer>
    </>
  );
}

export default SubdomainNotFoundPage;