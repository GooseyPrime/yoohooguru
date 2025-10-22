import { Header, Footer } from '@yoohooguru/shared'
import Head from 'next/head'
import styled from 'styled-components'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const HeroSection = styled.section`
  padding: 72px 0 48px;
  text-align: center;
  background: radial-gradient(1200px 600px at 50% -10%, rgba(124,140,255,.12), transparent), 
              linear-gradient(180deg, rgba(255,255,255,.02), transparent);
  position: relative;
  overflow: hidden;
`

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;

  h1 {
    font-size: clamp(2.625rem, 5vw, 3.5rem);
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    letter-spacing: -0.025em;
    color: #ffffff;
  }

  p {
    font-size: clamp(1rem, 2vw, 1.125rem);
    margin-bottom: 2rem;
    color: #b0b0b0;
    line-height: 1.6;
  }
`

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`

const Button = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }
  }

  &.outline {
    border: 2px solid #667eea;
    color: #667eea;
    
    &:hover {
      background: rgba(102, 126, 234, 0.1);
    }
  }
`

const HeroTagline = styled.div`
  max-width: 900px;
  margin: 3rem auto 2rem;
  padding: 2rem;
  text-align: center;
  background: rgba(124, 140, 255, 0.05);
  border: 1px solid rgba(124, 140, 255, 0.2);
  border-radius: 1rem;
  
  h2 {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 600;
    margin-bottom: 1rem;
    line-height: 1.4;
    color: #ffffff;
  }
  
  p {
    font-size: clamp(1rem, 2vw, 1.125rem);
    color: #b0b0b0;
    line-height: 1.8;
  }
`

const WelcomeTiles = styled.div`
  max-width: 1100px;
  margin: 24px auto;
  padding: 0 16px 48px;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`

const Tile = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  transition: transform 0.2s, border-color 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    border-color: rgba(102, 126, 234, 0.5);
  }

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 0.5rem;
    background: rgba(124, 140, 255, 0.1);
    color: #667eea;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    font-size: 24px;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #ffffff;
  }

  p {
    color: #b0b0b0;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

export default function Home() {
  return (
    <Container>
      <Head>
        <title>YooHoo.Guru - Community Skill Sharing Platform</title>
        <meta name="description" content="Exchange skills, discover purpose, and create exponential community impact." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main>
        <HeroSection>
          <HeroContent>
            <h1>A community where you can swap skills, share services, or find trusted local help.</h1>
            <p>
              Local connections, meaningful exchanges, and community impact through 
              our trusted skill-sharing platform.
            </p>
            <HeroButtons>
              <Button href="/signup" className="primary">
                Start Your Journey →
              </Button>
              <Button href="https://angel.yoohoo.guru" className="outline">
                Browse Services
              </Button>
            </HeroButtons>
          </HeroContent>
        </HeroSection>

        <HeroTagline>
          <h2>Learn. Earn. Empower.</h2>
          <p>
            Join a world where knowledge, kindness, and capability meet. Choose your path: 
            <strong> Become a Guru. Learn from Gurus. List a Gig.</strong> Help or get help through Angel&apos;s List. 
            <strong> Join the Heroes.</strong> Empower and be empowered through adaptive teaching.
          </p>
        </HeroTagline>

        <WelcomeTiles>
          <Tile>
            <div className="icon">
              🎓
            </div>
            <h3>SkillShare with Coach Guru</h3>
            <p>Learn from Gurus. Become a Guru. Exchange knowledge and skills through personalized coaching.</p>
            <a href="https://coach.yoohoo.guru">
              Explore Coach Guru →
            </a>
          </Tile>
          
          <Tile>
            <div className="icon">
              🔧
            </div>
            <h3>Angel&apos;s List</h3>
            <p>List a Gig. Help or get help through Angel&apos;s List. Find local services and offer your help.</p>
            <a href="https://angel.yoohoo.guru">
              Explore Angel&apos;s List →
            </a>
          </Tile>
          
          <Tile>
            <div className="icon">
              ❤️
            </div>
            <h3>Hero Gurus</h3>
            <p>Join the Heroes. Empower and be empowered through adaptive teaching and inclusive learning.</p>
            <a href="https://heroes.yoohoo.guru">
              Explore Hero Gurus →
            </a>
          </Tile>
        </WelcomeTiles>
      </main>

      <Footer />
    </Container>
  )
}
