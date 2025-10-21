import React from 'react';
import styled from 'styled-components';
import { ArrowLeft, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import SEOMetadata from '../components/SEOMetadata';

const PageContainer = styled.div`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background: var(--background);
  color: var(--text);
`;

const IconWrapper = styled.div`
  margin-bottom: 2rem;
  
  .icon {
    width: 4rem;
    height: 4rem;
    color: var(--primary);
    opacity: 0.7;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text);
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
`;

const BackButton = styled(Button)`
  margin-top: 1rem;
`;

function ComingSoonPage({ 
  title = "Coming Soon", 
  description = "We're working hard to bring you this feature. Check back soon!",
  seoTitle = "Coming Soon",
  seoDescription = "This feature is under development and will be available soon."
}) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <PageContainer>
      <SEOMetadata
        title={seoTitle}
        description={seoDescription}
        ogType="website"
      />
      
      <IconWrapper>
        <Clock className="icon" />
      </IconWrapper>
      
      <Title>{title}</Title>
      <Subtitle>{description}</Subtitle>
      
      <div>
        <BackButton variant="outline" onClick={handleGoBack}>
          <ArrowLeft size={16} />
          Go Back
        </BackButton>
        <BackButton variant="primary" onClick={handleGoHome} style={{ marginLeft: '1rem' }}>
          Home
        </BackButton>
      </div>
    </PageContainer>
  );
}

export default ComingSoonPage;