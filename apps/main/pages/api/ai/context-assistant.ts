import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
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

Guidelines:
- Be concise and actionable
- Reference the current page context
- Suggest specific next steps
- Use the quick actions when appropriate
- Be friendly and helpful`;

    // Prepare messages for OpenRouter
    const apiMessages: Message[] = [
      { role: 'system', content: contextualSystemPrompt },
      ...messages
    ];

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'https://www.yoohoo.guru',
        'X-Title': 'YooHoo.Guru Context Navigator'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet', // High-quality model for better responses
        messages: apiMessages,
        max_tokens: 500, // Keep responses concise
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', response.status, errorData);
      throw new Error('OpenRouter API request failed');
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response from OpenRouter:', data);
      throw new Error('Invalid API response');
    }

    const assistantMessage = data.choices[0].message.content;

    return res.status(200).json({
      message: assistantMessage,
      model: data.model,
      usage: data.usage
    });

  } catch (error) {
    console.error('Context assistant error:', error);
    return res.status(500).json({
      error: 'Failed to get AI response',
      message: 'I apologize, but I encountered an error. Please try again or use the quick action buttons above to navigate.'
    });
  }
}
