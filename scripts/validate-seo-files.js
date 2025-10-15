#!/usr/bin/env node

/**
 * Simple validation script to check sitemap URLs and robots.txt formatting
 */

const fs = require('fs');
const path = require('path');

const FRONTEND_PUBLIC_DIR = path.join(__dirname, '..', 'frontend', 'public');
const SITEMAP_PATH = path.join(FRONTEND_PUBLIC_DIR, 'sitemap.xml');
const ROBOTS_PATH = path.join(FRONTEND_PUBLIC_DIR, 'robots.txt');

console.log('🔍 Validating SEO files...\n');

// Validate robots.txt
try {
  const robotsContent = fs.readFileSync(ROBOTS_PATH, 'utf-8');
  console.log('✅ robots.txt found');
  
  if (robotsContent.includes('https://www.yoohoo.guru/sitemap.xml')) {
    console.log('✅ robots.txt contains correct canonical sitemap URL');
  } else if (robotsContent.includes('https://yoohoo.guru/sitemap.xml')) {
    console.log('⚠️  robots.txt uses non-canonical URL (should use www.yoohoo.guru)');
  } else {
    console.log('❌ robots.txt does not contain correct canonical sitemap URL');
  }
} catch (error) {
  console.log('❌ robots.txt not found or unreadable');
}

// Validate sitemap.xml
try {
  const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  console.log('✅ sitemap.xml found');
  
  // Check for canonical URLs
  const lines = sitemapContent.split('\n');
  const urlLines = lines.filter(line => line.includes('<loc>'));
  
  let canonicalCount = 0;
  let nonCanonicalCount = 0;
  let guruSubdomainCount = 0;
  
  urlLines.forEach(line => {
    // Extract the URL within the <loc> tag
    const match = line.match(/<loc>(.*?)<\/loc>/);
    if (match && match[1]) {
      try {
        const locUrl = new URL(match[1]);
        if (locUrl.hostname === 'www.yoohoo.guru') {
          canonicalCount++;
        } else if (locUrl.hostname === 'yoohoo.guru') {
          nonCanonicalCount++;
        } else if (locUrl.hostname.endsWith('.yoohoo.guru')) {
          guruSubdomainCount++;
        }
      } catch (e) {
        // Invalid URL, skip
      }
    }
  });
  
  console.log(`✅ Found ${canonicalCount} canonical www URLs`);
  if (nonCanonicalCount > 0) {
    console.log(`⚠️  Found ${nonCanonicalCount} non-canonical URLs (should be updated to www.yoohoo.guru)`);
  } else {
    console.log('✅ All main domain URLs use canonical www format');
  }
  
  console.log(`✅ Found ${guruSubdomainCount} guru subdomain URLs`);
  
  // Check for critical routes
  console.log('\n📋 Checking critical routes...');
  const criticalRoutes = [
    'www.yoohoo.guru/',
    'www.yoohoo.guru/skills',
    'www.yoohoo.guru/angels-list',
    'www.yoohoo.guru/forgot-password',
    'www.yoohoo.guru/dashboard',
    'www.yoohoo.guru/pricing',
    'www.yoohoo.guru/terms',
    'design.yoohoo.guru/about',
    'design.yoohoo.guru/pricing',
    'design.yoohoo.guru/modified',
    'music.yoohoo.guru/about',
    'writing.yoohoo.guru/about'
  ];
  
  criticalRoutes.forEach(route => {
    if (sitemapContent.includes(`https://${route}`)) {
      console.log(`  ✅ ${route}`);
    } else {
      console.log(`  ❌ Missing: ${route}`);
    }
  });
  
} catch (error) {
  console.log('❌ sitemap.xml not found or unreadable');
  console.error(error.message);
}

console.log('\n🏁 SEO validation complete!');