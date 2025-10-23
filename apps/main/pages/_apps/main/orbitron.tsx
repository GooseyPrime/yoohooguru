import React from 'react';
import styled from 'styled-components';
import OrbitronHero from '../../../components/orbitron/OrbitronHero';
import OrbitronFeatures from '../../../components/orbitron/OrbitronFeatures';
import OrbitronShowcase from '../../../components/orbitron/OrbitronShowcase';
import OrbitronCTA from '../../../components/orbitron/OrbitronCTA';
import OrbitronFooter from '../../../components/orbitron/OrbitronFooter';

const Container = styled.main`
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(135deg, #001408 0%, #040014 100%);
  color: white;
  min-height: 100vh;
`;

export default function OrbitronPage() {
  return (
    <Container>
      <OrbitronHero />
      <OrbitronFeatures />
      <OrbitronShowcase />
      <OrbitronCTA />
      <OrbitronFooter />
    </Container>
  );
}