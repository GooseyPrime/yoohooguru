import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchWithRetry } from '../utils/apiHelpers';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: number;
  readTime?: string;
  tags?: string[];
  category?: string;
}

interface BlogListProps {
  subdomain: string;
  limit?: number;
  showExcerpts?: boolean;
}

// Allow-list of valid subjects
const VALID_SUBJECTS = [
  'angel', 'art', 'auto', 'business', 'coach', 'coding', 'cooking', 'crafts', 'data',
  'design', 'finance', 'fitness', 'gardening', 'heroes', 'history',
  'home', 'investing', 'language', 'marketing', 'math',
  'mechanical', 'music', 'photography', 'sales', 'science', 'sports',
  'tech', 'wellness', 'writing'
];

export const BlogList: React.FC<BlogListProps> = ({
  subdomain,
  limit = 6,
  showExcerpts = true
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Validate subdomain before making the request
    if (!subdomain || !VALID_SUBJECTS.includes(subdomain)) {
      setError('Invalid subject specified.');
      setLoading(false);
      setPosts([]);
      return;
    }

    let isCancelled = false;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use fetchWithRetry for automatic retry logic
        const response = await fetchWithRetry(
          `/api/${subdomain}/posts?limit=${limit}&page=1`,
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
          setPosts(data.posts || []);
          setRetryCount(0); // Reset retry count on success
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error fetching blog posts:', err);
          setError('Blog posts temporarily unavailable. Please check back soon.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

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
      <div className="blog-list loading" role="status" aria-live="polite">
        <h2>Latest Blog Posts</h2>
        <div className="loading-spinner" aria-label="Loading blog posts">
          <div className="spinner"></div>
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-list error" role="alert">
        <h2>Latest Blog Posts</h2>
        <div className="error-message">
          <p>{error}</p>
          <button
            onClick={handleRetry}
            className="retry-button"
            aria-label="Retry loading blog posts"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="blog-list empty">
        <h2>Latest Blog Posts</h2>
        <p>No blog posts available at this time. Check back soon!</p>
      </div>
    );
  }

  return (
    <section className="blog-list" aria-label="Latest blog posts">
      <h2>Latest Blog Posts</h2>
      <div className="blog-grid">
        {posts.map((post) => (
          <article key={post.id} className="blog-card">
            <div className="blog-header">
              <h3 className="blog-title">
                <Link
                  href={`/blog/${post.slug}`}
                  className="blog-link"
                  aria-label={`Read blog post: ${post.title}`}
                >
                  {post.title}
                </Link>
              </h3>
              <div className="blog-meta">
                <span className="blog-author" aria-label={`Written by ${post.author}`}>
                  By {post.author}
                </span>
                <span className="blog-date" aria-label={`Published ${formatDate(post.publishedAt)}`}>
                  {formatDate(post.publishedAt)}
                </span>
                {post.readTime && (
                  <span className="blog-read-time" aria-label={`Reading time: ${post.readTime}`}>
                    {post.readTime}
                  </span>
                )}
              </div>
            </div>
            {showExcerpts && post.excerpt && (
              <p className="blog-excerpt">{post.excerpt}</p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="blog-tags" aria-label="Post tags">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="blog-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <Link
              href={`/blog/${post.slug}`}
              className="read-more"
              aria-label={`Read full post: ${post.title}`}
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>

      <style jsx>{`
        .blog-list {
          padding: 2rem 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .blog-list h2 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .blog-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
          display: flex;
          flex-direction: column;
        }

        .blog-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .blog-card:focus-within {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        .blog-header {
          margin-bottom: 1rem;
        }

        .blog-title {
          font-size: 1.375rem;
          margin: 0 0 0.75rem 0;
          line-height: 1.4;
        }

        .blog-link {
          color: #1a1a1a;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .blog-link:hover,
        .blog-link:focus {
          color: #2563eb;
        }

        .blog-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: #666;
        }

        .blog-author {
          font-weight: 500;
        }

        .blog-date,
        .blog-read-time {
          color: #888;
        }

        .blog-excerpt {
          color: #333;
          line-height: 1.6;
          margin-bottom: 1rem;
          flex-grow: 1;
        }

        .blog-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .blog-tag {
          padding: 0.25rem 0.75rem;
          background: #f0f0f0;
          color: #666;
          font-size: 0.75rem;
          border-radius: 12px;
          font-weight: 500;
        }

        .read-more {
          color: #2563eb;
          font-weight: 500;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease;
          align-self: flex-start;
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
          .blog-grid {
            grid-template-columns: 1fr;
          }

          .blog-list h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}