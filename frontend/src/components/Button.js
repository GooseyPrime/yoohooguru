import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-weight: var(--font-medium);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
  position: relative;
  overflow: hidden;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Size variants */
  ${props => {
    switch (props.$size) {
      case 'xs':
        return `
          padding: 0.25rem 0.5rem;
          font-size: var(--text-xs);
          min-height: 24px;
        `;
      case 'sm':
        return `
          padding: 0.375rem 0.75rem;
          font-size: var(--text-sm);
          min-height: 32px;
        `;
      case 'lg':
        return `
          padding: 0.75rem 1.5rem;
          font-size: var(--text-lg);
          min-height: 48px;
        `;
      case 'xl':
        return `
          padding: 1rem 2rem;
          font-size: var(--text-xl);
          min-height: 56px;
        `;
      default: // md
        return `
          padding: 0.5rem 1rem;
          font-size: var(--text-base);
          min-height: 40px;
        `;
    }
  }}

  /* Variant styles */
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: var(--primary);
          color: white;
          
          &:hover:not(:disabled) {
            background: #0056b3;
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }
          
          &:active {
            transform: translateY(0);
          }
        `;
        
      case 'secondary':
        return `
          background: var(--secondary);
          color: white;
          
          &:hover:not(:disabled) {
            background: #1e7e34;
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }
          
          &:active {
            transform: translateY(0);
          }
        `;
        
      case 'outline':
        return `
          background: transparent;
          color: var(--primary);
          border: 1px solid var(--primary);
          
          &:hover:not(:disabled) {
            background: var(--primary);
            color: white;
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }
          
          &:active {
            transform: translateY(0);
          }
        `;
        
      case 'ghost':
        return `
          background: transparent;
          color: ${props => props.theme.colors.textSecondary};
          
          &:hover:not(:disabled) {
            background: ${props => props.theme.colors.surfaceSecondary};
            color: ${props => props.theme.colors.text};
          }
        `;
        
      case 'danger':
        return `
          background: var(--error);
          color: white;
          
          &:hover:not(:disabled) {
            background: #c82333;
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }
          
          &:active {
            transform: translateY(0);
          }
        `;
        
      case 'success':
        return `
          background: var(--success);
          color: white;
          
          &:hover:not(:disabled) {
            background: #218838;
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }
          
          &:active {
            transform: translateY(0);
          }
        `;
        
      default:
        return `
          background: ${props => props.theme.colors.surfaceSecondary};
          color: ${props => props.theme.colors.text};
          
          &:hover:not(:disabled) {
            background: ${props => props.theme.colors.border};
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }
          
          &:active {
            transform: translateY(0);
          }
        `;
    }
  }}

  /* Full width */
  ${props => props.$fullWidth && `
    width: 100%;
  `}

  /* Loading state */
  ${props => props.$loading && `
    pointer-events: none;
  `}
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

function Button({
  children,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className,
  ...props
}) {
  const { theme } = useTheme();
  
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={className}
      theme={theme}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
}

export default Button;