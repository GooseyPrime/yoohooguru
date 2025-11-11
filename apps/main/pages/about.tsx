import React from 'react';
import Head from 'next/head';
import Navigation from '../components/ui/Navigation';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - YooHoo.Guru</title>
        <meta name="description" content="Learn about YooHoo.Guru's mission to build community through skill sharing." />
      </Head>

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                Building Community Through
                <span className="block gradient-text-emerald-blue mt-2">Skill Sharing</span>
              </h1>
              <p className="text-xl text-white-80 leading-relaxed">
                YooHoo.Guru is more than a platform—it's a movement to democratize knowledge, empower communities, and create meaningful connections through the exchange of skills and expertise.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-display font-bold text-white mb-6">Our Mission</h2>
                <p className="text-lg text-white-80 leading-relaxed mb-6">
                  We believe that everyone has valuable skills to share and knowledge to gain. Our mission is to create a trusted, accessible platform where people can connect, learn, and grow together.
                </p>
                <p className="text-lg text-white-80 leading-relaxed">
                  Whether you're a professional looking to share your expertise, someone seeking to learn new skills, or a volunteer wanting to make a difference, YooHoo.Guru provides the tools and community to make it happen.
                </p>
              </div>
              <div className="glass-card p-8 rounded-2xl">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Community First</h3>
                      <p className="text-white-80">Building meaningful connections through shared learning experiences.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Trust & Safety</h3>
                      <p className="text-white-80">Verified profiles, secure payments, and comprehensive safety measures.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Accessibility</h3>
                      <p className="text-white-80">Free learning opportunities for people with disabilities through Hero Gurus.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="glass-card p-12 rounded-3xl">
              <h2 className="text-3xl font-display font-bold text-white text-center mb-12">Our Impact</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text-emerald mb-2">10,000+</div>
                  <div className="text-white-60">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text-blue mb-2">500+</div>
                  <div className="text-white-60">Expert Instructors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text-purple mb-2">25,000+</div>
                  <div className="text-white-60">Sessions Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text-gold mb-2">98%</div>
                  <div className="text-white-60">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom text-center">
            <h2 className="text-4xl font-display font-bold text-white mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-white-80 max-w-2xl mx-auto mb-8">
              Start your journey today and become part of a growing community of learners and teachers.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-glow-emerald-lg hover:-translate-y-1"
            >
              <span>Get Started Free</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </section>
      </main>
    </>
  );
}