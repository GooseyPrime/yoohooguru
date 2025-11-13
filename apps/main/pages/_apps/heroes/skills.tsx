import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function HeroesSkills() {
  return (
    <>
      <Head>
        <title>Skills Marketplace - Heroes - YooHoo.Guru</title>
        <meta name="description" content="Browse and offer skills on the Heroes marketplace" />
      </Head>

      <main className="min-h-screen flex items-center justify-center py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-display font-bold text-white mb-6">
              Skills Marketplace
            </h1>
            <p className="text-xl text-white-80 mb-8">
              This page is under construction. We're building an amazing skills marketplace for our Heroes community.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/"
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
              >
                Back to Home
              </Link>
              <Link 
                href="/contact"
                className="px-6 py-3 glass-button text-white font-semibold rounded-xl hover:bg-white-20 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}