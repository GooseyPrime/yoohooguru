#!/usr/bin/env node

/**
 * Comprehensive test suite for the Copilot Agent automation system
 * Tests comment parsing, natural language detection, and safety features
 */

const { CommentParser, CopilotAgent } = require('./copilot-agent.js');

class CopilotAgentTest {
  constructor() {
    this.parser = new CommentParser();
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  test(description, testFunction) {
    try {
      const result = testFunction();
      if (result) {
        console.log(`✅ PASS: ${description}`);
        this.passed++;
      } else {
        console.log(`❌ FAIL: ${description}`);
        this.failed++;
      }
    } catch (error) {
      console.log(`❌ ERROR: ${description} - ${error.message}`);
      this.failed++;
    }
  }

  runAllTests() {
    console.log('🧪 Running Copilot Agent Tests...\n');

    // Test 1: Traditional comment_new tags
    this.test('Should detect traditional <comment_new> tags', () => {
      const result = this.parser.parseComment(
        '<comment_new>Fix the authentication bug in src/auth.js</comment_new>',
        'testuser'
      );
      return result.isActionable && result.hasCommentNewTags && result.confidence === 1.0;
    });

    // Test 2: Natural language with @copilot mention
    this.test('Should detect natural language with @copilot mention', () => {
      const result = this.parser.parseComment(
        '@copilot please fix the authentication bug in src/auth.js',
        'testuser'
      );
      return result.isActionable && !result.hasCommentNewTags && result.confidence > 0.5;
    });

    // Test 3: Natural language without mention but clear action
    this.test('Should detect clear action verbs without mention', () => {
      const result = this.parser.parseComment(
        'Fix the authentication bug in the login system',
        'testuser'
      );
      return result.isActionable && result.actions.length > 0;
    });

    // Test 4: Priority detection - urgent
    this.test('Should detect urgent priority', () => {
      const result = this.parser.parseComment(
        'URGENT: Fix the security vulnerability immediately!',
        'testuser'
      );
      return result.priority === 'urgent' && result.isActionable;
    });

    // Test 5: Priority detection - high
    this.test('Should detect high priority', () => {
      const result = this.parser.parseComment(
        'This is an important bug that needs to be fixed',
        'testuser'
      );
      return result.priority === 'high';
    });

    // Test 6: File reference detection
    this.test('Should extract file references', () => {
      const result = this.parser.parseComment(
        'Update the configuration in `config/database.js` and src/auth.js',
        'testuser'
      );
      return result.fileReferences.length === 2 && 
             result.fileReferences.includes('config/database.js') &&
             result.fileReferences.includes('src/auth.js');
    });

    // Test 7: Multiple action types
    this.test('Should detect multiple action types', () => {
      const result = this.parser.parseComment(
        'Fix the bug in auth.js and update the README.md documentation',
        'testuser'
      );
      return result.actions.length >= 2;
    });

    // Test 8: Bot comment filtering
    this.test('Should ignore bot comments', () => {
      const result = this.parser.parseComment(
        'Fix this critical bug now!',
        'Copilot'
      );
      return !result.isActionable && result.confidence === 0;
    });

    // Test 9: Forbidden pattern detection
    this.test('Should detect forbidden patterns', () => {
      const result = this.parser.parseComment(
        'Run sudo rm -rf / to clean up the system',
        'testuser'
      );
      return !result.isActionable && result.forbiddenPatterns.length > 0;
    });

    // Test 10: Low confidence filtering
    this.test('Should filter out low-confidence comments', () => {
      const result = this.parser.parseComment(
        'I think this might be a good idea maybe',
        'testuser'
      );
      return !result.isActionable && result.confidence < 0.3;
    });

    // Test 11: Implementation instructions
    this.test('Should detect implementation instructions', () => {
      const result = this.parser.parseComment(
        'Implement the new user registration feature with email validation',
        'testuser'
      );
      return result.isActionable && result.actions.some(a => a.type === 'natural');
    });

    // Test 12: Update instructions
    this.test('Should detect update instructions', () => {
      const result = this.parser.parseComment(
        'Update the API documentation to reflect the new endpoints',
        'testuser'
      );
      return result.isActionable && result.actions.length > 0;
    });

    // Test 13: Complex multi-line instructions
    this.test('Should handle complex multi-line instructions', () => {
      const complexComment = `
        @copilot - it is apparent you did not read the pdf that was attached. 
        Fix the HomePage component to properly handle geolocation errors.
        Add error handling for the city detection modal.
        Update the API integration in the AngelsListPage.
      `;
      const result = this.parser.parseComment(complexComment, 'testuser');
      return result.isActionable && result.actions.length >= 2;
    });

    // Test 14: Real-world PR comment simulation
    this.test('Should handle real PR comment structure', () => {
      const prComment = `
        @copilot - review all comments in this pr and continue to complete the work requested.
        
        The specific issues are:
        - Fix the GitHub Actions workflow artifact upload issue
        - Implement the HomePage geolocation error handling 
        - Connect the AngelsListPage to backend APIs
        - Add complete legal text to Terms and Privacy Policy pages
      `;
      const result = this.parser.parseComment(prComment, 'GooseyPrime');
      return result.isActionable && result.fileReferences.length === 0 && result.actions.length > 0;
    });

    // Test 15: Action confidence scoring
    this.test('Should properly score action confidence', () => {
      const highConfidence = this.parser.parseComment(
        '@copilot fix the critical security bug in auth.js immediately',
        'testuser'
      );
      const lowConfidence = this.parser.parseComment(
        'maybe we could consider looking into this sometime',
        'testuser'
      );
      return highConfidence.confidence > lowConfidence.confidence;
    });

    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
    
    if (this.failed === 0) {
      console.log('\n🎉 All tests passed! Copilot Agent system is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please review the implementation.');
      process.exit(1);
    }
  }

  // Demo mode with sample comments
  runDemo() {
    console.log('🎪 Copilot Agent Demo Mode\n');

    const sampleComments = [
      {
        body: '<comment_new>Fix the authentication bug in src/auth.js</comment_new>',
        user: 'developer',
        description: 'Traditional tagged comment'
      },
      {
        body: '@copilot please fix the authentication bug in src/auth.js',
        user: 'developer',
        description: 'Natural language with mention'
      },
      {
        body: 'URGENT: Security vulnerability in the login system needs immediate attention!',
        user: 'security-team',
        description: 'High priority natural language'
      },
      {
        body: 'Implement error handling for geolocation in HomePage.js and add fallback modal',
        user: 'product-manager',
        description: 'Implementation request with file reference'
      },
      {
        body: 'I think maybe we could possibly consider looking into this at some point',
        user: 'casual-observer',
        description: 'Low confidence comment'
      },
      {
        body: 'Run sudo rm -rf / to fix the disk space issue',
        user: 'malicious-user',
        description: 'Forbidden command attempt'
      }
    ];

    sampleComments.forEach((sample, index) => {
      console.log(`📝 Sample ${index + 1}: ${sample.description}`);
      console.log(`Comment: "${sample.body}"`);
      console.log(`User: ${sample.user}`);
      
      const result = this.parser.parseComment(sample.body, sample.user);
      
      console.log(`Result:`);
      console.log(`  ✓ Actionable: ${result.isActionable}`);
      console.log(`  ✓ Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`  ✓ Priority: ${result.priority}`);
      console.log(`  ✓ Actions found: ${result.actions.length}`);
      console.log(`  ✓ File references: ${result.fileReferences.length}`);
      console.log(`  ✓ Safety issues: ${result.forbiddenPatterns.length}`);
      
      if (result.actions.length > 0) {
        console.log(`  📋 Actions:`);
        result.actions.forEach(action => {
          console.log(`    - ${action.type}: "${action.instruction}" (${(action.confidence * 100).toFixed(1)}%)`);
        });
      }
      
      console.log('');
    });
  }
}

// Main execution
async function main() {
  const tester = new CopilotAgentTest();
  
  if (process.argv.includes('--demo')) {
    tester.runDemo();
  } else {
    tester.runAllTests();
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error in copilot agent tests:', error);
    process.exit(1);
  });
}

module.exports = CopilotAgentTest;