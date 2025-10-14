#!/usr/bin/env node

/**
 * Sitemap Generation Utility for yoohoo.guru
 * 
 * This script generates or updates the sitemap.xml file for the yoohoo.guru platform.
 * It includes all public routes from both the main site and guru subdomains.
 * 
 * Usage:
 *   node scripts/generate-sitemap.js
 * 
 * This script should be run whenever:
 * - New public routes are added
 * - Subdomains are added or modified
 * - The site structure changes significantly
 */

const fs = require('fs');
const path = require('path');

// Main domain configuration
const MAIN_DOMAIN = 'https://yoohoo.guru';
const CURRENT_DATE = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

// Guru subdomains configuration (matches AppRouter.js)
const GURU_SUBDOMAINS = [
  'cooking', 'music', 'fitness', 'tech', 'art', 'language', 
  'business', 'design', 'writing', 'photography', 'gardening', 'crafts', 'wellness', 
  'finance', 'home', 'data', 'investing', 'marketing', 'sales', 'coding'
];

// Main site public routes
const MAIN_ROUTES = [
  // Core platform pages
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/skills', priority: '0.9', changefreq: 'weekly' },
  { url: '/angels-list', priority: '0.9', changefreq: 'weekly' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/how-it-works', priority: '0.8', changefreq: 'monthly' },
  { url: '/pricing', priority: '0.8', changefreq: 'monthly' },
  
  // Community pages
  { url: '/blog', priority: '0.7', changefreq: 'weekly' },
  { url: '/success-stories', priority: '0.7', changefreq: 'weekly' },
  { url: '/events', priority: '0.6', changefreq: 'weekly' },
  { url: '/forum', priority: '0.6', changefreq: 'daily' },
  { url: '/mentorship', priority: '0.6', changefreq: 'weekly' },
  
  // Support pages
  { url: '/help', priority: '0.5', changefreq: 'monthly' },
  { url: '/contact', priority: '0.5', changefreq: 'monthly' },
  { url: '/safety', priority: '0.5', changefreq: 'monthly' },
  
  // Legal pages
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms', priority: '0.3', changefreq: 'yearly' },
  
  // Authentication pages (publicly accessible)
  { url: '/login', priority: '0.4', changefreq: 'yearly' },
  { url: '/signup', priority: '0.4', changefreq: 'yearly' }
];

// Guru subdomain routes
const GURU_ROUTES = [
  { url: '/', priority: '0.8', changefreq: 'weekly' },
  { url: '/about', priority: '0.6', changefreq: 'monthly' },
  { url: '/blog', priority: '0.6', changefreq: 'weekly' },
  { url: '/services', priority: '0.7', changefreq: 'weekly' },
  { url: '/contact', priority: '0.5', changefreq: 'monthly' }
];

/**
 * Generate a complete sitemap XML
 */
function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Main Domain URLs -->`;

  // Add main site routes
  MAIN_ROUTES.forEach(route => {
    xml += `
  <url>
    <loc>${MAIN_DOMAIN}${route.url}</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  });

  // Add guru subdomain routes
  xml += `
  
  <!-- Guru Subdomain Landing Pages -->`;
  
  GURU_SUBDOMAINS.forEach(subdomain => {
    const subdomainName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
    xml += `
  <!-- ${subdomainName} Guru -->`;
    
    GURU_ROUTES.forEach(route => {
      xml += `
  <url>
    <loc>https://${subdomain}.yoohoo.guru${route.url}</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    });
    
    if (subdomain !== GURU_SUBDOMAINS[GURU_SUBDOMAINS.length - 1]) {
      xml += '\n';
    }
  });

  xml += `
</urlset>`;

  return xml;
}

/**
 * Write the sitemap to the public directory
 */
function writeSitemap() {
  const sitemapContent = generateSitemap();
  const outputPath = path.join(__dirname, '..', 'frontend', 'public', 'sitemap.xml');
  
  try {
    fs.writeFileSync(outputPath, sitemapContent, 'utf8');
    console.log('✅ Sitemap generated successfully!');
    console.log(`📍 Location: ${outputPath}`);
    console.log(`📊 URLs included: ${MAIN_ROUTES.length + (GURU_SUBDOMAINS.length * GURU_ROUTES.length)}`);
    console.log(`🗓️  Last updated: ${CURRENT_DATE}`);
    console.log('\n📋 Summary:');
    console.log(`   • Main site routes: ${MAIN_ROUTES.length}`);
    console.log(`   • Guru subdomains: ${GURU_SUBDOMAINS.length}`);
    console.log(`   • Routes per subdomain: ${GURU_ROUTES.length}`);
    console.log(`   • Total subdomain routes: ${GURU_SUBDOMAINS.length * GURU_ROUTES.length}`);
    console.log(`   • Total URLs: ${MAIN_ROUTES.length + (GURU_SUBDOMAINS.length * GURU_ROUTES.length)}`);
  } catch (error) {
    console.error('❌ Error writing sitemap:', error.message);
    process.exit(1);
  }
}

/**
 * Validate the existing sitemap structure
 */
function validateSitemap() {
  const sitemapPath = path.join(__dirname, '..', 'frontend', 'public', 'sitemap.xml');
  
  if (!fs.existsSync(sitemapPath)) {
    console.log('⚠️  No existing sitemap found. A new one will be created.');
    return false;
  }
  
  try {
    const content = fs.readFileSync(sitemapPath, 'utf8');
    const urlCount = (content.match(/<url>/g) || []).length;
    const expectedCount = MAIN_ROUTES.length + (GURU_SUBDOMAINS.length * GURU_ROUTES.length);
    
    console.log(`📊 Current sitemap contains ${urlCount} URLs`);
    console.log(`📊 Expected URL count: ${expectedCount}`);
    
    if (urlCount !== expectedCount) {
      console.log('⚠️  URL count mismatch. Sitemap may need updating.');
      return false;
    }
    
    console.log('✅ Existing sitemap structure looks correct.');
    return true;
  } catch (error) {
    console.log('⚠️  Error reading existing sitemap:', error.message);
    return false;
  }
}

// Main execution
if (require.main === module) {
  console.log('🗺️  yoohoo.guru Sitemap Generator\n');
  
  // Validate existing sitemap
  const isValid = validateSitemap();
  
  if (!isValid || process.argv.includes('--force')) {
    if (process.argv.includes('--force')) {
      console.log('🔄 Force regeneration requested.\n');
    }
    writeSitemap();
  } else {
    console.log('\n✅ Sitemap is up to date. Use --force to regenerate anyway.');
  }
  
  console.log('\n💡 Tips:');
  console.log('   • Run this script after adding new public routes');
  console.log('   • Update GURU_SUBDOMAINS array when adding new subdomains');
  console.log('   • Submit sitemap to search engines: https://yoohoo.guru/sitemap.xml');
  console.log('   • Validate sitemap: https://www.xml-sitemaps.com/validate-xml-sitemap.html');
}

module.exports = {
  generateSitemap,
  writeSitemap,
  validateSitemap,
  MAIN_ROUTES,
  GURU_SUBDOMAINS,
  GURU_ROUTES
};