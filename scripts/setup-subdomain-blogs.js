#!/usr/bin/env node

/**
 * Script to set up blog pages for all subdomains
 * This creates blog directories and pages dynamically for each subdomain
 */

const fs = require('fs');
const path = require('path');

// Get all subdomain names
const subdomains = [
  'angel', 'coach', 'heroes', 'dashboard', 'cooking', 'music',
  'fitness', 'wellness', 'tech', 'coding', 'data', 'art',
  'design', 'writing', 'photography', 'crafts', 'language',
  'history', 'math', 'science', 'business', 'finance',
  'investing', 'marketing', 'sales', 'gardening', 'home', 'sports'
];

const appsDir = path.join(__dirname, '../apps/main/pages/_apps');

// Blog post page template
const blogPostTemplate = (subdomain) => `import { useRouter } from 'next/router';
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

  const subdomain = '${subdomain}';

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.yoohoo.guru';
        const response = await fetch(\`\${apiUrl}/api/\${subdomain}/posts/\${slug}\`);

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
          <a href={\`/_apps/\${subdomain}\`}>← Back to Home</a>
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
                    <a href={\`/_apps/\${subdomain}/blog/\${related.slug}\`}>
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
          <a href={\`/_apps/\${subdomain}\`}>← Back to {subdomain} Guru</a>
        </div>
      </main>

      <style jsx>{\`
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
      \`}</style>
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
`;

// Blog index page template
const blogIndexTemplate = (subdomain) => `import { useState, useEffect } from 'react';
import { Header } from '@yoohooguru/shared';
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

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const subdomain = '${subdomain}';
  const limit = 12;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.yoohoo.guru';
        const tagParam = selectedTag ? \`&tag=\${selectedTag}\` : '';
        const response = await fetch(
          \`\${apiUrl}/api/\${subdomain}/posts?page=\${page}&limit=\${limit}\${tagParam}\`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data.posts || []);
        setTotalPages(data.pagination?.totalPages || 1);

        if (data.filters?.availableTags) {
          setAvailableTags(data.filters.availableTags);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Unable to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, selectedTag]);

  return (
    <div>
      <Header />
      <main className="blog-index-page">
        <div className="blog-header">
          <h1>Blog</h1>
          <p>Expert insights, tutorials, and guides</p>
        </div>

        {availableTags.length > 0 && (
          <div className="tag-filter">
            <button
              className={\`tag-button \${!selectedTag ? 'active' : ''}\`}
              onClick={() => setSelectedTag(null)}
            >
              All
            </button>
            {availableTags.map((tag) => (
              <button
                key={tag}
                className={\`tag-button \${selectedTag === tag ? 'active' : ''}\`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="loading">
            <p>Loading posts...</p>
          </div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty">
            <p>No blog posts found. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="posts-grid">
              {posts.map((post) => (
                <article key={post.id} className="post-card">
                  <h2 className="post-title">
                    <Link href={\`/_apps/\${subdomain}/blog/\${post.slug}\`}>
                      <a>{post.title}</a>
                    </Link>
                  </h2>
                  <div className="post-meta">
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
                  {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
                  {post.tags && post.tags.length > 0 && (
                    <div className="post-tags">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link href={\`/_apps/\${subdomain}/blog/\${post.slug}\`}>
                    <a className="read-more">Read more →</a>
                  </Link>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="page-button"
                >
                  ← Previous
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="page-button"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        <div className="back-link">
          <a href={\`/_apps/\${subdomain}\`}>← Back to Home</a>
        </div>
      </main>

      <style jsx>{\`
        .blog-index-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .blog-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .blog-header h1 {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
        }

        .blog-header p {
          font-size: 1.2rem;
          color: #666;
        }

        .tag-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 2rem;
          justify-content: center;
        }

        .tag-button {
          background: #f3f4f6;
          color: #4b5563;
          padding: 0.5rem 1rem;
          border: 2px solid transparent;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tag-button:hover {
          background: #e5e7eb;
        }

        .tag-button.active {
          background: #2563eb;
          color: #fff;
          border-color: #2563eb;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .post-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 2rem;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
        }

        .post-card:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
        }

        .post-title {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .post-title a {
          color: #1a1a1a;
          text-decoration: none;
        }

        .post-title a:hover {
          color: #2563eb;
        }

        .post-meta {
          font-size: 0.875rem;
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

        .post-excerpt {
          color: #555;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tag {
          background: #f3f4f6;
          color: #4b5563;
          padding: 0.3rem 0.75rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .read-more {
          color: #2563eb;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .read-more:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-top: 3rem;
        }

        .page-button {
          background: #2563eb;
          color: #fff;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .page-button:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .page-button:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .page-info {
          color: #666;
          font-weight: 500;
        }

        .back-link {
          text-align: center;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #e0e0e0;
        }

        .back-link a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }

        .back-link a:hover {
          text-decoration: underline;
        }

        .loading, .error, .empty {
          text-align: center;
          padding: 4rem 2rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .blog-header h1 {
            font-size: 2rem;
          }

          .posts-grid {
            grid-template-columns: 1fr;
          }

          .pagination {
            flex-direction: column;
            gap: 1rem;
          }
        }
      \`}</style>
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
`;

console.log('🚀 Setting up blog pages for all subdomains...\n');

let successCount = 0;
let errorCount = 0;

subdomains.forEach((subdomain) => {
  try {
    const subdomainDir = path.join(appsDir, subdomain);
    const blogDir = path.join(subdomainDir, 'blog');

    // Create blog directory if it doesn't exist
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    // Write blog index page
    const indexPath = path.join(blogDir, 'index.tsx');
    fs.writeFileSync(indexPath, blogIndexTemplate(subdomain));

    // Write blog post page
    const slugPath = path.join(blogDir, '[slug].tsx');
    fs.writeFileSync(slugPath, blogPostTemplate(subdomain));

    console.log(`✅ ${subdomain}: Blog pages created`);
    successCount++;
  } catch (error) {
    console.error(`❌ ${subdomain}: Error - ${error.message}`);
    errorCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   ✅ Success: ${successCount} subdomains`);
console.log(`   ❌ Errors: ${errorCount} subdomains`);
console.log(`\n✨ Blog setup complete!`);
