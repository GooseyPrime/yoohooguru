import React from 'react';

interface OrbitronCardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'gradient';
  hover?: boolean;
  className?: string;
}

export const OrbitronCard: React.FC<OrbitronCardProps> = ({
  children,
  variant = 'glass',
  hover = true,
  className = '',
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300';

  const variantClasses = {
    glass: 'glass-effect',
    solid: 'bg-gray-900/80 border border-white/10',
    gradient: 'bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/20',
  };

  const hoverClasses = hover
    ? 'hover:scale-[1.02] hover:shadow-2xl hover:border-emerald-500/30'
    : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
