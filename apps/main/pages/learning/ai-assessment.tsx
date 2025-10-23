import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import styled from 'styled-components';
import LearningStyleAssessment from '../../components/ai/LearningStyleAssessment';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
`;

export default function AILearningAssessment() {
  return (
    <Container>
      <Head>
        <title>AI Learning Style Assessment | YooHoo.Guru</title>
        <meta name="description" content="Discover your personalized learning style with our AI-powered assessment." />
      </Head>
      
      <Header />
      
      <Main>
        <LearningStyleAssessment />
      </Main>
      
      <Footer />
    </Container>
  );
}