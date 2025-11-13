import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../components/ui/Navigation';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          q: 'What is YooHoo.Guru?',
          a: 'YooHoo.Guru is a comprehensive skill-sharing platform that connects learners with experts across three main services: Coach Guru (professional coaching), Angel\'s List (local services), and Hero Gurus (free accessible learning for people with disabilities).'
        },
        {
          q: 'Is YooHoo.Guru free to use?',
          a: 'Creating an account and browsing is completely free. Learners pay for sessions they book. Teachers and service providers pay a small commission (10-15%) on completed transactions. Hero Gurus is 100% free for everyone.'
        },
        {
          q: 'How do I get started?',
          a: 'Simply sign up for a free account, choose your user type (Gunu, Guru, Angel, or Hero), complete your profile, and start browsing or offering services immediately.'
        }
      ]
    },
    {
      category: 'For Learners',
      questions: [
        {
          q: 'How do I find the right Guru?',
          a: 'Use our search and filter tools to browse by skill, rating, price, and availability. Our AI-powered recommendation system can also suggest Gurus based on your learning style and goals.'
        },
        {
          q: 'How do I book a session?',
          a: 'Once you find a Guru you like, click "Book Session", choose a time slot, complete payment, and you\'ll receive a confirmation email with session details.'
        },
        {
          q: 'Can I get a refund?',
          a: 'Yes, if you\'re not satisfied with a session, you can request a refund within 24 hours. Each case is reviewed to ensure fairness for both parties.'
        },
        {
          q: 'What if I need to reschedule?',
          a: 'You can reschedule up to 24 hours before the session without penalty through your dashboard.'
        }
      ]
    },
    {
      category: 'For Teachers (Gurus)',
      questions: [
        {
          q: 'How much can I earn?',
          a: 'You set your own rates! After our 15% commission, you keep 85% of your earnings. Top Gurus earn $50-150+ per hour depending on their expertise and demand.'
        },
        {
          q: 'How do I get paid?',
          a: 'Payments are released to your account 24 hours after session completion. You can withdraw anytime with a minimum of $20.'
        },
        {
          q: 'Do I need any qualifications?',
          a: 'While formal qualifications help, what matters most is your expertise and ability to teach. We verify all Gurus through our review process.'
        },
        {
          q: 'How do I set my availability?',
          a: 'Use your dashboard calendar to set your available time slots. You have full control over your schedule.'
        }
      ]
    },
    {
      category: 'For Service Providers (Angels)',
      questions: [
        {
          q: 'What services can I offer?',
          a: 'Any legal local service! Popular categories include home repair, tutoring, pet care, event planning, personal training, and more.'
        },
        {
          q: 'What is the commission rate?',
          a: 'Angel\'s List charges 10-15% commission depending on the service category. You keep 85-90% of your earnings.'
        },
        {
          q: 'Do I need insurance?',
          a: 'We recommend appropriate insurance for your services. Some categories may require proof of insurance and licenses.'
        },
        {
          q: 'How do I handle disputes?',
          a: 'Contact our support team immediately. We have a fair dispute resolution process to protect both parties.'
        }
      ]
    },
    {
      category: 'Payments & Billing',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, debit cards, and digital wallets through our secure Stripe integration.'
        },
        {
          q: 'Are my payment details secure?',
          a: 'Yes! All payments are processed through Stripe with bank-level encryption. We never store your full payment information.'
        },
        {
          q: 'When will I be charged?',
          a: 'Learners are charged when booking a session. The payment is held and released to the Guru/Angel after successful completion.'
        },
        {
          q: 'Can I use multiple payment methods?',
          a: 'Currently, each transaction uses one payment method, but you can save multiple cards in your account.'
        }
      ]
    },
    {
      category: 'Technical',
      questions: [
        {
          q: 'What do I need for video sessions?',
          a: 'A device with a camera and microphone, stable internet (5+ Mbps recommended), and a modern web browser. No downloads required!'
        },
        {
          q: 'Which browsers are supported?',
          a: 'We support the latest versions of Chrome, Firefox, Safari, and Edge. Chrome and Firefox work best for video sessions.'
        },
        {
          q: 'Can I use the platform on mobile?',
          a: 'Yes! Our platform is fully responsive and works on smartphones and tablets.'
        },
        {
          q: 'What if I have technical issues during a session?',
          a: 'Contact support immediately at support@yoohoo.guru or use the in-session help button. We\'ll assist you right away.'
        }
      ]
    }
  ];

  const filteredFaqs = searchQuery
    ? faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
          faq =>
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqs;

  return (
    <>
      <Head>
        <title>FAQ - YooHoo.Guru</title>
        <meta name="description" content="Frequently asked questions about YooHoo.Guru" />
      </Head>

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              Frequently Asked <span className="gradient-text-emerald-blue">Questions</span>
            </h1>
            <p className="text-xl text-white-80 max-w-3xl mx-auto mb-8">
              Find quick answers to common questions about YooHoo.Guru
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search FAQs..."
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

        {/* FAQ Categories */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto space-y-12">
              {filteredFaqs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-3xl font-display font-bold text-white mb-6">
                    {category.category}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => {
                      const globalIndex = categoryIndex * 100 + faqIndex;
                      const isOpen = openIndex === globalIndex;
                      
                      return (
                        <div key={faqIndex} className="glass-card rounded-xl overflow-hidden">
                          <button
                            onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                            className="w-full p-6 text-left flex items-start justify-between hover:bg-white-5 transition-colors"
                          >
                            <h3 className="text-lg font-bold text-white pr-8 flex-1">
                              {faq.q}
                            </h3>
                            <svg
                              className={`w-6 h-6 text-white-60 flex-shrink-0 transform transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-6 pt-0 border-t border-white-10">
                              <p className="text-white-80 leading-relaxed">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                <p className="text-white-60">Try different keywords or browse all categories</p>
              </div>
            )}
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="glass-card p-12 rounded-3xl text-center max-w-3xl mx-auto">
              <div className="text-5xl mb-6">💬</div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">
                Still Have Questions?
              </h2>
              <p className="text-white-80 mb-8">
                Can't find what you're looking for? We're here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/help"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300"
                >
                  Visit Help Center
                </a>
                <a
                  href="/contact"
                  className="px-8 py-4 glass-button text-white font-semibold rounded-xl hover:bg-white-20 transition-all duration-300"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}