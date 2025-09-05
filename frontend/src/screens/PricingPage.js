import React from 'react';
import styled from 'styled-components';
import Button from '../components/Button';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.bg};
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: var(--text-lg);
  color: ${props => props.theme.colors.muted};
  text-align: center;
  margin-bottom: 3rem;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const PricingCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-lg);
  padding: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
  position: relative;
  
  &.featured {
    border-color: ${props => props.theme.colors.pri};
    transform: scale(1.05);
  }
  
  h3 {
    font-size: var(--text-xl);
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text};
  }
  
  .price {
    font-size: var(--text-3xl);
    font-weight: bold;
    color: ${props => props.theme.colors.pri};
    margin-bottom: 0.5rem;
  }
  
  .period {
    font-size: var(--text-sm);
    color: ${props => props.theme.colors.muted};
    margin-bottom: 2rem;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  margin-bottom: 2rem;
  
  li {
    padding: 0.5rem 0;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:before {
      content: "✓";
      color: ${props => props.theme.colors.succ};
      font-weight: bold;
    }
  }
`;

const EarningSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-lg);
  padding: 2rem;
  margin-top: 3rem;
  border: 1px solid ${props => props.theme.colors.border};
  
  h2 {
    font-size: var(--text-2xl);
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text};
    text-align: center;
  }
  
  p {
    font-size: var(--text-base);
    color: ${props => props.theme.colors.muted};
    line-height: 1.6;
    margin-bottom: 1rem;
  }
`;

const EarningGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const EarningCard = styled.div`
  background: ${props => props.theme.colors.elev};
  border-radius: var(--r-md);
  padding: 1.5rem;
  text-align: center;
  
  h4 {
    font-size: var(--text-lg);
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.text};
  }
  
  .amount {
    font-size: var(--text-xl);
    font-weight: bold;
    color: ${props => props.theme.colors.pri};
    margin-bottom: 0.5rem;
  }
  
  .description {
    font-size: var(--text-sm);
    color: ${props => props.theme.colors.muted};
  }
`;

function PricingPage() {
  return (
    <Container>
      <Content>
        <Title>Pricing</Title>
        <Subtitle>
          Start earning money by sharing your skills and helping your neighbors
        </Subtitle>
        
        <PricingGrid>
          <PricingCard>
            <h3>Community Member</h3>
            <div className="price">Free</div>
            <div className="period">Always</div>
            <FeatureList>
              <li>Browse skills and services</li>
              <li>Create basic profile</li>
              <li>Message other members</li>
              <li>Join community discussions</li>
              <li>Access safety resources</li>
            </FeatureList>
            <Button variant="outline">Get Started</Button>
          </PricingCard>

          <PricingCard className="featured">
            <h3>Skill Sharer</h3>
            <div className="price">$9</div>
            <div className="period">per month</div>
            <FeatureList>
              <li>Everything in Community</li>
              <li>Offer skills and services</li>
              <li>AI-powered session matching</li>
              <li>Calendar integration</li>
              <li>Payment processing</li>
              <li>Enhanced profile features</li>
            </FeatureList>
            <Button variant="primary">Start Earning</Button>
          </PricingCard>

          <PricingCard>
            <h3>Premium Angel</h3>
            <div className="price">$19</div>
            <div className="period">per month</div>
            <FeatureList>
              <li>Everything in Skill Sharer</li>
              <li>Priority listing placement</li>
              <li>Advanced analytics</li>
              <li>Custom branding</li>
              <li>Multiple skill categories</li>
              <li>Dedicated support</li>
            </FeatureList>
            <Button variant="primary">Go Premium</Button>
          </PricingCard>
        </PricingGrid>

        <EarningSection>
          <h2>Start Earning Today</h2>
          <p>
            yoohoo.guru makes it easy to monetize your skills and help your community. 
            Whether you&apos;re teaching a hobby, offering professional services, or helping with odd jobs, 
            our platform connects you with neighbors who need your expertise.
          </p>

          <EarningGrid>
            <EarningCard>
              <h4>Tutoring</h4>
              <div className="amount">$25-50/hr</div>
              <div className="description">Teaching skills like languages, music, coding</div>
            </EarningCard>

            <EarningCard>
              <h4>Handyman Services</h4>
              <div className="amount">$30-60/hr</div>
              <div className="description">Home repairs, assembly, maintenance</div>
            </EarningCard>

            <EarningCard>
              <h4>Creative Services</h4>
              <div className="amount">$20-40/hr</div>
              <div className="description">Art, design, photography, crafts</div>
            </EarningCard>

            <EarningCard>
              <h4>Pet Care</h4>
              <div className="amount">$15-25/hr</div>
              <div className="description">Walking, sitting, grooming, training</div>
            </EarningCard>
          </EarningGrid>
        </EarningSection>
      </Content>
    </Container>
  );
}

export default PricingPage;