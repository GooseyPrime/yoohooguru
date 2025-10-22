import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
`;

const SubcategoryHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SubcategoryTitle = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const SubcategoryDescription = styled.p`
  color: #b0b0b0;
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const SkillCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const SkillTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const SkillDescription = styled.p`
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const SkillMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const SkillLevel = styled.span`
  background: rgba(81, 207, 102, 0.2);
  color: #51cf66;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
`;

const SkillPrice = styled.span`
  color: #51cf66;
  font-weight: 600;
`;

const SkillButton = styled.a`
  display: inline-block;
  background: #667eea;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
  
  &:hover {
    background: #5a6fd8;
    cursor: pointer;
  }
`;

export default function WebDevelopmentSkills() {
  // Mock data for web development skills
  const webDevSkills = [
    {
      id: 'html-css',
      title: 'HTML & CSS Fundamentals',
      description: 'Learn the building blocks of web development with semantic HTML and modern CSS including Flexbox and Grid.',
      level: 'Beginner',
      price: 25
    },
    {
      id: 'javascript',
      title: 'JavaScript Essentials',
      description: 'Master JavaScript fundamentals including variables, functions, DOM manipulation, and modern ES6+ features.',
      level: 'Beginner',
      price: 30
    },
    {
      id: 'react',
      title: 'React Development',
      description: 'Build dynamic user interfaces with React, including hooks, state management, and component architecture.',
      level: 'Intermediate',
      price: 45
    },
    {
      id: 'nextjs',
      title: 'Next.js Framework',
      description: 'Learn server-side rendering, static site generation, and API routes with the powerful Next.js framework.',
      level: 'Intermediate',
      price: 50
    },
    {
      id: 'typescript',
      title: 'TypeScript for Web Dev',
      description: 'Add type safety to your JavaScript projects with TypeScript, improving code quality and developer experience.',
      level: 'Intermediate',
      price: 40
    },
    {
      id: 'fullstack',
      title: 'Full Stack Web Development',
      description: 'Combine frontend and backend skills to build complete web applications with databases and authentication.',
      level: 'Advanced',
      price: 65
    }
  ];

  return (
    <Container>
      <Head>
        <title>Web Development Skills | Coding | YooHoo.Guru</title>
        <meta name="description" content="Learn web development from HTML/CSS basics to advanced frameworks like React and Next.js." />
      </Head>
      
      <Header />
      
      <Main>
        <SubcategoryHeader>
          <SubcategoryTitle>Web Development</SubcategoryTitle>
          <SubcategoryDescription>
            Build modern websites and web applications. Start with HTML/CSS fundamentals and progress to advanced frameworks 
            like React, Next.js, and full stack development.
          </SubcategoryDescription>
        </SubcategoryHeader>
        
        <SkillsGrid>
          {webDevSkills.map(skill => (
            <SkillCard key={skill.id}>
              <SkillTitle>{skill.title}</SkillTitle>
              <SkillDescription>{skill.description}</SkillDescription>
              <SkillMeta>
                <SkillLevel>{skill.level}</SkillLevel>
                <SkillPrice>${skill.price}/hr</SkillPrice>
              </SkillMeta>
              <Link href={`/guru/${skill.id}`} passHref>
                <SkillButton>Find a Guru</SkillButton>
              </Link>
            </SkillCard>
          ))}
        </SkillsGrid>
      </Main>
      
      <Footer />
    </Container>
  );
}