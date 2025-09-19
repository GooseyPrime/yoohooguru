import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from '../../lib/api';
import Button from '../../components/Button';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: ${props => props.theme.colors.bg};
  min-height: calc(100vh - 140px);
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  margin-bottom: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const InfoBox = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 1rem;
  border-radius: ${props => props.theme.radius.md}px;
  margin-bottom: 1rem;

  p {
    color: ${props => props.theme.colors.muted};
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: ${props => props.theme.colors.text};
  }

  ul {
    color: ${props => props.theme.colors.muted};
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.25rem;
  }
`;

const ErrorMessage = styled.div`
  padding: 2rem;
  color: ${props => props.theme.colors.err};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.err};
  border-radius: ${props => props.theme.radius.md}px;
  margin: 1rem;
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

export default function OnboardingReview() {
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  useEffect(()=> {
    api('/onboarding/status')
      .then(r => setData(r.data))
      .catch((err) => {
        console.error('Failed to load onboarding status:', err);
        setError('Failed to load onboarding status. Please try again later.');
      });
  }, []);

  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!data) return <LoadingMessage>Loading…</LoadingMessage>;

  const publish = async () => {
    try {
      // In production, this would update the profile to published/active status
      alert('Submitted. A badge appears after any required docs are approved.');
      window.location.href = '/dashboard';
    } catch (error) {
      alert('Error publishing profile: ' + error.message);
    }
  };

  return (
    <Container>
      <Title>Review & Publish</Title>
      
      <Section>
        <SectionTitle>Profile Summary</SectionTitle>
        <InfoBox>
          <p><strong>Name:</strong> {data.profile?.displayName || 'Not set'}</p>
          <p><strong>Location:</strong> {data.profile?.city || 'Not set'}, {data.profile?.zip || 'Not set'}</p>
          <p><strong>Bio:</strong> {data.profile?.bio || 'Not set'}</p>
        </InfoBox>
        
        <SectionTitle>Selected Categories</SectionTitle>
        <InfoBox>
          {Object.keys(data.picks || {}).length > 0 ? (
            <ul>
              {Object.keys(data.picks || {}).map(slug => (
                <li key={slug}>{slug}</li>
              ))}
            </ul>
          ) : (
            <p>No categories selected</p>
          )}
        </InfoBox>
        
        <SectionTitle>Documents Uploaded</SectionTitle>
        <InfoBox>
          {Object.keys(data.docs || {}).length > 0 ? (
            <ul>
              {Object.values(data.docs || {}).map(doc => (
                <li key={doc.id}>
                  {doc.type} - {doc.status}
                  {doc.category && ` (${doc.category})`}
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents uploaded</p>
          )}
        </InfoBox>
        
        <SectionTitle>Status Check</SectionTitle>
        <InfoBox>
          <p>✓ Profile: {data.step.profileComplete ? 'Complete' : 'Incomplete'}</p>
          <p>✓ Categories: {data.step.categoriesComplete ? 'Complete' : 'Incomplete'}</p>
          <p>✓ Requirements: {data.step.requirementsComplete ? 'Complete' : 'Incomplete'}</p>
          <p>✓ Payout: {data.step.payoutConnected ? 'Complete' : 'Incomplete'}</p>
        </InfoBox>
      </Section>
      
      <Button 
        onClick={publish} 
        disabled={!data.step.reviewReady}
        variant="primary"
        size="lg"
      >
        Publish Profile
      </Button>
      {!data.step.reviewReady && (
        <InfoBox style={{marginTop: '1rem', borderColor: 'var(--err)'}}>
          <p style={{color: 'var(--err)'}}>
            Complete all steps first.
          </p>
        </InfoBox>
      )}
    </Container>
  );
}