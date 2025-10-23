import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import styled from 'styled-components';
import SkillSearch from '../../components/skills/SkillSearch';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
`;

export default function Skills() {
  return (
    <Container>
      <Head>
        <title>Skills Marketplace | YooHoo.Guru</title>
        <meta name="description" content="Browse and discover skills to learn from expert Gurus." />
      </Head>
      
      <Header />
      
      <Main>
        <SkillSearch />
      </Main>
      
      <Footer />
    </Container>
  );
}