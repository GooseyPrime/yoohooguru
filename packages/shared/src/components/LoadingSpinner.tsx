/**
 * Loading Spinner Component
 * A simple animated spinner for loading states
 * 
 * @module components/LoadingSpinner
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * Spin animation keyframes
 */
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

interface SpinnerProps {
  size?: string;
  color?: string;
}

const Spinner = styled.div<SpinnerProps>`
  width: ${props => props.size || '24px'};
  height: ${props => props.size || '24px'};
  border: 2px solid transparent;
  border-top: 2px solid ${props => props.color || '#667eea'};
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

/**
 * Loading spinner props
 */
interface LoadingSpinnerProps {
  /** Spinner size (e.g., '24px', '2rem') */
  size?: string;
  /** Spinner color (CSS color value) */
  color?: string;
}

/**
 * Loading Spinner component
 * 
 * @param {LoadingSpinnerProps} props - Component props
 * @returns {React.FC<LoadingSpinnerProps>} Rendered spinner component
 * 
 * @example
 * ```tsx
 * <LoadingSpinner size="32px" color="#667eea" />
 * ```
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size, color }) => {
  return (
    <SpinnerWrapper>
      <Spinner size={size} color={color} />
    </SpinnerWrapper>
  );
};

export default LoadingSpinner;
