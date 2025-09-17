#!/usr/bin/env node

/**
 * Copilot Agent - Intelligent comment processing and natural language instruction detection
 * This script processes GitHub PR and issue comments to identify actionable instructions
 * and respond appropriately, replacing the old <comment_new> tag-based system.
 */

const fs = require('fs').promises;
const path = require('path');

class CommentParser {
  constructor() {
    // Action patterns for natural language detection
    this.actionPatterns = [
      // Fix patterns
      /(?:fix|resolve|correct|address|debug)\s+(?:the\s+)?(.+)/i,
      // Implementation patterns
      /(?:implement|add|create|build|develop)\s+(.+)/i,
      // Update patterns
      /(?:update|modify|change|revise|improve)\s+(.+)/i,
      // Remove patterns
      /(?:remove|delete|eliminate)\s+(.+)/i,
      // Test patterns
      /(?:test|validate|verify)\s+(.+)/i,
      // Documentation patterns
      /(?:document|write|update)\s+(?:the\s+)?(.+)/i,
    ];

    // Priority indicators
    this.priorityPatterns = {
      urgent: /(?:urgent|critical|emergency|asap|immediately)/i,
      high: /(?:important|priority|high|serious)/i,
      medium: /(?:should|need to|required)/i,
    };

    // File reference patterns
    this.filePatterns = [
      /(?:in|from|to)\s+([a-zA-Z0-9/_.-]+\.(?:js|jsx|ts|tsx|py|md|json|yml|yaml|css|scss|html))/gi,
      /`([a-zA-Z0-9/_.-]+\.(?:js|jsx|ts|tsx|py|md|json|yml|yaml|css|scss|html))`/gi,
      /(?:file|script|component):\s*([a-zA-Z0-9/_.-]+\.(?:js|jsx|ts|tsx|py|md|json|yml|yaml|css|scss|html))/gi,
      /([a-zA-Z0-9/_-]+\/[a-zA-Z0-9/_-]+\.(?:js|jsx|ts|tsx|py|md|json|yml|yaml|css|scss|html))/gi,
    ];

    // Forbidden patterns for safety
    this.forbiddenPatterns = [
      /rm\s+-rf/i,
      /sudo/i,
      /\|\s*sh/i,
      /eval\s*\(/i,
      /exec\s*\(/i,
    ];
  }

  /**
   * Parse a comment to extract actionable instructions
   * @param {string} commentBody - The comment text to parse
   * @param {string} commentUser - The user who made the comment
   * @returns {Object} Parsed comment data
   */
  parseComment(commentBody, commentUser) {
    const result = {
      isActionable: false,
      hasCommentNewTags: false,
      actions: [],
      priority: 'medium',
      fileReferences: [],
      forbiddenPatterns: [],
      confidence: 0,
      rawText: commentBody,
      user: commentUser,
    };

    // Skip bot comments to prevent loops
    if (commentUser === 'Copilot' || commentUser.includes('[bot]')) {
      result.confidence = 0;
      return result;
    }

    // Check for traditional comment_new tags first
    const commentNewMatches = commentBody.match(/<comment_new>(.*?)<\/comment_new>/gs);
    if (commentNewMatches) {
      result.hasCommentNewTags = true;
      result.isActionable = true;
      result.confidence = 1.0;
      result.actions = commentNewMatches.map(match => ({
        type: 'tagged',
        instruction: match.replace(/<\/?comment_new>/g, '').trim(),
        confidence: 1.0,
      }));
    }

    // Check for forbidden patterns
    for (const pattern of this.forbiddenPatterns) {
      if (pattern.test(commentBody)) {
        result.forbiddenPatterns.push(pattern.source);
      }
    }

    // If forbidden patterns found, mark as not actionable
    if (result.forbiddenPatterns.length > 0) {
      result.isActionable = false;
      result.confidence = 0;
      return result;
    }

    // Extract file references
    for (const pattern of this.filePatterns) {
      let match;
      while ((match = pattern.exec(commentBody)) !== null) {
        if (!result.fileReferences.includes(match[1])) {
          result.fileReferences.push(match[1]);
        }
      }
    }

    // Detect priority level
    for (const [level, pattern] of Object.entries(this.priorityPatterns)) {
      if (pattern.test(commentBody)) {
        result.priority = level;
        break;
      }
    }

    // Natural language action detection
    let actionCount = 0;
    for (const pattern of this.actionPatterns) {
      const matches = commentBody.match(pattern);
      if (matches) {
        result.actions.push({
          type: 'natural',
          instruction: matches[1] ? matches[1].trim() : matches[0].trim(),
          confidence: 0.8,
          pattern: pattern.source,
        });
        actionCount++;
      }
    }

    // Check for @copilot mentions
    const isMentioned = /@copilot/i.test(commentBody);
    
    // Calculate confidence based on various factors
    let confidence = 0;
    if (result.hasCommentNewTags) confidence = 1.0;
    else {
      if (isMentioned) confidence += 0.4;
      if (actionCount > 0) confidence += 0.4 * Math.min(actionCount, 3);
      if (result.fileReferences.length > 0) confidence += 0.2;
      if (result.priority === 'urgent') confidence += 0.1;
      
      // Additional confidence boost for clear imperative sentences
      if (/(?:^|\s)(fix|implement|add|update|create|remove|delete)\s+/i.test(commentBody)) {
        confidence += 0.2;
      }
    }
    
    result.confidence = Math.min(confidence, 1.0);
    result.isActionable = result.confidence > 0.3 || result.hasCommentNewTags;

    return result;
  }
}

class CopilotAgent {
  constructor() {
    this.parser = new CommentParser();
    this.githubToken = process.env.GITHUB_TOKEN;
    this.repository = process.env.REPOSITORY;
    this.prNumber = process.env.PR_NUMBER;
    this.logDir = path.join(process.cwd(), 'logs');
  }

  async ensureLogDirectory() {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
    } catch (error) {
      console.warn('Could not create log directory:', error.message);
    }
  }

  async log(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      metadata,
    };
    
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
    
    try {
      await this.ensureLogDirectory();
      const logFile = path.join(this.logDir, 'comment-analysis.log');
      await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.warn('Could not write to log file:', error.message);
    }
  }

