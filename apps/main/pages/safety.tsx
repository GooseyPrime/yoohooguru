import React from 'react';
import Head from 'next/head';
import Navigation from '../components/ui/Navigation';

export default function Safety() {
  const safetyFeatures = [
    {
      icon: '✓',
      title: 'Identity Verification',
      description: 'All Gurus and Angels must verify their identity through government-issued ID and additional documentation.'
    },
    {
      icon: '🔍',
      title: 'Background Checks',
      description: 'We conduct comprehensive background checks on all service providers to ensure community safety.'
    },
    {
      icon: '⭐',
      title: 'Review System',
      description: 'Transparent rating and review system helps you make informed decisions about who to work with.'
    },
    {
      icon: '💳',
      title: 'Secure Payments',
      description: 'All transactions processed through Stripe with bank-level encryption and fraud protection.'
    },
    {
      icon: '🔒',
      title: 'Data Privacy',
      description: 'Your personal information is encrypted and never shared without your explicit consent.'
    },
    {
      icon: '📞',
      title: '24/7 Support',
      description: 'Our safety team is available around the clock to address concerns and resolve issues.'
    }
  ];

  const guidelines = [
    {
      title: 'For Learners (Gunus)',
      tips: [
        'Review Guru profiles, ratings, and reviews before booking',
        'Start with shorter sessions to test compatibility',
        'Keep all communication on the platform',
        'Report any inappropriate behavior immediately',
        'Never share personal financial information',
        'Trust your instincts - if something feels wrong, it probably is'
      ]
    },
    {
      title: 'For Teachers (Gurus)',
      tips: [
        'Maintain professional boundaries at all times',
        'Keep detailed records of sessions and communications',
        'Be clear about your expertise and limitations',
        'Respond promptly to learner questions and concerns',
        'Report any suspicious activity or requests',
        'Follow our community guidelines and code of conduct'
      ]
    },
    {
      title: 'For Service Providers (Angels)',
      tips: [
        'Accurately represent your services and qualifications',
        'Provide clear pricing and service descriptions',
        'Communicate availability and response times',
        'Document all work and agreements',
        'Respect client privacy and property',
        'Maintain appropriate insurance and licenses'
      ]
    }
  ];

  const reportingSteps = [
    {
      step: '1',
      title: 'Document the Issue',
      description: 'Take screenshots, save messages, and note dates/times of incidents.'
    },
    {
      step: '2',
      title: 'Report Immediately',
      description: 'Use the "Report" button on profiles or contact support@yoohoo.guru.'
    },
    {
      step: '3',
      title: 'Provide Details',
      description: 'Include all relevant information to help us investigate thoroughly.'
    },
    {
      step: '4',
      title: 'We Investigate',
      description: 'Our safety team reviews all reports within 24 hours.'
    },
    {
      step: '5',
      title: 'Action Taken',
      description: 'We take appropriate action including warnings, suspensions, or bans.'
    },
    {
      step: '6',
      title: 'Follow Up',
      description: 'We keep you informed throughout the process and outcome.'
    }
  ];

  return (
    <>
      <Head>
        <title>Safety & Trust - YooHoo.Guru</title>
        <meta name="description" content="Learn about our safety features, community guidelines, and how we protect our users." />
      </Head>

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom text-center">
            <div className="text-6xl mb-6">🛡️</div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              Your Safety is Our <span className="gradient-text-emerald-blue">Priority</span>
            </h1>
            <p className="text-xl text-white-80 max-w-3xl mx-auto">
              We&apos;ve built comprehensive safety features and guidelines to create a trusted community where everyone can learn, teach, and connect with confidence.
            </p>
          </div>
        </section>

        {/* Safety Features */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom">
            <h2 className="text-4xl font-display font-bold text-white text-center mb-12">
              How We Keep You Safe
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safetyFeatures.map((feature, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl hover-lift">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-4 text-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white-80 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="text-4xl font-display font-bold text-white text-center mb-12">
              Community Guidelines
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {guidelines.map((guideline, index) => (
                <div key={index} className="glass-card p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-white mb-6">{guideline.title}</h3>
                  <ul className="space-y-4">
                    {guideline.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white-80">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reporting Process */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom">
            <h2 className="text-4xl font-display font-bold text-white text-center mb-12">
              How to Report Issues
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportingSteps.map((item, index) => (
                  <div key={index} className="glass-card p-6 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white-80">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Safety Commitment */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="glass-card p-12 rounded-3xl max-w-4xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-white mb-6 text-center">
                Our Commitment to You
              </h2>
              <div className="space-y-6 text-white-80 leading-relaxed">
                <p>
                  At YooHoo.Guru, we believe that trust is the foundation of meaningful learning and community building. We&apos;re committed to maintaining the highest standards of safety and integrity across our platform.
                </p>
                <p>
                  Our dedicated Trust &amp; Safety team works around the clock to:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start space-x-3">
                    <span className="text-emerald-400 mt-1">•</span>
                    <span>Monitor platform activity for suspicious behavior</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-emerald-400 mt-1">•</span>
                    <span>Investigate all reports promptly and thoroughly</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-emerald-400 mt-1">•</span>
                    <span>Take swift action against policy violations</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-emerald-400 mt-1">•</span>
                    <span>Continuously improve our safety measures</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-emerald-400 mt-1">•</span>
                    <span>Educate our community on best practices</span>
                  </li>
                </ul>
                <p>
                  We also work closely with law enforcement when necessary and comply with all applicable laws and regulations to protect our community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom text-center">
            <div className="glass-card p-12 rounded-3xl max-w-3xl mx-auto">
              <div className="text-5xl mb-6">🚨</div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">
                Need Immediate Help?
              </h2>
              <p className="text-white-80 mb-8">
                If you&apos;re in immediate danger, contact local emergency services first (911 in the US).
              </p>
              <div className="space-y-4">
                <div className="glass-effect p-4 rounded-xl">
                  <div className="text-sm text-white-60 mb-1">Safety Team (24/7)</div>
                  <a href="mailto:safety@yoohoo.guru" className="text-xl font-bold text-emerald-400 hover:text-emerald-300">
                    safety@yoohoo.guru
                  </a>
                </div>
                <div className="glass-effect p-4 rounded-xl">
                  <div className="text-sm text-white-60 mb-1">General Support</div>
                  <a href="mailto:support@yoohoo.guru" className="text-xl font-bold text-emerald-400 hover:text-emerald-300">
                    support@yoohoo.guru
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}