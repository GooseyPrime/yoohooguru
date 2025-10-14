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

export default function AngelsList() {
  return (
    <Container>
      <Head>
        <title>Angel's List - Local Services & Micro Jobs | YooHoo.Guru</title>
        <meta name="description" content="Find local help and odd jobs. List your services and get hired in your community." />
      </Head>

      <Header />

      <Main>
        <Hero>
          <h1>🔧 Angel&apos;s List</h1>
          <p>Find help and odd jobs near you. List your services and connect with your community.</p>
        </Hero>

        <Features>
          <Feature>
            <h3>Find Local Help</h3>
            <p>Connect with neighbors offering services like handyman work, pet care, tutoring, and more.</p>
          </Feature>
          <Feature>
            <h3>List Your Services</h3>
            <p>Offer your skills to the community and earn while helping others.</p>
          </Feature>
          <Feature>
            <h3>Build Trust</h3>
            <p>Reviews and ratings help you find reliable service providers in your area.</p>
          </Feature>
        </Features>
      </Main>

      <Footer />
    </Container>
  )
}
