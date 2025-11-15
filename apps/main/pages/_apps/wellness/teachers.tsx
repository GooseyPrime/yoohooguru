import React from 'react';
import Navigation from '../../../components/ui/Navigation';
import Seo from '../../../components/Seo';

export default function Teachers() {
  return (
    <>
      <Seo
        title="Teachers - Wellness Guru - YooHoo.Guru"
        description="Meet expert teachers and instructors on Wellness Guru. Learn from the best in the field."
        url="https://wellness.yoohoo.guru/teachers"
        image="https://wellness.yoohoo.guru/assets/og-teachers.jpg"
      />

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                Expert Teachers
                <span className="block gradient-text-emerald-blue mt-2">on Wellness Guru</span>
              </h1>
              <p className="text-xl text-white-80 leading-relaxed">
                Learn from experienced professionals who are passionate about sharing their knowledge.
              </p>
            </div>
          </div>
        </section>

        {/* Teachers Grid - Placeholder */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center text-white-60">
              <p className="text-lg">Teachers directory coming soon...</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
