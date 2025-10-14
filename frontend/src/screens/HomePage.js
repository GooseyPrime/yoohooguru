import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ArrowRight, GraduationCap, Wrench, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import HeroArt from '../components/HeroArt';
import SimpleLocationSelector from '../components/SimpleLocationSelector';
import SEOMetadata from '../components/SEOMetadata';

const HeroSection = styled.section`
  padding: 72px 0 24px; 
  text-align: center;
  background: ${props => props.backgroundImage 
    ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${props.backgroundImage})`
    : 'radial-gradient(1200px 600px at 50% -10%, rgba(124,140,255,.12), transparent), linear-gradient(180deg, rgba(255,255,255,.02), transparent)'
  };
  background-size: cover;
  background-position: center;
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

const HeroTagline = styled.div`
  max-width: 900px;
  margin: 3rem auto 2rem;
  padding: 2rem;
  text-align: center;
  background: rgba(124, 140, 255, 0.05);
  border: 1px solid rgba(124, 140, 255, 0.2);
  border-radius: var(--r-lg);
  
  h2 {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 600;
    margin-bottom: 1rem;
    line-height: 1.4;
    color: var(--text);
  }
  
  p {
    font-size: clamp(1rem, 2vw, 1.125rem);
    color: var(--muted);
    line-height: 1.8;
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
  const [location, setLocation] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');

  const fetchCityImage = useCallback(async (cityName, stateName, countryName) => {
    try {
      // Call backend API to fetch location image
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const params = new URLSearchParams({
        city: cityName
      });
      
      if (stateName) {
        params.append('state', stateName);
      }
      
      if (countryName) {
        params.append('country', countryName);
      }

      const response = await fetch(`${apiUrl}/images/location?${params.toString()}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.url) {
        // Use high-resolution image URL suitable for backgrounds
        setBackgroundImage(data.data.url);
        console.log('Background image loaded:', data.data.description || cityName);
      } else {
        // Graceful fallback - no background image
        console.log('No background image found for location:', cityName);
      }
    } catch (error) {
      console.log('Could not fetch city image:', error);
      // Graceful fallback - no background image
    }
  }, []);

  const handleLocationChange = useCallback((locationString, data) => {
    setLocation(locationString);
    
    // Extract city, state, and country for background image
    const cityName = data?.city || locationString.split(',')[0]?.trim();
    const stateName = data?.state;
    const countryName = data?.country;
    
    if (cityName) {
      fetchCityImage(cityName, stateName, countryName);
    }
  }, [fetchCityImage]);

  const handleLocationError = useCallback((errorMessage) => {
    console.log('Location error:', errorMessage);
  }, []);

  const seoData = {
    title: `yoohoo.guru - Skill Sharing Platform${location ? ` in ${location}` : ''}`,
    description: 'Exchange skills, discover purpose, and create exponential community impact through our trusted neighborhood-based skill-sharing platform.',
    keywords: 'skill sharing, community, local services, tutoring, handyman, pet care, skill exchange, neighborhood help',
    ogTitle: `Find Local Skills & Services${location ? ` in ${location}` : ''} - yoohoo.guru`,
    ogDescription: 'Connect with your neighbors to exchange skills, book services, and build meaningful community connections.',
    ogImage: backgroundImage || `${process.env.PUBLIC_URL || ''}/assets/images/yoohooguruyetiman.png`,
    ogUrl: window.location.href,
    canonicalUrl: window.location.href,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "yoohoo.guru",
      "url": "https://yoohoo.guru",
      "description": "Community skill-sharing platform for local connections",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://yoohoo.guru/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  };

  useEffect(() => {
    // Let the EnhancedLocationSelector handle initial location request
  }, []);

  return (
    <>
      <SEOMetadata {...seoData} />
      
      <HeroSection backgroundImage={backgroundImage}>
        <SimpleLocationSelector 
          location={location}
          onLocationChange={handleLocationChange}
          onLocationError={handleLocationError}
          autoRequestGPS={true}
        />
        <HeroContent>
          <HeroArt src={`${process.env.PUBLIC_URL || ''}/assets/images/yoohooguruyetiman.png`} alt="yoohoo.guru community skill-sharing platform" />
          <h1>A community where you can swap skills, share services, or find trusted local help.</h1>
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
              onClick={() => window.location.href = 'https://angel.yoohoo.guru'}
            >
              Browse Services
            </Button>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <HeroTagline>
        <h2>Learn. Earn. Empower.</h2>
        <p>
          Join a world where knowledge, kindness, and capability meet. Choose your path: 
          <strong> Become a Guru. Learn from Gurus. List a Gig.</strong> Help or get help through Angel&apos;s List. 
          <strong> Join the Heros.</strong> Empower and be empowered through adaptive teaching.
        </p>
      </HeroTagline>

      <WelcomeTiles>
        <Tile>
          <div className="icon">
            <GraduationCap size={24} />
          </div>
          <h3>SkillShare with Coach Guru</h3>
          <p>Learn from Gurus. Become a Guru. Exchange knowledge and skills through personalized coaching.</p>
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = 'https://coach.yoohoo.guru'}
          >
            Explore Coach Guru →
          </Button>
        </Tile>
        
        <Tile>
          <div className="icon">
            <Wrench size={24} />
          </div>
          <h3>Angel&apos;s List</h3>
          <p>List a Gig. Help or get help through Angel&apos;s List. Find local services and offer your help.</p>
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = 'https://angel.yoohoo.guru'}
          >
            Explore Angel&apos;s List →
          </Button>
        </Tile>
        
        <Tile>
          <div className="icon">
            <Heart size={24} />
          </div>
          <h3>Hero Guru&apos;s</h3>
          <p>Join the Heros. Empower and be empowered through adaptive teaching and inclusive learning.</p>
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = 'https://heroes.yoohoo.guru'}
          >
            Explore Hero Guru&apos;s →
          </Button>
        </Tile>
      </WelcomeTiles>
    </>
  );
}

export default HomePage;