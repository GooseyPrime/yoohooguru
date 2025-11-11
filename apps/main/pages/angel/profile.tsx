import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import styled from 'styled-components';
import ProfileManager from '../../components/profile/ProfileManager';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
`;

export default function AngelProfile() {
  return (
    <Container>
      <Head>
        <title>Angel Profile | Angel&apos;s List | YooHoo.Guru</title>
        <meta name="description" content="Manage your Angel profile on the local service marketplace." />
      </Head>
      
      <Header />
      
      <Main>
        <ProfileManager />
      </Main>
      
      <Footer />
    </Container>
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
  
  // Check if user has Angel role
  // In a real implementation, this would check the user's actual role in the database
  const userRole = (session.user as { role?: string }).role || 'guru';
  
  if (userRole !== 'angel' && userRole !== 'admin') {
    return {
      redirect: {
        destination: '/dashboard',
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