jest.mock('axios');
jest.mock('../config/appConfig', () => ({ getConfig: jest.fn() }));

const axios = require('axios');
const { getConfig } = require('../config/appConfig');
const AISkillCategorizationService = require('./aiSkillCategorizationService');

const originalOpenAIKey = process.env.OPENAI_API_KEY;

describe('AISkillCategorizationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPENAI_API_KEY = '';
  });

  afterAll(() => {
    process.env.OPENAI_API_KEY = originalOpenAIKey;
  });

  test('returns null when no API keys are configured', async () => {
    getConfig.mockReturnValue({ openrouterApiKey: '', openaiApiKey: '' });

    const service = new AISkillCategorizationService();
    const result = await service.categorizeSkill({ title: 'Aquascaping' });

    expect(result).toBeNull();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('parses OpenRouter responses into allowed categories', async () => {
    getConfig.mockReturnValue({ openrouterApiKey: 'test-key', openaiApiKey: '' });
    axios.post.mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: '{"category":"Creative","confidence":0.82,"reasoning":"Design heavy skill"}'
            }
          }
        ]
      }
    });

    const service = new AISkillCategorizationService();
    const result = await service.categorizeSkill({
      title: 'Aquascaping',
      summary: 'Artful arrangement of aquatic plants and stones'
    });

    expect(result).toMatchObject({
      category: 'Creative',
      provider: 'openrouter',
      confidence: 0.82
    });
  });

  test('falls back to OpenAI when OpenRouter fails', async () => {
    getConfig.mockReturnValue({ openrouterApiKey: 'test-key', openaiApiKey: 'openai-key' });
    axios.post
      .mockRejectedValueOnce(new Error('openrouter down'))
      .mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                content: '{"category":"Practical","reasoning":"Hands-on home skill"}'
              }
            }
          ]
        }
      });

    const service = new AISkillCategorizationService();
    const result = await service.categorizeSkill({ title: 'Home canning' });

    expect(result).toMatchObject({
      category: 'Practical',
      provider: 'openai'
    });
  });
});
