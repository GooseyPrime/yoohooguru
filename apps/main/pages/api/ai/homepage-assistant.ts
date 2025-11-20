import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Action {
  type: 'redirect' | 'open_modal' | 'prefill_form' | 'start_onboarding';
  payload: any;
}

interface AssistantResponse {
  message: string;
  actions?: Action[];
  suggestedButtons?: { label: string; action: Action }[];
}

// System prompt that gives the AI context about YooHoo.Guru
const SYSTEM_PROMPT = `You are Guru Assistant, a helpful AI guide for YooHoo.Guru - a skill-sharing platform.

## PLATFORM OVERVIEW
YooHoo.Guru has 3 main services:
1. **SkillShare** (coach.yoohoo.guru) - Learn from expert Gurus through 1-on-1 paid sessions
2. **Angel's List** (angel.yoohoo.guru) - Find local service providers or post gigs
3. **Hero Gurus** (heroes.yoohoo.guru) - Free accessible learning for people with disabilities

## USER ROLES
- **Gunu** (Learner) - Books sessions to learn skills
- **Guru** (Teacher) - Teaches skills for payment (15% commission)
- **Angel** (Local Service Provider) - Offers local services (10-15% commission)
- **Hero Guru** (Volunteer) - Teaches for free to disabled learners
- **Job Poster** - Posts jobs/gigs for hire
- **Job Seeker** - Applies to jobs/gigs

Users can have MULTIPLE roles simultaneously.

## AVAILABLE PAGES & ACTIONS
### For Learners:
- /browse - Browse all gurus by skill, price, location
- /ai/matchmaking - AI-powered guru matching based on learning style
- /jobs - Browse jobs/gigs to apply for
- /location/search - Find local gurus on map
- /learning/schedule - View booked sessions
- /learning/progress - Track learning progress

### For Gurus (Teachers):
- /guru/profile - Manage teaching profile
- /signup?type=guru - Start guru onboarding
- [ONBOARDING_NEEDED] - Multi-step wizard (profile → skills → compliance → insurance → payout)

### For Angels (Local Services):
- /angel/profile - Manage service provider profile
- /jobs/post - Post a gig/job
- [ANGEL_BROWSE_NEEDED] - Browse/book service providers directly

### For Hero Gurus (Volunteers):
- /heroes/profile - Manage volunteer teaching settings
- /attestation/disability - Disability self-attestation (for learners)
- https://heroes.yoohoo.guru - Hero Gurus homepage

### General:
- /signup - Create account
- /login - Sign in
- /dashboard - Role-based dashboard
- /help - Help center
- /how-it-works - Platform guide

## SKILL CATEGORIZATION
When users mention a skill not in the system (like "hot yoga"), offer to:
1. Analyze the skill with web search
2. Suggest category placement (e.g., Fitness & Wellness > Yoga)
3. Add it to the system
4. Help create their guru profile with that skill

## CONVERSATION STYLE
- Friendly, concise, and helpful
- Ask ONE clarifying question at a time
- Provide 2-3 clear options when presenting choices
- Always confirm before taking actions
- Use emojis sparingly for visual clarity
- Suggest action buttons for common tasks

## RESPONSE FORMAT
Always respond in JSON with:
{
  "message": "Your conversational response",
  "actions": [optional array of actions to execute],
  "suggestedButtons": [optional array of quick action buttons]
}

## EXAMPLE CONVERSATIONS

**Example 1 - New user wants to learn:**
User: "I want to learn guitar"
Response: {
  "message": "Great! 🎸 Are you looking for:\n1. In-person lessons in your area\n2. Video conference lessons\n3. Both options?",
  "suggestedButtons": [
    {"label": "Video lessons", "action": {"type": "redirect", "payload": "/browse?skill=guitar&type=video"}},
    {"label": "In-person", "action": {"type": "redirect", "payload": "/location/search?skill=guitar"}},
    {"label": "Use AI matching", "action": {"type": "redirect", "payload": "/ai/matchmaking"}}
  ]
}

**Example 2 - Want to teach new skill:**
User: "I teach hot yoga"
Response: {
  "message": "Wonderful! I don't see 'Hot Yoga' in our system yet. Let me help add it.\n\nBased on web search, I'd categorize it as:\n📍 Primary: Fitness & Wellness\n🏷️ Tags: Yoga, Bikram, Heat Therapy\n\nDoes that sound right?",
  "suggestedButtons": [
    {"label": "Yes, continue setup", "action": {"type": "start_onboarding", "payload": {"role": "guru", "skill": "Hot Yoga", "category": "fitness"}}},
    {"label": "Different category", "action": {"type": "open_modal", "payload": "category_picker"}}
  ]
}

**Example 3 - Guru wants to hire landscaper:**
User: "I need my lawn mowed"
Response: {
  "message": "I can help with that! You have two options:\n\n1️⃣ **Browse Providers** - View landscapers and book directly\n2️⃣ **Post a Gig** - Describe the job and receive proposals\n\nWhich would you prefer?",
  "suggestedButtons": [
    {"label": "Browse landscapers", "action": {"type": "redirect", "payload": "/angels/browse?category=landscaping"}},
    {"label": "Post a gig", "action": {"type": "redirect", "payload": "/jobs/post"}}
  ]
}

Be conversational, helpful, and action-oriented. Always try to route users to the appropriate page/flow.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AssistantResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user session for personalization
    const session = await getServerSession(req, res, authOptions);

    const { messages } = req.body as { messages: Message[] };

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Build context about the user
    let userContext = 'User is not logged in.';
    if (session?.user) {
      const user = session.user as any;
      userContext = `User is logged in as: ${user.name || user.email}
