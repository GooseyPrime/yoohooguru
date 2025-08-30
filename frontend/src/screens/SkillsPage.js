import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  margin-bottom: 1rem;
  color: var(--gray-900);
  text-align: center;
`;

const Description = styled.p`
  font-size: var(--text-lg);
  color: var(--gray-600);
  margin-bottom: 3rem;
  text-align: center;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const SkillCategory = styled.div`
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  border-left: 4px solid var(--primary);

  h3 {
    font-size: var(--text-xl);
    margin-bottom: 1rem;
    color: var(--gray-900);
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    padding: 0.5rem 0;
    color: var(--gray-600);
    border-bottom: 1px solid var(--gray-200);

    &:last-child {
      border-bottom: none;
    }
  }
`;

const ComingSoon = styled.div`
  background: linear-gradient(135deg, var(--ripple-blue) 0%, var(--growth-green) 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: var(--radius-xl);
  text-align: center;

  h2 {
    font-size: var(--text-2xl);
    margin-bottom: 1rem;
  }

  p {
    opacity: 0.9;
    line-height: 1.6;
  }
`;

function SkillsPage() {
  const skillCategories = [
    {
      name: 'Creative Skills',
      skills: ['Graphic Design', 'Photography', 'Music Production', 'Writing', 'Painting']
    },
    {
      name: 'Technical Skills',
      skills: ['Web Development', 'Data Science', 'Mobile App Development', 'AI/ML', 'Cybersecurity']
    },
    {
      name: 'Language Skills',
      skills: ['Spanish', 'French', 'Mandarin', 'Japanese', 'German']
    },
    {
      name: 'Business Skills',
      skills: ['Marketing', 'Sales', 'Project Management', 'Finance', 'Entrepreneurship']
    },
    {
      name: 'Practical Skills',
      skills: ['Cooking', 'Gardening', 'Home Repair', 'Auto Maintenance', 'Crafting']
    },
    {
      name: 'Health & Wellness',
      skills: ['Yoga', 'Fitness Training', 'Meditation', 'Nutrition', 'Mental Health']
    }
  ];

  return (
    <Container>
      <Content>
        <Title>Explore Skills</Title>
        <Description>
          Discover the amazing skills available in the RIPPLE community. 
          Find teachers and learners for every interest and expertise level.
        </Description>

        <SkillsGrid>
          {skillCategories.map((category, index) => (
            <SkillCategory key={index}>
              <h3>{category.name}</h3>
              <ul>
                {category.skills.map((skill, skillIndex) => (
                  <li key={skillIndex}>{skill}</li>
                ))}
              </ul>
            </SkillCategory>
          ))}
        </SkillsGrid>

        <ComingSoon>
          <h2>🔍 Advanced Skills Browser Coming Soon!</h2>
          <p>
            We&apos;re building an advanced skills browser with search, filtering, 
            teacher profiles, and instant matching capabilities. 
            Connect with skilled community members effortlessly!
          </p>
        </ComingSoon>
      </Content>
    </Container>
  );
}

export default SkillsPage;