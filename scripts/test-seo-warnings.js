#!/usr/bin/env node

/**
 * Manual test to verify SEO warning logic
 */

console.log('🧪 Testing SEO Warning Logic...\n');

// Simulate the warning logic from SEOMetadata.js
function checkForDefaultDescription(description, url) {
  if (!description || description.length < 50 || 
      (description.includes('Learn') && description.includes('skills') && description.includes('expert'))) {
    console.warn(`SEO Warning: Page ${url} is using the default meta description. This may harm indexing.`);
    return true;
  }
  return false;
}

// Test cases
const testCases = [
  {
    description: null,
    url: 'https://www.yoohoo.guru/test1',
    shouldWarn: true,
    case: 'null description'
  },
  {
    description: 'Short desc',
    url: 'https://www.yoohoo.guru/test2', 
    shouldWarn: true,
    case: 'too short description'
  },
  {
    description: 'Learn cooking skills from expert chefs and professionals',
    url: 'https://www.yoohoo.guru/test3',
    shouldWarn: true,
    case: 'default pattern detected'
  },
  {
    description: 'This is a proper, unique description that provides specific value and information about the page content without using default patterns.',
    url: 'https://www.yoohoo.guru/test4',
    shouldWarn: false,
    case: 'proper unique description'
  }
];

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.case}`);
  const warned = checkForDefaultDescription(testCase.description, testCase.url);
  
  if (warned === testCase.shouldWarn) {
    console.log('✅ PASS\n');
    passedTests++;
  } else {
    console.log(`❌ FAIL - Expected warning: ${testCase.shouldWarn}, Got: ${warned}\n`);
  }
});

console.log(`🏁 SEO Warning Logic Test Complete: ${passedTests}/${totalTests} tests passed`);