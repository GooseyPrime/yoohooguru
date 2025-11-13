import { Header, Footer } from '@yoohooguru/shared'
import Head from 'next/head'
import styled from 'styled-components'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const Main = styled.main`
  flex: 1;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`

const Hero = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  h1 {
    font-size: 3rem;
    color: #ffffff;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.25rem;
    color: #b0b0b0;
    max-width: 600px;
    margin: 0 auto;
  }
`

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`

const Feature = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;

  h3 {
    font-size: 1.5rem;
    color: #ffffff;
    margin-bottom: 1rem;
  }

  p {
    color: #b0b0b0;
    line-height: 1.6;
  }
`

export default function HeroGurus() {
  return (
    <Container>
      <Head>
        <title>Hero Guru's - Accessible Learning for All | YooHoo.Guru</title>
        <meta name="description" content="Accessibility-first skill sharing for disability communities. Empower and be empowered through adaptive teaching." />
      </Head>

      <Header />

      <Main>
        <Hero>
          <h1>❤️ Hero Guru's</h1>
          <p>Accessibility-first skill sharing for disability communities. Learn and teach with understanding, patience, and adaptive approaches.</p>
        </Hero>

        <Features>
          <Feature>
            <h3>Universal Design</h3>
            <p>Sessions designed to work for the widest range of abilities with multiple ways to participate.</p>
          </Feature>
          <Feature>
            <h3>Assistive Technology</h3>
            <p>Screen readers, voice control support, visual aids, and adaptive tools integrated throughout.</p>
          </Feature>
          <Feature>
            <h3>Community Support</h3>
            <p>Peer mentorship programs and accessibility advocates in every neighborhood.</p>
          </Feature>
        </Features>
      </Main>

      <Footer />
    </Container>
  )
}
