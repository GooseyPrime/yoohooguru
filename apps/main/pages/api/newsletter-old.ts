import { NextApiRequest, NextApiResponse } from 'next';

interface NewsletterData {
  email: string;
  name?: string;
  source?: string; // Where the subscription came from (blog, contact, etc.)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, source }: NewsletterData = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format'
      });
    }

    // TODO: Implement actual newsletter subscription
    // For now, we'll log the subscription and return success
    console.log('Newsletter subscription:', {
      email,
      name: name || 'Not provided',
      source: source || 'unknown',
      timestamp: new Date().toISOString()
    });

    // In production, you would:
    // 1. Add to email marketing service (Mailchimp, ConvertKit, etc.)
    // 2. Store in database
    // 3. Send welcome email
    // 4. Handle double opt-in if required

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        email,
        subscribed: true,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process newsletter subscription'
    });
  }
}