import React from 'react';
import Link from 'next/link';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  href: string;
  stats: Array<{ label: string; value: string }>;
}

export function ServiceCard({ icon, title, description, features, href, stats }: ServiceCardProps) {
  return (
    <div className="group glass-card p-8 hover-lift">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:gradient-text-emerald-blue transition-all duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-white-80 leading-relaxed mb-6">
        {description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-white-10">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-xl font-bold text-emerald-400 mb-1">{stat.value}</div>
            <div className="text-xs text-white-60">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-white-80">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={href}
        className="block w-full py-3 text-center bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 text-emerald-400 font-semibold rounded-xl hover:from-emerald-500 hover:to-blue-500 hover:text-white transition-all duration-300 group-hover:shadow-glow-emerald"
      >
        Explore {title} →
      </Link>
    </div>
  );
}

interface ExpertCardProps {
  name: string;
  title: string;
  description: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  skills: string[];
  href: string;
  available?: boolean;
}

export function ExpertCard({
  name,
  title,
  description,
  rating,
  reviews,
  hourlyRate,
  skills,
  href,
  available = true,
}: ExpertCardProps) {
  // Generate initials for avatar
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="group glass-card p-6 hover-lift">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-display font-bold text-white truncate">{name}</h3>
            {available && (
              <span className="badge-success text-xs">Available</span>
            )}
          </div>
          <p className="text-sm text-white-60 mb-2">{title}</p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">★</span>
              <span className="text-white font-semibold">{rating}</span>
              <span className="text-white-60">({reviews})</span>
            </div>
            <div className="text-emerald-400 font-semibold">
              ${hourlyRate}/hr
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-white-80 leading-relaxed mb-4 line-clamp-2">
        {description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.slice(0, 4).map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs font-medium bg-white-10 text-white-80 rounded-full border border-white-10 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-300"
          >
            {skill}
          </span>
        ))}
        {skills.length > 4 && (
          <span className="px-3 py-1 text-xs font-medium text-white-60">
            +{skills.length - 4} more
          </span>
        )}
      </div>

      {/* CTA */}
      <Link
        href={href}
        className="block w-full py-2.5 text-center text-sm font-semibold text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10 transition-all duration-300"
      >
        View Profile →
      </Link>
    </div>
  );
}

interface ContentHubCardProps {
  icon: string;
  title: string;
  articleCount: number;
  href: string;
  gradient: string;
}

export function ContentHubCard({ icon, title, articleCount, href, gradient }: ContentHubCardProps) {
  return (
    <Link href={href} className="group block">
      <div className={`glass-card p-6 hover-lift ${gradient}`}>
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:gradient-text-emerald-blue transition-all duration-300">
          {title}
        </h3>
        <p className="text-sm text-white-60">
          {articleCount} articles
        </p>
      </div>
    </Link>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="card-feature group">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-display font-bold text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-white-80 leading-relaxed">
        {description}
      </p>
    </div>
  );
}