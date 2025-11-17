import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Track when component mounts on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update current path only on client side to avoid SSR issues
  useEffect(() => {
    if (mounted) {
      setCurrentPath(router.pathname);
    }
  }, [mounted, router.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
      { href: '/about', label: 'About' },
      { href: '/how-it-works', label: 'How It Works' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/blog', label: 'Blog' },
      { href: '/help', label: 'Help' },
      { href: '/safety', label: 'Safety' },
    ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-effect-strong shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-glow-emerald group-hover:shadow-glow-emerald-lg transition-all duration-300">
                <span className="text-2xl font-bold text-white font-display">YG</span>
              </div>
              <div className="hidden md:block">
                <div className="text-xl font-display font-bold gradient-text-emerald-blue">
                  YooHoo.Guru
                </div>
                <div className="text-xs text-white-60 font-body">
                  Skill Sharing Platform
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 hover:text-emerald-400 ${
                    currentPath === link.href
                      ? 'text-emerald-400'
                      : 'text-white-80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Buttons / User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {status === 'loading' ? (
                <div className="w-6 h-6 border-2 border-white-20 border-t-emerald-400 rounded-full animate-spin"></div>
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <button className="flex items-center space-x-2 px-4 py-2 glass-button rounded-xl hover:bg-white-20 transition-all duration-300">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-white">{session.user?.name || 'User'}</span>
                      <svg className="w-4 h-4 text-white-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 glass-effect-strong rounded-xl border border-white-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-50">
                      <div className="py-2">
                        <Link href="/dashboard" className="block px-4 py-2 text-sm text-white hover:bg-white-10 transition-colors">
                          Dashboard
                        </Link>
                        <Link href="/profile" className="block px-4 py-2 text-sm text-white hover:bg-white-10 transition-colors">
                          Profile
                        </Link>
                        <Link href="/settings" className="block px-4 py-2 text-sm text-white hover:bg-white-10 transition-colors">
                          Settings
                        </Link>
                        <hr className="my-2 border-white-10" />
                        <button
                          onClick={() => signOut()}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white-10 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-6 py-2.5 text-sm font-semibold text-white hover:text-emerald-400 transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-glow-emerald hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg glass-button"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden glass-effect-strong border-t border-white-10">
            <div className="container-custom py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2 text-base font-medium transition-colors duration-300 ${
                    currentPath === link.href
                      ? 'text-emerald-400'
                      : 'text-white-80 hover:text-emerald-400'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                {status === 'loading' ? (
                  <div className="flex justify-center py-3">
                    <div className="w-6 h-6 border-2 border-white-20 border-t-emerald-400 rounded-full animate-spin"></div>
                  </div>
                ) : session ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-3 glass-button rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white">{session.user?.name || 'User'}</div>
                        <div className="text-xs text-white-60">{session.user?.email}</div>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block w-full py-3 text-center text-base font-semibold text-white glass-button rounded-xl hover:bg-white-20 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block w-full py-3 text-center text-base font-semibold text-white glass-button rounded-xl hover:bg-white-20 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full py-3 text-center text-base font-semibold text-white glass-button rounded-xl hover:bg-white-20 transition-all duration-300"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block w-full py-3 text-center text-base font-semibold text-white glass-button rounded-xl hover:bg-white-20 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block w-full py-3 text-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-base font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from going under fixed nav */}
      <div className="h-20" />
    </>
  );
}