import React from 'react';
import OrbitronHero from '@/components/orbitron/OrbitronHero';
import OrbitronFeatures from '@/components/orbitron/OrbitronFeatures';
import OrbitronShowcase from '@/components/orbitron/OrbitronShowcase';
import OrbitronCTA from '@/components/orbitron/OrbitronCTA';
import OrbitronFooter from '@/components/orbitron/OrbitronFooter';

export default function OrbitronPage() {
  return (
    <main className="font-orbitron bg-gradient-to-br from-primarydark to-secondarydark text-white min-h-screen">
      <OrbitronHero />
      <OrbitronFeatures />
      <OrbitronShowcase />
      <OrbitronCTA />
      <OrbitronFooter />
    </main>
  );
}