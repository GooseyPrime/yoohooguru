import React from 'react';
import Navigation from '../../../components/ui/Navigation';
import Seo from '../../../components/Seo';

export default function Skills() {
  return (
    <>
      <Seo
        title="Skills - History Guru - YooHoo.Guru"
        description="Explore skills and courses available on History Guru. Start learning today."
        url="https://history.yoohoo.guru/skills"
        image="https://history.yoohoo.guru/assets/og-skills.jpg"
      />

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                Skills & Courses
                <span className="block gradient-text-emerald-blue mt-2">on History Guru</span>
              </h1>
              <p className="text-xl text-white-80 leading-relaxed">
                Discover a wide range of skills and courses to help you achieve your goals.
              </p>
            </div>
          </div>
        </section>

        {/* Skills Grid - Placeholder */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center text-white-60">
              <p className="text-lg">Skills directory coming soon...</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
