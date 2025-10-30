import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Header } from '@yoohooguru/shared';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: number;
  readTime?: string;
  tags?: string[];
  category?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
}

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subdomain = 'writing';

  // Example static allowlist of slugs for demonstration purposes.
  const allowedSlugs = [
    "example-post",
    "how-to-code",
    "introducing-new-feature",
    // Add other valid slugs as needed
  ];

  // Only allow slugs that match a safe pattern: letters, numbers, hyphens, underscores
  function isValidSlug(slug: any): slug is string {
    return (
      typeof slug === "string" &&
      /^[a-zA-Z0-9\-_]+$/.test(slug) &&
      slug.length <= 100 &&
      allowedSlugs.includes(slug)
    );
  }

  useEffect(() => {
    if (!slug) return;
    if (!isValidSlug(slug)) {
      setError("Invalid post slug.");
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.yoohoo.guru';
        const response = await fetch(`${apiUrl}/api/${subdomain}/posts/${slug}`);

        if (!response.ok) {
          throw new Error('Post not found');
        }

        const data = await response.json();
        setPost(data.post);
        setRelatedPosts(data.relatedPosts || []);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Unable to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div>
        <Header />
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading post...</p>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div>
        <Header />
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Post Not Found</h1>
          <p>{error || 'The requested blog post could not be found.'}</p>
          <a href={`/_apps/${subdomain}`}>← Back to Home</a>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="blog-post-page">
        <article className="blog-post">
          <header className="post-header">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <span className="author">By {post.author}</span>
              <span className="separator">•</span>
              <span className="date">{formatDate(post.publishedAt)}</span>
              {post.readTime && (
                <>
                  <span className="separator">•</span>
                  <span className="read-time">{post.readTime}</span>
                </>
              )}
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="post-content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <footer className="post-footer">
            <p className="disclaimer">
              This post may contain affiliate links. We may earn a commission if you make a purchase through these links, at no additional cost to you.
            </p>
          </footer>
        </article>

        {relatedPosts.length > 0 && (
          <aside className="related-posts">
            <h2>Related Posts</h2>
            <div className="related-grid">
              {relatedPosts.map((related) => (
                <div key={related.id} className="related-card">
                  <h3>
                    <a href={`/_apps/${subdomain}/blog/${related.slug}`}>
                      {related.title}
                    </a>
                  </h3>
                  <p>{related.excerpt}</p>
                </div>
              ))}
            </div>
          </aside>
        )}

        <div className="back-link">
          <a href={`/_apps/${subdomain}`}>← Back to {subdomain} Guru</a>
        </div>
      </main>

      <style jsx>{`
        .blog-post-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .blog-post {
          background: #fff;
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .post-header {
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 1.5rem;
          margin-bottom: 2rem;
        }

        .post-title {
          font-size: 2.5rem;
          line-height: 1.2;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .post-meta {
          font-size: 0.95rem;
          color: #666;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .separator {
          color: #ccc;
        }

        .author {
          font-weight: 600;
          color: #333;
        }

        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .tag {
          background: #f3f4f6;
          color: #4b5563;
          padding: 0.4rem 0.9rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .post-content {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #333;
        }

        .post-content :global(h2) {
          font-size: 1.8rem;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .post-content :global(h3) {
          font-size: 1.4rem;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: #1a1a1a;
        }

        .post-content :global(p) {
          margin-bottom: 1.5rem;
        }

        .post-content :global(a) {
          color: #2563eb;
          text-decoration: underline;
        }

        .post-content :global(a:hover) {
          color: #1d4ed8;
        }

        .post-content :global(ul),
        .post-content :global(ol) {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }

        .post-content :global(li) {
          margin-bottom: 0.5rem;
        }

        .post-content :global(blockquote) {
          border-left: 4px solid #2563eb;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #555;
        }

        .post-content :global(code) {
          background: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-size: 0.9em;
        }

        .post-content :global(pre) {
          background: #1a1a1a;
          color: #fff;
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }

        .post-content :global(pre code) {
          background: transparent;
          padding: 0;
        }

        .post-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #e0e0e0;
        }

        .disclaimer {
          font-size: 0.9rem;
          color: #666;
          font-style: italic;
        }

        .related-posts {
          background: #f9fafb;
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .related-posts h2 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }

        .related-grid {
          display: grid;
          gap: 1.5rem;
        }

        .related-card {
          background: #fff;
          padding: 1.5rem;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
        }

        .related-card h3 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .related-card a {
          color: #2563eb;
          text-decoration: none;
        }

        .related-card a:hover {
          text-decoration: underline;
        }

        .related-card p {
          color: #555;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .back-link {
          text-align: center;
          margin-top: 2rem;
        }

        .back-link a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }

        .back-link a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .blog-post-page {
            padding: 1rem;
          }

          .blog-post {
            padding: 1.5rem;
          }

          .post-title {
            font-size: 1.8rem;
          }

          .post-content {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}
