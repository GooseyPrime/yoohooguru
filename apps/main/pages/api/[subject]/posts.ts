import { NextApiRequest, NextApiResponse } from 'next';

// Mock blog posts data - in production, this would fetch from a database
const generateMockPosts = (subject: string, limit: number = 6, page: number = 1) => {
  const posts = [];
  const startId = (page - 1) * limit + 1;

  for (let i = 0; i < limit; i++) {
    const id = startId + i;
    posts.push({
      id,
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Tutorial ${id}: Getting Started`,
      slug: `${subject}-tutorial-${id}`,
      excerpt: `Learn the fundamentals of ${subject} with this comprehensive guide. Perfect for beginners and intermediate learners.`,
      content: `Full content for ${subject} tutorial ${id}...`,
      author: {
        name: 'Expert Instructor',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        bio: `Professional ${subject} instructor with 10+ years of experience`
      },
      image: `https://images.unsplash.com/photo-${1500000000000 + id}?w=800&h=400&fit=crop`,
      category: subject,
      tags: [subject, 'tutorial', 'learning'],
      publishedAt: new Date(Date.now() - (id * 86400000)).toISOString(),
      readTime: Math.floor(Math.random() * 10) + 5,
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 100) + 10
    });
  }

  return posts;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { subject, limit = '6', page = '1' } = req.query;

  if (!subject || typeof subject !== 'string') {
    return res.status(400).json({ error: 'Subject parameter is required' });
  }

  try {
    const limitNum = parseInt(limit as string, 10);
    const pageNum = parseInt(page as string, 10);

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      return res.status(400).json({ error: 'Invalid limit parameter (1-50)' });
    }

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Invalid page parameter' });
    }

    // In production, fetch real posts from database
    // For now, return mock data
    const posts = generateMockPosts(subject, limitNum, pageNum);
    const totalPosts = 100; // Mock total
    const totalPages = Math.ceil(totalPosts / limitNum);

    return res.status(200).json({
      success: true,
      subject,
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalPosts,
        totalPages,
        hasMore: pageNum < totalPages
      }
    });

  } catch (error) {
    console.error('Posts API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch posts',
      message: 'An error occurred while fetching blog posts'
    });
  }
}