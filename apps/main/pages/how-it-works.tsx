import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../components/ui/Navigation';

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Sign up and tell us about your skills or what you want to learn. Our AI assistant helps you create a compelling profile.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      number: "02",
      title: "Find Your Match",
      description: "Browse experts or get AI-powered recommendations based on your learning style, goals, and preferences.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      number: "03",
      title: "Book & Connect",
      description: "Schedule sessions at times that work for you. Connect via video chat, in-person, or through our messaging system.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      number: "04",
      title: "Learn & Grow",
      description: "Engage in personalized learning sessions. Track your progress, leave reviews, and build lasting connections.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  const platforms = [
    {
      name: "Coach Guru",
      description: "Professional skill coaching with verified experts",
      features: ["1-on-1 sessions", "Flexible scheduling", "Secure payments", "Expert verification"],
      color: "emerald"
    },
    {
      name: "Angel's List",
      description: "Local services and community marketplace",
      features: ["Local providers", "Service variety", "Trusted reviews", "Fair pricing"],
      color: "blue"
    },
    {
      name: "Hero Gurus",
      description: "Free accessible learning for people with disabilities",
      features: ["100% Free", "Adaptive methods", "Volunteer heroes", "Inclusive community"],
      color: "purple"
    }
  ];

  return (
    <>
      <Head>
        <title>How It Works - YooHoo.Guru</title>
        <meta name="description" content="Learn how YooHoo.Guru connects learners with experts through our simple 4-step process." />
      </Head>

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              How <span className="gradient-text-emerald-blue">YooHoo.Guru</span> Works
            </h1>
            <p className="text-xl text-white-80 max-w-3xl mx-auto">
              Getting started is easy. Follow these simple steps to begin your learning journey or start sharing your expertise.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
                >
                  <div className="flex-1">
                    <div className="glass-card p-8 rounded-2xl hover-lift">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center text-emerald-400">
                          {step.icon}
                        </div>
                        <div className="text-6xl font-bold text-white-10">{step.number}</div>
                      </div>
                      <h3 className="text-2xl font-display font-bold text-white mb-4">{step.title}</h3>
                      <p className="text-lg text-white-80 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 glass-effect flex items-center justify-center">
                      <div className="text-8xl">{['👤', '🔍', '📅', '🚀'][index]}</div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-bold text-white mb-6">
                Three Ways to Connect
              </h2>
              <p className="text-xl text-white-80 max-w-3xl mx-auto">
                Choose the platform that best fits your needs and goals.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {platforms.map((platform, index) => (
                <div key={index} className="glass-card p-8 rounded-2xl hover-lift">
                  <h3 className={`text-2xl font-display font-bold mb-4 gradient-text-${platform.color}`}>
                    {platform.name}
                  </h3>
                  <p className="text-white-80 mb-6">{platform.description}</p>
                  <ul className="space-y-3">
                    {platform.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white-80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom text-center">
            <div className="glass-card p-12 rounded-3xl max-w-4xl mx-auto">
              <h2 className="text-4xl font-display font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white-80 mb-8">
                Join thousands of learners and experts already using YooHoo.Guru
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-glow-emerald-lg hover:-translate-y-1"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/pricing"
                  className="w-full sm:w-auto px-8 py-4 glass-button text-white text-lg font-semibold rounded-xl hover:bg-white-20 transition-all duration-300"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}