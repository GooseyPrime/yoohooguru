import { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from '../../../lib/firebaseAdmin';

// Allow-list of valid subdomains
const VALID_SUBDOMAINS = [
  'angel', 'art', 'auto', 'business', 'coach', 'coding', 'cooking', 'crafts', 'data',
  'design', 'finance', 'fitness', 'gardening', 'heroes', 'history',
  'home', 'investing', 'language', 'marketing', 'math',
  'mechanical', 'music', 'photography', 'sales', 'science', 'sports',
  'tech', 'wellness', 'writing'
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subdomain } = req.query;

  // Validate subdomain parameter
  if (!subdomain || typeof subdomain !== 'string') {
    return res.status(400).json({ error: 'Subdomain parameter required' });
  }

  // Validate subdomain is in allow-list
  if (!VALID_SUBDOMAINS.includes(subdomain)) {
    return res.status(400).json({ error: 'Invalid subdomain specified' });
  }

  try {
    // Initialize Firebase and get Firestore instance
    const db = getFirestore();

    // Fetch news articles from: gurus/{subdomain}/news
    // Backend stores articles at this exact path (see /backend/src/agents/curationAgents.js:152)
    const newsSnapshot = await db
      .collection('gurus')
      .doc(subdomain)
      .collection('news')
      .orderBy('publishedAt', 'desc')
      .limit(10)
      .get();

    const news = newsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json({ news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return res.status(500).json({
      error: 'Failed to fetch news articles',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
