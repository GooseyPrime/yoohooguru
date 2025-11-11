import React from 'react';
import Image from 'next/image';
import { Button } from './Button';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'hover' | 'featured' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  gradient?: 'emerald' | 'blue' | 'purple' | 'none';
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hover = false,
  gradient = 'none',
  icon,
  title,
  subtitle,
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300';
  
  const variantClasses = {
    default: 'card-default',
    hover: 'card-hover',
    featured: 'card-featured',
    glass: 'glass-effect-strong border border-white/20',
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const gradientClasses = {
    emerald: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/20',
    blue: 'bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20',
    purple: 'bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20',
    none: '',
  };

  const hoverClasses = hover ? 'hover-lift cursor-pointer' : '';
  const gradientBorderClass = gradient !== 'none' ? 'border-opacity-30' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${gradientClasses[gradient]} ${hoverClasses} ${gradientBorderClass} ${className}`;

  return (
    <div className={classes} onClick={onClick}>
      {(icon || title || subtitle) && (
        <div className="mb-4">
          {icon && (
            <div className="mb-3 text-emerald-400">
              {icon}
            </div>
          )}
          {title && (
            <h3 className="heading-3 mb-2">{title}</h3>
          )}
          {subtitle && (
            <p className="body-normal text-gray-400">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  href: string;
  variant?: 'default' | 'featured';
  stats?: { label: string; value: string }[];
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  features,
  href,
  variant = 'default',
  stats,
}) => {
  return (
    <Card variant={variant === 'featured' ? 'featured' : 'hover'} className="group">
      <div className="w-16 h-16 mb-4 text-emerald-400 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="heading-3 mb-3 group-hover:text-emerald-400 transition-colors">
        {title}
      </h3>
      <p className="body-normal mb-4">{description}</p>
      
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-gray-300">
            <span className="w-5 h-5 text-emerald-400 mr-2 mt-0.5 flex-shrink-0">✓</span>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button href={href} variant="ghost" size="md" className="w-full group-hover:gradient-text-emerald-blue">
        Explore {title} →
      </Button>
    </Card>
  );
};

interface ExpertCardProps {
  name: string;
  title: string;
  description: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  avatar?: string;
  skills: string[];
  href: string;
  available?: boolean;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({
  name,
  title,
  description,
  rating,
  reviews,
  hourlyRate,
  avatar,
  skills,
  href,
  available = true,
}) => {
  return (
    <Card variant="hover" className="text-left">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {avatar ? (
            <Image src={avatar} alt={name} width={64} height={64} className="w-full h-full rounded-full object-cover" />
          ) : (
            name.split(' ').map(n => n[0]).join('')
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            {available ? (
              <span className="badge-success">Available</span>
            ) : (
              <span className="badge-warning">Busy</span>
            )}
          </div>
          
          <p className="text-emerald-400 text-sm font-medium mb-2">{title}</p>
          <p className="body-small text-gray-400 mb-3 line-clamp-2">{description}</p>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="text-sm font-medium">{rating}</span>
              <span className="text-xs text-gray-500 ml-1">({reviews})</span>
            </div>
            <div className="text-sm font-medium text-emerald-400">
              ${hourlyRate}/hr
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded-full">
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded-full">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
      
      <Button href={href} variant="ghost" size="sm" className="w-full">
        View Profile →
      </Button>
    </Card>
  );
};

export default Card;