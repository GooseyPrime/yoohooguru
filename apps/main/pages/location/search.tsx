import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import styled from 'styled-components';
import GoogleMap from '../../components/location/GoogleMap';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
`;

const PageHeader = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const LocationInfo = styled.div`
  max-width: 800px;
  margin: 0 auto 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

export default function LocationSearch() {
  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    console.log('Selected location:', location);
    // In a real implementation, this would filter Gurus by location
  };
  
  return (
    <Container>
      <Head>
        <title>Location Search | YooHoo.Guru</title>
        <meta name="description" content="Find local Gurus and services near you." />
      </Head>
      
      <Header />
      
      <Main>
        <PageHeader>Find Local Gurus</PageHeader>
        
        <LocationInfo>
          <p style={{color: '#b0b0b0', lineHeight: '1.6'}}>
            Search for Gurus and services in your area. We'll match you with local experts 
            who can provide in-person sessions or services.
          </p>
        </LocationInfo>
        
        <GoogleMap 
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          onLocationSelect={handleLocationSelect}
        />
      </Main>
      
      <Footer />
    </Container>
  );
}