#!/usr/bin/env node

/**
 * Dynamic CORS Origin Sync for Production
 * 
 * This script dynamically fetches and updates allowed origins based on 
 * deployment metadata from Vercel and Railway.
 * 
 * Usage:
 *   node scripts/update-cors-origins.production.js
 * 
 * Environment Variables Required:
 *   - VERCEL_API_TOKEN (optional): For fetching dynamic Vercel domains
 * 
 * The script updates .env.production with the latest CORS_ORIGIN_PRODUCTION value.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const envPath = path.resolve(__dirname, '../.env.production');

// Static origins that should always be included
const staticOrigins = [
  'https://yoohoo.guru',
  'https://www.yoohoo.guru',
  'https://api.yoohoo.guru',  // Explicitly listed as wildcards don't reliably match subdomains
  'https://*.yoohoo.guru',
  'https://*.vercel.app',
];

/**
 * Fetch dynamic Vercel domains using Vercel API
 * Requires VERCEL_API_TOKEN environment variable
 */
async function fetchVercelDomains() {
  try {
    if (!process.env.VERCEL_API_TOKEN) {
      console.warn('⚠️ VERCEL_API_TOKEN not set - skipping dynamic Vercel domain fetch');
      return [];
    }

    const res = await axios.get('https://api.vercel.com/v6/domains', {
      headers: { 
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        'User-Agent': 'yoohoo-cors-sync/1.0.0'
      },
      timeout: 10000
    });
    
    const domains = res.data.domains
      .filter(d => d.verified) // Only include verified domains
      .map(d => `https://${d.name}`);
    
    console.log(`✅ Fetched ${domains.length} verified Vercel domains`);
    return domains;
  } catch (err) {
    console.warn('⚠️ Failed to fetch Vercel domains:', err.message);
    return [];
  }
}

/**
 * Get Railway backend domain
 * This could be extended to fetch from Railway API if needed
 */
function getRailwayDomain() {
  // Static for now, can be fetched via Railway API if needed
  return 'https://api.yoohoo.guru';
}

/**
 * Update the CORS_ORIGIN_PRODUCTION line in .env.production
 */
function updateEnvFile(origins) {
  try {
    // Check if .env.production exists
    if (!fs.existsSync(envPath)) {
      console.error('❌ .env.production file not found at:', envPath);
      process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf-8');
    const originsList = origins.join(',');
    
    // Update the CORS_ORIGIN_PRODUCTION line, or add it if it doesn't exist
    let updatedContent;
    if (envContent.includes('CORS_ORIGIN_PRODUCTION=')) {
      updatedContent = envContent.replace(
        /^CORS_ORIGIN_PRODUCTION=.*$/m,
        `CORS_ORIGIN_PRODUCTION=${originsList}`
      );
    } else {
      // Add the line if it doesn't exist
      updatedContent = envContent + `\nCORS_ORIGIN_PRODUCTION=${originsList}\n`;
    }

    fs.writeFileSync(envPath, updatedContent);
    console.log('✅ CORS_ORIGIN_PRODUCTION updated dynamically in .env.production');
    console.log(`📝 Origins (${origins.length}):`, origins.join(', '));
    
  } catch (error) {
    console.error('❌ Failed to update .env.production:', error.message);
    process.exit(1);
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('🔄 Starting dynamic CORS origin sync...');
    console.log('📁 Env file path:', envPath);
    
    // Fetch dynamic origins
    const vercelOrigins = await fetchVercelDomains();
    const railwayDomain = getRailwayDomain();
    
    // Combine all origins and remove duplicates
    const allOrigins = Array.from(new Set([
      ...staticOrigins,
      ...vercelOrigins,
      railwayDomain
    ]));
    
    // Update the environment file
    updateEnvFile(allOrigins);
    
    console.log('🎉 CORS origin sync completed successfully!');
    
  } catch (error) {
    console.error('❌ CORS origin sync failed:', error.message);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = {
  fetchVercelDomains,
  getRailwayDomain,
  updateEnvFile,
  main
};