import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navigation from '../../../components/ui/Navigation';
import NewsSection from '../../../components/NewsSection';
import BlogList from '../../../components/BlogList';
import { getSubjectConfig } from '../../../config/subjects';

interface SubjectPageProps {
  subject: string;
}

const SubjectPage: React.FC<SubjectPageProps> = ({ subject }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [subjectData, setSubjectData] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    if (router.isReady) {
      // Get subject configuration
      const subjectConfig = getSubjectConfig(subject);
      setConfig(subjectConfig);
      
      // Load subject-specific data
      loadSubjectData();
    }
  }, [router.isReady, subject]);

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
            <p className="text-purple-300">The subject you're looking for doesn't exist or isn't available.</p>
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

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Expert Tutors', value: '150+', icon: '👨‍🏫' },
            { label: 'Video Courses', value: '500+', icon: '🎥' },
            { label: 'Active Students', value: '10K+', icon: '👥' },
            { label: 'Success Rate', value: '95%', icon: '⭐' }
          ].map((stat, index) => (
            <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 text-center hover:bg-opacity-20 transition-all duration-300">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-purple-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* News Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NewsSection 
          title={`${subjectData.title} News & Updates`}
          newsItems={subjectData.news || []}
        />
      </div>

      {/* Blog Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlogList 
          title={`${subjectData.title} Articles & Tutorials`}
          blogPosts={subjectData.blogs || []}
        />
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Master {subjectData.title}?
          </h2>
          <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
            Connect with expert tutors, access premium courses, and join a community of passionate learners.
          </p>
          <div className="space-x-4">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105">
              Get Started Free
            </button>
            <button className="bg-purple-800 bg-opacity-50 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-70 transition-all duration-300 transform hover:scale-105">
              View Pricing
            </button>
          </div>
        </div>
      </div>
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