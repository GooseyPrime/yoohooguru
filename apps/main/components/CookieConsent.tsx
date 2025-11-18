import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
      } catch (e) {
        console.error('Error loading cookie preferences:', e);
      }
    }
  }, []);


  // Prevent hydration mismatch by only rendering after mount
  if (!mounted) {
    return null;
  }
  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(onlyNecessary);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs: typeof preferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    
    // Apply preferences (in production, this would enable/disable tracking scripts)
    if (prefs.analytics) {
      // Enable analytics
      console.log('Analytics enabled');
    }
    if (prefs.marketing) {
      // Enable marketing cookies
      console.log('Marketing cookies enabled');
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <div className="container-custom max-w-6xl mx-auto">
        <div className="glass-card p-6 md:p-8 rounded-2xl shadow-2xl border border-white/10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🍪</span>
                <h3 className="text-xl font-display font-bold text-white">
                  Cookie Preferences
                </h3>
              </div>
              <p className="text-white-80 text-sm mb-4">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                By clicking &quot;Accept All&quot;, you consent to our use of cookies.{' '}
                <Link href="/cookies" className="text-emerald-400 hover:text-emerald-300 underline">
                  Learn more
                </Link>
              </p>

              {/* Cookie Categories */}
              <div className="space-y-3 mb-4">
                <label className="flex items-center gap-3 cursor-not-allowed opacity-60">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-4 h-4 rounded border-white/20 bg-white/10"
                  />
                  <div>
                    <span className="text-white text-sm font-medium">Necessary Cookies</span>
                    <p className="text-white-60 text-xs">Required for the website to function</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-white text-sm font-medium">Analytics Cookies</span>
                    <p className="text-white-60 text-xs">Help us understand how visitors use our site</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-white text-sm font-medium">Marketing Cookies</span>
                    <p className="text-white-60 text-xs">Used to deliver personalized advertisements</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 md:min-w-[200px]">
              <button
                onClick={handleAcceptAll}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-glow-emerald"
              >
                Accept All
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-6 py-3 glass-button text-white text-sm font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Save Preferences
              </button>
              <button
                onClick={handleRejectAll}
                className="px-6 py-3 text-white-60 text-sm font-medium hover:text-white transition-colors duration-300"
              >
                Reject All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}