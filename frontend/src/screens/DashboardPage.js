import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.bg};
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const Description = styled.p`
  font-size: var(--text-lg);
  color: ${props => props.theme.colors.muted};
  margin-bottom: 2rem;
`;

const ComingSoon = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.pri} 0%, ${props => props.theme.colors.succ} 100%);
  color: ${props => props.theme.colors.text};
  padding: 3rem 2rem;
  border-radius: ${props => props.theme.radius.xl}px;
  margin: 2rem 0;
  border: 1px solid ${props => props.theme.colors.border};

  h2 {
    font-size: var(--text-2xl);
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.bg};
  }

  p {
    color: ${props => props.theme.colors.bg};
    opacity: 0.9;
    line-height: 1.6;
  }
`;

function DashboardPage() {
  return (
    <Container>
      <Content>
        <Title>Your Dashboard</Title>
        <Description>
          Manage your skills, track your progress, and connect with your community.
        </Description>
        
        <ComingSoon>
          <h2>🚧 Dashboard Coming Soon!</h2>
          <p>
            Your personalized dashboard is being built with features like skill matching,
            progress tracking, and community insights. Stay tuned!
          </p>
        </ComingSoon>
      </Content>
    </Container>
  );
}

export default DashboardPage;