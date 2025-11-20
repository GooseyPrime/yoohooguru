import { GetServerSideProps } from 'next';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import Link from 'next/link';
import { OrbitronContainer, OrbitronCard } from '../../components/orbitron';

export default function LearningProgress() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    if (typeof window !== 'undefined') {
      router.push('/login?redirect=/learning/progress');
    }
    return null;
  }

  const stats = {
    totalSessions: 12,
    hoursLearned: 18,
    skillsLearning: 3,
    averageRating: 4.8
  };

  const skillProgress = [
    { skill: 'Web Development', sessions: 6, hours: 9, progress: 60 },
    { skill: 'Digital Marketing', sessions: 4, hours: 6, progress: 40 },
    { skill: 'UI/UX Design', sessions: 2, hours: 3, progress: 20 }
  ];

  return (
    <OrbitronContainer gradient="primary">
      <Head>
        <title>My Learning Progress | YooHoo.Guru</title>
        <meta name="description" content="Track your learning progress and achievements" />
      </Head>

      <Header />

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Learning Progress</h1>
          <p className="text-gray-400">Track your journey and achievements</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <OrbitronCard className="p-6 text-center">
            <div className="text-3xl font-bold gradient-text-emerald mb-2">{stats.totalSessions}</div>
            <div className="text-gray-400 text-sm">Total Sessions</div>
          </OrbitronCard>
          <OrbitronCard className="p-6 text-center">
            <div className="text-3xl font-bold gradient-text-blue mb-2">{stats.hoursLearned}</div>
            <div className="text-gray-400 text-sm">Hours Learned</div>
          </OrbitronCard>
          <OrbitronCard className="p-6 text-center">
            <div className="text-3xl font-bold gradient-text-purple mb-2">{stats.skillsLearning}</div>
            <div className="text-gray-400 text-sm">Skills Learning</div>
          </OrbitronCard>
          <OrbitronCard className="p-6 text-center">
            <div className="text-3xl font-bold gradient-text-gold mb-2">{stats.averageRating}★</div>
            <div className="text-gray-400 text-sm">Avg Rating</div>
          </OrbitronCard>
        </div>

        {/* Skill Progress */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Skills in Progress</h2>
          <div className="space-y-6">
            {skillProgress.map((item, index) => (
              <OrbitronCard key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{item.skill}</h3>
                  <span className="text-gray-400 text-sm">
                    {item.sessions} sessions • {item.hours} hours
                  </span>
                </div>
                <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <div className="mt-2 text-right text-sm text-gray-400">{item.progress}% complete</div>
              </OrbitronCard>
            ))}
          </div>
        </div>

        {/* CTA */}
        <OrbitronCard className="p-8 text-center bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Learn More?</h2>
          <p className="text-gray-400 mb-6">
            Continue your learning journey by booking more sessions with expert gurus
          </p>
          <Link
            href="/browse"
            className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
          >
            Browse Gurus
          </Link>
        </OrbitronCard>
      </main>

      <Footer />
    </OrbitronContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
