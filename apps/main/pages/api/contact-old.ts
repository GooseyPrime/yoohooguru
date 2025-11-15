import { NextApiRequest, NextApiResponse } from 'next';
import { isValidEmail, isValidLength, sanitizeString } from '../../utils/validation';

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

    // Sanitize inputs
    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = sanitizeString(email);
    const sanitizedSubject = sanitizeString(subject || '');
    const sanitizedMessage = sanitizeString(message);

    // Validate email format (safe from ReDoS)
    if (!isValidEmail(sanitizedEmail)) {
      return res.status(400).json({ 
        error: 'Invalid email format'
      });
    }

    // Validate name length
    if (!isValidLength(sanitizedName, 1, 100)) {
      return res.status(400).json({ 
        error: 'Invalid name',
        details: 'Name must be between 1 and 100 characters'
      });
    }

    // Validate message length
    if (!isValidLength(sanitizedMessage, 10, 5000)) {
      return res.status(400).json({ 
        error: 'Invalid message length',
        details: 'Message must be between 10 and 5000 characters'
      });
    }

    // TODO: Implement actual email sending or database storage
    // For now, we'll log the submission and return success
    console.log('Contact form submission:', {
      name: sanitizedName,
      email: sanitizedEmail,
      subject: sanitizedSubject,
      category,
      message: sanitizedMessage,
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
        name: sanitizedName,
        email: sanitizedEmail,
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