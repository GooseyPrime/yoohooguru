import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primarydark via-secondarydark to-tertiarydark" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center">
        {/* Announcement Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 glass-effect rounded-full mb-8 animate-fade-in">
          <span className="text-2xl">🎉</span>
          <span className="text-sm font-medium text-white-80">
            Join 10,000+ members sharing skills and building community
          </span>
          <span className="text-2xl">🎉</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fade-in-up">
          <span className="block text-white mb-2">Share Skills.</span>
          <span className="block gradient-text-emerald-blue">Build Community.</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-white-80 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Connect with local experts, exchange knowledge, and create meaningful impact through our trusted skill-sharing platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-glow-emerald-lg hover:-translate-y-1 flex items-center justify-center space-x-2"
          >
            <span>Get Started Free</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="#explore"
            className="w-full sm:w-auto px-8 py-4 glass-button text-white text-lg font-semibold rounded-xl hover:bg-white-20 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Explore Platform</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text-emerald mb-2">10K+</div>
            <div className="text-sm md:text-base text-white-60 font-medium">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text-blue mb-2">500+</div>
            <div className="text-sm md:text-base text-white-60 font-medium">Skills Shared</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text-purple mb-2">98%</div>
            <div className="text-sm md:text-base text-white-60 font-medium">Satisfaction</div>
          </div>
        </div>

        {/* Video Preview */}
        <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <button className="group relative inline-flex items-center space-x-3 px-6 py-3 glass-effect rounded-full hover:glass-effect-strong transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-white">Watch How It Works</div>
              <div className="text-xs text-white-60">2-minute platform overview</div>
            </div>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}