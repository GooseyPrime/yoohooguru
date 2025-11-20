# Homepage AI Assistant - Setup Guide

## Overview

The Homepage AI Assistant is a conversational AI that guides users through YooHoo.Guru's complex navigation and user flows. It uses OpenRouter's API to provide intelligent, context-aware assistance.

## Features

- **Conversational Navigation**: Users describe what they want, AI routes them correctly
- **Skill Creation**: AI categorizes and creates new skills using web search
- **Multi-Role Support**: Handles users with multiple roles (Guru + Angel + Hero)
- **Personalized Guidance**: Uses session context to personalize responses
- **Action Execution**: Can redirect, prefill forms, and start workflows
- **Quick Action Buttons**: Provides clickable buttons for common tasks

## Setup

### 1. Get OpenRouter API Key

1. Visit https://openrouter.ai/
2. Sign up for an account
3. Go to API Keys section
4. Create a new API key
5. Copy the key

### 2. Add Environment Variable

Add to `.env.local` (for local development):
```bash
OPENROUTER_API_KEY=sk-or-v1-xxxxx...
```

Add to Vercel environment variables (for production):
1. Go to Vercel project settings
2. Navigate to Environment Variables
3. Add `OPENROUTER_API_KEY` with your key
4. Redeploy

### 3. Configure Model (Optional)

Default model: `anthropic/claude-3.5-sonnet`

To change, edit `/apps/main/pages/api/ai/homepage-assistant.ts`:
```typescript
model: 'anthropic/claude-3.5-sonnet', // or 'openai/gpt-4-turbo' or 'meta-llama/llama-3.1-70b-instruct'
```

Available models at: https://openrouter.ai/models

### 4. Deploy

After adding the environment variable, redeploy:
```bash
vercel --prod
```

## Usage

### User Side

The assistant appears as a floating chat button in the bottom right corner of the homepage.

**Example Conversations:**

1. **"I want to learn guitar"**
   - AI asks: in-person or video?
   - Provides location search or browse options
   - Can use AI matchmaking for personalized recommendations

2. **"I teach hot yoga"**
   - AI doesn't find skill, offers to create it
   - Uses web search to categorize (Fitness > Yoga)
   - Starts guru onboarding with skill pre-filled

3. **"I need my lawn mowed"**
   - Offers: Browse landscapers OR Post a gig
   - Routes to appropriate page based on choice

4. **"How do I become a guru?"**
   - Explains guru onboarding process
   - Asks about skill/expertise
   - Starts signup flow

### Developer Side

**API Endpoint:** `/api/ai/homepage-assistant`

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "I want to learn guitar" }
  ]
}
```

**Response:**
```json
{
  "message": "Great! 🎸 Are you looking for:\n1. In-person lessons\n2. Video conference\n3. Both?",
  "suggestedButtons": [
    {
      "label": "Video lessons",
      "action": { "type": "redirect", "payload": "/browse?skill=guitar&type=video" }
    },
    {
      "label": "In-person",
      "action": { "type": "redirect", "payload": "/location/search?skill=guitar" }
    }
  ],
  "actions": []
}
```

## Action Types

The assistant can execute these actions:

### 1. `redirect`
Navigates user to a page
```typescript
{
  type: 'redirect',
  payload: '/browse?skill=guitar'
}
```

### 2. `start_onboarding`
Begins guru/angel onboarding with pre-filled data
```typescript
{
  type: 'start_onboarding',
  payload: {
    role: 'guru',
    skill: 'Hot Yoga',
    category: 'fitness'
  }
}
```

### 3. `open_modal`
Opens a modal (future)
```typescript
{
  type: 'open_modal',
  payload: 'skill_picker'
}
```

### 4. `prefill_form`
Pre-fills form data (future)
```typescript
{
  type: 'prefill_form',
  payload: {
    page: '/jobs/post',
    data: { title: '...', description: '...' }
  }
}
```

## Customization

### Modify System Prompt

Edit `/apps/main/pages/api/ai/homepage-assistant.ts`:

```typescript
const SYSTEM_PROMPT = `You are Guru Assistant...

[Add your custom instructions here]
`;
```

### Add New Actions

1. Define action type in `Action` interface
2. Add handler in `executeActions()` function in `HomepageAssistant.tsx`
3. Update system prompt to use new action

### Change Appearance

Edit `/apps/main/components/HomepageAssistant.tsx`:
- Chat button: Line ~50 (floating button)
- Chat widget: Line ~115 (main window)
- Colors: Update gradient classes

## Web Search Capability

The AI can search the web when analyzing skills or answering questions.

Example:
```
User: "What is hot yoga?"
AI: *searches web* "Hot yoga, also known as Bikram yoga..."
```

This is enabled via OpenRouter's `tools` parameter:
```typescript
tools: [
  {
    type: 'web_search',
    description: 'Search for skill information'
  }
]
```

## Cost Estimation

**OpenRouter Pricing (as of 2024):**
- Claude 3.5 Sonnet: $3/million input tokens, $15/million output tokens
- Average conversation: ~500 tokens input, ~300 tokens output
- Cost per conversation: ~$0.006 (less than 1 cent)

**Monthly estimate** (1000 conversations): ~$6/month

For higher volume, consider:
- GPT-4 Turbo: $10/million input, $30/million output
- Llama 3.1 70B: $0.60/million input, $0.80/million output (much cheaper!)

## Troubleshooting

### "I'm having trouble connecting"
- Check `OPENROUTER_API_KEY` is set
- Verify API key is valid at https://openrouter.ai/
- Check OpenRouter service status

### AI not responding correctly
- Review system prompt for clarity
- Adjust temperature (lower = more deterministic)
- Try different model

### Actions not executing
- Check console for errors
- Verify action types match handler
- Ensure URLs are correct

## Future Enhancements

1. **Voice Input** - Add speech-to-text
2. **Multi-language** - Support Spanish, French, etc.
3. **Skill Suggestions** - AI suggests related skills
4. **Form Pre-fill** - Fill booking forms via conversation
5. **Session History** - Remember past conversations
6. **Proactive Tips** - AI suggests based on user behavior
7. **Analytics** - Track common questions and intents

## Files

- **API:** `/apps/main/pages/api/ai/homepage-assistant.ts`
- **Component:** `/apps/main/components/HomepageAssistant.tsx`
- **Usage:** `/apps/main/pages/index.tsx` (and can be added to other pages)

## Related Documentation

- OpenRouter API: https://openrouter.ai/docs
- Claude 3.5 Docs: https://docs.anthropic.com/
- YooHoo.Guru User Flows: `/COMPREHENSIVE_USER_FLOWS.md`
