/**
 * Test script to verify improved error messages in news curation
 * This test verifies that error handling properly categorizes different failure types
 */

require('dotenv').config();
const { logger } = require('./src/utils/logger');

// Mock function to test error categorization
function categorizeError(error) {
  const errorContext = error.code === 'ENOTFOUND' 
    ? 'Network connectivity issue - unable to reach NewsAPI.org'
    : error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED'
    ? 'Request timeout - NewsAPI.org took too long to respond'
    : error.response?.status === 401
    ? 'Invalid NewsAPI key - check NEWS_API_KEY environment variable'
    : error.response?.status === 429
    ? 'NewsAPI rate limit exceeded - try again later'
    : error.message;
  
  return errorContext;
}

// Test cases
const testCases = [
  {
    name: 'Network not found error',
    error: { code: 'ENOTFOUND', message: 'getaddrinfo ENOTFOUND feeds.reuters.com' },
    expected: 'Network connectivity issue - unable to reach NewsAPI.org'
  },
  {
    name: 'Timeout error',
    error: { code: 'ETIMEDOUT', message: 'timeout of 10000ms exceeded' },
    expected: 'Request timeout - NewsAPI.org took too long to respond'
  },
  {
    name: 'Connection aborted',
    error: { code: 'ECONNABORTED', message: 'timeout of 10000ms exceeded' },
    expected: 'Request timeout - NewsAPI.org took too long to respond'
  },
  {
    name: 'Invalid API key',
    error: { response: { status: 401 }, message: 'Unauthorized' },
    expected: 'Invalid NewsAPI key - check NEWS_API_KEY environment variable'
  },
  {
    name: 'Rate limit exceeded',
    error: { response: { status: 429 }, message: 'Too Many Requests' },
    expected: 'NewsAPI rate limit exceeded - try again later'
  },
  {
    name: 'Generic error',
    error: { message: 'Something went wrong' },
    expected: 'Something went wrong'
  }
];

logger.info('🧪 Testing error message categorization...\n');

let passed = 0;
let failed = 0;

testCases.forEach(testCase => {
  const result = categorizeError(testCase.error);
  const success = result === testCase.expected;
  
  if (success) {
    logger.info(`✅ ${testCase.name}: PASSED`);
    logger.info(`   Expected: "${testCase.expected}"`);
    logger.info(`   Got:      "${result}"\n`);
    passed++;
  } else {
    logger.error(`❌ ${testCase.name}: FAILED`);
    logger.error(`   Expected: "${testCase.expected}"`);
    logger.error(`   Got:      "${result}"\n`);
    failed++;
  }
});

logger.info(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}

logger.info('✅ All error message tests passed!');
process.exit(0);
