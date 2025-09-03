import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.background};
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBg};
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid ${props => props.theme.colors.border};
  transition: all var(--transition-fast);

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

function AngelsListPage() {
  const { theme } = useTheme();

  return (
    <PageContainer theme={theme}>
      <ContentWrapper>
        <HeaderSection>
          <Title theme={theme}>
            <h1>Angel&apos;s List</h1>
          </Title>
          <Description theme={theme}>
            Discover inspiring community members who are making a difference through skill sharing and mentorship.
          </Description>
        </HeaderSection>

        <GridContainer>
          <Card theme={theme}>
            <CardTitle theme={theme}>Community Leaders</CardTitle>
            <CardDescription theme={theme}>
              Meet the amazing individuals who are leading by example and inspiring others to share their skills.
            </CardDescription>
          </Card>

          <Card theme={theme}>
            <CardTitle theme={theme}>Top Mentors</CardTitle>
            <CardDescription theme={theme}>
              Connect with experienced professionals who are dedicated to helping others grow and succeed.
            </CardDescription>
          </Card>

          <Card theme={theme}>
            <CardTitle theme={theme}>Skill Champions</CardTitle>
            <CardDescription theme={theme}>
              Discover members who excel in various skills and are passionate about teaching others.
            </CardDescription>
          </Card>
        </GridContainer>
      </ContentWrapper>
    </PageContainer>
  );
}

export default AngelsListPage;