import { NextApiRequest, NextApiResponse } from 'next';

// Mock news data - in production, this would fetch from a real news API
const generateMockNews = (subject: string) => {
  const newsItems = [
    {
      id: 1,
      title: `Latest Trends in ${subject.charAt(0).toUpperCase() + subject.slice(1)}`,
      description: `Discover the newest developments and innovations in the ${subject} field.`,
      url: `https://example.com/news/${subject}/1`,
      image: `https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop`,
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      source: 'Industry News'
    },
    {
      id: 2,
      title: `Expert Insights: ${subject.charAt(0).toUpperCase() + subject.slice(1)} Best Practices`,
      description: `Learn from industry experts about the best practices and techniques in ${subject}.`,
      url: `https://example.com/news/${subject}/2`,
      image: `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop`,
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      source: 'Expert Insights'
    },
    {
      id: 3,
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Industry Update`,
      description: `Stay informed about the latest updates and changes in the ${subject} industry.`,
      url: `https://example.com/news/${subject}/3`,
      image: `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop`,
      publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      source: 'Industry Update'
    }
  ];

  return newsItems;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { subject } = req.query;

  if (!subject || typeof subject !== 'string') {
    return res.status(400).json({ error: 'Subject parameter is required' });
  }

  try {
    // In production, fetch real news from an API
    // For now, return mock data
    const news = generateMockNews(subject);

    return res.status(200).json({
      success: true,
      subject,
      news,
      count: news.length
    });

  } catch (error) {
    console.error('News API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch news',
      message: 'An error occurred while fetching news articles'
    });
  }
}