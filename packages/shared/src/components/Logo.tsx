import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
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
  height: 48px;
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
  font-size: 2.2rem;
  font-weight: 700;
  color: #667eea;
`;

const GuruText = styled.span`
  font-family: 'Sakkal Majalla', 'Amiri', 'Scheherazade New', serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #667eea;
  margin-left: 0.1rem;
`;

const DotSeparator = styled.span`
  font-family: 'Amatic SC', cursive;
  font-size: 2.2rem;
  font-weight: 700;
  color: #667eea;
  margin: 0 0.1rem;
`;

const LogoLettering = styled.img`
  height: 48px;
  width: auto;
  object-fit: contain;
`;

interface LogoProps {
  showIcon?: boolean;
  showImage?: boolean;
  showText?: boolean;
  showLettering?: boolean;
  size?: string;
  to?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  showIcon = false,
  showImage = false, 
  showText = true,
  showLettering = false,
  size = 'normal',
  to = '/',
  className 
}) => {
  const sizeMultiplier = size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1;
  
  return (
    <LogoContainer href={to} className={className}>
      {showIcon && (
        <LogoIcon style={{ fontSize: `${1.8 * sizeMultiplier}rem` }}>
          🎯
        </LogoIcon>
      )}
      
      {showImage && (
        <LogoImage 
          src="/assets/images/YooHoo.png" 
          alt="yoohoo.guru logo"
          style={{ height: `${48 * sizeMultiplier}px` }}
        />
      )}
      
      {showLettering && (
        <LogoLettering 
          src="/assets/images/yoohoogurulettering.png" 
          alt="yoohoo.guru"
          style={{ height: `${48 * sizeMultiplier}px` }}
        />
      )}
      
      {showText && !showLettering && (
        <LogoText>
          <YoohooText style={{ fontSize: `${2.2 * sizeMultiplier}rem` }}>
            Yoohoo
          </YoohooText>
          <DotSeparator style={{ fontSize: `${2.2 * sizeMultiplier}rem` }}>
            .
          </DotSeparator>
          <GuruText style={{ fontSize: `${1.8 * sizeMultiplier}rem` }}>
            Guru
          </GuruText>
        </LogoText>
      )}
    </LogoContainer>
  );
};

export default Logo;