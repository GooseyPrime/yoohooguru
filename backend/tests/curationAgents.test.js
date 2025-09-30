/**
 * Tests for Curation Agents Error Handling and Startup Diagnostics
 */

const { 
  startCurationAgents, 
  getCurationAgentStatus, 
  newsCurationAgent, 
  blogCurationAgent 
} = require('../src/agents/curationAgents');
const { logger } = require('../src/utils/logger');

// Mock logger to capture log messages in tests
jest.mock('../src/utils/logger');

// Mock node-cron to prevent actual cron jobs in tests
jest.mock('node-cron', () => ({
  schedule: jest.fn(() => ({ destroy: jest.fn() }))
}));

// Mock Firebase config
jest.mock('../src/config/firebase', () => ({
  getFirestore: jest.fn()
}));

// Mock subdomains config
jest.mock('../src/config/subdomains', () => ({
  getAllSubdomains: jest.fn(),
  getSubdomainConfig: jest.fn()
}));

describe('Curation Agents Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset process.env
    delete process.env.DISABLE_CURATION_AGENTS;
    delete process.env.NODE_ENV;
  });

  describe('startCurationAgents()', () => {
    it('should start agents successfully when all dependencies are available', () => {
      const { getFirestore } = require('../src/config/firebase');
      const { getAllSubdomains } = require('../src/config/subdomains');
      
      getFirestore.mockReturnValue({}); // Mock Firestore instance
      getAllSubdomains.mockReturnValue(['tech', 'cooking', 'fitness']);
      
      expect(() => startCurationAgents()).not.toThrow();
      expect(logger.info).toHaveBeenCalledWith('🤖 All AI curation agents started successfully');
    });

    it('should handle disabled agents gracefully', () => {
      process.env.DISABLE_CURATION_AGENTS = 'true';
      
      startCurationAgents();
      
      expect(logger.info).toHaveBeenCalledWith('ℹ️ Curation agents are disabled via DISABLE_CURATION_AGENTS environment variable');
      
      const status = getCurationAgentStatus();
      expect(status.newsAgent.status).toBe('disabled');
      expect(status.blogAgent.status).toBe('disabled');
    });

    it('should log detailed errors when Firebase is not available', () => {
      const { getFirestore } = require('../src/config/firebase');
      
      getFirestore.mockImplementation(() => {
        throw new Error('Firebase not initialized. Call initializeFirebase() first.');
      });
      
      startCurationAgents();
      
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('News curation agent failed to start:'),
        expect.objectContaining({
          error: expect.stringContaining('Firebase not initialized'),
          stack: expect.any(String)
        })
      );
    });

    it('should log detailed errors when subdomains are not configured', () => {
      const { getFirestore } = require('../src/config/firebase');
      const { getAllSubdomains } = require('../src/config/subdomains');
      
      getFirestore.mockReturnValue({});
      getAllSubdomains.mockReturnValue([]);
      
      startCurationAgents();
      
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('News curation agent failed to start:'),
        expect.objectContaining({
          error: expect.stringContaining('No subdomains configured'),
          stack: expect.any(String)
        })
      );
    });

    it('should continue startup even when some agents fail', () => {
      const { getFirestore } = require('../src/config/firebase');
      
      // Make Firebase fail for this test
      getFirestore.mockImplementation(() => {
        throw new Error('Connection failed');
      });
      
      startCurationAgents();
      
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Curation agent startup completed with errors: 2 agent(s) failed to start:')
      );
    });

    it('should show development mode message in non-production environments', () => {
      process.env.NODE_ENV = 'development';
      const { getFirestore } = require('../src/config/firebase');
      const { getAllSubdomains } = require('../src/config/subdomains');
      
      getFirestore.mockReturnValue({});
      getAllSubdomains.mockReturnValue(['tech']);
      
      startCurationAgents();
      
      expect(logger.info).toHaveBeenCalledWith('🔧 Curation agents running in development mode');
    });
  });

  describe('getCurationAgentStatus()', () => {
    it('should return current agent status', () => {
      const status = getCurationAgentStatus();
      
      expect(status).toHaveProperty('newsAgent');
      expect(status).toHaveProperty('blogAgent');
      expect(status).toHaveProperty('environment');
      expect(status).toHaveProperty('timestamp');
      
      expect(status.newsAgent).toHaveProperty('status');
      expect(status.newsAgent).toHaveProperty('error');
      expect(status.newsAgent).toHaveProperty('lastStarted');
    });

    it('should include environment information', () => {
      process.env.NODE_ENV = 'test';
      const status = getCurationAgentStatus();
      
      expect(status.environment).toBe('test');
      expect(status.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
    });
  });

  describe('Individual Agent Dependency Validation', () => {
    it('should validate NewsAgent dependencies correctly', () => {
      const { getFirestore } = require('../src/config/firebase');
      const { getAllSubdomains } = require('../src/config/subdomains');
      
      getFirestore.mockReturnValue({});
      getAllSubdomains.mockReturnValue(['tech', 'cooking']);
      
      expect(() => {
        newsCurationAgent.validateDependencies();
      }).not.toThrow();
      
      expect(logger.info).toHaveBeenCalledWith('✅ News agent dependencies validated - 2 subdomains configured');
    });

    it('should validate BlogAgent dependencies correctly', () => {
      const { getFirestore } = require('../src/config/firebase');
      const { getAllSubdomains } = require('../src/config/subdomains');
      
      getFirestore.mockReturnValue({});
      getAllSubdomains.mockReturnValue(['tech', 'cooking', 'fitness']);
      
      expect(() => {
        blogCurationAgent.validateDependencies();
      }).not.toThrow();
      
      expect(logger.info).toHaveBeenCalledWith('✅ Blog agent dependencies validated - 3 subdomains configured');
    });

    it('should throw detailed errors when Firebase is unavailable', () => {
      const { getFirestore } = require('../src/config/firebase');
      
      getFirestore.mockImplementation(() => {
        throw new Error('Firebase not initialized. Call initializeFirebase() first.');
      });
      
      expect(() => {
        newsCurationAgent.validateDependencies();
      }).toThrow('News curation agent dependency validation failed: Firebase not initialized. Call initializeFirebase() first.');
    });
  });
});