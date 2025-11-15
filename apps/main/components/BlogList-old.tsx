import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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

// Allow-list of valid subjects (copy from getStaticPaths in [subject]/index.tsx)
const VALID_SUBJECTS = [
  'art', 'auto', 'business', 'coding', 'cooking', 'crafts', 'data',
  'design', 'finance', 'fitness', 'gardening', 'history',
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

  useEffect(() => {
    // Validate subdomain before making the request
    if (!subdomain || !VALID_SUBJECTS.includes(subdomain)) {
      setError('Invalid subject specified.');
      setLoading(false);
      setPosts([]);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;

    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Set timeout to prevent indefinite loading
        timeoutId = setTimeout(() => {
          if (!isCancelled && loading) {
            setError('Request timeout. Content temporarily unavailable.');
            setLoading(false);
          }
        }, 10000); // 10 second timeout

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.yoohoo.guru';
        const response = await fetch(`${apiUrl}/api/${subdomain}/posts?limit=${limit}&page=1`);

        if (isCancelled) return;

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch blog posts (${response.status})`);
        }

        const data = await response.json();
        if (!isCancelled) {
          setPosts(data.posts || []);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error fetching blog posts:', err);
          setError('Content temporarily unavailable. Please check back soon.');
        }
      } finally {
        if (!isCancelled) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    };

    fetchBlogPosts();

    // Cleanup function
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subdomain, limit]);

  if (loading) {
    return (
      <div className="blog-list loading">
        <h2>Latest Blog Posts</h2>
        <p>Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-list error">
        <h2>Latest Blog Posts</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="blog-list empty">
        <h2>Latest Blog Posts</h2>
        <p>No blog posts available yet. Check back soon for expert insights!</p>
      </div>
    );
  }

  return (
    <section className="blog-list">
      <h2>Latest Blog Posts</h2>
      <div className="blog-grid">
        {posts.map((post) => (
          <article key={post.id} className="blog-card">
            <div className="blog-header">
              <h3 className="blog-title">
                <Link href={`/_apps/${subdomain}/blog/${post.slug}`}>
                  <a className="blog-link">{post.title}</a>
                </Link>
              </h3>
              <div className="blog-meta">
                <span className="author">{post.author}</span>
                {post.readTime && (
                  <>
                    <span className="separator">•</span>
                    <span className="read-time">{post.readTime}</span>
                  </>
                )}
                <span className="separator">•</span>
                <span className="date">{formatDate(post.publishedAt)}</span>
              </div>
            </div>

            {showExcerpts && post.excerpt && (
              <p className="blog-excerpt">{post.excerpt}</p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="blog-tags">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <Link href={`/_apps/${subdomain}/blog/${post.slug}`}>
              <a className="read-more">Read full post →</a>
            </Link>
          </article>
        ))}
      </div>

      <div className="view-all">
        <Link href={`/_apps/${subdomain}/blog`}>
          <a className="view-all-link">View all blog posts →</a>
        </Link>
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
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .blog-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.75rem;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
          display: flex;
          flex-direction: column;
        }

        .blog-card:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
          transform: translateY(-3px);
        }

        .blog-header {
          margin-bottom: 1rem;
        }

        .blog-title {
          font-size: 1.375rem;
          margin: 0 0 0.75rem 0;
          line-height: 1.3;
          font-weight: 600;
        }

        .blog-link {
          color: #1a1a1a;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .blog-link:hover {
          color: #2563eb;
        }

        .blog-meta {
          font-size: 0.875rem;
          color: #666;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .separator {
          color: #ccc;
        }

        .author {
          font-weight: 500;
          color: #333;
        }

        .blog-excerpt {
          color: #555;
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

        .tag {
          background: #f3f4f6;
          color: #4b5563;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .read-more {
          color: #2563eb;
          font-weight: 500;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease;
          margin-top: auto;
        }

        .read-more:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .view-all {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid #e0e0e0;
        }

        .view-all-link {
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
          font-size: 1.1rem;
          transition: color 0.2s ease;
        }

        .view-all-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .loading, .error, .empty {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }

          .blog-list h2 {
            font-size: 1.5rem;
          }

          .blog-title {
            font-size: 1.2rem;
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
