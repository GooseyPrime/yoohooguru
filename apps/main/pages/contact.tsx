export const dynamic = "force-dynamic";
import React, { useState } from 'react';
import Seo from '../components/Seo';
import Link from 'next/link';
import Navigation from '../components/ui/Navigation';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Thank you for contacting us! We\'ll get back to you within 24 hours.',
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: 'general',
          message: ''
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@yoohoo.guru',
      link: 'mailto:support@yoohoo.guru',
      responseTime: 'Response within 24 hours'
    },
    {
      icon: '🛡️',
      title: 'Safety Team',
      description: 'Report safety concerns',
      contact: 'safety@yoohoo.guru',
      link: 'mailto:safety@yoohoo.guru',
      responseTime: 'Priority response'
    },
    {
      icon: '💼',
      title: 'Business Inquiries',
      description: 'Partnerships & press',
      contact: 'business@yoohoo.guru',
      link: 'mailto:business@yoohoo.guru',
      responseTime: 'Response within 48 hours'
    }
  ];

  const offices = [
    {
      city: 'San Francisco',
      address: '123 Market Street, Suite 400',
      state: 'CA 94103',
      country: 'United States'
    },
    {
      city: 'New York',
      address: '456 Broadway, Floor 12',
      state: 'NY 10013',
      country: 'United States'
    },
    {
      city: 'Austin',
      address: '789 Congress Avenue',
      state: 'TX 78701',
      country: 'United States'
    }
  ];

  return (
    <>
      <Seo
        title="Contact Us - YooHoo.Guru"
        description="Get in touch with YooHoo.Guru. We're here to help with questions about our platform, partnerships, or support."
        url="https://www.yoohoo.guru/contact"
        image="https://www.yoohoo.guru/assets/og-contact.jpg"
      />

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              Get in <span className="gradient-text-emerald-blue">Touch</span>
            </h1>
            <p className="text-xl text-white-80 max-w-3xl mx-auto">
              Have a question, suggestion, or need help? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="pb-20">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.link}
                  className="glass-card p-8 rounded-2xl hover-lift text-center"
                >
                  <div className="text-5xl mb-4">{method.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                  <p className="text-white-60 text-sm mb-4">{method.description}</p>
                  <p className="text-emerald-400 font-semibold mb-2">{method.contact}</p>
                  <p className="text-xs text-white-60">{method.responseTime}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-display font-bold text-white mb-4">
                  Send Us a Message
                </h2>
                <p className="text-white-80">
                  Fill out the form below and we&apos;ll get back to you as soon as possible
                </p>
              </div>

              <div className="glass-card p-8 md:p-12 rounded-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Status Message */}
                  {submitStatus.type && (
                    <div
                      className={`p-4 rounded-lg ${
                        submitStatus.type === 'success'
                          ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                          : 'bg-red-500/20 border border-red-500/50 text-red-400'
                      }`}
                      role="alert"
                    >
                      <p className="text-sm">{submitStatus.message}</p>
                    </div>
                  )}
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-premium w-full"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-premium w-full"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-premium w-full"
                      required
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="safety">Safety & Trust</option>
                      <option value="partnership">Partnership</option>
                      <option value="press">Press & Media</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="input-premium w-full"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input-premium w-full min-h-[150px] resize-y"
                      placeholder="Tell us more about your inquiry..."
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-glow-emerald"
                        aria-busy={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold text-white mb-4">
                Our Offices
              </h2>
              <p className="text-white-80">
                Visit us at one of our locations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {offices.map((office, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl text-center">
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-bold text-white mb-4">{office.city}</h3>
                  <div className="text-white-80 space-y-1">
                    <p>{office.address}</p>
                    <p>{office.state}</p>
                    <p>{office.country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Link */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom text-center">
            <div className="glass-card p-12 rounded-3xl max-w-3xl mx-auto">
              <div className="text-5xl mb-6">❓</div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">
                Looking for Quick Answers?
              </h2>
              <p className="text-white-80 mb-8">
                Check out our Help Center for answers to common questions
              </p>
              <Link
                href="/help"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300"
              >
                <span>Visit Help Center</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}