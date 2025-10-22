import React, { useEffect, useState } from 'react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: number;
  curatedAt: number;
}

interface NewsSectionProps {
  subdomain: string;
  limit?: number;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ subdomain, limit = 5 }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.yoohoo.guru';
        const response = await fetch(`${apiUrl}/api/news/${subdomain}`);

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        setArticles(data.news?.slice(0, limit) || []);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Unable to load news articles');
      } finally {
        setLoading(false);
      }
    };

    if (subdomain) {
      fetchNews();
    }
  }, [subdomain, limit]);

  if (loading) {
    return (
      <div className="news-section loading">
        <h2>Latest News</h2>
        <p>Loading news articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-section error">
        <h2>Latest News</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="news-section empty">
        <h2>Latest News</h2>
        <p>No news articles available at this time. Check back soon!</p>
      </div>
    );
  }

  return (
    <section className="news-section">
      <h2>Latest News</h2>
      <div className="news-grid">
        {articles.map((article) => (
          <article key={article.id} className="news-card">
            <div className="news-header">
              <h3 className="news-title">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-link"
                >
                  {article.title}
                </a>
              </h3>
              <span className="news-meta">
                {article.source} • {formatDate(article.publishedAt)}
              </span>
            </div>
            <p className="news-summary">{article.summary}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="read-more"
            >
              Read full article →
            </a>
          </article>
        ))}
      </div>

      <style jsx>{`
        .news-section {
          padding: 2rem 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .news-section h2 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }

        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .news-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
        }

        .news-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .news-header {
          margin-bottom: 1rem;
        }

        .news-title {
          font-size: 1.25rem;
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
        }

        .news-link {
          color: #2563eb;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .news-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .news-meta {
          font-size: 0.875rem;
          color: #666;
        }

        .news-summary {
          color: #333;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .read-more {
          color: #2563eb;
          font-weight: 500;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }

        .read-more:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .loading, .error, .empty {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .news-grid {
            grid-template-columns: 1fr;
          }

          .news-section h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}
