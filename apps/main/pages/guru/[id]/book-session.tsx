import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import styled from 'styled-components';
import SessionBooking from '../../../components/sessions/SessionBooking';
import { isValidId } from '../../../lib/validators';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
`;

export default function BookSession() {
  const router = useRouter();
  const { id } = router.query;
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Validate guru ID to prevent SSRF/path traversal
    if (id && !isValidId(id)) {
      setError('Invalid guru identifier');
    }
  }, [id]);
  
  // Mock guru data - in a real implementation, this would come from your backend
  const guruData = {
    id: id as string,
    name: 'Alex Johnson',
    skill: 'Web Development',
    rating: 4.8,
    price: 50
  };
  
  const handleBookingSuccess = () => {
    // Redirect to dashboard or session confirmation page
    router.push('/dashboard');
  };
  
  if (error) {
    return (
      <Container>
        <Head>
          <title>Error | YooHoo.Guru</title>
        </Head>
        <Header />
        <Main style={{ textAlign: 'center', padding: '3rem' }}>
          <h1>{error}</h1>
          <button onClick={() => router.push('/')}>Return Home</button>
        </Main>
        <Footer />
      </Container>
    );
  }
  
  return (
    <Container>
      <Head>
        <title>Book Session with {guruData.name} | YooHoo.Guru</title>
        <meta name="description" content={`Book a session with Guru ${guruData.name} for ${guruData.skill}`} />
      </Head>
      
      <Header />
      
      <Main>
        <SessionBooking
          guruId={guruData.id}
          guruName={guruData.name}
          skill={guruData.skill}
          rating={guruData.rating}
          price={guruData.price}
          onBookingSuccess={handleBookingSuccess}
        />
      </Main>
      
      <Footer />
    </Container>
  );
}