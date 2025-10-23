import React from 'react';

interface OrbitronSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const OrbitronSection: React.FC<OrbitronSectionProps> = ({
  children,
  title,
  subtitle,
  className = '',
}) => {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="gradient-text-emerald-blue">{title}</span>
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};
