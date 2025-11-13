import React from 'react';
import Head from 'next/head';
import Navigation from '../../../components/ui/Navigation';
import { NewsSection } from '../../../components/NewsSection';
import { BlogList } from '../../../components/BlogList';

export default function CookingHome() {
  return (
    <>
      <Head>
        <title>Cooking Guru - YooHoo.Guru</title>
        <meta name="description" content="Learn culinary arts from professional chefs and passionate home cooks." />
      </Head>

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500/20 via-primarydark to-from-orange-500 to-red-500/20" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-500 to-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>

          {/* Content */}
          <div className="relative z-10 container-custom text-center">
            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500/20 to-from-orange-500 to-red-500/20 flex items-center justify-center text-6xl glass-card hover-lift animate-fade-in">
              🍳
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 animate-fade-in-up">
              Cooking <span className="gradient-text-orange">Guru</span>
            </h1>
            <p className="text-xl md:text-2xl text-white-80 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Learn culinary arts from professional chefs and passionate home cooks.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <a
                href="/signup?type=gunu"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-semibold rounded-xl hover:from-orange-600 hover:to-500 to-600 transition-all duration-300 shadow-lg hover:shadow-glow-orange-lg hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <span>Start Learning Cooking</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/signup?type=guru"
                className="w-full sm:w-auto px-8 py-4 glass-button text-white text-lg font-semibold rounded-xl hover:bg-white-20 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Become a Cooking Guru</span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text-orange mb-2">156</div>
                <div className="text-sm md:text-base text-white-60 font-medium">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text-500 to mb-2">250+</div>
                <div className="text-sm md:text-base text-white-60 font-medium">Cooking Gurus</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text-orange mb-2">4K+</div>
                <div className="text-sm md:text-base text-white-60 font-medium">Students</div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="section-padding">
          <div className="container-custom">
            <NewsSection subdomain="cooking" limit={5} />
            <div className="mt-16">
              <BlogList subdomain="cooking" limit={6} showExcerpts={true} />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom text-center">
            <div className="glass-card p-12 rounded-3xl max-w-4xl mx-auto">
              <div className="text-5xl mb-6">🍳</div>
              <h2 className="text-4xl font-display font-bold text-white mb-6">
                Ready to Start Your Cooking Journey?
              </h2>
              <p className="text-xl text-white-80 mb-8">
                Join thousands of cooking enthusiasts learning and teaching on YooHoo.Guru
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/signup?type=gunu"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-semibold rounded-xl hover:from-orange-600 hover:to-500 to-600 transition-all duration-300 shadow-lg hover:shadow-glow-orange-lg hover:-translate-y-1"
                >
                  Start Learning Cooking
                </a>
                <a
                  href="/signup?type=guru"
                  className="w-full sm:w-auto px-8 py-4 glass-button text-white text-lg font-semibold rounded-xl hover:bg-white-20 transition-all duration-300"
                >
                  Become a Cooking Guru
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>;
  );
}
