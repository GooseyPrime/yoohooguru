import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import Link from 'next/link';
import { OrbitronContainer, OrbitronCard } from '../../components/orbitron';

interface Session {
  id: string;
  guruName: string;
  skill: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
}

const MOCK_SESSIONS: Session[] = [
  {
    id: '1',
    guruName: 'Sarah Chen',
    skill: 'Web Development',
    date: '2025-11-25',
    time: '14:00',
    duration: 60,
    type: 'video',
    status: 'upcoming'
  },
  {
    id: '2',
    guruName: 'Marcus Rodriguez',
    skill: 'Digital Marketing',
    date: '2025-11-27',
    time: '10:00',
    duration: 90,
    type: 'video',
    status: 'upcoming'
  }
];

export default function LearningSchedule() {
  const { data: session } = useSession();
  const router = useRouter();
  const [sessions] = useState<Session[]>(MOCK_SESSIONS);

  if (!session) {
    if (typeof window !== 'undefined') {
      router.push('/login?redirect=/learning/schedule');
    }
    return null;
  }

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const pastSessions = sessions.filter(s => s.status === 'completed');

  return (
    <OrbitronContainer gradient="primary">
      <Head>
        <title>My Learning Schedule | YooHoo.Guru</title>
        <meta name="description" content="Manage your upcoming and past learning sessions" />
      </Head>

      <Header />

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Learning Schedule</h1>
          <p className="text-gray-400">Manage your upcoming and past sessions</p>
        </div>

        {upcomingSessions.length === 0 && pastSessions.length === 0 ? (
          <OrbitronCard className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-white-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">No Sessions Scheduled</h2>
            <p className="text-gray-400 mb-8">
              You haven't booked any learning sessions yet. Browse our gurus to get started!
            </p>
            <Link
              href="/browse"
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
            >
              Browse Gurus
            </Link>
          </OrbitronCard>
        ) : (
          <>
            {/* Upcoming Sessions */}
            {upcomingSessions.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Upcoming Sessions</h2>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <OrbitronCard key={session.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{session.skill}</h3>
                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">
                              {session.type}
                            </span>
                          </div>
                          <p className="text-gray-400 mb-2">with {session.guruName}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{new Date(session.date).toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{session.time} ({session.duration} min)</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {session.type === 'video' && (
                            <Link
                              href={`/session/${session.id}/video`}
                              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                            >
                              Join Video Call
                            </Link>
                          )}
                          <Link
                            href={`/guru/${session.id}/ratings`}
                            className="px-6 py-3 glass-button text-white font-semibold rounded-xl hover:bg-white-20 transition-all duration-300"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </OrbitronCard>
                  ))}
                </div>
              </div>
            )}

            {/* Past Sessions */}
            {pastSessions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Past Sessions</h2>
                <div className="space-y-4">
                  {pastSessions.map((session) => (
                    <OrbitronCard key={session.id} className="p-6 opacity-75">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{session.skill}</h3>
                          <p className="text-gray-400 mb-2">with {session.guruName}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{new Date(session.date).toLocaleDateString()}</span>
                            <span>{session.duration} min</span>
                          </div>
                        </div>
                        <Link
                          href={`/guru/${session.id}/ratings`}
                          className="px-6 py-3 glass-button text-white font-semibold rounded-xl hover:bg-white-20 transition-all duration-300"
                        >
                          Leave Review
                        </Link>
                      </div>
                    </OrbitronCard>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
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
