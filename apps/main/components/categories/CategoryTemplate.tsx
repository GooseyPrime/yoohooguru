import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.95;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled.a`
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
  
  &.primary {
    background: white;
    color: #667eea;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
  }
  
  &.secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
  }
`;

const CategorySection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const SectionTitle = styled.h2`
  color: #ffffff;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const SkillCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    border-color: rgba(102, 126, 234, 0.5);
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

interface CategoryTemplateProps {
  categoryName: string;
  categoryDescription: string;
  skills: {
    id: string;
    title: string;
    description: string;
  }[];
}

export default function CategoryTemplate({ 
  categoryName, 
  categoryDescription, 
  skills 
}: CategoryTemplateProps) {
  return (
    <Container>
      <Head>
        <title>{categoryName} Skills | YooHoo.Guru</title>
        <meta name="description" content={categoryDescription} />
      </Head>
      
      <Header />
      
      <main>
        <HeroSection>
          <HeroTitle>{categoryName} Skills</HeroTitle>
          <HeroSubtitle>
            {categoryDescription}
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/skills" passHref>
              <Button className="primary">
                Browse All Skills →
              </Button>
            </Link>
            <Link href="/guru/profile" passHref>
              <Button className="secondary">
                Become a Guru
              </Button>
            </Link>
          </HeroButtons>
        </HeroSection>
        
        <CategorySection>
          <SectionTitle>Popular {categoryName} Skills</SectionTitle>
          
          <SkillsGrid>
            {skills.map((skill) => (
              <SkillCard key={skill.id}>
                <SkillTitle>{skill.title}</SkillTitle>
                <SkillDescription>{skill.description}</SkillDescription>
                <Link href={`/skills/${categoryName.toLowerCase()}/${skill.id}`} passHref>
                  <SkillButton>Learn More</SkillButton>
                </Link>
              </SkillCard>
            ))}
          </SkillsGrid>
        </CategorySection>
      </main>
      
      <Footer />
    </Container>
  );
}