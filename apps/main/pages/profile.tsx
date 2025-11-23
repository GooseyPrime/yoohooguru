import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
// import { useRouter } from 'next/router'; // Unused import
import Seo from '../components/Seo';
import Navigation from '../components/ui/Navigation';
import ProfileManager from '../components/profile/ProfileManager';
import AIProfileAssistant from '../components/ai/AIProfileAssistant';

export default function Profile() {
  // const router = useRouter(); // Unused variable
  const { data: session } = useSession();

  // Mock profile data - in real implementation, fetch from backend
  const currentProfile = session?.user ? {
    name: session.user.name || '',
    email: session.user.email || '',
    bio: '',
    skills: [],
    experience: '',
    hourlyRate: 0
  } : {
    name: '',
    email: '',
    bio: '',
    skills: [],
    experience: '',
    hourlyRate: 0
  };

  // Determine user type from role (default to 'gunu' for learners)
  const userType = (session?.user?.role || 'gunu') as 'guru' | 'gunu' | 'angel' | 'hero';

  return (
    <>
      <Seo
        title="Profile | YooHoo.Guru"
        description="Manage your YooHoo.Guru profile"
        url="https://www.yoohoo.guru/profile"
      />

      <Navigation />

      <main className="min-h-screen section-padding">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Your Profile
            </h1>
            <p className="text-xl text-white-80">
              Manage your account information and preferences
            </p>
          </div>

          <ProfileManager />

          {/* AI Profile Assistant */}
          <div className="mt-12">
            <AIProfileAssistant userType={userType} currentProfile={currentProfile} />
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
