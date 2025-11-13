import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../components/ui/Navigation';

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'account', name: 'Account & Profile', icon: '👤' },
    { id: 'payments', name: 'Payments & Billing', icon: '💳' },
    { id: 'sessions', name: 'Sessions & Booking', icon: '📅' },
    { id: 'safety', name: 'Safety & Trust', icon: '🛡️' },
    { id: 'technical', name: 'Technical Support', icon: '🔧' },
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I get started on YooHoo.Guru?',
      answer: 'Getting started is easy! Simply sign up for a free account, choose whether you want to be a Gunu (learner), Guru (teacher), Angel (service provider), or Hero (volunteer). Complete your profile, and you can start browsing experts or offering your own services immediately.'
    },
    {
      category: 'getting-started',
      question: 'What are the different user types?',
      answer: 'YooHoo.Guru has four user types: 1) Gunu - Learners who want to acquire new skills, 2) Guru - Experts who teach and share knowledge, 3) Angel - Service providers offering local services, 4) Hero - Volunteers providing free accessible learning for people with disabilities.'
    },
    {
      category: 'account',
      question: 'How do I update my profile?',
      answer: 'Go to your dashboard and click on "Profile Settings". You can update your photo, bio, skills, availability, rates, and other information. Make sure to save your changes before leaving the page.'
    },
    {
      category: 'account',
      question: 'Can I have multiple roles?',
      answer: 'Yes! You can be both a learner and a teacher on the platform. Many of our members teach in some areas while learning in others. Simply switch between roles in your dashboard.'
    },
    {
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'Go to Settings > Account > Delete Account. Please note that this action is permanent and cannot be undone. All your data will be removed from our system.'
    },
    {
      category: 'payments',
      question: 'How do payments work?',
      answer: 'All payments are processed securely through Stripe. Learners pay upfront when booking sessions. For Coach Guru, we take a 15% commission. For Angel\'s List, the commission is 10-15%. Funds are released to Gurus/Angels after successful session completion.'
    },
    {
      category: 'payments',
      question: 'When do I get paid?',
      answer: 'Payments are released to your account 24 hours after a session is completed. You can withdraw your earnings at any time through your dashboard. Minimum withdrawal amount is $20.'
    },
    {
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and digital wallets through Stripe. All transactions are secure and encrypted.'
    },
    {
      category: 'payments',
      question: 'What is your refund policy?',
      answer: 'If you\'re not satisfied with a session, you can request a refund within 24 hours. Each case is reviewed individually to ensure fairness for both parties. Refunds are typically processed within 5-7 business days.'
    },
    {
      category: 'sessions',
      question: 'How do I book a session?',
      answer: 'Browse experts in your area of interest, view their profiles, and click "Book Session". Choose a time that works for you, complete the payment, and you\'ll receive a confirmation email with session details.'
    },
    {
      category: 'sessions',
      question: 'Can I reschedule or cancel a session?',
      answer: 'Yes, you can reschedule or cancel up to 24 hours before the session start time without penalty. Cancellations within 24 hours may incur a fee. Go to your dashboard to manage your bookings.'
    },
    {
      category: 'sessions',
      question: 'What if my Guru doesn\'t show up?',
      answer: 'If a Guru doesn\'t show up for a scheduled session, you will receive a full refund automatically. The Guru may also face penalties on their account. Contact support if you experience any issues.'
    },
    {
      category: 'sessions',
      question: 'How does video conferencing work?',
      answer: 'We use Agora for high-quality video sessions. No downloads required - everything works in your browser. You\'ll receive a session link via email. Just click to join at the scheduled time.'
    },
    {
      category: 'safety',
      question: 'How do you verify Gurus and Angels?',
      answer: 'All Gurus and Angels go through a verification process including identity verification, background checks (where applicable), and skill validation. Verified profiles display a badge.'
    },
    {
      category: 'safety',
      question: 'What if I have a problem with a Guru or Angel?',
      answer: 'You can report any issues through your dashboard or contact support@yoohoo.guru. We take all reports seriously and investigate promptly. You can also leave reviews to help other users.'
    },
    {
      category: 'safety',
      question: 'Is my personal information safe?',
      answer: 'Yes, we take privacy seriously. All data is encrypted, and we never share your personal information with third parties without your consent. Read our Privacy Policy for full details.'
    },
    {
      category: 'technical',
      question: 'What browsers are supported?',
      answer: 'YooHoo.Guru works best on the latest versions of Chrome, Firefox, Safari, and Edge. For video sessions, we recommend Chrome or Firefox for the best experience.'
    },
    {
      category: 'technical',
      question: 'I\'m having video quality issues. What should I do?',
      answer: 'Check your internet connection (we recommend at least 5 Mbps). Close other applications using bandwidth. Try refreshing your browser. If issues persist, contact technical support.'
    },
    {
      category: 'technical',
      question: 'The site isn\'t loading properly. Help!',
      answer: 'Try clearing your browser cache and cookies, disable browser extensions temporarily, or try a different browser. If the problem persists, contact support@yoohoo.guru with details about your browser and device.'
    },
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const searchedFaqs = searchQuery
    ? filteredFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredFaqs;

  return (
    <>
      <Head>
        <title>Help Center - YooHoo.Guru</title>
        <meta name="description" content="Find answers to common questions about YooHoo.Guru" />
      </Head>

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              How Can We <span className="gradient-text-emerald-blue">Help?</span>
            </h1>
            <p className="text-xl text-white-80 max-w-3xl mx-auto mb-8">
              Search our knowledge base or browse by category
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-premium w-full pl-12"
                />
                <svg className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-white-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="pb-12">
          <div className="container-custom">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-glow-emerald'
                      : 'glass-button text-white-80 hover:bg-white-20'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto space-y-4">
              {searchedFaqs.length > 0 ? (
                searchedFaqs.map((faq, index) => (
                  <details key={index} className="glass-card p-6 rounded-xl group">
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-bold text-white pr-8 group-open:text-emerald-400 transition-colors">
                          {faq.question}
                        </h3>
                        <svg className="w-6 h-6 text-white-60 flex-shrink-0 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-white-10">
                      <p className="text-white-80 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                  <p className="text-white-60">Try different keywords or browse by category</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="glass-card p-12 rounded-3xl text-center max-w-3xl mx-auto">
              <div className="text-5xl mb-6">💬</div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">
                Still Need Help?
              </h2>
              <p className="text-white-80 mb-8">
                Can&apos;t find what you&apos;re looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300"
                >
                  Contact Support
                </a>
                <a
                  href="mailto:support@yoohoo.guru"
                  className="px-8 py-4 glass-button text-white font-semibold rounded-xl hover:bg-white-20 transition-all duration-300"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}