import React from 'react';

const Footer: React.FC<{ currentDomain?: string }> = ({ currentDomain = 'main' }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'About Us', href: '/about' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Blog', href: '/blog' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Safety', href: '/safety' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR Compliance', href: '/gdpr' },
    ],
    services: [
      { name: 'Coach Guru', href: 'https://coach.yoohoo.guru' },
      { name: "Angel's List", href: 'https://angel.yoohoo.guru' },
      { name: 'Hero Gurus', href: 'https://heroes.yoohoo.guru' },
      { name: 'Content Hubs', href: '/hubs' },
    ],
    content: [
      { name: 'Technology', href: 'https://tech.yoohoo.guru' },
      { name: 'Business', href: 'https://business.yoohoo.guru' },
      { name: 'Creative Arts', href: 'https://art.yoohoo.guru' },
      { name: 'View All Topics', href: '/hubs' },
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: '🐦', href: '#' },
    { name: 'LinkedIn', icon: '💼', href: '#' },
    { name: 'Facebook', icon: '📘', href: '#' },
    { name: 'Instagram', icon: '📷', href: '#' },
    { name: 'YouTube', icon: '📺', href: '#' },
  ];

  return (
    <footer className="bg-gradient-to-b from-secondarydark to-primarydark border-t border-white/10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
                YG
              </div>
              <div>
                <div className="text-xl font-bold text-white">YooHoo.Guru</div>
                <div className="text-sm text-gray-400">
                  {currentDomain === 'main' ? 'Skill Sharing Platform' : `${currentDomain.charAt(0).toUpperCase() + currentDomain.slice(1)} Hub`}
                </div>
              </div>
            </div>
            
            <p className="body-small text-gray-400 mb-6 max-w-md">
              A neighborhood-based skill-sharing platform where users exchange skills, 
              discover purpose, and create exponential community impact.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Stay Connected</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-default flex-1"
                />
                <button className="btn-primary">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Get weekly updates on new experts and learning opportunities.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 glass-effect rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:bg-white/10 transition-all duration-200"
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3 mb-6">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content Hubs Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="text-center mb-6">
            <h4 className="text-white font-semibold mb-2">Explore Our Content Hubs</h4>
            <p className="text-sm text-gray-400">Expert-curated content across 24 specialized topics</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Technology', 'Business', 'Coding', 'Design', 'Marketing', 'Writing',
              'Photography', 'Music', 'Fitness', 'Cooking', 'Art', 'Science'
            ].map((topic, index) => (
              <a
                key={index}
                href={`https://${topic.toLowerCase()}.yoohoo.guru`}
                className="text-center p-3 glass-effect rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-sm">📚</span>
                </div>
                <span className="text-xs text-gray-300">{topic}</span>
              </a>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <a
              href="/hubs"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
            >
              View All 24 Topics →
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © {currentYear} YooHoo.Guru. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <span className="mr-2">🌍</span>
                <span>Available globally</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🔒</span>
                <span>Secure platform</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">⭐</span>
                <span>4.9★ rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-gray-500">
            <div className="flex items-center">
              <span className="w-4 h-4 text-green-400 mr-1">✓</span>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 text-green-400 mr-1">✓</span>
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 text-green-400 mr-1">✓</span>
              <span>PCI DSS Certified</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 text-green-400 mr-1">✓</span>
              <span>Verified Providers</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 text-green-400 mr-1">✓</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;