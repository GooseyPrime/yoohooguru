#!/usr/bin/env node
/**
 * Generate CORS Origins Script
 * Automatically updates the CORS_ORIGIN_PRODUCTION string in .env.test
 * with the latest approved frontend and backend domains.
 */

const fs = require('fs');
const path = require('path');

// Static origins that must be included
const staticOrigins = [
  'https://yoohoo.guru',
  'https://www.yoohoo.guru',
  'https://api.yoohoo.guru',
  'https://*.yoohoo.guru',
  'https://*.vercel.app',
];

function updateEnvFile() {
  const envPath = path.resolve(__dirname, '../.env.test');
  
  // Check if .env.test exists
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.test file not found at:', envPath);
    process.exit(1);
  }

  try {
    // Read current content
    const envContent = fs.readFileSync(envPath, 'utf-8');
    
    // Update CORS_ORIGIN_PRODUCTION line
    const updatedContent = envContent.replace(
      /^CORS_ORIGIN_PRODUCTION=.*$/m,
      `CORS_ORIGIN_PRODUCTION=${staticOrigins.join(',')}`
    );

    // Check if any changes were made
    if (envContent === updatedContent) {
      console.log('✅ CORS_ORIGIN_PRODUCTION is already up to date in .env.test');
      return;
    }

    // Write updated content back
    fs.writeFileSync(envPath, updatedContent);
    console.log('✅ CORS_ORIGIN_PRODUCTION updated in .env.test');
    console.log('📝 New value:', staticOrigins.join(','));
    
  } catch (error) {
    console.error('❌ Error updating .env.test:', error.message);
    process.exit(1);
  }
}

function validateOrigins() {
  console.log('🔍 Validating CORS origins:');
  staticOrigins.forEach((origin, index) => {
    const isWildcard = origin.includes('*');
    const protocol = origin.startsWith('https://') ? 'HTTPS' : 'HTTP';
    console.log(`   ${index + 1}. ${origin} (${protocol}${isWildcard ? ', WILDCARD' : ''})`);
  });
  console.log('');
}

function main() {
  console.log('🛠️  CORS Origins Generator');
  console.log('==========================');
  console.log('');
  
  validateOrigins();
  updateEnvFile();
  
  console.log('');
  console.log('💡 Note: https://api.yoohoo.guru is explicitly listed because wildcard');
  console.log('   CORS matching does not reliably cover subdomains in most middleware.');
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = {
  staticOrigins,
  updateEnvFile,
  validateOrigins
};