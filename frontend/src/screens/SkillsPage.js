import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Calendar, Users, Star, Clock, ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import { getSkillCategoriesForDisplay } from '../lib/skillCategorization';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.bg};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: var(--text-2xl);
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
  line-height: 1.3;
`;

const Description = styled.p`
  font-size: var(--text-base);
  color: ${props => props.theme.colors.muted};
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.5;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: ${props => props.theme.shadow.card};
  border: 1px solid ${props => props.theme.colors.border};
`;

const SearchHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  
  h2 {
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
    font-size: var(--text-xl);
    font-weight: 600;
  }
  
  p {
    color: ${props => props.theme.colors.muted};
    font-size: var(--text-sm);
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  max-width: 500px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: var(--r-md);
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: var(--text-sm);
  transition: all var(--t-fast);
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.pri};
    box-shadow: 0 0 0 2px rgba(124, 140, 255, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.muted};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.muted};
  width: 20px;
  height: 20px;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 1rem 2rem;
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: ${props => props.$active ? props.theme.colors.pri : props.theme.colors.muted};
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$active ? props.theme.colors.pri : 'transparent'};
  transition: all var(--t-fast);
  
  &:hover {
    color: ${props => props.theme.colors.pri};
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const SkillCategory = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-lg);
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadow.card};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all var(--t-med);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }

  h3 {
    font-size: var(--text-lg);
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .category-icon {
    font-size: 1.25rem;
  }
`;

const SkillsList = styled.ul`
  list-style: none;
  margin-bottom: 1rem;
  
  li {
    padding: 0.25rem 0;
    color: ${props => props.theme.colors.muted};
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--text-sm);
    
    &:before {
      content: "•";
      color: ${props => props.theme.colors.pri};
      font-weight: bold;
    }
  }
`;

const SessionTemplates = styled.div`
  background: ${props => props.theme.colors.elev};
  border-radius: var(--r-md);
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SessionTemplate = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: var(--r-md);
  margin-bottom: 0.5rem;
  background: ${props => props.theme.colors.surface};
  cursor: pointer;
  transition: all var(--t-fast);
  
  &:hover {
    background: ${props => props.theme.colors.surface};
    transform: translateX(4px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SessionInfo = styled.div`
  flex: 1;
  
  .session-name {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.25rem;
  }
  
  .session-details {
    font-size: var(--text-xs);
    color: ${props => props.theme.colors.muted};
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const CategoryActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TemplateHeader = styled.div`
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AICoachBadge = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: var(--text-xs);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  font-weight: var(--font-medium);
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ComingSoon = styled.div`
  background: linear-gradient(135deg, var(--primary) 0%, var(--growth-green) 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: var(--radius-xl);
  margin: 2rem 0;
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

const RiskBadge = styled.div`
  background: ${props => props.risk === 'high' ? 'linear-gradient(135deg, #ff6b6b, #ee5a52)' : 'linear-gradient(135deg, #ffa726, #ff9800)'};
  color: white;
  font-size: var(--text-xs);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  font-weight: var(--font-medium);
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

function SkillsPage() {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');

  // Get categories from shared utility instead of hardcoded list
  const skillCategories = getSkillCategoriesForDisplay();

  const filteredCategories = searchTerm 
    ? skillCategories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : skillCategories;

  return (
    <Container>
      <Content>
        <Title>Discover & Learn Skills</Title>
        <Description>
          Connect with skilled community members and book AI-moderated learning sessions
          tailored to your learning style and goals.
        </Description>

        <SearchSection>
          <SearchHeader>
            <h2>Find Your Perfect Learning Match</h2>
            <p>Search by skill, category, or session type</p>
          </SearchHeader>
          <SearchInputContainer>
            <SearchIcon />
            <SearchInput 
             
              type="text"
              placeholder="Search skills (e.g., Python, Yoga, Spanish...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInputContainer>
        </SearchSection>

        <TabsContainer>
          <Tab 
            $active={activeTab === 'browse'} 
           
            onClick={() => setActiveTab('browse')}
          >
            Browse Skills
          </Tab>
          <Tab 
            $active={activeTab === 'sessions'} 
           
            onClick={() => setActiveTab('sessions')}
          >
            Session Templates
          </Tab>
          <Tab 
            $active={activeTab === 'ai-coach'} 
           
            onClick={() => setActiveTab('ai-coach')}
          >
            AI Coaching
          </Tab>
        </TabsContainer>

        <SkillsGrid>
          {filteredCategories.map((category, index) => (
            <SkillCategory key={index}>
              <h3>
                <span className="category-icon">{category.icon}</span>
                {category.name}
                {category.requiresWaiver && (
                  <RiskBadge risk={category.riskLevel}>
                    {category.riskIndicator} High Risk
                  </RiskBadge>
                )}
              </h3>
              
              <SkillsList>
                {category.keywords.slice(0, 6).map((skill, skillIndex) => (
                  <li key={skillIndex}>{skill}</li>
                ))}
              </SkillsList>

              <SessionTemplates>
                <TemplateHeader>
                  <Calendar size={16} />
                  Available Session Templates
                  {category.requiresWaiver && (
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      color: '#ff6b6b',
                      fontWeight: 'var(--font-medium)'
                    }}>
                      ⚠️ Waiver Required
                    </span>
                  )}
                </TemplateHeader>
                
                {category.sessionTemplates.map((template, templateIndex) => (
                  <SessionTemplate key={templateIndex}>
                    <SessionInfo>
                      <div className="session-name">{template.name}</div>
                      <div className="session-details">
                        <span><Clock size={12} /> {template.duration}</span>
                        <span><Users size={12} /> {template.participants}</span>
                        <span><Star size={12} /> {template.difficulty}</span>
                      </div>
                    </SessionInfo>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AICoachBadge>
                        AI Coach
                      </AICoachBadge>
                      <ChevronRight size={16} color="#9AA7B2" />
                    </div>
                  </SessionTemplate>
                ))}
              </SessionTemplates>

              <CategoryActions>
                <Button variant="primary" size="sm">
                  Book Session
                </Button>
                <Button variant="outline" size="sm">
                  Find Teachers
                </Button>
              </CategoryActions>
            </SkillCategory>
          ))}
        </SkillsGrid>

        <ComingSoon>
          <h2>Advanced Features Coming Soon!</h2>
          <p>
			We&#39;re building advanced skill matching, real-time AI coaching, progress tracking,
            and certification pathways. Join our community to be the first to experience
            the future of peer-to-peer learning!
          </p>
        </ComingSoon>
      </Content>
    </Container>
  );
}

export default SkillsPage;