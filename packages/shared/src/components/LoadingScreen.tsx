import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(124, 140, 255, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(124, 140, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(124, 140, 255, 0);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  animation: ${fadeIn} 0.3s ease-in;
`;

const LoadingIcon = styled.div`
  font-size: 3rem;
  animation: ${pulse} 2s infinite;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: #b0b0b0;
  font-size: 1.125rem;
  margin-top: 1rem;
`;

const LoadingScreen: React.FC = () => {
  return (
    <LoadingContainer>
      <LoadingIcon>⚡</LoadingIcon>
      <LoadingText>Loading...</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingScreen;
