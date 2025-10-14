import React from 'react';
import styled, { css } from 'styled-components';

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

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

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