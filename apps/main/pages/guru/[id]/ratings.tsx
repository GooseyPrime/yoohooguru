import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import styled from 'styled-components';
import RatingSystem from '../../../components/ratings/RatingSystem';
import { isValidId } from '../../../lib/validators';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const GuruHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const GuruName = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const GuruSkill = styled.p`
  color: #b0b0b0;
  font-size: 1.2rem;
`;

export default function GuruRatings() {
  const router = useRouter();
  const { id } = router.query;
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Validate guru ID to prevent SSRF/path traversal
    if (id && !isValidId(id)) {
      setError('Invalid guru identifier');
    }
  }, [id]);
  
  // Mock guru data
  const guruData = {
    name: 'Alex Johnson',
    skill: 'Web Development',
    averageRating: 4.8,
    totalReviews: 24
  };
  
  const handleReviewSubmit = (rating: number, comment: string) => {
    // In a real implementation, this would submit to an API
    console.log(`Submitted review for guru ${id}: ${rating} stars, comment: ${comment}`);
    alert('Review submitted successfully!');
  };
  
  if (error) {
    return (
      <Container>
        <Head>
          <title>Error | YooHoo.Guru</title>
        </Head>
        <Header />
        <Main style={{ textAlign: 'center', padding: '3rem' }}>
          <h1 style={{ color: '#fff' }}>{error}</h1>
          <button onClick={() => router.push('/')}>Return Home</button>
        </Main>
        <Footer />
      </Container>
    );
  }
  
  return (
    <Container>
      <Head>
        <title>Rate {guruData.name} | YooHoo.Guru</title>
        <meta name="description" content={`Rate your experience with Guru ${guruData.name}`} />
      </Head>
      
      <Header />
      
      <Main>
        <GuruHeader>
          <GuruName>{guruData.name}</GuruName>
          <GuruSkill>{guruData.skill} Guru</GuruSkill>
        </GuruHeader>
        
        <RatingSystem
          guruId={id as string}
          guruName={guruData.name}
          averageRating={guruData.averageRating}
          totalReviews={guruData.totalReviews}
          onSubmitReview={handleReviewSubmit}
        />
      </Main>
      
      <Footer />
    </Container>
  );
}