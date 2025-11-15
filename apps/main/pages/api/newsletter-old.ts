import { NextApiRequest, NextApiResponse } from 'next';
import { isValidEmail, isValidLength, sanitizeString } from '../../utils/validation';

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
        error: 'Missing required field',
        details: 'Email is required'
      });
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeString(email);
    const sanitizedName = name ? sanitizeString(name) : '';

    // Validate email format (safe from ReDoS)
    if (!isValidEmail(sanitizedEmail)) {
      return res.status(400).json({ 
        error: 'Invalid email format'
      });
    }

    // Validate name if provided
    if (sanitizedName && !isValidLength(sanitizedName, 1, 100)) {
      return res.status(400).json({ 
        error: 'Invalid name',
        details: 'Name must be between 1 and 100 characters'
      });
    }

    // TODO: Implement actual newsletter subscription
    // For now, we'll log the subscription and return success
    console.log('Newsletter subscription:', {
      email: sanitizedEmail,
      name: sanitizedName,
      source: source || 'unknown',
      timestamp: new Date().toISOString()
    });

    // In production, you would:
    // 1. Add to email marketing service (Mailchimp, SendGrid, etc.)
    // 2. Store in database
    // 3. Send welcome email
    // 4. Handle unsubscribe requests

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        email: sanitizedEmail,
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