import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Logo from './Logo';

const Header: React.FC<{ currentDomain?: string }> = ({ currentDomain = 'main' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const navItems = [
    { name: 'Home', href: 'https://www.yoohoo.guru', domain: 'main' },
    { name: "Angel's List", href: 'https://angel.yoohoo.guru', domain: 'angel' },
    { name: 'SkillShare', href: 'https://coach.yoohoo.guru', domain: 'coach' },
    { name: 'Hero Gurus', href: 'https://heroes.yoohoo.guru', domain: 'heroes' },
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
              {/* Book Session CTA - Always visible */}
              <a
                href="https://www.yoohoo.guru/browse"
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-emerald-400/50"
              >
                Book a Session
              </a>

              {/* Conditional Navigation based on authentication */}
              {status === 'loading' ? (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-emerald-400 rounded-full animate-spin"></div>
              ) : session ? (
                <div className="flex items-center gap-4">
                  <a
                    href="/dashboard"
                    className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </a>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm">{session.user?.name}</span>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 glass-effect-strong border border-white/20 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-2">
                        <a href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10">
                          Profile
                        </a>
                        <a href="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10">
                          Settings
                        </a>
                        <a href="/messages" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10">
                          Messages
                        </a>
                        <hr className="my-2 border-white/10" />
                        <button
                          onClick={() => signOut()}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <a
                    href="/login"
                    className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200"
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    className="btn-gradient text-sm"
                  >
                    Get Started
                  </a>
                </div>
              )}
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
                
                <hr className="border-white/10 my-4" />

                {/* Mobile Book Session CTA */}
                <a
                  href="https://www.yoohoo.guru/browse"
                  className="block btn-gradient text-center py-3 rounded-lg"
                >
                  Book a Session
                </a>

                <hr className="border-white/10 my-4" />

                {/* Mobile Auth */}
                {status === 'loading' ? (
                  <div className="flex justify-center py-2">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-emerald-400 rounded-full animate-spin"></div>
                  </div>
                ) : session ? (
                  <div className="space-y-3">
                    <a href="/dashboard" className="block nav-link">
                      Dashboard
                    </a>
                    <a href="/profile" className="block nav-link">
                      Profile
                    </a>
                    <a href="/messages" className="block nav-link">
                      Messages
                    </a>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left nav-link"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <a href="/login" className="block nav-link">
                      Sign In
                    </a>
                    <a href="/signup" className="block btn-gradient text-center">
                      Get Started
                    </a>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;