const fs = require('fs');
const path = require('path');
const subdomainConfig = require('../subdomains-config.js');

function generateSubdomainPage(subdomain, config) {
  return `import React from 'react';
import Head from 'next/head';
import Navigation from '../../../components/ui/Navigation';
import { NewsSection } from '../../../components/NewsSection';
import { BlogList } from '../../../components/BlogList';

export default function ${config.name.charAt(0).toUpperCase() + config.name.slice(1)}Home() {
  return (
    <>
      <Head>
        <title>${config.name} Guru - YooHoo.Guru</title>
        <meta name="description" content="${config.description}" />
      </Head>

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br ${config.gradient}/20 via-primarydark to-${config.gradient}/20" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-${config.gradient.split('-')[1]}-500/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-${config.gradient.split('-')[2]}-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>

          {/* Content */}
          <div className="relative z-10 container-custom text-center">
            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${config.gradient}/20 to-${config.gradient}/20 flex items-center justify-center text-6xl glass-card hover-lift animate-fade-in">
              ${config.icon}
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 animate-fade-in-up">
              ${config.name} <span className="gradient-text-${config.gradient.split('-')[1]}">Guru</span>
            </h1>
            <p className="text-xl md:text-2xl text-white-80 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              ${config.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <a
                href="/signup?type=gunu"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r ${config.gradient} text-white text-lg font-semibold rounded-xl hover:from-${config.gradient.split('-')[1]}-600 hover:to-${config.gradient.split('-')[2]}-600 transition-all duration-300 shadow-lg hover:shadow-glow-${config.gradient.split('-')[1]}-lg hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <span>Start Learning ${config.name}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/signup?type=guru"
                className="w-full sm:w-auto px-8 py-4 glass-button text-white text-lg font-semibold rounded-xl hover:bg-white-20 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Become a ${config.name} Guru</span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text-${config.gradient.split('-')[1]} mb-2">${config.articles}</div>
                <div className="text-sm md:text-base text-white-60 font-medium">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text-${config.gradient.split('-')[2]} mb-2">${config.gurus}</div>
                <div className="text-sm md:text-base text-white-60 font-medium">${config.name} Gurus</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text-${config.gradient.split('-')[1]} mb-2">${config.students}</div>
                <div className="text-sm md:text-base text-white-60 font-medium">Students</div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="section-padding">
          <div className="container-custom">
            <NewsSection subdomain="${subdomain}" limit={5} />
            <div className="mt-16">
              <BlogList subdomain="${subdomain}" limit={6} showExcerpts={true} />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom text-center">
            <div className="glass-card p-12 rounded-3xl max-w-4xl mx-auto">
              <div className="text-5xl mb-6">${config.icon}</div>
              <h2 className="text-4xl font-display font-bold text-white mb-6">
                Ready to Start Your ${config.name} Journey?
              </h2>
              <p className="text-xl text-white-80 mb-8">
                Join thousands of ${config.name.toLowerCase()} enthusiasts learning and teaching on YooHoo.Guru
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/signup?type=gunu"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r ${config.gradient} text-white text-lg font-semibold rounded-xl hover:from-${config.gradient.split('-')[1]}-600 hover:to-${config.gradient.split('-')[2]}-600 transition-all duration-300 shadow-lg hover:shadow-glow-${config.gradient.split('-')[1]}-lg hover:-translate-y-1"
                >
                  Start Learning ${config.name}
                </a>
                <a
                  href="/signup?type=guru"
                  className="w-full sm:w-auto px-8 py-4 glass-button text-white text-lg font-semibold rounded-xl hover:bg-white-20 transition-all duration-300"
                >
                  Become a ${config.name} Guru
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </gt;
  );
}
`;
}

// Update all subdomains
async function updateAllSubdomains() {
  const subdomainsPath = path.join(__dirname, '../apps/main/pages/_apps');
  
  console.log('Updating all subdomain pages...');
  
  for (const [subdomain, config] of Object.entries(subdomainConfig)) {
    const pageContent = generateSubdomainPage(subdomain, config);
    const filePath = path.join(subdomainsPath, subdomain, 'index.tsx');
    
    try {
      await fs.promises.writeFile(filePath, pageContent);
      console.log(`✅ Updated: ${subdomain}/index.tsx`);
    } catch (error) {
      console.error(`❌ Error updating ${subdomain}:`, error.message);
    }
  }
  
  console.log('\\n🎉 All subdomain pages updated successfully!');
}

// Run the script
updateAllSubdomains().catch(console.error);