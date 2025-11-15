import React from 'react';

/**
 * SkipToContent Component
 * Provides a keyboard-accessible link to skip navigation and jump directly to main content
 * This is an important accessibility feature for screen reader and keyboard users
 */
export default function SkipToContent() {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <style jsx>{`
        .skip-to-content {
          position: absolute;
          top: -40px;
          left: 0;
          background: #2563eb;
          color: white;
          padding: 8px 16px;
          text-decoration: none;
          font-weight: 600;
          border-radius: 0 0 4px 0;
          z-index: 9999;
          transition: top 0.3s ease;
        }

        .skip-to-content:focus {
          top: 0;
          outline: 2px solid #fff;
          outline-offset: 2px;
        }

        .skip-to-content:hover {
          background: #1d4ed8;
        }
      `}</style>
    </>
  );
}