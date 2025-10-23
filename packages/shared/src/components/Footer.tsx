import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-effect-strong border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <Logo showText={true} size="normal" to="/" />
            <p className="mt-4 text-gray-400 leading-relaxed">
              A neighborhood-based skill-sharing platform where users exchange skills,
              discover purpose, and create exponential community impact.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 gradient-text-emerald-blue">
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 gradient-text-emerald-blue">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/help" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/safety" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Safety
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 gradient-text-emerald-blue">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} YooHoo.Guru. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
