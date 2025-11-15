import React from 'react';
import Link from 'next/link';
import { NextPageContext } from 'next';
import Navigation from '../components/ui/Navigation';
import Seo from '../components/Seo';

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  const getErrorMessage = () => {
    switch (statusCode) {
      case 404:
        return {
          title: 'Page Not Found',
          description: "The page you're looking for doesn't exist.",
        };
      case 500:
        return {
          title: 'Server Error',
          description: 'Something went wrong on our end. Please try again later.',
        };
      case 403:
        return {
          title: 'Access Denied',
          description: "You don't have permission to access this page.",
        };
      default:
        return {
          title: 'An Error Occurred',
          description: 'Something unexpected happened. Please try again.',
        };
    }
  };

  const { title, description } = getErrorMessage();

  return (
    <>
      <Seo
        title={`${title} - YooHoo.Guru`}
        description={description}
        url="https://www.yoohoo.guru/error"
      />

      <Navigation />

      <main className="min-h-screen flex items-center justify-center">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Code */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-white/10">
                <span className="text-6xl font-display font-bold text-red-400">
                  {statusCode || '?'}
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              {title}
            </h1>

            {/* Description */}
            <p className="text-xl text-white-80 mb-8 leading-relaxed">
              {description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-glow-emerald transition-all duration-300 hover:-translate-y-0.5"
              >
                Go to Homepage
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 glass-button text-white font-semibold rounded-xl hover:glass-effect-strong transition-all duration-300"
              >
                Try Again
              </button>
            </div>

            {/* Help Section */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-sm text-white-60 mb-4">
                If this problem persists, please{' '}
                <Link href="/help" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  contact support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;