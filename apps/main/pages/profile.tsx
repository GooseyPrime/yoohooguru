import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
// import { useRouter } from 'next/router'; // Unused import
import Seo from '../components/Seo';
import Navigation from '../components/ui/Navigation';
import ProfileManager from '../components/profile/ProfileManager';

export default function Profile() {
  // const router = useRouter(); // Unused variable

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
