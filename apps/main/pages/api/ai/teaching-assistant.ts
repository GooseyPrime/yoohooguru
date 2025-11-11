import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getAITeachingAssistance } from '../../../lib/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { topic, studentLevel, learningStyle, specificQuestion } = req.body;

    // Validate required fields
    if (!topic || !studentLevel || !learningStyle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await getAITeachingAssistance({
      topic,
      studentLevel,
      learningStyle,
      specificQuestion
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('AI Teaching Assistant API error:', error);
    return res.status(500).json({ error: 'Failed to generate teaching assistance' });
  }
}