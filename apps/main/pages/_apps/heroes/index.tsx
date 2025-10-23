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
  background: linear-gradient(135deg, #ff6b6b 0%, #764ba2 100%);
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
    color: #ff6b6b;
    
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
    border-color: rgba(255, 107, 107, 0.5);
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

const MissionSection = styled.section`
  background: rgba(255, 107, 107, 0.1);
  padding: 4rem 2rem;
  text-align: center;
`;

const MissionTitle = styled.h2`
  color: #ff6b6b;
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const MissionDescription = styled.p`
  color: #b0b0b0;
  font-size: 1.25rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
`;

export default function HeroGurusHome() {
  return (
    <Container>
      <Head>
        <title>Hero Gurus | Free Accessible Learning | YooHoo.Guru</title>
        <meta name="description" content="Free accessible skill-sharing for people with disabilities. Join our community of adaptive learners and volunteer Gurus." />
      </Head>
      
      <Header />
      
      <main>
        <HeroSection>
          <HeroTitle>Hero Gurus Community</HeroTitle>
          <HeroSubtitle>
            Free accessible learning for people with disabilities. Our platform connects adaptive learners 
            with volunteer Gurus who provide specialized, accommodating instruction.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/skills" passHref>
              <Button className="primary">
                Find Accessible Learning →
              </Button>
            </Link>
            <Link href="/heroes/profile" passHref>
              <Button className="secondary">
                Become a Hero Guru
              </Button>
            </Link>
          </HeroButtons>
        </HeroSection>
        
        <FeaturesSection>
          <SectionTitle>Accessible Learning Features</SectionTitle>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>♿</FeatureIcon>
              <FeatureTitle>Adaptive Teaching</FeatureTitle>
              <FeatureDescription>
                Our Hero Gurus are specially trained to accommodate various disabilities including 
                visual, auditory, motor, and cognitive impairments.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>❤️</FeatureIcon>
              <FeatureTitle>Completely Free</FeatureTitle>
              <FeatureDescription>
                All learning sessions are 100% free with no contracts or obligations. 
                Funded through grants, donations, and community support.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🤝</FeatureIcon>
              <FeatureTitle>Community Focused</FeatureTitle>
              <FeatureDescription>
                Built on volunteerism and community impact. Hero Gurus contribute their time and 
                expertise to make learning accessible to all.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesSection>
        
        <MissionSection>
          <MissionTitle>Our Mission</MissionTitle>
          <MissionDescription>
            Hero Gurus is dedicated to breaking down barriers to education and skill development 
            for people with disabilities. We believe everyone deserves access to learning opportunities, 
            regardless of their physical or cognitive abilities. Our volunteer Gurus provide 
            adaptive instruction that accommodates individual needs, making skill-sharing truly inclusive.
          </MissionDescription>
        </MissionSection>
      </main>
      
      <Footer />
    </Container>
  );
}