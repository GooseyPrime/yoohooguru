import React from 'react';
import styled from 'styled-components';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import HeroArt from '../components/HeroArt';

const HeroSection = styled.section`
  padding: 72px 0 24px; 
  text-align: center;
  background: radial-gradient(1200px 600px at 50% -10%, rgba(124,140,255,.12), transparent),
              linear-gradient(180deg, rgba(255,255,255,.02), transparent);
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;

  h1 {
    font-size: clamp(2.625rem, 5vw, 3.5rem);
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    letter-spacing: -0.025em;
    color: var(--text);
  }

  p {
    font-size: clamp(1rem, 2vw, 1.125rem);
    margin-bottom: 2rem;
    color: var(--muted);
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

const WelcomeTiles = styled.div`
  max-width: 1100px; 
  margin: 24px auto; 
  padding: 0 16px;
  display: grid; 
  gap: 20px; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;

const Tile = styled.div`
  background: var(--surface); 
  border: 1px solid var(--border); 
  border-radius: var(--r-lg);
  padding: 20px; 
  box-shadow: ${({ theme }) => theme.shadow.card};
  transition: transform var(--t-med) ${({ theme }) => theme.motion.in}, 
              border-color var(--t-fast) ${({ theme }) => theme.motion.in};
  
  &:hover { 
    transform: translateY(-2px); 
    border-color: #2E3540; 
  }

  .icon {
    width: 48px;
    height: 48px;
    border-radius: var(--r-md);
    background: rgba(124,140,255,.10);
    color: var(--pri);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--text);
  }

  p {
    color: var(--muted);
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }
`;


function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroArt />
          <h1>Find help or share your skills — the Handy‑Yeti way.</h1>
          <p>
            Local connections, meaningful exchanges, and community impact through 
            our trusted skill-sharing platform.
          </p>
          <HeroButtons>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/signup')}
            >
              Start Your Journey
              <ArrowRight size={20} />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/angels-list')}
            >
              Browse Services
            </Button>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <WelcomeTiles>
        <Tile>
          <h3>Angel&apos;s List</h3>
          <p>Find help, rentals, and odd jobs near you.</p>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/angels-list')}
          >
            Explore Angel&apos;s List →
          </Button>
        </Tile>
        
        <Tile>
          <div className="icon">
            <BookOpen size={24} />
          </div>
          <h3>SkillShare (led by Coach Guru)</h3>
          <p>Learn or teach. Book a Guru or swap skills.</p>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/skills')}
          >
            Explore Skills
          </Button>
        </Tile>
      </WelcomeTiles>
    </>
  );
}

export default HomePage;