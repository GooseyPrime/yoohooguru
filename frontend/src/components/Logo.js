import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--pri);
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
  }
`;

const LogoIcon = styled.span`
  font-size: 1.8rem;
  animation: pulse 3s infinite;
`;

const LogoImage = styled.img`
  height: 32px;
  width: auto;
  object-fit: contain;
`;

const LogoText = styled.span`
  display: flex;
  align-items: baseline;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const YoohooText = styled.span`
  font-family: 'Amatic SC', cursive;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--pri);
`;

const GuruText = styled.span`
  font-family: 'Sakkal Majalla', 'Amiri', 'Scheherazade New', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--pri);
  margin-left: 0.1rem;
`;

const DotSeparator = styled.span`
  font-family: 'Amatic SC', cursive;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--pri);
  margin: 0 0.1rem;
`;

const Logo = ({ 
  showIcon = true, 
  showImage = false, 
  showText = true, 
  size = 'normal',
  to = '/',
  className 
}) => {
  const sizeMultiplier = size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1;
  
  return (
    <LogoContainer to={to} className={className}>
      {showIcon && (
        <LogoIcon style={{ fontSize: `${1.8 * sizeMultiplier}rem` }}>
          🎯
        </LogoIcon>
      )}
      
      {showImage && (
        <LogoImage 
          src="/assets/images/YooHoo.png" 
          alt="yoohoo.guru logo"
          style={{ height: `${32 * sizeMultiplier}px` }}
        />
      )}
      
      {showText && (
        <LogoText>
          <YoohooText style={{ fontSize: `${1.8 * sizeMultiplier}rem` }}>
            Yoohoo
          </YoohooText>
          <DotSeparator style={{ fontSize: `${1.8 * sizeMultiplier}rem` }}>
            .
          </DotSeparator>
          <GuruText style={{ fontSize: `${1.5 * sizeMultiplier}rem` }}>
            Guru
          </GuruText>
        </LogoText>
      )}
    </LogoContainer>
  );
};

export default Logo;