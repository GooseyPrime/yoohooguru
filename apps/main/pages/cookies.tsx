import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../components/ui/Navigation';

export default function Cookies() {
  return (
    <>
      <Head>
        <title>Cookie Policy - YooHoo.Guru</title>
        <meta name="description" content="Learn about how YooHoo.Guru uses cookies and similar technologies." />
      </Head>

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom text-center">
            <div className="text-6xl mb-6">🍪</div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              Cookie <span className="gradient-text-emerald-blue">Policy</span>
            </h1>
            <p className="text-xl text-white-80 max-w-3xl mx-auto">
              Last Updated: November 11, 2024
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Introduction */}
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-3xl font-display font-bold text-white mb-4">What Are Cookies?</h2>
                <div className="text-white-80 space-y-4 leading-relaxed">
                  <p>
                    Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, understanding how you use our site, and improving our services.
                  </p>
                  <p>
                    This Cookie Policy explains what cookies are, how we use them, and your choices regarding cookies.
                  </p>
                </div>
              </div>

              {/* Types of Cookies */}
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-3xl font-display font-bold text-white mb-6">Types of Cookies We Use</h2>
                <div className="space-y-6">
                  
                  {/* Essential Cookies */}
                  <div className="border-l-4 border-emerald-500 pl-6">
                    <h3 className="text-xl font-bold text-white mb-3">1. Essential Cookies</h3>
                    <p className="text-white-80 mb-3">
                      These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                    </p>
                    <ul className="space-y-2 text-white-80">
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>Authentication cookies (keep you logged in)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>Security cookies (protect against fraud)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>Session cookies (maintain your session state)</span>
                      </li>
                    </ul>
                    <p className="text-sm text-white-60 mt-3">
                      <strong>Can be disabled:</strong> No - These are required for the site to work
                    </p>
                  </div>

                  {/* Functional Cookies */}
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-bold text-white mb-3">2. Functional Cookies</h3>
                    <p className="text-white-80 mb-3">
                      These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                    </p>
                    <ul className="space-y-2 text-white-80">
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Language preferences</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Theme preferences (dark/light mode)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>User interface customizations</span>
                      </li>
                    </ul>
                    <p className="text-sm text-white-60 mt-3">
                      <strong>Can be disabled:</strong> Yes - But some features may not work properly
                    </p>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h3 className="text-xl font-bold text-white mb-3">3. Analytics Cookies</h3>
                    <p className="text-white-80 mb-3">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                    <ul className="space-y-2 text-white-80">
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>Google Analytics (traffic analysis)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>Page view tracking</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>User behavior patterns</span>
                      </li>
                    </ul>
                    <p className="text-sm text-white-60 mt-3">
                      <strong>Can be disabled:</strong> Yes - Through your browser settings or our cookie preferences
                    </p>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h3 className="text-xl font-bold text-white mb-3">4. Marketing Cookies</h3>
                    <p className="text-white-80 mb-3">
                      These cookies are used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.
                    </p>
                    <ul className="space-y-2 text-white-80">
                      <li className="flex items-start space-x-2">
                        <span className="text-orange-400 mt-1">•</span>
                        <span>Advertising cookies (show relevant ads)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-orange-400 mt-1">•</span>
                        <span>Retargeting cookies</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-orange-400 mt-1">•</span>
                        <span>Social media cookies</span>
                      </li>
                    </ul>
                    <p className="text-sm text-white-60 mt-3">
                      <strong>Can be disabled:</strong> Yes - Through your browser settings or our cookie preferences
                    </p>
                  </div>

                </div>
              </div>

              {/* Third-Party Cookies */}
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-3xl font-display font-bold text-white mb-4">Third-Party Cookies</h2>
                <div className="text-white-80 space-y-4 leading-relaxed">
                  <p>
                    We use services from trusted third-party providers that may set cookies on your device:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <span className="text-emerald-400 mt-1">•</span>
                      <div>
                        <strong className="text-white">Google Analytics:</strong> For website analytics and performance monitoring
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-emerald-400 mt-1">•</span>
                      <div>
                        <strong className="text-white">Stripe:</strong> For secure payment processing
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-emerald-400 mt-1">•</span>
                      <div>
                        <strong className="text-white">Agora:</strong> For video conferencing functionality
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-emerald-400 mt-1">•</span>
                      <div>
                        <strong className="text-white">Social Media Platforms:</strong> For social sharing features
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Managing Cookies */}
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-3xl font-display font-bold text-white mb-4">Managing Your Cookie Preferences</h2>
                <div className="text-white-80 space-y-4 leading-relaxed">
                  <p>
                    You have several options to manage or disable cookies:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-white-5 p-4 rounded-xl">
                      <h4 className="text-white font-semibold mb-2">Browser Settings</h4>
                      <p className="text-sm">
                        Most browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies. Note that disabling cookies may affect website functionality.
                      </p>
                    </div>

                    <div className="bg-white-5 p-4 rounded-xl">
                      <h4 className="text-white font-semibold mb-2">Cookie Preference Center</h4>
                      <p className="text-sm mb-3">
                        Use our Cookie Preference Center to customize which types of cookies you allow.
                      </p>
                      <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300">
                        Manage Cookie Preferences
                      </button>
                    </div>

                    <div className="bg-white-5 p-4 rounded-xl">
                      <h4 className="text-white font-semibold mb-2">Opt-Out Tools</h4>
                      <p className="text-sm">
                        You can opt out of interest-based advertising through:
                      </p>
                      <ul className="text-sm mt-2 space-y-1">
                        <li>• Network Advertising Initiative: <a href="http://www.networkadvertising.org/choices/" className="text-emerald-400 hover:text-emerald-300" target="_blank" rel="noopener noreferrer">www.networkadvertising.org</a></li>
                        <li>• Digital Advertising Alliance: <a href="http://www.aboutads.info/choices/" className="text-emerald-400 hover:text-emerald-300" target="_blank" rel="noopener noreferrer">www.aboutads.info</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Updates */}
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-3xl font-display font-bold text-white mb-4">Updates to This Policy</h2>
                <div className="text-white-80 space-y-4 leading-relaxed">
                  <p>
                    We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-3xl font-display font-bold text-white mb-4">Questions?</h2>
                <div className="text-white-80 space-y-4 leading-relaxed">
                  <p>
                    If you have questions about our use of cookies or this Cookie Policy, please contact us:
                  </p>
                  <div className="bg-white-5 p-4 rounded-xl">
                    <p className="mb-2"><strong className="text-white">Email:</strong> privacy@yoohoo.guru</p>
                    <p><strong className="text-white">Mail:</strong> YooHoo.Guru, 123 Market Street, Suite 400, San Francisco, CA 94103</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="glass-card p-8 rounded-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Related Policies</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/privacy" className="glass-effect p-4 rounded-xl hover:bg-white-10 transition-all duration-300">
                  <h4 className="text-white font-semibold mb-2">Privacy Policy</h4>
                  <p className="text-sm text-white-60">Learn how we protect your personal information</p>
                </Link>
                <Link href="/terms" className="glass-effect p-4 rounded-xl hover:bg-white-10 transition-all duration-300">
                  <h4 className="text-white font-semibold mb-2">Terms of Service</h4>
                  <p className="text-sm text-white-60">Read our terms and conditions</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}