import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Seo from '../../components/Seo';
import Link from 'next/link';
import Navigation from '../../components/ui/Navigation';

export default function AIMatchmaking() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  // Questionnaire state
  const [learningGoal, setLearningGoal] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [preferredStyle, setPreferredStyle] = useState('');
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  const INTERESTS_OPTIONS = [
    'Coding', 'Design', 'Business', 'Marketing', 'Finance', 'Cooking',
    'Fitness', 'Language', 'Music', 'Photography', 'Art', 'Writing'
  ];

  const handleGetMatches = async () => {
    if (!session) {
      router.push('/login?redirect=/ai/matchmaking');
      return;
    }

    setIsLoading(true);
    setHasStarted(true);

    // Simulate AI matchmaking (in production, this would call the actual AI API)
    // For now, we'll show the mock results after a delay
    setTimeout(() => {
      const mockMatches = [
        {
          id: '1',
          name: 'Sarah Chen',
          title: 'Full Stack Web Development Expert',
          compatibility: 95,
          hourlyRate: 75,
          strengths: [
            'Extensive experience in your areas of interest',
            'Teaching style matches your learning preferences',
            'Available in your preferred time zone'
          ],
          considerations: [
            'May move quickly through advanced topics'
          ]
        },
        {
          id: '3',
          name: 'Emily Watson',
          title: 'UI/UX Design Mentor',
          compatibility: 87,
          hourlyRate: 55,
          strengths: [
            'Patient teaching approach for beginners',
            'Portfolio-focused learning methodology',
            'Flexible scheduling options'
          ],
          considerations: [
            'Focuses more on creative aspects than technical implementation'
          ]
        }
      ];

      setMatches(mockMatches);
      setIsLoading(false);
    }, 2000);
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  if (status === 'loading') {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-white-20 border-t-emerald-400 rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo
        title="AI-Powered Guru Matching - YooHoo.Guru"
        description="Find your perfect learning match with our AI-powered guru recommendation system. Get personalized teacher recommendations based on your learning style, goals, and preferences."
        url="https://www.yoohoo.guru/ai/matchmaking"
        image="https://www.yoohoo.guru/assets/og-ai-matchmaking.jpg"
      />

      <Navigation />

      <main className="min-h-screen section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                AI-Powered
                <span className="block gradient-text-emerald-blue mt-2">Guru Matching</span>
              </h1>
              <p className="text-xl text-white-80 leading-relaxed">
                Answer a few questions and let our AI find the perfect gurus for your learning journey
              </p>
            </div>

            {!hasStarted ? (
              /* Questionnaire */
              <div className="glass-card p-8 rounded-3xl">
                <div className="space-y-6">
                  {/* Learning Goal */}
                  <div>
                    <label className="block text-lg font-semibold text-white mb-3">
                      What do you want to learn?
                    </label>
                    <textarea
                      value={learningGoal}
                      onChange={(e) => setLearningGoal(e.target.value)}
                      placeholder="e.g., I want to learn web development to build my own startup idea..."
                      className="w-full px-4 py-3 bg-primarydark/50 border border-white-20 rounded-xl text-white placeholder-white-40 focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-lg font-semibold text-white mb-3">
                      What's your experience level?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setExperienceLevel(level)}
                          className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                            experienceLevel === level
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                              : 'bg-primarydark/50 border border-white-20 text-white-80 hover:border-emerald-400'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Learning Style */}
                  <div>
                    <label className="block text-lg font-semibold text-white mb-3">
                      Preferred learning style
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'hands-on', label: 'Hands-on / Project-based' },
                        { value: 'structured', label: 'Structured / Step-by-step' },
                        { value: 'exploratory', label: 'Exploratory / Self-paced' },
                        { value: 'collaborative', label: 'Collaborative / Interactive' }
                      ].map((style) => (
                        <button
                          key={style.value}
                          onClick={() => setPreferredStyle(style.value)}
                          className={`w-full px-4 py-3 rounded-xl font-medium text-left transition-all duration-300 ${
                            preferredStyle === style.value
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                              : 'bg-primarydark/50 border border-white-20 text-white-80 hover:border-emerald-400'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-lg font-semibold text-white mb-3">
                      Budget per hour
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Under $40', '$40-60', '$60-80', '$80+'].map((range) => (
                        <button
                          key={range}
                          onClick={() => setBudget(range)}
                          className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                            budget === range
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                              : 'bg-primarydark/50 border border-white-20 text-white-80 hover:border-emerald-400'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-lg font-semibold text-white mb-3">
                      Areas of interest (select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {INTERESTS_OPTIONS.map((interest) => (
                        <button
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                            interests.includes(interest)
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                              : 'bg-primarydark/50 border border-white-20 text-white-80 hover:border-emerald-400'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleGetMatches}
                      disabled={!learningGoal || !experienceLevel || !preferredStyle || !budget || interests.length === 0}
                      className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-glow-emerald-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      Find My Perfect Gurus
                    </button>
                  </div>
                </div>
              </div>
            ) : isLoading ? (
              /* Loading State */
              <div className="glass-card p-12 rounded-3xl text-center">
                <div className="w-16 h-16 mx-auto mb-6 border-4 border-white-20 border-t-emerald-400 rounded-full animate-spin"></div>
                <h3 className="text-2xl font-bold text-white mb-2">Analyzing Your Profile...</h3>
                <p className="text-white-60">Our AI is finding the best guru matches for you</p>
              </div>
            ) : (
              /* Results */
              <div className="space-y-6">
                <div className="glass-card p-6 rounded-2xl text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Your Perfect Matches
                  </h2>
                  <p className="text-white-60">
                    Based on your learning goals and preferences, here are your top guru recommendations
                  </p>
                </div>

                {matches.map((match) => (
                  <div key={match.id} className="glass-card p-8 rounded-2xl">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{match.name}</h3>
                        <p className="text-white-80">{match.title}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold gradient-text-emerald mb-1">
                          {match.compatibility}%
                        </div>
                        <div className="text-sm text-white-60">Match</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-400 mb-3">STRENGTHS</h4>
                        <ul className="space-y-2">
                          {match.strengths.map((strength: string, idx: number) => (
                            <li key={idx} className="flex items-start space-x-2 text-white-80 text-sm">
                              <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-yellow-400 mb-3">CONSIDERATIONS</h4>
                        <ul className="space-y-2">
                          {match.considerations.map((consideration: string, idx: number) => (
                            <li key={idx} className="flex items-start space-x-2 text-white-80 text-sm">
                              <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <span>{consideration}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white-10">
                      <div className="text-white-80">
                        <span className="font-semibold text-emerald-400">${match.hourlyRate}</span>/hour
                      </div>
                      <Link
                        href={`/guru/${match.id}/book-session`}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-glow-emerald"
                      >
                        Book Session
                      </Link>
                    </div>
                  </div>
                ))}

                <div className="text-center pt-6">
                  <Link
                    href="/browse"
                    className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    <span>Browse all gurus</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
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
