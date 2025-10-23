import React from 'react';
import { Header, Footer } from '@yoohooguru/shared';
import { OrbitronContainer, OrbitronHeroSimple } from './orbitron';

interface SubdomainLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  gradient?: 'primary' | 'secondary';
}

export const SubdomainLayout: React.FC<SubdomainLayoutProps> = ({
  title,
  subtitle,
  children,
  gradient = 'secondary',
}) => {
  return (
    <OrbitronContainer gradient={gradient}>
      <Header />

      <main>
        <OrbitronHeroSimple
          title={title}
          subtitle={subtitle}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </div>
      </main>

      <Footer />
    </OrbitronContainer>
  );
};
