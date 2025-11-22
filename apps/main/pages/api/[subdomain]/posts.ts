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

    // Build query for blog posts from: gurus/{subdomain}/posts
    // Backend stores posts at this exact path (see /backend/src/agents/curationAgents.js:1024)
    let query = db
      .collection('gurus')
      .doc(subdomain)
      .collection('posts')
      .orderBy('publishedAt', 'desc');

    // Apply pagination
    // Firestore doesn't have offset(), so we implement page-based pagination
    // by fetching documents up to the requested page and using the last doc as cursor
    if (pageNum > 1) {
      // For page > 1, fetch documents up to the previous page to get cursor
      const skipCount = (pageNum - 1) * limitNum;
      const cursorSnapshot = await query.limit(skipCount).get();
      
      if (cursorSnapshot.docs.length > 0) {
        // Use the last document as the cursor for startAfter
        const lastDoc = cursorSnapshot.docs[cursorSnapshot.docs.length - 1];
        query = query.startAfter(lastDoc);
      }
    }
    
    // Fetch the actual page of results
    const postsSnapshot = await query.limit(limitNum).get();
    
    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Return paginated results
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
