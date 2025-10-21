import { browseSkills, getSkillSuggestions, getAiSkillMatches, getSkillDetails, getSkillExchangePairs } from './skillsApi';
import * as api from './api';

// Mock the api module
jest.mock('./api');

describe('skillsApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('browseSkills', () => {
    it('should correctly extract data from backend response', async () => {
      // Mock backend response structure: { success, data: { skills, categories, total } }
      const mockResponse = {
        success: true,
        data: {
          skills: [
            { id: '1', title: 'JavaScript', category: 'Programming' },
            { id: '2', title: 'React', category: 'Programming' }
          ],
          categories: ['Programming', 'Design'],
          total: 2
        }
      };

      api.apiGet.mockResolvedValue(mockResponse);

      const result = await browseSkills({ category: 'Programming' });

      expect(result.success).toBe(true);
      expect(result.skills).toHaveLength(2);
      expect(result.skills[0].title).toBe('JavaScript');
      expect(result.categories).toEqual(['Programming', 'Design']);
      expect(result.total).toBe(2);
    });

    it('should handle empty response data gracefully', async () => {
      const mockResponse = {
        success: true,
        data: {}
      };

      api.apiGet.mockResolvedValue(mockResponse);

      const result = await browseSkills();

      expect(result.success).toBe(true);
      expect(result.skills).toEqual([]);
      expect(result.categories).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should handle errors and return error response', async () => {
      const mockError = new Error('Network error');
      api.apiGet.mockRejectedValue(mockError);

      // Suppress console.error for this test
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await browseSkills();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
      expect(result.skills).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getSkillSuggestions', () => {
    it('should correctly extract suggestions from backend response', async () => {
      const mockResponse = {
        success: true,
        data: {
          suggestions: ['JavaScript', 'Java', 'Python']
        }
      };

      api.apiGet.mockResolvedValue(mockResponse);

      const result = await getSkillSuggestions('Ja', 10);

      expect(result.success).toBe(true);
      expect(result.suggestions).toHaveLength(3);
      expect(result.suggestions[0]).toBe('JavaScript');
    });

    it('should return empty array for queries less than 2 characters', async () => {
      const result = await getSkillSuggestions('J');

      expect(result.success).toBe(true);
      expect(result.suggestions).toEqual([]);
      expect(api.apiGet).not.toHaveBeenCalled();
    });
  });

  describe('getAiSkillMatches', () => {
    it('should correctly extract matches from backend response', async () => {
      const mockResponse = {
        success: true,
        data: {
          matches: [
            { userId: 'user1', score: 10 },
            { userId: 'user2', score: 8 }
          ],
          targetUserId: 'currentUser',
          algorithm: 'v1'
        }
      };

      api.apiGet.mockResolvedValue(mockResponse);

      const result = await getAiSkillMatches('currentUser');

      expect(result.success).toBe(true);
      expect(result.matches).toHaveLength(2);
      expect(result.targetUserId).toBe('currentUser');
      expect(result.algorithm).toBe('v1');
    });

    it('should return error for missing userId', async () => {
      const result = await getAiSkillMatches(null);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User ID is required');
      expect(result.matches).toEqual([]);
    });
  });

  describe('getSkillDetails', () => {
    it('should correctly extract skill details from backend response', async () => {
      const mockResponse = {
        success: true,
        data: {
          skill: { id: '1', title: 'JavaScript' },
          category: 'Programming',
          teachers: [{ id: 'teacher1' }],
          learners: [{ id: 'learner1' }],
          totalTeachers: 1,
          totalLearners: 1
        }
      };

      api.apiGet.mockResolvedValue(mockResponse);

      const result = await getSkillDetails('JavaScript');

      expect(result.success).toBe(true);
      expect(result.skill.title).toBe('JavaScript');
      expect(result.category).toBe('Programming');
      expect(result.teachers).toHaveLength(1);
      expect(result.learners).toHaveLength(1);
    });

    it('should return error for missing skill name', async () => {
      const result = await getSkillDetails(null);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Skill name is required');
    });
  });

  describe('getSkillExchangePairs', () => {
    it('should correctly extract exchange pairs from backend response', async () => {
      const mockResponse = {
        success: true,
        data: {
          exchangePairs: [
            { userA: 'user1', userB: 'user2', score: 15 }
          ],
          totalPairs: 1,
          algorithm: 'v1'
        }
      };

      api.apiGet.mockResolvedValue(mockResponse);

      const result = await getSkillExchangePairs();

      expect(result.success).toBe(true);
      expect(result.exchangePairs).toHaveLength(1);
      expect(result.totalPairs).toBe(1);
      expect(result.algorithm).toBe('v1');
    });

    it('should handle empty response data gracefully', async () => {
      const mockResponse = {
        success: true,
        data: {}
      };

      api.apiGet.mockResolvedValue(mockResponse);

      const result = await getSkillExchangePairs();

      expect(result.success).toBe(true);
      expect(result.exchangePairs).toEqual([]);
      expect(result.totalPairs).toBe(0);
    });
  });
});
