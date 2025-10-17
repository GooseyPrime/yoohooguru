/**
 * Button Component
 * A reusable button component with multiple variants and sizes
 * 
 * @module components/Button
 */

import React from 'react';
import styled, { css } from 'styled-components';

/**
 * Styled button props using transient props to avoid DOM warnings
 */
interface StyledButtonProps {
  $primary?: boolean;
  $secondary?: boolean;
  $fullWidth?: boolean;
  $small?: boolean;
  $large?: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  background-color: #667eea;
  color: white;
  
  ${props => props.$primary && css`
    background-color: #667eea;
    color: white;
    
    &:hover {
      background-color: #5568d3;
      transform: translateY(-2px);
    }
    
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
      transform: none;
    }
  `}
  
  ${props => props.$secondary && css`
    background-color: transparent;
    color: #667eea;
    border: 2px solid #667eea;
    
    &:hover {
      background-color: #667eea;
      color: white;
    }
    
    &:disabled {
      border-color: #ccc;
      color: #ccc;
      cursor: not-allowed;
    }
  `}
  
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.$small && css`
    padding: 8px 16px;
    font-size: 14px;
  `}
  
  ${props => props.$large && css`
    padding: 16px 32px;
    font-size: 18px;
  `}
`;

/**
 * Button component props
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: React.ReactNode;
  /** Button variant style */
  variant?: 'primary' | 'secondary';
  /** Whether button should take full width of container */
  fullWidth?: boolean;
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Whether to show loading state */
  loading?: boolean;
}

/**
 * Button component
 * 
 * @param {ButtonProps} props - Component props
 * @returns {React.FC<ButtonProps>} Rendered button component
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="large" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
const Button: React.FC<ButtonProps> = ({
  children, 
  variant = 'primary',
  fullWidth = false,
  size = 'medium',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  ...props 
}) => {
  // Convert to transient props (prefixed with $) to avoid DOM prop warnings
  const $primary = variant === 'primary';
  const $secondary = variant === 'secondary';
  const $fullWidth = fullWidth;
  const $small = size === 'small';
  const $large = size === 'large';
  
  return (
    <StyledButton 
      $primary={$primary} 
      $secondary={$secondary}
      $fullWidth={$fullWidth}
      $small={$small}
      $large={$large}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      {...props}
    >
      {loading && <span>Loading...</span>}
      {children}
    </StyledButton>
  );
};

export default Button;