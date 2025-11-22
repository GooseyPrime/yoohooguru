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

  const { subdomain, limit = '10', page = '1' } = req.query;

  // Validate subdomain parameter
  if (!subdomain || typeof subdomain !== 'string') {
    return res.status(400).json({ error: 'Subdomain parameter required' });
  }

  // Validate subdomain is in allow-list
  if (!VALID_SUBDOMAINS.includes(subdomain)) {
    return res.status(400).json({ error: 'Invalid subdomain specified' });
  }

  // Parse and validate pagination parameters
  const limitNum = parseInt(typeof limit === 'string' ? limit : '10', 10);
  const pageNum = parseInt(typeof page === 'string' ? page : '1', 10);

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({ error: 'Invalid limit parameter (must be 1-100)' });
  }

  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({ error: 'Invalid page parameter (must be >= 1)' });
  }

  try {
    // Initialize Firebase and get Firestore instance
    const db = getFirestore();

    // Fetch blog posts from: gurus/{subdomain}/posts
    // Backend stores posts at this exact path (see /backend/src/agents/curationAgents.js:1024)
    // Calculate offset for pagination: skip (pageNum - 1) * limitNum documents
    const offset = (pageNum - 1) * limitNum;
    
    const postsSnapshot = await db
      .collection('gurus')
      .doc(subdomain)
      .collection('posts')
      .orderBy('publishedAt', 'desc')
      .offset(offset)
      .limit(limitNum)
      .get();

    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Calculate total count for pagination (optional - can be expensive)
    // For now, we'll just return the posts without total count
    return res.status(200).json({
      posts,
      page: pageNum,
      limit: limitNum,
      count: posts.length
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return res.status(500).json({
      error: 'Failed to fetch blog posts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
