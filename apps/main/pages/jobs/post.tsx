import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Navigation from '../../components/ui/Navigation';
import AIJobHelper from '../../components/ai/AIJobHelper';
import Head from 'next/head';

export default function PostJob() {
  const router = useRouter();
  const { status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    duration: '',
    skillsRequired: '',
    experienceLevel: 'intermediate',
    location: 'remote',
    urgency: 'normal'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/jobs');
      } else {
        alert('Failed to post job. Please try again.');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-300 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login?redirect=/jobs/post');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Head>
        <title>Post a Job | YooHoo.Guru</title>
        <meta name="description" content="Post a help wanted ad and find skilled professionals on YooHoo.Guru" />
      </Head>

      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Post a Help Wanted Ad
          </h1>
          <p className="text-xl text-purple-300">
            Find the perfect expert for your project
          </p>
        </div>

        {/* Form */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-purple-500 border-opacity-20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-purple-300 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white bg-opacity-5 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Need a React Developer for E-commerce Site"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-purple-300 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white bg-opacity-5 border border-purple-500 border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a category</option>
                <option value="coding">Programming & Development</option>
                <option value="design">Design & Creative</option>
                <option value="writing">Writing & Content</option>
                <option value="marketing">Marketing & Sales</option>
                <option value="business">Business & Consulting</option>
                <option value="data">Data & Analytics</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-purple-300 mb-2">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white bg-opacity-5 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe the project, requirements, and expectations..."
              />
            </div>

            {/* Skills Required */}
            <div>
              <label htmlFor="skillsRequired" className="block text-sm font-medium text-purple-300 mb-2">
                Skills Required *
              </label>
              <input
                type="text"
                id="skillsRequired"
                name="skillsRequired"
                required
                value={formData.skillsRequired}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white bg-opacity-5 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., React, Node.js, MongoDB, REST APIs"
              />
              <p className="text-sm text-purple-400 mt-1">Separate skills with commas</p>
            </div>

            {/* Budget and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-purple-300 mb-2">
                  Budget (USD) *
                </label>
                <input
                  type="text"
                  id="budget"
                  name="budget"
                  required
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-5 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., $500-$1000"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-purple-300 mb-2">
                  Project Duration *
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  required
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-5 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 2-4 weeks"
                />
              </div>
            </div>

            {/* Experience Level and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="experienceLevel" className="block text-sm font-medium text-purple-300 mb-2">
                  Experience Level Required
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-5 border border-purple-500 border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-purple-300 mb-2">
                  Work Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-5 border border-purple-500 border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-purple-300 mb-2">
                Urgency Level
              </label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white bg-opacity-5 border border-purple-500 border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">Low - Can wait</option>
                <option value="normal">Normal - Standard timeline</option>
                <option value="high">High - Need soon</option>
                <option value="urgent">Urgent - ASAP</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : 'Post Job'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-4 rounded-full font-semibold bg-white bg-opacity-10 text-white hover:bg-opacity-20 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* AI Job Helper */}
        <div className="mt-12">
          <AIJobHelper />
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-white font-semibold mb-2">Targeted Matching</h3>
            <p className="text-purple-300 text-sm">AI-powered matching connects you with the right experts</p>
          </div>
          <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="text-white font-semibold mb-2">Fast Responses</h3>
            <p className="text-purple-300 text-sm">Get proposals from qualified experts within hours</p>
          </div>
          <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="text-white font-semibold mb-2">Secure Payment</h3>
            <p className="text-purple-300 text-sm">Protected payments through our escrow system</p>
          </div>
        </div>
      </div>
    </div>
  );
}
// Make this page server-side rendered to avoid SSG issues with Navigation component using useRouter
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
