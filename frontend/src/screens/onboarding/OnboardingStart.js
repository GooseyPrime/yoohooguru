import React, { useState } from 'react';
import Button from '../../components/Button'; // This is the unused import that needs to be removed
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  max-width: 500px;
  text-align: center;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  font-size: 2.5rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

function OnboardingStart() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // This line contains the unescaped single quote that needs to be fixed
    console.log('Welcome to our community! Let's get you set up');
    navigate('/onboarding/categories');
  };

  return (
    <Container theme={theme}>
      <Content>
        <Title theme={theme}>Welcome to YooHoo Guru! 🌊</Title>
        <Subtitle theme={theme}>
          Join our skill-sharing community where knowledge flows like water, 
          connecting people and creating ripples of positive change.
        </Subtitle>
        
        <div style={{ margin: '2rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
          <h3>Ready to start your journey?</h3>
          <p>Let's set up your profile and discover amazing skills to learn and share.</p>
        </div>

        <button
          onClick={handleGetStarted}
          style={{
            padding: '1rem 2rem',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}
        >
          Get Started
        </button>
      </Content>
    </Container>
  );
}

export default OnboardingStart;