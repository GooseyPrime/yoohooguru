import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getAILearningStyleAssessment } from '../../../lib/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { responses } = req.body;

    // Validate required fields
    if (!responses || typeof responses !== 'object') {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await getAILearningStyleAssessment({
      responses
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('AI Learning Style Assessment API error:', error);
    return res.status(500).json({ error: 'Failed to generate learning style assessment' });
  }
}