import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Logo from './Logo';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

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
                  {session.user?.image && (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      className="w-8 h-8 rounded-full border border-emerald-400/30"
                    />
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-medium transition-all duration-200 border border-red-600/30"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <a
                    href="/login"
                    className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200"
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-glow-emerald"
                  >
                    Sign Up
                  </a>
                </div>
              )}
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
            
            {/* Mobile Auth Navigation */}
            {status === 'loading' ? (
              <div className="w-6 h-6 border-2 border-gray-300 border-t-emerald-400 rounded-full animate-spin mx-auto"></div>
            ) : session ? (
              <div className="flex flex-col gap-4">
                <a
                  href="/dashboard"
                  className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200 py-2"
                >
                  Dashboard
                </a>
                <div className="flex items-center gap-3 py-2">
                  {session.user?.image && (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      className="w-8 h-8 rounded-full border border-emerald-400/30"
                    />
                  )}
                  <span className="text-gray-300 text-sm">{session.user?.name}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-6 py-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-medium transition-all duration-200 border border-red-600/30 text-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <a
                  href="/login"
                  className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200 py-2"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-semibold transition-all duration-300 text-center shadow-glow-emerald"
                >
                  Sign Up
                </a>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
