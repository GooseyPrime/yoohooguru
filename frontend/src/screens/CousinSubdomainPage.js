import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { getSubdomainName } from '../hosting/hostRules';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: white;
`;

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  color: #333;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #667eea;
  text-transform: capitalize;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: #764ba2;
  margin-bottom: 2rem;
  font-weight: 400;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: #555;
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const FeatureItem = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const CTAButton = styled.a`
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  }
`;

const BackLink = styled.a`
  display: inline-block;
  color: #667eea;
  text-decoration: none;
  margin-top: 1.5rem;
  font-size: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AdPlaceholder = styled.div`
  background: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  color: #999;
  font-style: italic;
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
          Welcome to the {subdomainName} community hub! We're building something special here - 
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
