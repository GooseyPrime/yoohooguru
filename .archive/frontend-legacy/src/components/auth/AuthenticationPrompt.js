import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Lock, User, DollarSign, Star, Shield } from 'lucide-react';
import Button from '../Button';
import Logo from '../Logo';

// Professional Authentication Prompt Styled Components
const AuthPromptContainer = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.bg};
`;

const AuthPromptCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-xl);
  box-shadow: ${props => props.theme.shadow.card};
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const AuthPromptLogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const AuthPromptIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(124, 140, 255, 0.1) 0%, rgba(46, 213, 115, 0.1) 100%);
  border: 2px solid rgba(124, 140, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: ${props => props.theme.colors.pri};
`;

const AuthPromptTitle = styled.h1`
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.75rem;
`;

const AuthPromptSubtitle = styled.p`
  color: ${props => props.theme.colors.muted};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const AuthPromptActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const AuthPromptFeatures = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const AuthPromptFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: ${props => props.theme.colors.muted};
  font-size: var(--text-sm);
  text-align: left;
  
  svg {
    color: ${props => props.theme.colors.pri};
    flex-shrink: 0;
  }
`;

function AuthenticationPrompt({ 
  title = "Sign In Required",
  subtitle,
  returnPath = "/",
  message,
  features = []
}) {
  const navigate = useNavigate();

  const defaultFeatures = [
    { icon: User, text: "Personalized dashboard with your activity" },
    { icon: DollarSign, text: "Track earnings and manage transactions" },
    { icon: Star, text: "View ratings and build your reputation" },
    { icon: Shield, text: "Secure account with privacy controls" }
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <AuthPromptContainer>
      <AuthPromptCard>
        <AuthPromptLogoWrapper>
          <Logo showImage={true} size="small" />
        </AuthPromptLogoWrapper>
        
        <AuthPromptIcon>
          <Lock size={28} />
        </AuthPromptIcon>
        
        <AuthPromptTitle>{title}</AuthPromptTitle>
        <AuthPromptSubtitle>
          {subtitle || "Access your personal profile, manage your skills, track earnings, and connect with your community."}
        </AuthPromptSubtitle>
        
        <AuthPromptActions>
          <Button 
            variant="primary" 
            onClick={() => navigate('/login', { 
              state: { 
                from: { pathname: returnPath },
                message: message || `Sign in to access ${title.toLowerCase()}`
              }
            })}
            style={{ flex: 1 }}
          >
            Sign In
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/signup', { 
              state: { 
                from: { pathname: returnPath },
                message: message || `Create an account to access ${title.toLowerCase()}`
              }
            })}
            style={{ flex: 1 }}
          >
            Sign Up
          </Button>
        </AuthPromptActions>
        
        <AuthPromptFeatures>
          {displayFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <AuthPromptFeature key={index}>
                <IconComponent size={16} />
                <span>{feature.text}</span>
              </AuthPromptFeature>
            );
          })}
        </AuthPromptFeatures>
      </AuthPromptCard>
    </AuthPromptContainer>
  );
}

export default AuthenticationPrompt;