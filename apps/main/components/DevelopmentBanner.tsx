import React, { useState, useEffect } from 'react';

export default function DevelopmentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem('devBannerDismissed');
    if (!dismissed) {
      setShowBanner(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('devBannerDismissed', 'true');
    localStorage.setItem('devBannerDismissedDate', new Date().toISOString());
    setShowBanner(false);
  };

  // Prevent hydration mismatch by only rendering after mount
  if (!mounted || !showBanner) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600/95 to-emerald-600/95 backdrop-blur-sm border-b border-white/10">
        <div className="container-custom py-3 px-4">
          <div className="flex items-start justify-between gap-4">
            {/* Content */}
            <div className="flex-1 text-sm text-white">
              <p className="font-semibold mb-1">
                Welcome to YooHoo.Guru — your place to summon a Guru, learn a skill, or get a helping hand.
              </p>
              <p className="text-white/90 text-xs md:text-sm">
                We&apos;re actively polishing the platform and debugging our production release. Thanks for your patience as we tidy things up. 
                If you spot anything that needs attention, feel free to send constructive feedback to{' '}
                <a 
                  href="mailto:brandon@yoohoo.guru" 
                  className="text-white underline hover:text-blue-200 transition-colors font-medium"
                >
                  brandon@yoohoo.guru
                </a>
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors duration-200"
              aria-label="Dismiss banner"
            >
              <svg 
                className="w-5 h-5 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
