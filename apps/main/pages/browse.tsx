import { GetServerSideProps } from 'next';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Seo from '../components/Seo';
import Link from 'next/link';
import Navigation from '../components/ui/Navigation';
import { ExpertCard } from '../components/ui/Card';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(() => import('../components/location/InteractiveMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-primarydark/50 rounded-xl flex items-center justify-center"><div className="text-white-60">Loading map...</div></div>
});

// This page will be the main "Browse Gurus" page
// We'll fetch real guru data from the API in a future iteration
// For now, we'll use comprehensive mock data that links to real booking pages

interface Guru {
  id: string;
  name: string;
  title: string;
  description: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  skills: string[];
  category: string;
  image?: string;
  availability?: 'available' | 'busy' | 'offline';
  location?: {
    lat: number;
    lng: number;
    city: string;
    state: string;
  };
}

const MOCK_GURUS: Guru[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Full Stack Web Development Expert',
    description: 'Full-stack developer with 8+ years experience in React, Node.js, and cloud architecture. Passionate about teaching modern web development best practices.',
    rating: 4.9,
    reviews: 127,
    hourlyRate: 75,
    skills: ['React', 'Node.js', 'AWS', 'TypeScript', 'Next.js'],
    category: 'coding',
    availability: 'available',
    location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco', state: 'CA' }
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    title: 'Digital Marketing Strategist',
    description: 'Help businesses grow through data-driven marketing. Specialized in SEO, content strategy, and social media marketing with proven ROI.',
    rating: 4.8,
    reviews: 93,
    hourlyRate: 60,
    skills: ['SEO', 'Content Marketing', 'Analytics', 'Social Media'],
    category: 'marketing',
    availability: 'available',
    location: { lat: 40.7128, lng: -74.0060, city: 'New York', state: 'NY' }
  },
  {
    id: '3',
    name: 'Emily Watson',
    title: 'UI/UX Design Mentor',
    description: 'Creative director turned educator. Teaching design thinking, brand identity, user experience, and digital illustration for modern apps.',
    rating: 5.0,
    reviews: 201,
    hourlyRate: 55,
    skills: ['UI/UX', 'Brand Design', 'Illustration', 'Figma', 'Prototyping'],
    category: 'design',
    availability: 'available',
    location: { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', state: 'CA' }
  },
  {
    id: '4',
    name: 'Dr. James Patterson',
    title: 'Data Science & Machine Learning',
    description: 'PhD in Computer Science. Specializing in machine learning, data analysis, and AI. Make complex concepts understandable.',
    rating: 4.9,
    reviews: 156,
    hourlyRate: 90,
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow', 'Statistics'],
    category: 'data',
    availability: 'busy',
    location: { lat: 42.3601, lng: -71.0589, city: 'Boston', state: 'MA' }
  },
  {
    id: '5',
    name: 'Chef Marco Rossi',
    title: 'Italian Cuisine Master',
    description: 'Trained in Rome, teaching authentic Italian cooking. From pasta to perfect risotto - learn traditional techniques and modern twists.',
    rating: 4.9,
    reviews: 178,
    hourlyRate: 60,
    skills: ['Italian Cooking', 'Pasta Making', 'Baking', 'Wine Pairing'],
    category: 'cooking',
    availability: 'available',
    location: { lat: 41.8781, lng: -87.6298, city: 'Chicago', state: 'IL' }
  },
  {
    id: '6',
    name: 'Jennifer Lee',
    title: 'Personal Finance Coach',
    description: 'CFA and CFP. Help individuals take control of their finances through budgeting, investing, and retirement planning strategies.',
    rating: 4.7,
    reviews: 142,
    hourlyRate: 65,
    skills: ['Budgeting', 'Investing', 'Retirement Planning', 'Tax Strategy'],
    category: 'finance',
    availability: 'available',
    location: { lat: 47.6062, lng: -122.3321, city: 'Seattle', state: 'WA' }
  },
  {
    id: '7',
    name: 'Alex Thompson',
    title: 'Yoga & Mindfulness Instructor',
    description: 'Certified yoga instructor with 12 years experience. Specializing in vinyasa, meditation, and mindfulness for stress reduction.',
    rating: 4.8,
    reviews: 213,
    hourlyRate: 45,
    skills: ['Yoga', 'Meditation', 'Mindfulness', 'Breathing Techniques'],
    category: 'fitness',
    availability: 'available',
    location: { lat: 30.2672, lng: -97.7431, city: 'Austin', state: 'TX' }
  },
  {
    id: '8',
    name: 'David Kim',
    title: 'Business Strategy Consultant',
    description: 'Former McKinsey consultant. Help startups and small businesses develop growth strategies, business models, and market positioning.',
    rating: 4.9,
    reviews: 89,
    hourlyRate: 100,
    skills: ['Strategy', 'Business Planning', 'Market Analysis', 'Startups'],
    category: 'business',
    availability: 'busy',
    location: { lat: 33.4484, lng: -112.0740, city: 'Phoenix', state: 'AZ' }
  },
  {
    id: '9',
    name: 'Sophie Dubois',
    title: 'French Language Teacher',
    description: 'Native French speaker from Paris. Interactive lessons focused on conversation, grammar, and French culture. All levels welcome.',
    rating: 4.9,
    reviews: 167,
    hourlyRate: 40,
    skills: ['French', 'Conversation', 'Grammar', 'Culture', 'DELF Prep'],
    category: 'language',
    availability: 'available',
    location: { lat: 38.9072, lng: -77.0369, city: 'Washington', state: 'DC' }
  },
  {
    id: '10',
    name: 'Michael Anderson',
    title: 'Portrait Photography',
    description: 'Professional photographer for 15 years. Teaching composition, lighting, post-processing, and building a photography business.',
    rating: 4.8,
    reviews: 124,
    hourlyRate: 55,
    skills: ['Portrait Photography', 'Lightroom', 'Composition', 'Lighting'],
    category: 'photography',
    availability: 'available',
    location: { lat: 39.7392, lng: -104.9903, city: 'Denver', state: 'CO' }
  },
  {
    id: '11',
    name: 'Lisa Zhang',
    title: 'Product Management Expert',
    description: 'Senior PM at tech unicorn. Teaching product strategy, roadmapping, user research, and agile methodologies for aspiring PMs.',
    rating: 4.9,
    reviews: 95,
    hourlyRate: 80,
    skills: ['Product Strategy', 'Agile', 'User Research', 'Roadmapping'],
    category: 'tech',
    availability: 'available',
    location: { lat: 37.3382, lng: -121.8863, city: 'San Jose', state: 'CA' }
  },
  {
    id: '12',
    name: 'Carlos Mendez',
    title: 'Guitar & Music Theory',
    description: 'Berklee graduate teaching guitar (acoustic & electric), music theory, and songwriting. From beginner to advanced techniques.',
    rating: 4.8,
    reviews: 187,
    hourlyRate: 50,
    skills: ['Guitar', 'Music Theory', 'Songwriting', 'Performance'],
    category: 'music',
    availability: 'available',
    location: { lat: 25.7617, lng: -80.1918, city: 'Miami', state: 'FL' }
  }
];

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'coding', label: 'Coding & Tech' },
  { value: 'design', label: 'Design' },
  { value: 'business', label: 'Business' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'data', label: 'Data Science' },
  { value: 'finance', label: 'Finance' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'language', label: 'Language' },
  { value: 'photography', label: 'Photography' },
  { value: 'music', label: 'Music' },
];

