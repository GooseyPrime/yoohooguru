import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      title,
      description,
      category,
      budget,
      duration,
      skillsRequired,
      experienceLevel,
      location,
      urgency
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !budget || !duration || !skillsRequired) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In a real implementation, save to database
    // For now, return success with mock data
    const job = {
      id: Date.now().toString(),
      title,
      description,
      category,
      budget,
      duration,
      skillsRequired: skillsRequired.split(',').map((s: string) => s.trim()),
      experienceLevel,
      location,
      urgency,
      postedBy: session.user?.name || 'Anonymous',
      postedDate: new Date().toISOString(),
      proposals: 0,
      status: 'active'
    };

    // TODO: Save to Firestore
    // await db.collection('jobs').add(job);

    return res.status(201).json({ success: true, job });
  } catch (error) {
    console.error('Error creating job:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}