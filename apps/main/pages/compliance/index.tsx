import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import styled from 'styled-components';
import ComplianceRequirements from '../../components/compliance/ComplianceRequirements';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
`;

export default function Compliance() {
  return (
    <Container>
      <Head>
        <title>Compliance Requirements | YooHoo.Guru</title>
        <meta name="description" content="View compliance requirements for different skill categories on our platform." />
      </Head>
      
      <Header />
      
      <Main>
        <ComplianceRequirements />
      </Main>
      
      <Footer />
    </Container>
  );
}