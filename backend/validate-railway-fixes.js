/**
 * Final validation test - simulate the exact Railway error scenarios
 */
const request = require('supertest');
const app = require('./src/index.js');

async function validateRailwayFixes() {
  console.log('🚀 Final Validation: Railway Error Scenarios');
  console.log('================================================');
  
  const tests = [
    {
      name: 'OPTIONS /auth/profile (CORS preflight)',
      method: 'options',
      url: '/auth/profile',
      headers: { 'Origin': 'https://yoohoo.guru' },
      expectedStatus: 200,
      description: 'Should return 200 even for disallowed origins'
    },
    {
      name: 'GET /auth/profile (No auth)',
      method: 'get', 
      url: '/auth/profile',
      headers: {},
      expectedStatus: 401,
      description: 'Should return 401 for missing authentication'
    },
    {
      name: 'OPTIONS /api/gurus/:subdomain/home',
      method: 'options',
      url: '/api/gurus/yoohooguru-frontend-ftzvr797y-intellme/home',
      headers: { 'Origin': 'https://yoohoo.guru' },
      expectedStatus: 200,
      description: 'OPTIONS should work even for invalid subdomains'
    },
    {
      name: 'GET /api/gurus/:subdomain/home (Invalid subdomain)',
      method: 'get',
      url: '/api/gurus/yoohooguru-frontend-ftzvr797y-intellme/home', 
      headers: {},
      expectedStatus: 404,
      description: 'Should return 404 for invalid guru subdomain'
    },
    {
      name: 'OPTIONS /api/gurus/news/:subdomain',
      method: 'options',
      url: '/api/gurus/news/yoohooguru-frontend-ftzvr797y-intellme',
      headers: { 'Origin': 'https://yoohoo.guru' },
      expectedStatus: 200,
      description: 'OPTIONS should work for news endpoints'
    },
    {
      name: 'GET /api/gurus/news/:subdomain (Invalid subdomain)',
      method: 'get',
      url: '/api/gurus/news/yoohooguru-frontend-ftzvr797y-intellme',
      headers: {},
      expectedStatus: 404,
      description: 'Should return 404 for invalid subdomain in news'
    },
    {
      name: 'OPTIONS /gurus/:subdomain/services',
      method: 'options',
      url: '/gurus/yoohooguru-frontend-ftzvr797y-intellme/services',
      headers: { 'Origin': 'https://yoohoo.guru' },
      expectedStatus: 200,
      description: 'OPTIONS should work for non-API guru routes'
    },
    {
      name: 'GET /gurus/:subdomain/services (Invalid subdomain)',
      method: 'get',
      url: '/gurus/yoohooguru-frontend-ftzvr797y-intellme/services',
      headers: {},
      expectedStatus: 404,
      description: 'Should return 404 for invalid subdomain in services'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const response = await request(app)[test.method](test.url)
        .set(test.headers)
        .expect(test.expectedStatus);

      console.log(`✅ ${test.name}`);
      console.log(`   Status: ${response.status} (expected ${test.expectedStatus})`);
      console.log(`   ${test.description}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   Error: ${error.message}`);
      console.log(`   ${test.description}`);
      failed++;
    }
    console.log('');
  }

  console.log('================================================');
  console.log(`🏁 Final Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All Railway error scenarios are now properly handled!');
  } else {
    console.log('⚠️  Some scenarios still need attention.');
  }
  
  process.exit(failed === 0 ? 0 : 1);
}

// Only run if this file is executed directly
if (require.main === module) {
  validateRailwayFixes().catch(console.error);
}