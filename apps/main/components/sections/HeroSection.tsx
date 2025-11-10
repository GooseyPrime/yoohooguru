import React from 'react';
import Button from '../ui/Button';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  backgroundImage?: string;
  variant?: 'main' | 'coach' | 'angel' | 'hero' | 'content';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Share Skills. Build Community.",
  subtitle = "Connect with local experts, exchange knowledge, and create meaningful impact through our trusted skill-sharing platform.",
  description,
  primaryCTA = { text: "Get Started Free →", href: "/signup" },
  secondaryCTA = { text: "Explore Platform", href: "/explore" },
  backgroundImage,
  variant = 'main',
}) => {
  const getVariantContent = () => {
    switch (variant) {
      case 'coach':
        return {
          title: "Share Your Expertise. Earn Income.",
          subtitle: "Join thousands of expert instructors teaching what they love. Set your own rates, schedule, and create impact.",
          primaryCTA: { text: "Become a Guru →", href: "/signup" },
          secondaryCTA: { text: "Find a Coach", href: "/skills" },
        };
      case 'angel':
        return {
          title: "Local Services. Trusted Community.",
          subtitle: "Find trusted local providers or offer your skills. Connect with your neighborhood for everyday tasks and specialized help.",
          primaryCTA: { text: "Post a Service →", href: "/signup" },
          secondaryCTA: { text: "Find Services", href: "/browse" },
        };
      case 'hero':
        return {
          title: "Learn for Free. Teach with Heart.",
          subtitle: "Accessible learning for everyone. Volunteer as a Hero or learn through adaptive teaching methods in our inclusive community.",
          primaryCTA: { text: "Start Learning →", href: "/learn" },
          secondaryCTA: { text: "Become a Hero", href: "/volunteer" },
        };
      case 'content':
        return {
          title: "Expert Knowledge. Curated Content.",
          subtitle: "Discover the latest insights, tutorials, and trends in your field. AI-curated content updated daily.",
          primaryCTA: { text: "Explore Articles →", href: "/articles" },
          secondaryCTA: { text: "Find Experts", href: "/experts" },
        };
      default:
        return { title, subtitle, primaryCTA, secondaryCTA };
    }
  };

  const content = getVariantContent();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primarydark via-gray-900 to-secondarydark" />
        
        {/* Placeholder for Hero Background Image */}
        {backgroundImage ? (
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ) : (
          <div className="absolute inset-0">
            {/* Animated Background Orbs - Simplified */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" />
          </div>
        )}

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-primarydark via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 py-20">
        <div className="animate-fade-in-up">
          {/* Main Heading */}
          <h1 className="heading-hero mb-6 gradient-text-emerald-blue">
            {content.title}
          </h1>

          {/* Subtitle */}
          <p className="body-large mb-8 max-w-4xl mx-auto">
            {content.subtitle}
          </p>

          {/* Additional Description */}
          {description && (
            <p className="body-normal mb-12 max-w-3xl mx-auto">
              {description}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="gradient" size="lg" href={content.primaryCTA.href}>
              {content.primaryCTA.text}
            </Button>
            <Button variant="ghost" size="lg" href={content.secondaryCTA.href}>
              {content.secondaryCTA.text}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">10K+</div>
              <div className="text-sm text-gray-400">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-sm text-gray-400">Skills Shared</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
              <div className="text-sm text-gray-400">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Placeholder for Visual Element */}
        <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="glass-card p-8 rounded-2xl max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium">Watch How It Works</p>
                <p className="text-sm text-gray-500 mt-1">2-minute platform overview</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;