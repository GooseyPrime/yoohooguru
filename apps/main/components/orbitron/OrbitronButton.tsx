import React from 'react';
import Link from 'next/link';

interface OrbitronButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'emerald' | 'blue' | 'gradient' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const OrbitronButton: React.FC<OrbitronButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'gradient',
  size = 'md',
  className = '',
  type = 'button',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    emerald: 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-glow-emerald hover:shadow-glow-emerald-lg',
    blue: 'bg-blue-500 hover:bg-blue-400 text-white shadow-glow-blue hover:shadow-glow-blue-lg',
    gradient: 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white shadow-lg hover:shadow-glow-emerald-lg',
    ghost: 'glass-effect hover:glass-effect-strong text-gray-300 hover:text-white border border-white/20 hover:border-white/30',
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
};
