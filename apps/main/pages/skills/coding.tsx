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

const CategoryHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const CategoryTitle = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const CategoryDescription = styled.p`
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

export default function CodingSkills() {
  // Mock data for coding skills
  const codingSkills = [
    {
      id: 'web-dev',
      title: 'Web Development',
      description: 'Learn to build modern websites and web applications using HTML, CSS, JavaScript, and frameworks like React and Next.js.',
      subcategories: ['Frontend Development', 'Backend Development', 'Full Stack Development']
    },
    {
      id: 'python',
      title: 'Python Programming',
      description: 'Master Python for data science, automation, web development, and more. Perfect for beginners and intermediate learners.',
      subcategories: ['Data Science', 'Web Scraping', 'Automation', 'Machine Learning']
    },
    {
      id: 'mobile',
      title: 'Mobile App Development',
      description: 'Create mobile applications for iOS and Android platforms using React Native, Flutter, or native development tools.',
      subcategories: ['iOS Development', 'Android Development', 'Cross-Platform Apps']
    },
    {
      id: 'data-science',
      title: 'Data Science & Machine Learning',
      description: 'Learn to analyze data, build predictive models, and implement machine learning algorithms using Python and R.',
      subcategories: ['Data Analysis', 'Machine Learning', 'Deep Learning', 'AI Fundamentals']
    },
    {
      id: 'devops',
      title: 'DevOps & Cloud Computing',
      description: 'Master deployment, CI/CD pipelines, containerization with Docker, and cloud platforms like AWS and Google Cloud.',
      subcategories: ['Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'CI/CD']
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      description: 'Learn essential cybersecurity skills including network security, encryption, threat analysis, and secure coding practices.',
      subcategories: ['Network Security', 'Ethical Hacking', 'Secure Coding', 'Threat Analysis']
    }
  ];

  return (
    <Container>
      <Head>
        <title>Coding Skills | YooHoo.Guru</title>
        <meta name="description" content="Learn programming and software development skills from expert Gurus." />
      </Head>
      
      <Header />
      
      <Main>
        <CategoryHeader>
          <CategoryTitle>Coding Skills</CategoryTitle>
          <CategoryDescription>
            Master programming languages, frameworks, and development tools. From beginner coding to advanced software engineering, 
            find Gurus who can help you build your technical skills.
          </CategoryDescription>
        </CategoryHeader>
        
        <SkillsGrid>
          {codingSkills.map(skill => (
            <SkillCard key={skill.id}>
              <SkillTitle>{skill.title}</SkillTitle>
              <SkillDescription>{skill.description}</SkillDescription>
              <div style={{color: '#b0b0b0', fontSize: '0.9rem', marginBottom: '1rem'}}>
                {skill.subcategories.join(', ')}
              </div>
              <Link href={`/skills/coding/${skill.id}`} passHref>
                <SkillButton>Explore {skill.title}</SkillButton>
              </Link>
            </SkillCard>
          ))}
        </SkillsGrid>
      </Main>
      
      <Footer />
    </Container>
  );
}