import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    const rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Normalize privateKey: if already has newlines use as-is, else replace literal '\n'
        privateKey: rawKey.includes('\n') ? rawKey : rawKey.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

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

    const db = getFirestore();
    
    const job = {
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
      postedById: session.user?.email || '',
      postedDate: new Date().toISOString(),
      proposals: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore
    const docRef = await db.collection('jobs').add(job);

    return res.status(201).json({ 
      success: true, 
      job: {
        id: docRef.id,
        ...job
      }
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}