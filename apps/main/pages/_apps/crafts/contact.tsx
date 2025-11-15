import React from 'react';
import Navigation from '../../../components/ui/Navigation';
import Seo from '../../../components/Seo';

export default function Contact() {{
  return (
    <>
      <Seo
        title="Contact Crafts Guru - YooHoo.Guru"
        description="Get in touch with Crafts Guru. We're here to help with questions and support."
        url="https://crafts.yoohoo.guru/contact"
        image="https://crafts.yoohoo.guru/assets/og-contact.jpg"
      />

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                Contact
                <span className="block gradient-text-emerald-blue mt-2">Crafts Guru</span>
              </h1>
              <p className="text-xl text-white-80 leading-relaxed">
                Have questions? We're here to help. Reach out to our team for support.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto glass-card p-8 rounded-2xl">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 rounded-lg bg-primarydark/50 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-white mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 rounded-lg bg-primarydark/50 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-white mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={{6}}
                    className="w-full px-4 py-3 rounded-lg bg-primarydark/50 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold hover:shadow-lg transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}}
