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
  background: linear-gradient(135deg, #51cf66 0%, #764ba2 100%);
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
    color: #51cf66;
    
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
    border-color: rgba(81, 207, 102, 0.5);
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
  background: rgba(81, 207, 102, 0.1);
  border: 1px solid rgba(81, 207, 102, 0.3);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  margin: 3rem 0;
`;

const CommissionTitle = styled.h3`
  color: #51cf66;
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

export default function AngelListHome() {
  return (
    <Container>
      <Head>
        <title>Angel's List | Local Service Marketplace | YooHoo.Guru</title>
        <meta name="description" content="Find and provide local services in your community. Connect with neighbors for everything from handyman work to tutoring." />
      </Head>
      
      <Header />
      
      <main>
        <HeroSection>
          <HeroTitle>Angel's List Marketplace</HeroTitle>
          <HeroSubtitle>
            Find and provide local services in your community. Connect with neighbors for everything 
            from handyman work to tutoring, all within your local area.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/location/search" passHref>
              <Button className="primary">
                Find Local Services →
              </Button>
            </Link>
            <Link href="/angel/profile" passHref>
              <Button className="secondary">
                Become an Angel
              </Button>
            </Link>
          </HeroButtons>
        </HeroSection>
        
        <FeaturesSection>
          <SectionTitle>Local Service Features</SectionTitle>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>📍</FeatureIcon>
              <FeatureTitle>Geographical Matching</FeatureTitle>
              <FeatureDescription>
                Connect with service providers and clients in your local area. Reduce travel time 
                and support your community with nearby services.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>💰</FeatureIcon>
              <FeatureTitle>Flexible Pricing</FeatureTitle>
              <FeatureDescription>
                Set your own rates for services. Our tiered commission structure (10-15%) ensures 
                fair pricing for both providers and clients.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🛡️</FeatureIcon>
              <FeatureTitle>Secure Transactions</FeatureTitle>
              <FeatureDescription>
                All payments are securely processed and held in escrow until services are completed. 
                Protection for both service providers and clients.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesSection>
        
        <CommissionInfo>
          <CommissionTitle>Commission Structure</CommissionTitle>
          <CommissionRate>10-15% Tiered Commission</CommissionRate>
          <CommissionDescription>
            Our fair commission structure ensures you keep most of what you earn. 
            Lower commission rates for higher volume providers.
          </CommissionDescription>
        </CommissionInfo>
      </main>
      
      <Footer />
    </Container>
  );
}