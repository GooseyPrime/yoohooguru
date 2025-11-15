import { NextApiRequest, NextApiResponse } from 'next';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
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
    const { name, email, subject, category, message }: ContactFormData = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Name, email, and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format'
      });
    }

    // Validate message length
    if (message.length < 10) {
      return res.status(400).json({ 
        error: 'Message too short',
        details: 'Message must be at least 10 characters'
      });
    }

    if (message.length > 5000) {
      return res.status(400).json({ 
        error: 'Message too long',
        details: 'Message must be less than 5000 characters'
      });
    }

    // TODO: Implement actual email sending or database storage
    // For now, we'll log the submission and return success
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      category,
      message,
      timestamp: new Date().toISOString()
    });

    // In production, you would:
    // 1. Send email using a service like SendGrid, AWS SES, or Resend
    // 2. Store in database for tracking
    // 3. Send confirmation email to user
    // 4. Notify support team

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Thank you for contacting us! We\'ll get back to you within 24 hours.',
      data: {
        name,
        email,
        category,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process contact form submission'
    });
  }
}