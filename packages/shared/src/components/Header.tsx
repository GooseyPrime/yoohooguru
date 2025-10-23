import React, { useState } from 'react';
import Logo from './Logo';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 glass-effect-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo showText={true} size="normal" to="/" />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="https://www.yoohoo.guru"
                className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="https://angel.yoohoo.guru"
                className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200"
              >
                Angel&apos;s List
              </a>
              <a
                href="https://coach.yoohoo.guru"
                className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200"
              >
                Coach Guru
              </a>
              <a
                href="https://heroes.yoohoo.guru"
                className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200"
              >
                Hero Gurus
              </a>
              <a
                href="https://dashboard.yoohoo.guru"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-glow-emerald"
              >
                Dashboard
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white text-2xl transition-colors"
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-effect-strong border-b border-white/10 animate-fade-in">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
            <a
              href="https://www.yoohoo.guru"
              className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200 py-2"
            >
              Home
            </a>
            <a
              href="https://angel.yoohoo.guru"
              className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200 py-2"
            >
              Angel&apos;s List
            </a>
            <a
              href="https://coach.yoohoo.guru"
              className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200 py-2"
            >
              Coach Guru
            </a>
            <a
              href="https://heroes.yoohoo.guru"
              className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200 py-2"
            >
              Hero Gurus
            </a>
            <a
              href="https://dashboard.yoohoo.guru"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-semibold transition-all duration-300 text-center shadow-glow-emerald"
            >
              Dashboard
            </a>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
