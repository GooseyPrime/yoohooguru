import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navigation from '../../../components/ui/Navigation';
import { NewsSection } from '../../../components/NewsSection';
import { BlogList } from '../../../components/BlogList';
import { getSubjectConfig } from '../../../config/subjects';
import Button from '../../../components/ui/Button';

interface SubjectPageProps {
  subject: string;
}

const SubjectPage: React.FC<SubjectPageProps> = ({ subject }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [subjectData, setSubjectData] = useState<{
    news: unknown[];
    blogs: unknown[];
    title: string;
    description: string;
  } | null>(null);
  const [config, setConfig] = useState<{
    icon: string;
    gradient: string;
    description: string;
  } | null>(null);

  const loadSubjectData = async () => {
    try {
      // Fetch subject-specific news and blogs
      const [newsData, blogData] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.yoohoo.guru'}/api/news?subject=${subject}`).then(res => {
          if (!res.ok) throw new Error('Failed to fetch news');
          return res.json();
        }).catch(() => []),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.yoohoo.guru'}/api/blogs?subject=${subject}`).then(res => {
          if (!res.ok) throw new Error('Failed to fetch blogs');
          return res.json();
        }).catch(() => [])
      ]);

      setSubjectData({
        news: newsData,
        blogs: blogData,
        title: subject.charAt(0).toUpperCase() + subject.slice(1),
        description: `Discover the best ${subject} resources, tutorials, and expert guidance on YooHoo.Guru`
      });
    } catch (error) {
      console.error('Error loading subject data:', error);
      setSubjectData({
        news: [],
        blogs: [],
        title: subject.charAt(0).toUpperCase() + subject.slice(1),
        description: `Discover the best ${subject} resources, tutorials, and expert guidance on YooHoo.Guru`
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      excerpt: "Learn from the experiences of others. These pitfalls can slow your progress if you&apos;re not aware of them.",
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (router.isReady && subject) {
      loadSubjectData();
      const subjectConfig = getSubjectConfig(subject);
      setConfig(subjectConfig);
    }
  }, [router.isReady, subject]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto mb-4"></div>
            <p className="text-purple-300 text-lg">Loading {subject} resources...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!subjectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Subject Not Found</h1>
            <p className="text-purple-300">The subject you&apos;re looking for doesn&apos;t exist or isn&apos;t available.</p>
          </div>
        </div>
      </div>
    );
  }

  const gradientClass = config?.gradient || 'from-purple-600 via-pink-600 to-red-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Enhanced Hero Section */}
      <div className={`relative bg-gradient-to-br ${gradientClass} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-6">
              {config?.icon && (
                <div className="text-6xl mb-4">{config.icon}</div>
              )}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              {subjectData.title}
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              {subjectData.description}
            </p>
            <div className="mt-8 space-x-4">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105">
                Find {subjectData.title} Experts
              </button>
              <button className="bg-purple-800 bg-opacity-50 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-70 transition-all duration-300 transform hover:scale-105">
                Start Learning
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#gradient)" fillOpacity="0.1"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop stopColor="#8B5CF6"/>
                <stop offset="1%" stopColor="#EC4899"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Resources Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

      {/* News Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NewsSection 
          subdomain={subject}
          limit={5}
        />
      </div>

      {/* Blog Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlogList 
          subdomain={subject}
          limit={5}
        />
      </div>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card-featured text-center p-12">
              <h2 className="heading-2 mb-4">Ready to Master {subject.charAt(0).toUpperCase() + subject.slice(1)}?</h2>
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
  );
};



export async function getStaticProps({ params }: { params: { subject: string } }) {
  return {
    props: {
      subject: params.subject
    },
    revalidate: 60 // Revalidate every minute
  };
}

export async function getStaticPaths() {
  // Define all possible subject paths
  const subjects = [
    'art', 'business', 'coding', 'cooking', 'crafts', 'data', 
    'design', 'finance', 'fitness', 'gardening', 'history', 
    'home', 'investing', 'language', 'marketing', 'math', 
    'music', 'photography', 'sales', 'science', 'sports', 
    'tech', 'wellness', 'writing'
  ];

  const paths = subjects.map(subject => ({
    params: { subject }
  }));

  return {
    paths,
    fallback: true
  };
}

export default SubjectPage;