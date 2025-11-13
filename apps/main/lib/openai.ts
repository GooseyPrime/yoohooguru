import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIMatchmakingRequest {
  guruSkills: string[];
  guruExperience: string;
  guruAvailability: string;
  gunuNeeds: string;
  gunuLevel: string;
  gunuGoals: string;
}

export interface UserProfile {
  name?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  [key: string]: unknown;
}

export interface AIProfileAssistantRequest {
  userType: 'guru' | 'gunu' | 'angel' | 'hero';
  currentProfile: UserProfile;
  goals?: string;
}

export interface AITeachingAssistantRequest {
  topic: string;
  studentLevel: string;
  learningStyle: string;
  specificQuestion?: string;
}

export interface AIPriceRecommendationRequest {
  skill: string;
  experience: string;
  location: string;
  sessionType: string;
}

export interface AIJobHelperRequest {
  jobTitle: string;
  category: string;
  requirements?: string;
}

export interface AICandidateSelectionRequest {
  jobDescription: string;
  candidates: Array<{
    name: string;
    skills: string[];
    experience: string;
    rating: number;
  }>;
}

export interface AILearningStyleRequest {
  responses: Record<string, string>;
}

export interface AIMatchmakingResponse {
  compatibilityScore: number;
  strengths: string[];
  considerations: string[];
  recommendation: string;
  suggestedTopics: string[];
}

/**
 * AI Matchmaking for Guru-Gunu pairing
 */
export async function getAIMatchmaking(request: AIMatchmakingRequest): Promise<AIMatchmakingResponse> {
  try {
    const prompt = `You are an expert matchmaking AI for an educational platform. Analyze the following information and provide a compatibility score and detailed explanation.

Guru Profile:
- Skills: ${request.guruSkills.join(', ')}
- Experience: ${request.guruExperience}
- Availability: ${request.guruAvailability}

Gunu (Student) Profile:
- Learning Needs: ${request.gunuNeeds}
- Current Level: ${request.gunuLevel}
- Goals: ${request.gunuGoals}

Provide a JSON response with:
1. compatibilityScore (0-100)
2. strengths (array of matching points)
3. considerations (array of potential challenges)
4. recommendation (detailed explanation)
5. suggestedTopics (array of topics to start with)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert educational matchmaking assistant. Provide detailed, actionable insights in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error('AI Matchmaking error:', error);
    throw new Error('Failed to generate AI matchmaking analysis');
  }
}

export interface AIProfileAssistanceResponse {
  suggestions: string[];
  missingElements: string[];
  strengthAreas: string[];
  optimizedBio: string;
  keywordRecommendations: string[];
  nextSteps: string[];
}

/**
 * AI Profile Setup Assistant
 */
export async function getAIProfileAssistance(request: AIProfileAssistantRequest): Promise<AIProfileAssistanceResponse> {
  try {
    const prompt = `You are a profile optimization expert. Help improve this ${request.userType} profile.

Current Profile: ${JSON.stringify(request.currentProfile, null, 2)}
${request.goals ? `Goals: ${request.goals}` : ''}

Provide a JSON response with:
1. suggestions (array of specific improvements)
2. missingElements (array of important missing information)
3. strengthAreas (array of strong points to highlight)
4. optimizedBio (improved bio text)
5. keywordRecommendations (array of keywords to include)
6. nextSteps (array of actionable next steps)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert profile optimization assistant. Provide specific, actionable advice in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error('AI Profile Assistant error:', error);
    throw new Error('Failed to generate profile assistance');
  }
}

export interface AITeachingAssistanceResponse {
  teachingApproach: string;
  keyPoints: string[];
  examples: string[];
  exercises: string[];
  assessmentQuestions: string[];
  resources: string[];
  commonMistakes: string[];
}

/**
 * AI Teaching Assistant for Gurus
 */
