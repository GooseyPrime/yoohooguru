import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface NavigationProps {
  currentDomain?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ currentDomain = 'main' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: 'Home', href: 'https://www.yoohoo.guru', domain: 'main' },
    { name: "Angel's List", href: 'https://angel.yoohoo.guru', domain: 'angel' },
    { name: 'Coach Guru', href: 'https://coach.yoohoo.guru', domain: 'coach' },
    { name: 'Hero Gurus', href: 'https://heroes.yoohoo.guru', domain: 'heroes' },
  ];

  const contentHubs = [
    'art', 'business', 'coding', 'cooking', 'crafts', 'data', 'design',
    'finance', 'fitness', 'gardening', 'history', 'home', 'investing',
    'language', 'marketing', 'math', 'music', 'photography', 'sales',
    'science', 'sports', 'tech', 'wellness', 'writing'
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-b border-emerald-500/30 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-sm text-emerald-400">
            <span className="hidden sm:inline">🎉</span>
            <span className="mx-2">Join 10,000+ members sharing skills and building community</span>
            <span className="hidden sm:inline">🎉</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 glass-effect-strong border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
                YG
              </div>
              <div>
                <div className="text-xl font-bold text-white">YooHoo.Guru</div>
                <div className="text-xs text-gray-400">
                  {currentDomain === 'main' ? 'Skill Sharing Platform' : `${currentDomain.charAt(0).toUpperCase() + currentDomain.slice(1)} Hub`}
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.domain}
                  href={item.href}
                  className={`nav-link ${currentDomain === item.domain ? 'nav-link-active' : ''}`}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className="nav-link">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="btn-ghost text-sm">Sign In</button>
              <button className="btn-primary text-sm">Get Started</button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <nav className="space-y-3">
                {navItems.map((item) => (
                  <a
                    key={item.domain}
                    href={item.href}
                    className={`block nav-link ${currentDomain === item.domain ? 'nav-link-active' : ''}`}
                  >
                    {item.name}
                  </a>
                ))}
                
                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs text-gray-500 font-semibold mb-2">CONTENT HUBS</div>
                  <div className="grid grid-cols-2 gap-2">
                    {contentHubs.slice(0, 8).map((hub) => (
                      <a
                        key={hub}
                        href={`https://${hub}.yoohoo.guru`}
                        className="text-sm text-gray-400 hover:text-emerald-400"
                      >
                        {hub.charAt(0).toUpperCase() + hub.slice(1)}
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button className="btn-ghost flex-1">Sign In</button>
                  <button className="btn-primary flex-1">Get Started</button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navigation;