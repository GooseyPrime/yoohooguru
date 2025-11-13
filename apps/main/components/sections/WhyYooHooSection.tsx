import React from 'react';

export const WhyYooHooSection: React.FC = () => {
  const benefits = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Verified & Trusted",
      description: "Every expert is thoroughly vetted. Your safety and security are our top priorities with encrypted payments and verified identities."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Fair & Transparent Pricing",
      description: "You set your own rates. We take a small commission only when you succeed. No hidden fees, no surprises."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "AI-Powered Matching",
      description: "Our intelligent system connects you with the perfect learning partner based on your goals, style, and schedule."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Learn on Your Schedule",
      description: "Book sessions that fit your life. Morning, evening, or weekend - find experts available when you are."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Thriving Community",
      description: "Join thousands of learners and experts building meaningful connections while growing their skills and income."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Money-Back Guarantee",
      description: "Not satisfied with your session? We'll make it right. Your success and satisfaction are guaranteed."
    }
  ];

  const comparisons = [
    {
      feature: "Personal Connection",
      yoohoo: true,
      others: false,
      description: "Real 1-on-1 video sessions with dedicated experts"
    },
    {
      feature: "Flexible Pricing",
      yoohoo: true,
      others: false,
      description: "You control your rates and schedule"
    },
    {
      feature: "AI-Powered Matching",
      yoohoo: true,
      others: false,
      description: "Intelligent pairing based on learning styles"
    },
    {
      feature: "Community Impact",
      yoohoo: true,
      others: false,
      description: "Free learning for people with disabilities"
    },
    {
      feature: "Instant Booking",
      yoohoo: true,
      others: true,
      description: "Book sessions in seconds"
    },
    {
      feature: "Secure Payments",
      yoohoo: true,
      others: true,
      description: "Protected transactions via Stripe"
    }
  ];

  const stats = [
    { value: "4.9/5", label: "Average Rating", sublabel: "From 10,000+ reviews" },
    { value: "98%", label: "Success Rate", sublabel: "Students achieve their goals" },
    { value: "24/7", label: "Support", sublabel: "We're here when you need us" },
    { value: "$2M+", label: "Earned by Gurus", sublabel: "And growing every month" }
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-primarydark/50 to-transparent">
      <div className="container-custom">
        {/* Main Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Why Choose <span className="gradient-text-emerald-blue">YooHoo.Guru</span>?
          </h2>
          <p className="text-xl md:text-2xl text-white-80 max-w-4xl mx-auto">
            We're not just another learning platform. We're a community where real people connect, 
            share knowledge, and transform lives—one session at a time.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="glass-card p-8 rounded-2xl hover:shadow-glow-emerald transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center text-emerald-400 mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-white-70 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="glass-card p-8 md:p-12 rounded-3xl mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text-emerald mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-white-60">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              How We Compare
            </h3>
            <p className="text-lg text-white-70 max-w-2xl mx-auto">
              See why thousands choose YooHoo.Guru over traditional platforms
            </p>
          </div>

          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white-10">
                    <th className="text-left p-6 text-white font-semibold">Feature</th>
                    <th className="text-center p-6">
                      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full">
                        <span className="text-white font-bold">YooHoo.Guru</span>
                      </div>
                    </th>
                    <th className="text-center p-6 text-white-60 font-semibold">Other Platforms</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((comparison, index) => (
                    <tr key={index} className="border-b border-white-10 hover:bg-white-5 transition-colors">
                      <td className="p-6">
                        <div className="font-semibold text-white mb-1">{comparison.feature}</div>
                        <div className="text-sm text-white-60">{comparison.description}</div>
                      </td>
                      <td className="text-center p-6">
                        {comparison.yoohoo ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20">
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="text-center p-6">
                        {comparison.others ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20">
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <h3 className="text-2xl font-display font-bold text-white mb-8">
            Your Trust Matters
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
            <div className="flex items-center space-x-3 text-white-70">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-3 text-white-70">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Stripe Payments</span>
            </div>
            <div className="flex items-center space-x-3 text-white-70">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Verified Experts</span>
            </div>
            <div className="flex items-center space-x-3 text-white-70">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>24/7 Support</span>
            </div>
          </div>
          <p className="text-white-60 max-w-2xl mx-auto">
            Your privacy and security are protected by industry-leading encryption and security practices. 
            We never share your personal information without your explicit consent.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyYooHooSection;