import React from 'react';
import styled from 'styled-components';
import { ArrowRight, Users, BookOpen, TrendingUp, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const HeroSection = styled.section`
  background: linear-gradient(135deg, var(--ripple-blue) 0%, var(--growth-green) 100%);
  color: white;
  padding: 6rem 0 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
    opacity: 0.3;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;

  h1 {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: var(--font-bold);
    margin-bottom: 1.5rem;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  p {
    font-size: var(--text-xl);
    margin-bottom: 2rem;
    opacity: 0.9;
    line-height: 1.6;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FeaturesSection = styled.section`
  padding: 6rem 0;
  background: white;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: var(--text-3xl);
  margin-bottom: 3rem;
  color: var(--gray-900);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 2rem;
  border-radius: var(--radius-xl);
  background: var(--light-gray);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
  }

  h3 {
    font-size: var(--text-xl);
    margin-bottom: 1rem;
    color: var(--gray-900);
  }

  p {
    color: var(--gray-600);
    line-height: 1.6;
  }
`;

const StatsSection = styled.section`
  background: var(--gray-900);
  color: white;
  padding: 4rem 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const StatCard = styled.div`
  h3 {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    color: var(--primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--gray-300);
    font-size: var(--text-lg);
  }
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, var(--growth-green) 0%, var(--energy-orange) 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
`;

function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users size={24} />,
      title: 'Connect with Community',
      description: 'Find skilled neighbors and share your expertise in a trusted local network.'
    },
    {
      icon: <BookOpen size={24} />,
      title: 'Learn & Teach',
      description: 'Exchange skills through AI-moderated sessions designed for effective learning.'
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Grow Together',
      description: 'Progress through tiers and create exponential impact in your community.'
    },
    {
      icon: <Star size={24} />,
      title: 'Quality Assured',
      description: 'AI-powered matching and session templates ensure meaningful exchanges.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Members' },
    { number: '500+', label: 'Skills Available' },
    { number: '25,000+', label: 'Sessions Completed' },
    { number: '98%', label: 'Satisfaction Rate' }
  ];

  return (
    <>
      <HeroSection>
        <HeroContent>
          <h1>Create Ripples of Impact in Your Community</h1>
          <p>
            Exchange skills, discover purpose, and build meaningful connections 
            with neighbors who share your passion for growth and learning.
          </p>
          <HeroButtons>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/signup')}
            >
              Start Your Journey
              <ArrowRight size={20} />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/skills')}
            >
              Browse Skills
            </Button>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>How yoohoo.guru Works</SectionTitle>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <div className="icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      <StatsSection>
        <SectionTitle style={{ color: 'white' }}>
          Building Communities, One Skill at a Time
        </SectionTitle>
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </StatCard>
          ))}
        </StatsGrid>
      </StatsSection>

      <CTASection>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Ready to Make Your Impact?</h2>
          <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
            Join thousands of community members creating positive change through skill sharing.
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/signup')}
          >
            Join yoohoo.guru
            <ArrowRight size={20} />
          </Button>
        </div>
      </CTASection>
    </>
  );
}

export default HomePage;