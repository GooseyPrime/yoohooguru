import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Seo from '../../components/Seo';
import Navigation from '../../components/ui/Navigation';
import Link from 'next/link';
import { isValidSlug } from '../../lib/validators';

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

  useEffect(() => {
    if (!slug) return;

    // Validate slug to prevent SSRF/path traversal
    if (!isValidSlug(slug as string)) {
      setError('Invalid blog post identifier');
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.yoohoo.guru';

        // Sanitize and validate slug immediately before use (defense in depth)
        const slugPattern = /^[A-Za-z0-9\-_]+$/;
        const slugStr = typeof slug === 'string' ? slug : '';
        if (!slugPattern.test(slugStr)) {
          throw new Error('Invalid slug format');
        }
        const safeSlug = slugStr;

        // For main blog, we'll try to fetch from a general blog collection
        // This is a placeholder - you may need to adjust based on your API structure
        const response = await fetch(`${apiUrl}/api/blog/posts/${safeSlug}`);

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
      <div className="min-h-screen">
        <Seo
          title="Loading... | YooHoo.Guru Blog"
          description="Loading blog post"
          url={`https://www.yoohoo.guru/blog/${slug}`}
        />
        <Navigation />
        <main className="flex items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-white-20 border-t-emerald-400 rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen">
        <Seo
          title="Post Not Found | YooHoo.Guru Blog"
          description="The requested blog post could not be found"
          url={`https://www.yoohoo.guru/blog/${slug}`}
        />
        <Navigation />
        <main className="section-padding text-center">
          <div className="max-w-2xl mx-auto glass-card p-12 rounded-3xl">
            <div className="text-6xl mb-6">📝</div>
            <h1 className="text-4xl font-display font-bold text-white mb-4">Post Not Found</h1>
            <p className="text-xl text-white-80 mb-8">
              {error || 'The requested blog post could not be found.'}
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-glow-emerald-lg hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Blog</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={post.seo?.metaTitle || `${post.title} | YooHoo.Guru Blog`}
        description={post.seo?.metaDescription || post.excerpt}
        url={`https://www.yoohoo.guru/blog/${post.slug}`}
      />

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom max-w-4xl">
            <article className="glass-card p-8 md:p-12 rounded-3xl">
              {/* Post Header */}
              <header className="border-b border-white-10 pb-8 mb-8">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white-60 mb-6">
                  <span className="text-white font-semibold">By {post.author}</span>
                  <span>•</span>
                  <span>{formatDate(post.publishedAt)}</span>
                  {post.readTime && (
                    <>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </>
                  )}
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              {/* Post Content */}
              <div className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>

              {/* Post Footer */}
              <footer className="mt-12 pt-8 border-t border-white-10">
                <p className="text-sm text-white-60 italic">
                  This post may contain affiliate links. We may earn a commission if you make a purchase through these links, at no additional cost to you.
                </p>
              </footer>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <aside className="mt-12">
                <h2 className="text-3xl font-display font-bold text-white mb-8">Related Posts</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.id}
                      href={`/blog/${related.slug}`}
                      className="glass-card p-6 rounded-2xl hover-lift block"
                    >
                      <h3 className="text-xl font-display font-bold text-white mb-3 hover:text-emerald-400 transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-white-70 line-clamp-2">{related.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </aside>
            )}

            {/* Back Link */}
            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to All Posts</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .prose {
          color: rgba(255, 255, 255, 0.9);
        }

        .prose h2 {
          font-size: 1.875rem;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: #ffffff;
          font-weight: 700;
        }

        .prose h3 {
          font-size: 1.5rem;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: #ffffff;
          font-weight: 600;
        }

        .prose p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }

        .prose a {
          color: #10b981;
          text-decoration: underline;
        }

        .prose a:hover {
          color: #059669;
        }

        .prose ul,
        .prose ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }

        .prose li {
          margin-bottom: 0.5rem;
        }

        .prose blockquote {
          border-left: 4px solid #10b981;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: rgba(255, 255, 255, 0.7);
        }

        .prose code {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-size: 0.9em;
        }

        .prose pre {
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }

        .prose pre code {
          background: transparent;
          padding: 0;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
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

// Make this page server-side rendered to avoid SSG issues with useRouter
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
