import React from 'react';
import styled from 'styled-components';

const HeroArtContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 2rem;
  text-align: center;
  position: relative;
`;

const ArtImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

interface HeroArtProps {
  src?: string;
  alt?: string;
}

const HeroArt: React.FC<HeroArtProps> = ({ src, alt = "Hero artwork" }) => {
  if (!src) return null;
  
  return (
    <HeroArtContainer>
      <ArtImage src={src} alt={alt} loading="lazy" />
    </HeroArtContainer>
  );
};

export default HeroArt;
