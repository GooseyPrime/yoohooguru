import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.95;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled.a`
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
  
  &.primary {
    background: white;
    color: #667eea;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
  }
  
  &.secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
  }
`;

const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const SectionTitle = styled.h2`
  color: #ffffff;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    border-color: rgba(102, 126, 234, 0.5);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #b0b0b0;
  line-height: 1.6;
`;

const CommissionInfo = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  margin: 3rem 0;
`;

const CommissionTitle = styled.h3`
  color: #667eea;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const CommissionRate = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const CommissionDescription = styled.p`
  color: #b0b0b0;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

export default function CoachGuruHome() {
  return (
    <Container>
      <Head>
        <title>Coach Guru | Paid Skill-Sharing Marketplace | YooHoo.Guru</title>
        <meta name="description" content="Learn from expert Gurus and earn by sharing your skills on our paid skill-sharing marketplace." />
      </Head>
      
      <Header />
      
      <main>
        <HeroSection>
          <HeroTitle>Coach Guru Marketplace</HeroTitle>
          <HeroSubtitle>
            Learn from expert Gurus and earn by sharing your skills. Our platform connects passionate 
            learners with skilled teachers for one-time paid sessions.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/skills" passHref>
              <Button className="primary">
                Find a Guru →
              </Button>
            </Link>
            <Link href="/guru/profile" passHref>
              <Button className="secondary">
                Become a Guru
              </Button>
            </Link>
          </HeroButtons>
        </HeroSection>
        
        <FeaturesSection>
          <SectionTitle>How Coach Guru Works</SectionTitle>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>🔍</FeatureIcon>
              <FeatureTitle>Find Your Guru</FeatureTitle>
              <FeatureDescription>
                Browse our extensive marketplace of skilled Gurus across 24 categories. 
                Filter by skill, price, availability, and ratings to find the perfect match.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>📅</FeatureIcon>
              <FeatureTitle>Book a Session</FeatureTitle>
              <FeatureDescription>
                Schedule one-time learning sessions with your chosen Guru. 
                Choose between video conferencing or in-person meetings based on location.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>💳</FeatureIcon>
              <FeatureTitle>Secure Payments</FeatureTitle>
              <FeatureDescription>
                All payments are processed securely through Stripe with 48-hour escrow protection. 
                Funds are released to Gurus after successful session completion.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
          
          <CommissionInfo>
            <CommissionTitle>Platform Commission</CommissionTitle>
            <CommissionRate>15%</CommissionRate>
            <CommissionDescription>
              Coach Guru charges a 15% platform commission on all transactions. 
              This fee supports platform maintenance, security, and quality assurance.
            </CommissionDescription>
          </CommissionInfo>
        </FeaturesSection>
      </main>
      
      <Footer />
    </Container>
  );
}