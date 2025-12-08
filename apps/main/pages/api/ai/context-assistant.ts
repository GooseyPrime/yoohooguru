import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * NavigationAction interface documents the expected JSON structure
 * returned by the AI when suggesting navigation actions
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface NavigationAction {
  type: 'navigate';
  route: string;
  label: string;
}

/**
 * Context-Aware AI Assistant API
 * 
 * This endpoint powers the ContextNavigator's AI chat zone.
 * The system prompt changes based on the user's current page/route.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    const { messages, systemPrompt, currentPath, userRole } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!systemPrompt) {
      return res.status(400).json({ error: 'System prompt is required' });
    }

    // Get OpenRouter API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY not configured');
      return res.status(500).json({ 
        error: 'AI service not configured',
        message: 'I apologize, but the AI assistant is temporarily unavailable. Please use the quick action buttons above to navigate.' 
      });
    }

    // Build context-aware system message
    const userName = session?.user?.name || 'there';
    const userRoleText = userRole && userRole !== 'guest' ? ` You are speaking with a ${userRole}.` : '';
    
    const contextualSystemPrompt = `${systemPrompt}

Current context:
- User is on page: ${currentPath}
- User name: ${userName}${userRoleText}
- Authentication: ${session ? 'Logged in' : 'Guest'}

## AVAILABLE ROUTES FOR NAVIGATION
When users ask to find services, browse content, or navigate, you can suggest these routes:
- /browse - Browse gurus/teachers by skill
- /location/search - Find local gurus on map
- /jobs - Browse jobs/gigs (for service requests like "mow my lawn", "landscaping", etc.)
- /jobs/post - Post a job/gig
- /ai/matchmaking - AI-powered guru matching
- /dashboard - User dashboard
- /settings - Account settings
- /profile - User profile
- /billing - Billing and payments
- /privacy - Privacy settings
- /help - Help center

## RESPONSE FORMAT
When suggesting navigation, respond in JSON format:
{
  "message": "Your helpful response here",
  "action": {
    "type": "navigate",
    "route": "/path/to/navigate",
    "label": "Description of where you're sending them"
  }
}

If no navigation is needed, just respond with text (no JSON).

## EXAMPLES
User: "find someone to mow my lawn"
Response: {"message": "I can help you with that! You can either browse landscapers directly or post a job listing. Let me take you to the jobs page where you can post your lawn mowing request.", "action": {"type": "navigate", "route": "/jobs/post", "label": "Post Lawn Mowing Job"}}

User: "I want to change my password"
Response: {"message": "I'll take you to your account settings where you can update your password.", "action": {"type": "navigate", "route": "/settings", "label": "Account Settings"}}

User: "what can you help me with?"
Response: I can help you navigate this page, find features, and answer questions about YooHoo.Guru. Just ask me anything!

Guidelines:
- Be concise and actionable
- Reference the current page context
- Suggest specific next steps
- Use navigation actions when users express intent to go somewhere or do something
- Be friendly and helpful`;

    // Prepare messages for OpenRouter
    const apiMessages: Message[] = [
      { role: 'system', content: contextualSystemPrompt },
      ...messages
    ];

    // Preferred models with conversational skills - OpenRouter will select first available
    const preferredModels = [
      'anthropic/claude-3.5-sonnet',
      'openai/gpt-4o-mini',
      'google/gemini-flash-1.5',
      'meta-llama/llama-3.1-8b-instruct',
      'mistralai/mistral-7b-instruct'
    ];

    // Call OpenRouter API with model fallback
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'https://www.yoohoo.guru',
        'X-Title': 'YooHoo.Guru Context Navigator'
      },
      body: JSON.stringify({
        models: preferredModels, // Use model routing to select from preferred models
        messages: apiMessages,
        max_tokens: 500, // Keep responses concise
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', response.status, errorData);
      const errorMessage = errorData.error?.message || errorData.message || 'Unknown error';
      throw new Error(`OpenRouter API request failed (${response.status}): ${errorMessage}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response from OpenRouter:', data);
      throw new Error('Invalid API response');
    }

    const assistantMessage = data.choices[0].message.content;

    // Try to parse as JSON to detect navigation actions
    try {
      const parsed = JSON.parse(assistantMessage);
      if (parsed.message && parsed.action) {
        // Structured response with navigation action
        return res.status(200).json({
          message: parsed.message,
          action: parsed.action,
          model: data.model,
          usage: data.usage
        });
      } else if (typeof parsed === 'object' && parsed.message) {
        // JSON response without action
        return res.status(200).json({
          message: parsed.message,
          model: data.model,
          usage: data.usage
        });
      }
    } catch {
      // Not JSON, treat as plain text response
    }

    return res.status(200).json({
      message: assistantMessage,
      model: data.model,
      usage: data.usage
    });

  } catch (error) {
    console.error('Context assistant error:', error);
    
    // Provide more specific error messages based on the error type
    let userMessage = 'I apologize, but I encountered an error. Please try again or use the quick action buttons above to navigate.';
    
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Check for common error types
      if (error.message.includes('API request failed')) {
        userMessage = 'The AI service is temporarily unavailable. Please use the quick action buttons above to navigate.';
      } else if (error.message.includes('not configured')) {
        userMessage = 'The AI assistant is not configured. Please use the quick action buttons above to navigate.';
      }
    }
    
    return res.status(500).json({
      error: 'Failed to get AI response',
      message: userMessage
    });
  }
}
