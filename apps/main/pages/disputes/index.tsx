import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import styled from 'styled-components';
import DisputeResolution from '../../components/disputes/DisputeResolution';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
`;

export default function Disputes() {
  return (
    <Container>
      <Head>
        <title>Dispute Resolution | YooHoo.Guru</title>
        <meta name="description" content="Submit and manage disputes related to your sessions." />
      </Head>
      
      <Header />
      
      <Main>
        <DisputeResolution />
      </Main>
      
      <Footer />
    </Container>
  );
}