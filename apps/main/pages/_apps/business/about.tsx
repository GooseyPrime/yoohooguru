import React from 'react';
import Navigation from '../../../components/ui/Navigation';
import Seo from '../../../components/Seo';

export default function About() {{
  return (
    <>
      <Seo
        title="About Business Guru - YooHoo.Guru"
        description="Learn about Business Guru, Master Business Skills. Learn business strategies, entrepreneurship, and professional development."
        url="https://business.yoohoo.guru/about"
        image="https://business.yoohoo.guru/assets/og-about.jpg"
      />

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                About
                <span className="block gradient-text-emerald-blue mt-2">Business Guru</span>
              </h1>
              <p className="text-xl text-white-80 leading-relaxed">
                Learn business strategies, entrepreneurship, and professional development.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-display font-bold text-white mb-6">Our Mission</h2>
              <p className="text-lg text-white-80 leading-relaxed mb-6">
                Business Guru is part of the YooHoo.Guru ecosystem, dedicated to connecting learners with expert teachers and service providers. Our mission is to make quality education and services accessible to everyone.
              </p>
              <p className="text-lg text-white-80 leading-relaxed">
                Whether you're looking to learn new skills, share your expertise, or find trusted service providers, Business Guru provides the platform and community to make it happen.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}}
