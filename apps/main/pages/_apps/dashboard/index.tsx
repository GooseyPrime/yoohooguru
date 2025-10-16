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

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`

const Card = styled.div`
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

export default function Dashboard() {
  return (
    <Container>
      <Head>
        <title>Dashboard | YooHoo.Guru</title>
        <meta name="description" content="Manage your YooHoo.Guru profile, bookings, and activities." />
      </Head>

      <Header />

      <Main>
        <Hero>
          <h1>📊 Your Dashboard</h1>
          <p>Manage your profile, bookings, and community connections all in one place.</p>
        </Hero>

        <DashboardGrid>
          <Card>
            <h3>My Profile</h3>
            <p>Update your profile information, skills, and availability.</p>
          </Card>
          <Card>
            <h3>Bookings</h3>
            <p>View and manage your upcoming sessions and appointments.</p>
          </Card>
          <Card>
            <h3>Messages</h3>
            <p>Connect with coaches, students, and service providers.</p>
          </Card>
          <Card>
            <h3>Earnings</h3>
            <p>Track your earnings and manage payout preferences.</p>
          </Card>
          <Card>
            <h3>Reviews</h3>
            <p>See what others are saying about your services.</p>
          </Card>
          <Card>
            <h3>Settings</h3>
            <p>Customize your experience and manage account settings.</p>
          </Card>
        </DashboardGrid>
      </Main>

      <Footer />
    </Container>
  )
}