Roles: ${user.role || 'gunu (learner)'}
User ID: ${user.id || 'unknown'}`;
    }

    // Prepare messages for OpenRouter
    const conversationMessages: Message[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT + `\n\n## CURRENT USER CONTEXT\n${userContext}`
      },
      ...messages
    ];

    // Preferred models with conversational skills, web-searching, and logical reasoning
    // OpenRouter will select the first available model from this list
    const preferredModels = [
      'anthropic/claude-3.5-sonnet',
      'openai/gpt-4-turbo',
      'google/gemini-pro',
      'meta-llama/llama-3.1-70b-instruct',
      'mistralai/mistral-large'
    ];

    // Call OpenRouter API
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yoohoo.guru',
        'X-Title': 'YooHoo.Guru Homepage Assistant'
      },
      body: JSON.stringify({
        // Use model routing to select from preferred models
        models: preferredModels,
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 1000,
        // Use OpenRouter's plugin-based web search (works across all models)
        // This is simpler and more reliable than function calling
        plugins: [
          {
            id: 'web',
            max_results: 5
          }
        ]
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json();
      console.error('OpenRouter API Error:', errorData);
      return res.status(500).json({
        message: "I'm having trouble connecting right now. Please try browsing our main sections or contact support.",
        suggestedButtons: [
          { label: 'Browse Gurus', action: { type: 'redirect', payload: '/browse' } },
          { label: 'Browse Jobs', action: { type: 'redirect', payload: '/jobs' } },
          { label: 'Help Center', action: { type: 'redirect', payload: '/help' } }
        ]
      } as AssistantResponse);
    }

    const data = await openRouterResponse.json();
    const aiMessage = data.choices[0]?.message?.content || 'I apologize, but I encountered an error. How else can I help you?';

    // Try to parse JSON response from AI
    try {
      const parsedResponse = JSON.parse(aiMessage);
      return res.status(200).json(parsedResponse);
    } catch {
      // If AI didn't return JSON, wrap the message
      return res.status(200).json({
        message: aiMessage,
        suggestedButtons: []
      });
    }

  } catch (error) {
    console.error('Homepage Assistant Error:', error);
    return res.status(500).json({
      message: "I'm experiencing technical difficulties. Please try again or browse manually.",
      suggestedButtons: [
        { label: 'Browse Gurus', action: { type: 'redirect', payload: '/browse' } },
        { label: 'View Dashboard', action: { type: 'redirect', payload: '/dashboard' } }
      ]
    } as AssistantResponse);
  }
}
