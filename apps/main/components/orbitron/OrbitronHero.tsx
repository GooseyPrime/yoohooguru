import React from 'react';

interface OrbitronHeroProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const OrbitronHero: React.FC<OrbitronHeroProps> = ({
  title,
  subtitle,
  children,
  className = '',
}) => {
  return (
    <section className={`relative py-20 md:py-32 overflow-hidden ${className}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          <span className="gradient-text-emerald-blue">
            {title}
          </span>
        </h1>

        {subtitle && (
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto animate-slide-up">
            {subtitle}
          </p>
        )}

        {children && (
          <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
};
