#!/usr/bin/env node
/**
 * Production Deployment Verification Script
 * Verifies that frontend/backend decoupling is working correctly
 */

const https = require('https');
const http = require('http');

const TIMEOUT = 10000; // 10 seconds

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const timeout = setTimeout(() => reject(new Error('Request timeout')), TIMEOUT);
    
    protocol.get(url, (res) => {
      clearTimeout(timeout);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ 
        status: res.statusCode, 
        headers: res.headers, 
        body: data 
      }));
    }).on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

async function verifyDeployment() {
  console.log('🔍 Verifying yoohoo.guru deployment separation...\n');
  
  const tests = [
    {
      name: 'Backend API Health Check',
      url: 'https://api.yoohoo.guru/health',
      expectJson: true,
      expectStatus: 200,
      expectContent: 'timestamp'
    },
    {
      name: 'Backend API Root (should NOT serve HTML)',
      url: 'https://api.yoohoo.guru/',
      expectJson: true,
      expectStatus: 404,
      expectContent: 'API-only server'
    },
    {
      name: 'Backend API Info',
      url: 'https://api.yoohoo.guru/api',
      expectJson: true,
      expectStatus: 200,
      expectContent: 'Welcome to yoohoo.guru API'
    },
    {
      name: 'Frontend www (should serve HTML)',
      url: 'https://www.yoohoo.guru/',
      expectHtml: true,
      expectStatus: 200,
      expectContent: '<!DOCTYPE html>'
    },
    {
      name: 'Frontend apex (should serve HTML)',  
      url: 'https://yoohoo.guru/',
      expectHtml: true,
      expectStatus: 200,
      expectContent: '<!DOCTYPE html>'
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await makeRequest(test.url);
      
      // Check status code
      if (test.expectStatus && response.status !== test.expectStatus) {
        throw new Error(`Expected status ${test.expectStatus}, got ${response.status}`);
      }
      
      // Check content type
      const contentType = response.headers['content-type'] || '';
      if (test.expectJson && !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response, got ${contentType}`);
      }
      if (test.expectHtml && !contentType.includes('text/html')) {
        throw new Error(`Expected HTML response, got ${contentType}`);
      }
      
      // Check content
      if (test.expectContent && !response.body.includes(test.expectContent)) {
        throw new Error(`Expected content "${test.expectContent}" not found`);
      }
      
      console.log(`  ✅ PASS - Status: ${response.status}, Type: ${contentType.split(';')[0]}`);
      passed++;
      
    } catch (error) {
      console.log(`  ❌ FAIL - ${error.message}`);
      failed++;
    }
    console.log('');
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Frontend and backend are properly decoupled.');
    console.log('\nNext steps:');
    console.log('1. Test Google Authentication on https://yoohoo.guru/login');
    console.log('2. Verify images load correctly');
    console.log('3. Test Modified Masters and other features');
  } else {
    console.log('\n⚠️  Some tests failed. Check deployment configuration:');
    console.log('1. Railway: Ensure SERVE_FRONTEND=false');
    console.log('2. Vercel: Ensure REACT_APP_API_URL=https://api.yoohoo.guru'); 
    console.log('3. Check CORS_ORIGIN_PRODUCTION includes frontend domains');
  }
  
  process.exit(failed === 0 ? 0 : 1);
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('\n❌ Unhandled error:', error.message);
  process.exit(1);
});

// Run verification
verifyDeployment().catch(error => {
  console.error('\n❌ Verification failed:', error.message);
  process.exit(1);
});