export async function getAITeachingAssistance(request: AITeachingAssistantRequest): Promise<AITeachingAssistanceResponse> {
  try {
    const prompt = `You are an expert teaching assistant helping a Guru teach ${request.topic} to a ${request.studentLevel} level student with ${request.learningStyle} learning style.

${request.specificQuestion ? `Specific Question: ${request.specificQuestion}` : ''}

Provide a JSON response with:
1. teachingApproach (recommended teaching method)
2. keyPoints (array of main concepts to cover)
3. examples (array of relevant examples)
4. exercises (array of practice exercises)
5. assessmentQuestions (array of questions to check understanding)
6. resources (array of recommended resources)
7. commonMistakes (array of common mistakes to watch for)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert teaching assistant. Provide comprehensive, pedagogically sound advice in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error('AI Teaching Assistant error:', error);
    throw new Error('Failed to generate teaching assistance');
  }
}

export interface AIPriceRecommendationResponse {
  recommendedPrice: number;
  priceRange: { min: number; max: number };
  factors: string[];
  marketComparison: string;
  pricingStrategy: string;
  valueProposition: string;
}

/**
 * AI Price Setting Recommendations
 */
export async function getAIPriceRecommendation(request: AIPriceRecommendationRequest): Promise<AIPriceRecommendationResponse> {
  try {
    const prompt = `You are a pricing strategy expert for educational services. Analyze the following and recommend pricing.

Service Details:
- Skill: ${request.skill}
- Experience Level: ${request.experience}
- Location: ${request.location}
- Session Type: ${request.sessionType}

Provide a JSON response with:
1. recommendedPrice (suggested hourly rate)
2. priceRange (min and max range)
3. factors (array of factors affecting price)
4. marketComparison (how this compares to market rates)
5. pricingStrategy (recommendations for pricing strategy)
6. valueProposition (how to justify the price)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a pricing strategy expert. Provide data-driven pricing recommendations in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error('AI Price Recommendation error:', error);
    throw new Error('Failed to generate price recommendation');
  }
}

export interface AIJobHelperResponse {
  improvedTitle: string;
  description: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  budgetGuidance: string;
  keywords: string[];
}

/**
 * AI Job Posting Helper
 */
export async function getAIJobHelper(request: AIJobHelperRequest): Promise<AIJobHelperResponse> {
  try {
    const prompt = `You are a job posting expert. Help create an effective job posting.

Job Details:
- Title: ${request.jobTitle}
- Category: ${request.category}
${request.requirements ? `- Requirements: ${request.requirements}` : ''}

Provide a JSON response with:
1. improvedTitle (optimized job title)
2. description (compelling job description)
3. requiredSkills (array of essential skills)
4. niceToHaveSkills (array of bonus skills)
5. responsibilities (array of key responsibilities)
6. qualifications (array of qualifications)
7. budgetGuidance (suggested budget range)
8. keywords (array of SEO keywords)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a job posting expert. Create compelling, effective job postings in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error('AI Job Helper error:', error);
    throw new Error('Failed to generate job posting assistance');
  }
}

export interface AICandidateSelectionResponse {
  rankedCandidates: Array<{ name: string; rank: number; score: number }>;
  topPick: { name: string; reasoning: string };
  analysis: Record<string, string>;
  interviewQuestions: string[];
  redFlags: string[];
  recommendations: string[];
}

/**
 * AI Candidate Selection Tool
 */
export async function getAICandidateSelection(request: AICandidateSelectionRequest): Promise<AICandidateSelectionResponse> {
  try {
    const prompt = `You are a candidate evaluation expert. Analyze these candidates for the job.

Job Description: ${request.jobDescription}

Candidates:
${request.candidates.map((c, i) => `
${i + 1}. ${c.name}
   Skills: ${c.skills.join(', ')}
   Experience: ${c.experience}
   Rating: ${c.rating}/5
`).join('\n')}

Provide a JSON response with:
1. rankedCandidates (array of candidates ranked by fit)
2. topPick (best candidate with detailed reasoning)
3. analysis (detailed analysis for each candidate)
4. interviewQuestions (array of questions to ask top candidates)
5. redFlags (any concerns to investigate)
6. recommendations (hiring recommendations)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a candidate evaluation expert. Provide thorough, unbiased analysis in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error('AI Candidate Selection error:', error);
    throw new Error('Failed to generate candidate analysis');
  }
}

export interface AILearningStyleAssessmentResponse {
  primaryStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';
  secondaryStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';
  stylePercentages: Record<string, number>;
  characteristics: string[];
  studyRecommendations: string[];
  teachingApproach: string;
  strengthAreas: string[];
  developmentAreas: string[];
}

/**
 * AI Learning Style Assessment
 */
export async function getAILearningStyleAssessment(request: AILearningStyleRequest): Promise<AILearningStyleAssessmentResponse> {
  try {
    const prompt = `You are a learning style assessment expert. Analyze these assessment responses and determine the learning style.

Responses: ${JSON.stringify(request.responses, null, 2)}

Provide a JSON response with:
1. primaryStyle (main learning style: visual, auditory, kinesthetic, or reading/writing)
2. secondaryStyle (secondary learning style)
3. stylePercentages (breakdown of all styles)
4. characteristics (array of learning characteristics)
5. studyRecommendations (array of study method recommendations)
6. teachingApproach (how teachers should approach this learner)
7. strengthAreas (learning strengths)
8. developmentAreas (areas to develop)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a learning style assessment expert. Provide detailed, actionable insights in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error('AI Learning Style Assessment error:', error);
    throw new Error('Failed to generate learning style assessment');
  }
}

export default openai;