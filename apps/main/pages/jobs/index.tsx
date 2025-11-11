import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navigation from '../../components/ui/Navigation';
import Head from 'next/head';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: string;
  duration: string;
  skillsRequired: string[];
  experienceLevel: string;
  location: string;
  urgency: string;
  postedBy: string;
  postedDate: string;
  proposals: number;
}

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        // Use mock data if API fails
        setJobs(mockJobs);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      setJobs(mockJobs);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.skillsRequired.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'text-red-400 bg-red-500 bg-opacity-20';
      case 'high': return 'text-orange-400 bg-orange-500 bg-opacity-20';
      case 'normal': return 'text-blue-400 bg-blue-500 bg-opacity-20';
      default: return 'text-gray-400 bg-gray-500 bg-opacity-20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-300 text-lg">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Head>
        <title>Browse Jobs | YooHoo.Guru</title>
        <meta name="description" content="Find freelance opportunities and projects on YooHoo.Guru" />
      </Head>

      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Browse Help Wanted Ads
          </h1>
          <p className="text-xl text-purple-300 mb-8">
            Find your next project and showcase your expertise
          </p>
          <button
            onClick={() => router.push('/jobs/post')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            Post a Job
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search jobs by title, description, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-4 bg-white bg-opacity-10 backdrop-blur-md border border-purple-500 border-opacity-30 rounded-full text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-6 py-4 bg-white bg-opacity-10 backdrop-blur-md border border-purple-500 border-opacity-30 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              <option value="coding">Programming & Development</option>
              <option value="design">Design & Creative</option>
              <option value="writing">Writing & Content</option>
              <option value="marketing">Marketing & Sales</option>
              <option value="business">Business & Consulting</option>
              <option value="data">Data & Analytics</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">{filteredJobs.length}</div>
            <div className="text-purple-300">Active Jobs</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">$50K+</div>
            <div className="text-purple-300">Total Budget</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <div className="text-purple-300">Experts Available</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">95%</div>
            <div className="text-purple-300">Success Rate</div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-purple-300 text-lg">No jobs found matching your criteria.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-purple-500 border-opacity-20 hover:bg-opacity-15 transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/jobs/${job.id}`)}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="text-xl font-bold text-white flex-1">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(job.urgency)}`}>
                        {job.urgency.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-purple-300 mb-4 line-clamp-2">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skillsRequired.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-600 bg-opacity-30 text-purple-200 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-purple-400">
                      <span>💰 {job.budget}</span>
                      <span>⏱️ {job.duration}</span>
                      <span>📍 {job.location}</span>
                      <span>📊 {job.experienceLevel}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white mb-2">{job.proposals}</div>
                    <div className="text-purple-300 text-sm mb-4">Proposals</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/jobs/${job.id}/apply`);
                      }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-purple-500 border-opacity-20 flex items-center justify-between text-sm text-purple-400">
                  <span>Posted by {job.postedBy}</span>
                  <span>{job.postedDate}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Mock data for demonstration
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'React Developer Needed for E-commerce Platform',
    description: 'Looking for an experienced React developer to build a modern e-commerce platform with Next.js, TypeScript, and Stripe integration. Must have experience with responsive design and state management.',
    category: 'coding',
    budget: '$2,000 - $3,000',
    duration: '4-6 weeks',
    skillsRequired: ['React', 'Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS'],
    experienceLevel: 'intermediate',
    location: 'remote',
    urgency: 'high',
    postedBy: 'TechStartup Inc.',
    postedDate: '2 days ago',
    proposals: 12
  },
  {
    id: '2',
    title: 'UI/UX Designer for Mobile App',
    description: 'Seeking a talented UI/UX designer to create wireframes and high-fidelity designs for a fitness tracking mobile app. Experience with Figma and mobile design patterns required.',
    category: 'design',
    budget: '$1,500 - $2,500',
    duration: '3-4 weeks',
    skillsRequired: ['Figma', 'UI Design', 'UX Design', 'Mobile Design', 'Prototyping'],
    experienceLevel: 'intermediate',
    location: 'remote',
    urgency: 'normal',
    postedBy: 'FitLife Apps',
    postedDate: '1 week ago',
    proposals: 8
  },
  {
    id: '3',
    title: 'Content Writer for Tech Blog',
    description: 'Need a skilled content writer to create engaging articles about web development, AI, and emerging technologies. Must have technical knowledge and excellent writing skills.',
    category: 'writing',
    budget: '$500 - $800',
    duration: '2-3 weeks',
    skillsRequired: ['Technical Writing', 'SEO', 'Content Strategy', 'Research'],
    experienceLevel: 'intermediate',
    location: 'remote',
    urgency: 'low',
    postedBy: 'DevBlog Media',
    postedDate: '3 days ago',
    proposals: 15
  },
  {
    id: '4',
    title: 'Data Analyst for Marketing Campaign',
    description: 'Looking for a data analyst to analyze marketing campaign performance and provide actionable insights. Experience with Google Analytics, SQL, and data visualization tools required.',
    category: 'data',
    budget: '$1,000 - $1,500',
    duration: '2 weeks',
    skillsRequired: ['SQL', 'Google Analytics', 'Data Visualization', 'Python', 'Excel'],
    experienceLevel: 'expert',
    location: 'remote',
    urgency: 'urgent',
    postedBy: 'Marketing Pro Agency',
    postedDate: '1 day ago',
    proposals: 6
  },
  {
    id: '5',
    title: 'Social Media Manager for Brand Launch',
    description: 'Seeking an experienced social media manager to handle brand launch across Instagram, Twitter, and LinkedIn. Must have proven track record of growing social media presence.',
    category: 'marketing',
    budget: '$800 - $1,200',
    duration: '1 month',
    skillsRequired: ['Social Media Marketing', 'Content Creation', 'Analytics', 'Brand Strategy'],
    experienceLevel: 'intermediate',
    location: 'remote',
    urgency: 'high',
    postedBy: 'NewBrand Co.',
    postedDate: '5 days ago',
    proposals: 10
  }
];