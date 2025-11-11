import React from 'react';
import Head from 'next/head';
import Navigation from '../../../components/ui/Navigation';
import HeroSection from '../../../components/sections/HeroSection';
import { ExpertCard } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

interface ContentHubProps {
  subject: string;
}

const ContentHub: React.FC<ContentHubProps> = ({ subject }) => {
  // Subject-specific configuration
  const subjectConfig: Record<string, {
    title: string;
    description: string;
    icon: string;
    color: string;
    stats: { experts: number; courses: number; articles: number };
  }> = {
    music: {
      title: "Music Guru",
      description: "Master instruments, theory, and production with expert guidance",
      icon: "🎵",
      color: "purple",
      stats: { experts: 145, courses: 89, articles: 234 }
    },
    coding: {
      title: "Coding Guru", 
      description: "Learn programming languages, frameworks, and development best practices",
      icon: "💻",
      color: "emerald",
      stats: { experts: 289, courses: 156, articles: 412 }
    },
    cooking: {
      title: "Cooking Guru",
      description: "Discover culinary techniques, recipes, and kitchen skills",
      icon: "👨‍🍳",
      color: "orange",
      stats: { experts: 98, courses: 67, articles: 189 }
    },
    // Default configuration for other subjects
    default: {
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Guru`,
      description: `Expert knowledge and curated content for ${subject} enthusiasts`,
      icon: "📚",
      color: "blue",
      stats: { experts: 67, courses: 34, articles: 123 }
    }
  };

  const config = subjectConfig[subject] || subjectConfig.default;

  // Sample news articles
  const newsArticles = [
    {
      title: `Latest Innovations in ${config.title.replace(' Guru', '')}`,
      excerpt: "Breaking developments and emerging trends are reshaping the landscape. Industry experts weigh in on what this means for practitioners.",
      author: "Industry Analyst",
      readTime: "5 min read",
      date: "2 hours ago",
      featured: true
    },
    {
      title: "Community Spotlight: Success Stories",
      excerpt: "Meet the members who are making waves in our community. Learn from their journeys and achievements.",
      author: "Community Team", 
      readTime: "3 min read",
      date: "5 hours ago"
    },
    {
      title: "Tips and Tricks for Beginners",
      excerpt: "Essential guidance for those just starting their journey. These foundational concepts will accelerate your learning.",
      author: "Expert Mentor",
      readTime: "7 min read", 
      date: "1 day ago"
    },
    {
      title: "Advanced Techniques Deep Dive",
      excerpt: "Explore sophisticated methods and strategies used by professionals. Take your skills to the next level.",
      author: "Professional Instructor",
      readTime: "10 min read",
      date: "2 days ago"
    }
  ];

  // Sample blog posts
  const blogPosts = [
    {
      title: "Getting Started: A Complete Guide",
      excerpt: "Everything you need to know to begin your journey. This comprehensive guide covers fundamentals, tools, and first steps.",
      author: "Teaching Team",
      category: "Beginner",
      readTime: "12 min read",
      featured: true
    },
    {
      title: "Common Mistakes to Avoid",
      excerpt: "Learn from the experiences of others. These pitfalls can slow your progress if you're not aware of them.",
      author: "Expert Community",
      category: "Learning",
      readTime: "8 min read"
    },
    {
      title: "Building Your Portfolio",
      excerpt: "Showcase your skills effectively. Learn what makes a portfolio stand out to potential clients or employers.",
      author: "Career Advisors",
      category: "Career",
      readTime: "15 min read"
    }
  ];

  // Sample experts for this subject
  const subjectExperts = [
    {
      name: "Alex Morgan",
      title: `${config.title.replace(' Guru', '')} Expert`,
      description: `Professional ${subject.toLowerCase()} specialist with 10+ years of experience. Passionate about teaching and mentoring others.`,
      rating: 4.9,
      reviews: 156,
      hourlyRate: 65,
      skills: [subject, "Teaching", "Mentoring", "Professional Development"],
      href: `https://coach.yoohoo.guru/alex-morgan-${subject}`,
    },
    {
      name: "Sarah Johnson",
      title: `Advanced ${config.title.replace(' Guru', '')} Instructor`,
      description: `Advanced practitioner specializing in cutting-edge techniques. Known for making complex topics accessible and engaging.`,
      rating: 4.8,
      reviews: 98,
      hourlyRate: 55,
      skills: [subject, "Advanced Techniques", "Problem Solving", "Creative Methods"],
      href: `https://coach.yoohoo.guru/sarah-johnson-${subject}`,
    },
    {
      name: "Michael Chen",
      title: `Industry ${config.title.replace(' Guru', '')} Professional`,
      description: `Real-world experience from working with top companies. Practical insights that bridge theory and application.`,
      rating: 5.0,
      reviews: 203,
      hourlyRate: 75,
      skills: [subject, "Industry Applications", "Best Practices", "Professional Skills"],
      href: `https://coach.yoohoo.guru/michael-chen-${subject}`,
    }
  ];

  // Related subjects for cross-linking
  const relatedSubjects = ['Technology', 'Business', 'Creative Arts', 'Education', 'Lifestyle', 'Science'].filter(s => s !== subject);

  return (
    <>
      <Head>
        <title>{config.title} - Expert Knowledge & Community | YooHoo.Guru</title>
        <meta name="description" content={config.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={config.title} />
        <meta property="og:description" content={config.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://${subject}.yoohoo.guru`} />
      </Head>

      <div className="min-h-screen bg-orbitron-primary">
        <Navigation currentDomain={subject} />
        
        {/* Hero Section */}
        <HeroSection 
          variant="content"
          title={config.title}
          subtitle={config.description}
        />

        {/* Hub Statistics */}
        <section className="py-12 bg-gradient-to-b from-transparent to-secondarydark/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="glass-effect p-6 rounded-lg">
                <div className="text-3xl font-bold text-emerald-400 mb-2">{config.stats.experts}+</div>
                <div className="text-sm text-gray-400">Expert Instructors</div>
              </div>
              <div className="glass-effect p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-400 mb-2">{config.stats.courses}+</div>
                <div className="text-sm text-gray-400">Available Courses</div>
              </div>
              <div className="glass-effect p-6 rounded-lg">
                <div className="text-3xl font-bold text-purple-400 mb-2">{config.stats.articles}+</div>
                <div className="text-sm text-gray-400">Articles & Tutorials</div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="heading-2 mb-2">Latest News</h2>
                <p className="body-normal">Stay updated with the latest developments and trends</p>
              </div>
              <Button variant="ghost" href={`/${subject}/news`}>
                View All News →
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {newsArticles.map((article, index) => (
                <div key={index} className={`card-hover ${article.featured ? 'card-featured' : 'card-default'}`}>
                  {article.featured && (
                    <div className="flex items-center mb-3">
                      <span className="badge-info">Featured</span>
                    </div>
                  )}
                  
                  <h3 className="heading-3 mb-3 hover:text-emerald-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="body-normal text-gray-400 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <span>{article.date}</span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <Button variant="ghost" size="sm" href={`/${subject}/news/${index}`}>
                      Read More →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section className="py-20 bg-gradient-to-b from-transparent to-secondarydark/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="heading-2 mb-2">Latest Blog Posts</h2>
                <p className="body-normal">In-depth tutorials and expert insights</p>
              </div>
              <Button variant="ghost" href={`/${subject}/blog`}>
                View All Posts →
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <div key={index} className={`card-hover ${post.featured ? 'card-featured' : 'card-default'}`}>
                  {post.featured && (
                    <div className="flex items-center mb-3">
                      <span className="badge-warning">Featured</span>
                    </div>
                  )}
                  
                  <div className="flex items-center mb-3">
                    <span className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="heading-3 mb-3 hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="body-normal text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <Button variant="ghost" size="sm" href={`/${subject}/blog/${index}`}>
                    Read Article →
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expert Instructors Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-2">Expert Instructors</h2>
              <p className="body-normal max-w-2xl mx-auto">
                Learn from the best in the field. Our verified instructors bring real-world experience and passion for teaching.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {subjectExperts.map((expert, index) => (
                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ExpertCard {...expert} />
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="gradient" size="lg" href={`https://coach.yoohoo.guru/experts?subject=${subject}`}>
                Browse All {config.title.replace(' Guru', '')} Experts →
              </Button>
            </div>
          </div>
        </section>

        {/* Learning Resources Section */}
        <section className="py-20 bg-gradient-to-b from-transparent to-secondarydark/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-2">Learning Resources</h2>
              <p className="body-normal">Tools, templates, and resources to accelerate your learning</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Beginner's Guide", icon: "📖", count: "25+ lessons" },
                { title: "Practice Exercises", icon: "✏️", count: "100+ problems" },
                { title: "Video Tutorials", icon: "🎥", count: "45+ videos" },
                { title: "Community Forum", icon: "💬", count: "500+ discussions" },
                { title: "Downloadable Resources", icon: "📁", count: "30+ files" },
                { title: "Live Workshops", icon: "🎯", count: "Weekly sessions" },
                { title: "Certification Path", icon: "🏆", count: "3 levels" },
                { title: "Project Templates", icon: "🛠️", count: "20+ templates" }
              ].map((resource, index) => (
                <div key={index} className="card-hover text-center p-6">
                  <div className="text-3xl mb-3">{resource.icon}</div>
                  <h4 className="font-semibold text-white mb-2">{resource.title}</h4>
                  <p className="text-sm text-emerald-400">{resource.count}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Hubs Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="heading-3 mb-2">Explore Related Topics</h2>
              <p className="body-normal">Discover more content hubs in related areas</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {relatedSubjects.map((related, index) => (
                <a
                  key={index}
                  href={`https://${related.toLowerCase().replace(' ', '-')}.yoohoo.guru`}
                  className="card-hover text-center p-6 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl">📚</span>
                  </div>
                  <h4 className="font-medium text-white text-sm">{related}</h4>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card-featured text-center p-12">
              <h2 className="heading-2 mb-4">Ready to Master {config.title.replace(' Guru', '')}?</h2>
              <p className="body-large mb-8 max-w-2xl mx-auto">
                Join our community of learners and experts. Start your journey today with personalized guidance and curated resources.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="gradient" size="lg" href="/signup">
                  Start Learning →
                </Button>
                <Button variant="ghost" size="lg" href={`https://coach.yoohoo.guru/experts?subject=${subject}`}>
                  Find Expert →
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContentHub;