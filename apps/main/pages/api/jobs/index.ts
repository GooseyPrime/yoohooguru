import { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, search, limit = 20 } = req.query;

    const db = getFirestore();
    let query = db.collection('jobs').where('status', '==', 'active');

    // Filter by category if provided
    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }

    // Order by posted date (most recent first)
    query = query.orderBy('postedDate', 'desc');

    // Limit results
    query = query.limit(Number(limit));

    const snapshot = await query.get();
    
    let jobs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply search filter if provided (client-side filtering for simplicity)
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      jobs = jobs.filter((job: {
          title?: string;
          description?: string;
          skillsRequired?: string[];
        }) => 
        job.title?.toLowerCase().includes(searchLower) ||
        job.description?.toLowerCase().includes(searchLower) ||
        job.skillsRequired?.some((skill: string) => skill.toLowerCase().includes(searchLower))
      );
    }

    return res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}