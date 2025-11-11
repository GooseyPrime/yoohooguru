import React from 'react';
import Head from 'next/head';
import Navigation from '../components/ui/Navigation';

export default function Hubs() {
  const allHubs = [
    { icon: '🎨', name: 'Art', slug: 'art', description: 'Drawing, painting, sculpture, and visual arts', articles: 167 },
    { icon: '💼', name: 'Business', slug: 'business', description: 'Entrepreneurship, management, and strategy', articles: 189 },
    { icon: '💻', name: 'Coding', slug: 'coding', description: 'Programming, software development, and tech', articles: 234 },
    { icon: '🍳', name: 'Cooking', slug: 'cooking', description: 'Culinary arts, recipes, and food techniques', articles: 156 },
    { icon: '✂️', name: 'Crafts', slug: 'crafts', description: 'DIY projects, handmade goods, and creativity', articles: 143 },
    { icon: '📊', name: 'Data', slug: 'data', description: 'Data science, analytics, and visualization', articles: 178 },
    { icon: '🎨', name: 'Design', slug: 'design', description: 'Graphic design, UI/UX, and creative direction', articles: 201 },
    { icon: '💰', name: 'Finance', slug: 'finance', description: 'Personal finance, budgeting, and money management', articles: 167 },
    { icon: '💪', name: 'Fitness', slug: 'fitness', description: 'Exercise, nutrition, and healthy living', articles: 134 },
    { icon: '🌱', name: 'Gardening', slug: 'gardening', description: 'Plants, landscaping, and outdoor spaces', articles: 112 },
    { icon: '📚', name: 'History', slug: 'history', description: 'Historical events, cultures, and civilizations', articles: 145 },
    { icon: '🏠', name: 'Home', slug: 'home', description: 'Home improvement, decor, and organization', articles: 198 },
    { icon: '📈', name: 'Investing', slug: 'investing', description: 'Stocks, real estate, and wealth building', articles: 187 },
    { icon: '🗣️', name: 'Language', slug: 'language', description: 'Foreign languages and communication skills', articles: 156 },
    { icon: '📱', name: 'Marketing', slug: 'marketing', description: 'Digital marketing, branding, and advertising', articles: 223 },
    { icon: '🔢', name: 'Math', slug: 'math', description: 'Mathematics, statistics, and problem solving', articles: 134 },
    { icon: '🎵', name: 'Music', slug: 'music', description: 'Instruments, theory, and musical performance', articles: 178 },
    { icon: '📷', name: 'Photography', slug: 'photography', description: 'Camera techniques, editing, and visual storytelling', articles: 165 },
    { icon: '💼', name: 'Sales', slug: 'sales', description: 'Sales techniques, negotiation, and closing deals', articles: 143 },
    { icon: '🔬', name: 'Science', slug: 'science', description: 'Scientific concepts, experiments, and discovery', articles: 156 },
    { icon: '⚽', name: 'Sports', slug: 'sports', description: 'Athletic training, techniques, and competition', articles: 134 },
    { icon: '💻', name: 'Tech', slug: 'tech', description: 'Technology trends, gadgets, and innovation', articles: 245 },
    { icon: '🧘', name: 'Wellness', slug: 'wellness', description: 'Mental health, mindfulness, and self-care', articles: 167 },
    { icon: '✍️', name: 'Writing', slug: 'writing', description: 'Creative writing, journalism, and storytelling', articles: 189 }
  ];

  return (
    <>
      <Head>
        <title>Content Hubs - YooHoo.Guru</title>
        <meta name="description" content="Explore 24 specialized content hubs covering art, business, technology, wellness, and more." />
      </Head>

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              Explore Our <span className="gradient-text-emerald-blue">Content Hubs</span>
            </h1>
            <p className="text-xl text-white-80 max-w-3xl mx-auto">
              Discover expert-curated content across 24 specialized topics. Each hub features AI-curated news, in-depth articles, and community insights.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="pb-20">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text-emerald mb-2">24</div>
                <div className="text-white-60">Content Hubs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text-blue mb-2">4,000+</div>
                <div className="text-white-60">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text-purple mb-2">Daily</div>
                <div className="text-white-60">Updates</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text-gold mb-2">AI</div>
                <div className="text-white-60">Curated</div>
              </div>
            </div>
          </div>
        </section>

        {/* All Hubs Grid */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allHubs.map((hub, index) => (
                <a
                  key={index}
                  href={`https://${hub.slug}.yoohoo.guru`}
                  className="glass-card p-6 rounded-2xl hover-lift group"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {hub.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:gradient-text-emerald-blue transition-all duration-300">
                    {hub.name}
                  </h3>
                  <p className="text-sm text-white-60 mb-3 line-clamp-2">
                    {hub.description}
                  </p>
                  <div className="text-xs text-emerald-400 font-semibold">
                    {hub.articles} articles →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="text-4xl font-display font-bold text-white text-center mb-12">
              What You'll Find in Each Hub
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="glass-card p-8 rounded-2xl text-center">
                <div className="text-5xl mb-4">📰</div>
                <h3 className="text-xl font-bold text-white mb-3">Daily News</h3>
                <p className="text-white-80">
                  AI-curated news articles updated twice daily with the latest developments in each field
                </p>
              </div>
              <div className="glass-card p-8 rounded-2xl text-center">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-white mb-3">Weekly Blog Posts</h3>
                <p className="text-white-80">
                  In-depth articles and guides written by AI and reviewed by experts in the field
                </p>
              </div>
              <div className="glass-card p-8 rounded-2xl text-center">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-white mb-3">Expert Community</h3>
                <p className="text-white-80">
                  Connect with Gurus and learners who share your interests and passion
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/50">
          <div className="container-custom text-center">
            <div className="glass-card p-12 rounded-3xl max-w-3xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-white mb-4">
                Ready to Dive In?
              </h2>
              <p className="text-white-80 mb-8">
                Choose a hub that interests you and start exploring expert content today
              </p>
              <a
                href="/"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300"
              >
                <span>Back to Home</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}