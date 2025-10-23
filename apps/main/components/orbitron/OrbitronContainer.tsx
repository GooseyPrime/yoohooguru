import React from 'react';

interface OrbitronContainerProps {
  children: React.ReactNode;
  gradient?: 'primary' | 'secondary' | 'none';
  className?: string;
}

export const OrbitronContainer: React.FC<OrbitronContainerProps> = ({
  children,
  gradient = 'none',
  className = '',
}) => {
  const gradientClasses = {
    primary: 'bg-gradient-to-br from-primarydark via-gray-900 to-secondarydark',
    secondary: 'bg-gradient-to-br from-secondarydark via-gray-900 to-primarydark',
    none: '',
  };

  const classes = `min-h-screen ${gradientClasses[gradient]} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
