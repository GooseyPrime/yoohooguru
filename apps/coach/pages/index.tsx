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

export default function CoachGuru() {
  return (
    <Container>
      <Head>
        <title>Coach Guru - SkillShare & Coaching | YooHoo.Guru</title>
        <meta name="description" content="Learn from Gurus. Become a Guru. Exchange knowledge and skills through personalized coaching." />
      </Head>

      <Header />

      <Main>
        <Hero>
          <h1>🎓 Coach Guru</h1>
          <p>Learn or teach. Book a Guru or swap skills. Personalized coaching for everyone.</p>
        </Hero>

        <Features>
          <Feature>
            <h3>Learn New Skills</h3>
            <p>Connect with experienced coaches and teachers in your area or online.</p>
          </Feature>
          <Feature>
            <h3>Become a Guru</h3>
            <p>Share your expertise and earn by teaching others what you know best.</p>
          </Feature>
          <Feature>
            <h3>Skill Exchange</h3>
            <p>Trade skills with others - teach what you know, learn what you need.</p>
          </Feature>
        </Features>
      </Main>

      <Footer />
    </Container>
  )
}
