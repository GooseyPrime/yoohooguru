import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../components/ui/Navigation';

export default function Pricing() {
  const plans = [
    {
      name: "Gunu (Learner)",
      description: "Perfect for those looking to learn new skills",
      price: "Free",
      period: "to join",
      features: [
        "Browse all experts and services",
        "Book unlimited sessions",
        "Access to all content hubs",
        "Secure messaging",
        "Session recordings",
        "Progress tracking",
        "Community access",
        "24/7 support"
      ],
      cta: "Start Learning",
      href: "/signup?type=gunu",
      popular: false,
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      name: "Guru (Teacher)",
      description: "Share your expertise and earn income",
      price: "15%",
      period: "commission",
      features: [
        "Create your expert profile",
        "Set your own rates",
        "Flexible scheduling",
        "Secure payment processing",
        "AI teaching assistant",
        "Student management tools",
        "Analytics dashboard",
        "Priority support"
      ],
      cta: "Become a Guru",
      href: "/signup?type=guru",
      popular: true,
      gradient: "from-emerald-500/20 to-blue-500/20"
    },
    {
      name: "Angel (Service Provider)",
      description: "Offer local services to your community",
      price: "10-15%",
      period: "commission",
      features: [
        "List your services",
        "Set competitive pricing",
        "Local visibility",
        "Verified provider badge",
        "Customer management",
        "Payment processing",
        "Review system",
        "Business analytics"
      ],
      cta: "Join Angel's List",
      href: "/signup?type=angel",
      popular: false,
      gradient: "from-purple-500/20 to-pink-500/20"
    }
  ];

  const faqs = [
    {
      question: "How does payment work?",
      answer: "Payments are processed securely through Stripe. Learners pay upfront when booking sessions, and funds are released to Gurus after successful completion. Our platform takes a small commission to maintain and improve the service."
    },
    {
      question: "Can I be both a Guru and a Gunu?",
      answer: "Absolutely! Many of our members both teach and learn on the platform. You can switch between roles seamlessly and enjoy the benefits of both."
    },
    {
      question: "What about Hero Gurus?",
      answer: "Hero Gurus is our 100% free platform for people with disabilities. Volunteer teachers (Heroes) provide free accessible learning. There are no fees or commissions for this service."
    },
    {
      question: "Are there any hidden fees?",
      answer: "No hidden fees! The commission rates shown are all-inclusive. Learners pay the session price, and Gurus receive their earnings minus the platform commission."
    },
    {
      question: "Can I cancel my account anytime?",
      answer: "Yes, you can cancel your account at any time. There are no long-term commitments or cancellation fees."
    },
    {
      question: "How do refunds work?",
      answer: "We have a fair refund policy. If you're not satisfied with a session, you can request a refund within 24 hours. Each case is reviewed individually to ensure fairness for both parties."
    }
  ];

  return (
    <>
      <Head>
        <title>Pricing - YooHoo.Guru</title>
        <meta name="description" content="Simple, transparent pricing for learners, teachers, and service providers. Join YooHoo.Guru today." />
      </Head>

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              Simple, <span className="gradient-text-emerald-blue">Transparent</span> Pricing
            </h1>
            <p className="text-xl text-white-80 max-w-3xl mx-auto">
              Choose the plan that works for you. No hidden fees, no surprises. Just honest pricing for honest skill sharing.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`glass-card p-8 rounded-2xl hover-lift relative ${
                    plan.popular ? 'border-2 border-emerald-500/50' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm font-semibold rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6 text-4xl`}>
                    {['🎓', '👨‍🏫', '🛠️'][index]}
                  </div>

                  <h3 className="text-2xl font-display font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-white-60 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <div className="text-4xl font-bold text-white mb-1">{plan.price}</div>
                    <div className="text-white-60">{plan.period}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-white-80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.href}
                    className={`block w-full py-3 text-center font-semibold rounded-xl transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 shadow-lg hover:shadow-glow-emerald-lg'
                        : 'glass-button text-white hover:bg-white-20'
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>

            {/* Hero Gurus Callout */}
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="glass-card p-8 rounded-2xl border-l-4 border-purple-500">
                <div className="flex items-start space-x-4">
                  <div className="text-5xl">❤️</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-display font-bold text-white mb-2">
                      Hero Gurus - 100% Free
                    </h3>
                    <p className="text-white-80 mb-4">
                      Our commitment to accessibility means that people with disabilities can access free learning through our Hero Gurus platform. Volunteer teachers provide adaptive, inclusive education at no cost.
                    </p>
                    <a
                      href="https://heroes.yoohoo.guru"
                      className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                    >
                      <span>Learn more about Hero Gurus</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-bold text-white mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-white-80 max-w-3xl mx-auto">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-card p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-3">{faq.question}</h3>
                  <p className="text-white-80 leading-relaxed">{faq.answer}</p>
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
                Join thousands of learners and experts on YooHoo.Guru today
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-glow-emerald-lg hover:-translate-y-1"
              >
                <span>Create Free Account</span>
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