  async processComment() {
    try {
      // Check if this is demo mode
      if (process.argv.includes('--demo')) {
        const CopilotAgentTest = require('./test-copilot-agent.js');
        const tester = new CopilotAgentTest();
        tester.runDemo();
        return;
      }

      const commentBody = process.env.COMMENT_BODY;
      const commentUser = process.env.COMMENT_USER;

      if (!commentBody || !commentUser) {
        await this.log('error', 'Missing comment data from environment variables');
        return;
      }

      await this.log('info', 'Processing comment from user', {
        user: commentUser,
        repository: this.repository,
        prNumber: this.prNumber,
      });

      // Parse the comment for actionable instructions
      const parsed = this.parser.parseComment(commentBody, commentUser);

      await this.log('info', 'Comment parsing completed', {
        isActionable: parsed.isActionable,
        hasCommentNewTags: parsed.hasCommentNewTags,
        actionsFound: parsed.actions.length,
        confidence: parsed.confidence,
        priority: parsed.priority,
        fileReferences: parsed.fileReferences,
        forbiddenPatterns: parsed.forbiddenPatterns,
      });

      // If the comment is actionable, log the analysis
      if (parsed.isActionable) {
        await this.log('info', 'Comment identified as actionable', {
          commentId: this.prNumber,
          actionsFound: parsed.actions.length,
          priority: parsed.priority,
          hasCommentNewTags: parsed.hasCommentNewTags,
          fileReferences: parsed.fileReferences,
        });

        // Log each action found
        for (const action of parsed.actions) {
          await this.log('info', 'Action identified', {
            type: action.type,
            instruction: action.instruction,
            confidence: action.confidence,
          });
        }

        // In a full implementation, this is where we would:
        // 1. Create a new branch
        // 2. Make the requested changes
        // 3. Commit and push
        // 4. Create or update a pull request
        // 5. Add a comment with the results

        await this.log('info', 'Comment processing completed successfully');
      } else {
        await this.log('info', 'Comment not identified as actionable', {
          confidence: parsed.confidence,
          reason: parsed.confidence < 0.3 ? 'Low confidence score' : 'No clear instructions found',
        });
      }

    } catch (error) {
      await this.log('error', 'Error processing comment', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

// Main execution
async function main() {
  const agent = new CopilotAgent();
  await agent.processComment();
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error in copilot agent:', error);
    process.exit(1);
  });
}

module.exports = { CommentParser, CopilotAgent };