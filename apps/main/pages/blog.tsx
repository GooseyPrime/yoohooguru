import React from 'react';
import Seo from '../components/Seo';
import Link from 'next/link';
import Navigation from '../components/ui/Navigation';

export default function Blog() {
  const categories = [
    { name: 'All Posts', count: 156, active: true },
    { name: 'Platform Updates', count: 24, active: false },
    { name: 'Success Stories', count: 45, active: false },
    { name: 'Tips & Guides', count: 67, active: false },
    { name: 'Community', count: 20, active: false },
  ];

  const featuredPost = {
    title: "How YooHoo.Guru is Transforming Skill Sharing in 2024",
    excerpt: "Discover how our platform is revolutionizing the way people learn, teach, and connect through skill sharing. From AI-powered matching to accessible learning for all.",
    author: "YooHoo Team",
    date: "November 10, 2024",
    readTime: "5 min read",
    image: "🚀",
    category: "Platform Updates"
  };

  const recentPosts = [
    {
      title: "10 Tips for Becoming a Successful Guru",
      excerpt: "Learn the secrets to building a thriving teaching practice on YooHoo.Guru.",
      author: "Sarah Chen",
      date: "November 8, 2024",
      readTime: "4 min read",
      category: "Tips & Guides",
      icon: "👨‍🏫",
      slug: "10-tips-becoming-successful-guru"
    },
    {
      title: "Success Story: From Learner to Expert in 6 Months",
      excerpt: "How Marcus transformed his career by learning web development on our platform.",
      author: "Marcus Rodriguez",
      date: "November 5, 2024",
      readTime: "6 min read",
      category: "Success Stories",
      icon: "⭐",
      slug: "success-story-learner-to-expert"
    },
    {
      title: "Building Community Through Hero Gurus",
      excerpt: "The impact of accessible learning for people with disabilities.",
      author: "Emily Watson",
      date: "November 3, 2024",
      readTime: "5 min read",
      category: "Community",
      icon: "❤️",
      slug: "building-community-hero-gurus"
    },
    {
      title: "AI-Powered Matchmaking: Finding Your Perfect Guru",
      excerpt: "How our AI technology connects learners with the right experts.",
      author: "Tech Team",
      date: "November 1, 2024",
      readTime: "7 min read",
      category: "Platform Updates",
      icon: "🤖",
      slug: "ai-powered-matchmaking"
    },
    {
      title: "Maximizing Your Learning Experience",
      excerpt: "Best practices for getting the most out of your coaching sessions.",
      author: "Learning Team",
      date: "October 28, 2024",
      readTime: "4 min read",
      category: "Tips & Guides",
      icon: "📚",
      slug: "maximizing-learning-experience"
    },
    {
      title: "Angel's List: Supporting Local Communities",
      excerpt: "How our local services marketplace is strengthening neighborhoods.",
      author: "Community Team",
      date: "October 25, 2024",
      readTime: "5 min read",
      category: "Community",
      icon: "🏘️",
      slug: "angels-list-supporting-communities"
    }
  ];

  return (
    <>
      <Seo
        title="Blog - YooHoo.Guru"
        description="Explore articles, tips, and insights about skill sharing, learning, and community building on YooHoo.Guru."
        url="https://www.yoohoo.guru/blog"
        image="https://www.yoohoo.guru/assets/og-blog.jpg"
      />

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              YooHoo.Guru <span className="gradient-text-emerald-blue">Blog</span>
            </h1>
            <p className="text-xl text-white-80 max-w-3xl mx-auto">
              Stories, updates, and insights from our community of learners and experts
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="pb-12">
          <div className="container-custom">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    category.active
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-glow-emerald'
                      : 'glass-button text-white-80 hover:bg-white-20'
                  }`}
                >
                  {category.name} <span className="text-white-60">({category.count})</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="pb-20">
          <div className="container-custom">
            <div className="glass-card p-8 md:p-12 rounded-3xl hover-lift">
              <div className="flex items-start justify-between mb-4">
                <span className="badge-info">{featuredPost.category}</span>
                <div className="text-6xl">{featuredPost.image}</div>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                {featuredPost.title}
              </h2>
              <p className="text-lg text-white-80 mb-6 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-white-60">
                  <span>{featuredPost.author}</span>
                  <span>•</span>
                  <span>{featuredPost.date}</span>
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <Link
                  href="/blog/yoohoo-guru-transforming-skill-sharing-2024"
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts Grid */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom">
            <h2 className="text-3xl font-display font-bold text-white mb-12">Recent Posts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl hover-lift">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs px-3 py-1 bg-white-10 text-white-80 rounded-full">
                      {post.category}
                    </span>
                    <div className="text-4xl">{post.icon}</div>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-3">
                    {post.title}
                  </h3>
                  <p className="text-white-80 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-white-60 mb-4">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block w-full py-2 text-center text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10 transition-all duration-300 font-semibold"
                  >
                    Read Article →
                  </Link>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Link
                href="/blog?page=2"
                className="inline-block px-8 py-4 glass-button text-white font-semibold rounded-xl hover:bg-white-20 transition-all duration-300"
              >
                Load More Posts
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="glass-card p-12 rounded-3xl text-center max-w-3xl mx-auto">
              <div className="text-5xl mb-6">📬</div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-white-80 mb-8">
                Get the latest stories, tips, and platform updates delivered to your inbox
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 input-premium"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}