const PRICE_RANGES = [
  { value: '', label: 'Any Price' },
  { value: '0-40', label: 'Under $40/hr' },
  { value: '40-60', label: '$40-60/hr' },
  { value: '60-80', label: '$60-80/hr' },
  { value: '80-200', label: '$80+/hr' },
];

export default function BrowseGurus() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [filteredGurus, setFilteredGurus] = useState<Guru[]>(MOCK_GURUS);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    let filtered = MOCK_GURUS;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(guru =>
        guru.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guru.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guru.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guru.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(guru => guru.category === selectedCategory);
    }

    // Filter by price range
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      filtered = filtered.filter(guru => {
        if (max) {
          return guru.hourlyRate >= min && guru.hourlyRate <= max;
        } else {
          return guru.hourlyRate >= min;
        }
      });
    }

    setFilteredGurus(filtered);
  }, [searchTerm, selectedCategory, selectedPriceRange]);

  return (
    <>
      <Seo
        title="Browse Expert Gurus - YooHoo.Guru"
        description="Find and book sessions with expert teachers across all skill categories. Learn from the best in coding, design, business, cooking, fitness, and more."
        url="https://www.yoohoo.guru/browse"
        image="https://www.yoohoo.guru/assets/og-browse.jpg"
      />

      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-b from-transparent to-primarydark/30">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                Find Your Perfect
                <span className="block gradient-text-emerald-blue mt-2">Guru</span>
              </h1>
              <p className="text-xl text-white-80 leading-relaxed">
                Browse hundreds of expert teachers across all skill categories. Book 1-on-1 sessions and start learning today.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="glass-card p-6 rounded-2xl">
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name, skill, or keyword..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-6 py-4 bg-primarydark/50 border border-white-20 rounded-xl text-white placeholder-white-40 focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                    <svg
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white-40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Filters */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white-80 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-primarydark/50 border border-white-20 rounded-xl text-white focus:outline-none focus:border-emerald-400 transition-colors"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white-80 mb-2">Price Range</label>
                    <select
                      value={selectedPriceRange}
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="w-full px-4 py-3 bg-primarydark/50 border border-white-20 rounded-xl text-white focus:outline-none focus:border-emerald-400 transition-colors"
                    >
                      {PRICE_RANGES.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Results Count & View Toggle */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-white-60">
                    {filteredGurus.length} guru{filteredGurus.length !== 1 ? 's' : ''} found
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        viewMode === 'list'
                          ? 'bg-accent-main text-primarydark'
                          : 'bg-white-10 text-white-60 hover:bg-white-20'
                      }`}
                    >
                      <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      List
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        viewMode === 'map'
                          ? 'bg-accent-main text-primarydark'
                          : 'bg-white-10 text-white-60 hover:bg-white-20'
                      }`}
                    >
                      <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Map
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Matchmaking CTA */}
            {session && (
              <div className="max-w-4xl mx-auto mb-12">
                <Link
                  href="/ai/matchmaking"
                  className="block glass-card p-6 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">Try AI-Powered Matching</h3>
                        <p className="text-white-60 text-sm">Let our AI find the perfect guru based on your learning style and goals</p>
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-emerald-400 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>
              </div>
            )}

            {/* Guru Grid or Map View */}
            {viewMode === 'list' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGurus.map((guru) => (
                  <div key={guru.id} className="animate-fade-in-up">
                    <ExpertCard
                      {...guru}
                      href={`/guru/${guru.id}/book-session`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-7xl mx-auto">
                <InteractiveMap
                  markers={filteredGurus
                    .filter(guru => guru.location)
                    .map(guru => ({
                      id: guru.id,
                      lat: guru.location!.lat,
                      lng: guru.location!.lng,
                      name: guru.name,
                      type: 'guru' as const,
                      title: guru.title,
                      price: guru.hourlyRate,
                      rating: guru.rating,
                      category: guru.category,
                      href: `/guru/${guru.id}/book-session`
                    }))}
                  showControls={true}
                  filterTypes={['guru']}
                />
              </div>
            )}

            {/* No Results */}
            {filteredGurus.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Gurus Found</h3>
                <p className="text-white-60 mb-6">Try adjusting your search criteria or browse all categories</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedPriceRange('');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Browse by Category Section */}
        <section className="section-padding bg-gradient-to-b from-primarydark/30 to-transparent">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold text-white mb-4">
                Browse by Category
              </h2>
              <p className="text-xl text-white-80">
                Explore gurus in specific skill areas
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CATEGORIES.slice(1).map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`p-6 glass-card rounded-xl hover:bg-white-10 transition-all duration-300 ${
                    selectedCategory === category.value ? 'border-2 border-emerald-400' : ''
                  }`}
                >
                  <div className="text-center">
                    <h3 className="text-white font-semibold">{category.label}</h3>
                    <p className="text-white-60 text-sm mt-1">
                      {MOCK_GURUS.filter(g => g.category === category.value).length} gurus
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// Make this page server-side rendered
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
