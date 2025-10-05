import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { getSubdomainName } from '../hosting/hostRules';

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--bg, #0F0A1E);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  /* Premium gradient overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(1200px 600px at 50% -10%, rgba(124,140,255,.12), transparent);
    pointer-events: none;
  }
`;

const ContentCard = styled.div`
  background: var(--surface, #1A1530);
  border: 1px solid var(--border, #2D2754);
  border-radius: var(--r-xl, 16px);
  padding: 3rem;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text, #F8FAFC);
  text-transform: capitalize;
  letter-spacing: -0.025em;
  line-height: 1.2;
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  color: var(--muted, #B4C6E7);
  margin-bottom: 2rem;
  font-weight: 400;
  text-align: center;
  line-height: 1.4;
`;

const Description = styled.p`
  font-size: 1.125rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: var(--muted, #B4C6E7);
  text-align: center;
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin: 2.5rem 0;
`;

const FeatureItem = styled.div`
  background: var(--elev, #252142);
  border: 1px solid var(--border, #2D2754);
  padding: 2rem 1.5rem;
  border-radius: var(--r-lg, 12px);
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    transform: translateY(-4px);
    border-color: var(--pri, #6366F1);
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  filter: grayscale(20%) brightness(1.1);
`;

const FeatureTitle = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text, #F8FAFC);
`;

const CTAButton = styled.a`
  display: inline-block;
  background: var(--pri, #6366F1);
  color: var(--text, #F8FAFC);
  padding: 1rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
    background: #7C7FF4;
  }
`;

const BackLink = styled.a`
  display: inline-block;
  color: var(--pri, #6366F1);
  text-decoration: none;
  margin-top: 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.2s ease;
  
  &:hover {
    color: #7C7FF4;
    text-decoration: underline;
  }
`;

const AdPlaceholder = styled.div`
  background: var(--elev, #252142);
  border: 2px dashed var(--border, #2D2754);
  border-radius: var(--r-lg, 12px);
  padding: 2.5rem 2rem;
  margin: 2.5rem 0;
  color: var(--muted, #B4C6E7);
  font-style: italic;
  text-align: center;
  transition: border-color 0.3s ease;
  
  &:hover {
    border-color: var(--pri, #6366F1);
  }
`;

/**
 * Cousin Subdomain Page
 * Dynamic landing page for any "cousin" subdomain of yoohoo.guru
 * Displays placeholder content with monetization opportunities
 */
function CousinSubdomainPage() {
  const [subdomainName, setSubdomainName] = useState('');

  useEffect(() => {
    const name = getSubdomainName();
    setSubdomainName(name || 'unknown');
  }, []);

  const features = [
    {
      icon: '🎯',
      title: 'Specialized Content',
      description: 'Curated content for this topic'
    },
    {
      icon: '📚',
      title: 'Learning Resources',
      description: 'Guides, tutorials, and courses'
    },
    {
      icon: '🤝',
      title: 'Community',
      description: 'Connect with like-minded people'
    },
    {
      icon: '💡',
      title: 'Expert Insights',
      description: 'Tips from industry professionals'
    }
  ];

  return (
    <PageContainer>
      <Helmet>
        <title>{`${subdomainName} - YooHoo.guru`}</title>
        <meta name="description" content={`Discover ${subdomainName} skills, resources, and community at YooHoo.guru`} />
      </Helmet>
      
      <ContentCard>
        <Title>{subdomainName}</Title>
        <Subtitle>Coming Soon to YooHoo.guru</Subtitle>
        
        <Description>
          Welcome to the {subdomainName} community hub! We&apos;re building something special here - 
          a dedicated space for enthusiasts, learners, and experts to connect, share knowledge, 
          and grow together.
        </Description>

        <AdPlaceholder>
          📢 Ad Space: Partner with us to reach {subdomainName} enthusiasts
        </AdPlaceholder>

        <FeatureList>
          {features.map((feature, index) => (
            <FeatureItem key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
            </FeatureItem>
          ))}
        </FeatureList>

        <Description>
          This cousin subdomain is part of the YooHoo.guru network - a skill-sharing platform 
          where communities exchange knowledge, discover purpose, and create impact.
        </Description>

        <AdPlaceholder>
          🎯 Ad Space: Featured courses and resources for {subdomainName}
        </AdPlaceholder>

        <CTAButton href="https://www.yoohoo.guru">
          Explore Main Platform
        </CTAButton>

        <BackLink href="https://www.yoohoo.guru">
          ← Back to YooHoo.guru
        </BackLink>
      </ContentCard>
    </PageContainer>
  );
}

export default CousinSubdomainPage;
