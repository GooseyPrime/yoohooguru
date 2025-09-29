import React from 'react';
import styled, { css } from 'styled-components';

const StyledButton = styled.button`
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
  
  ${props => props.$primary && css`
    background-color: ${props => props.theme.colors.primary};
    color: white;
    
    &:hover {
      background-color: ${props => props.theme.colors.primaryDark || props.theme.colors.primary};
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
    color: ${props => props.theme.colors.primary};
    border: 2px solid ${props => props.theme.colors.primary};
    
    &:hover {
      background-color: ${props => props.theme.colors.primary};
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

const Button = ({ 
  children, 
  variant = 'primary',
  fullWidth = false,
  size = 'medium',
  disabled = false,
  type = 'button',
  onClick,
  ...props 
}) => {
  // Convert to transient props (prefixed with $)
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
      disabled={disabled}
      type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;