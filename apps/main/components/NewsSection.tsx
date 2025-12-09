import React, { useEffect, useState } from 'react';
import { fetchWithRetry } from '../utils/apiHelpers';

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

// Allow-list of valid subjects
const VALID_SUBJECTS = [
  'angel', 'art', 'auto', 'business', 'coach', 'coding', 'cooking', 'crafts', 'data',
  'design', 'finance', 'fitness', 'gardening', 'heroes', 'history',
  'home', 'investing', 'language', 'marketing', 'math',
  'mechanical', 'music', 'photography', 'sales', 'science', 'sports',
  'tech', 'wellness', 'writing'
];

export const NewsSection: React.FC<NewsSectionProps> = ({ subdomain, limit = 5 }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Validate subdomain before making the request
    if (!subdomain || !VALID_SUBJECTS.includes(subdomain)) {
      setError('Invalid subject specified.');
      setLoading(false);
      setArticles([]);
      return;
    }

    let isCancelled = false;

    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use fetchWithRetry for automatic retry logic
        const response = await fetchWithRetry(
          `/api/news/${subdomain}`,
          {},
          {
            maxRetries: 3,
            retryDelay: 1000,
            backoff: true,
            timeout: 10000,
          }
        );

        if (isCancelled) return;

        const data = await response.json();
        if (!isCancelled) {
          setArticles(data.news?.slice(0, limit) || []);
          setRetryCount(0); // Reset retry count on success
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error fetching news:', err);
          setError('Content temporarily unavailable. Please check back soon.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchNews();

    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, [subdomain, limit, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="news-section loading" role="status" aria-live="polite">
        <h2>Latest News</h2>
        <div className="loading-spinner" aria-label="Loading news articles">
          <div className="spinner"></div>
          <p>Loading news articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-section error" role="alert">
        <h2>Latest News</h2>
        <div className="error-message">
          <p>{error}</p>
          <button
            onClick={handleRetry}
            className="retry-button"
            aria-label="Retry loading news"
          >
            Try Again
          </button>
        </div>
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
    <section className="news-section" aria-label="Latest news articles">
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
                  aria-label={`Read article: ${article.title}`}
                >
                  {article.title}
                </a>
              </h3>
              <span className="news-meta" aria-label={`Published by ${article.source} ${formatDate(article.publishedAt)}`}>
                {article.source} • {formatDate(article.publishedAt)}
              </span>
            </div>
            <p className="news-summary">{article.summary}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="read-more"
              aria-label={`Read full article: ${article.title}`}
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

        .news-card:focus-within {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
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

        .news-link:hover,
        .news-link:focus {
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

        .read-more:hover,
        .read-more:focus {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .loading, .error, .empty {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e0e0e0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .retry-button {
          padding: 0.75rem 1.5rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .retry-button:hover,
        .retry-button:focus {
          background: #1d4ed8;
          outline: 2px solid #2563eb;
          outline-offset: 2px;
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