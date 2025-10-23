import { useRouter } from 'next/router';
import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import styled from 'styled-components';
import SessionBooking from '../../../components/sessions/SessionBooking';

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