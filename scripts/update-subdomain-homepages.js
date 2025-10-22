#!/usr/bin/env node

/**
 * Script to update subdomain homepages with News and Blog sections
 */

const fs = require('fs');
const path = require('path');

// Get all subdomain names
const subdomains = [
  'angel', 'coach', 'heroes', 'dashboard', 'cooking', 'music',
  'fitness', 'wellness', 'tech', 'coding', 'data', 'art',
  'design', 'writing', 'photography', 'crafts', 'language',
  'history', 'math', 'science', 'business', 'finance',
  'investing', 'marketing', 'sales', 'gardening', 'home', 'sports'
];

const appsDir = path.join(__dirname, '../apps/main/pages/_apps');

// Homepage template
const homepageTemplate = (subdomain) => {
  // Capitalize subdomain name for display
  const capitalizedSubdomain = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);

  return `import { Header } from '@yoohooguru/shared';
import { NewsSection } from '../../../components/NewsSection';
import { BlogList } from '../../../components/BlogList';

export default function Home() {
  return (
    <div>
      <Header />
      <main className="subdomain-home">
        <div className="hero-section">
          <h1>${capitalizedSubdomain} Guru</h1>
          <p>Welcome to your expert guide for ${subdomain}</p>
        </div>

        <div className="content-wrapper">
          <NewsSection subdomain="${subdomain}" limit={5} />
          <BlogList subdomain="${subdomain}" limit={6} showExcerpts={true} />
        </div>
      </main>

      <style jsx>{\`
        .subdomain-home {
          min-height: 100vh;
          background: #f9fafb;
        }

        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
        }

        .hero-section h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .hero-section p {
          font-size: 1.25rem;
          opacity: 0.95;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2rem;
          }

          .hero-section p {
            font-size: 1rem;
          }

          .content-wrapper {
            padding: 1rem;
          }
        }
      \`}</style>
    </div>
  );
}
`;
};

console.log('🚀 Updating subdomain homepages with News and Blog sections...\n');

let successCount = 0;
let errorCount = 0;

subdomains.forEach((subdomain) => {
  try {
    const indexPath = path.join(appsDir, subdomain, 'index.tsx');

    // Write the new homepage
    fs.writeFileSync(indexPath, homepageTemplate(subdomain));

    console.log(`✅ ${subdomain}: Homepage updated with News and Blog sections`);
    successCount++;
  } catch (error) {
    console.error(`❌ ${subdomain}: Error - ${error.message}`);
    errorCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   ✅ Success: ${successCount} subdomains`);
console.log(`   ❌ Errors: ${errorCount} subdomains`);
console.log(`\n✨ Homepage updates complete!`);
