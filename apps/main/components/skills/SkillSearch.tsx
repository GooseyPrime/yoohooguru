import { useState, useEffect } from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  max-width: 800px;
  margin: 0 auto 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SearchHeader = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-size: 1rem;
  flex: 1;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const SkillCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const SkillTitle = styled.h3`
  color: #ffffff;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
`;

const SkillDescription = styled.p`
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const SkillMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
`;

const SkillCategory = styled.span`
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
`;

const SkillPrice = styled.span`
  color: #51cf66;
  font-weight: 600;
`;

const NoResults = styled.div`
  text-align: center;
  color: #b0b0b0;
  padding: 2rem;
  grid-column: 1 / -1;
`;

// This would typically come from an API or database
const SKILL_CATEGORIES = [
  'art', 'business', 'coding', 'cooking', 'crafts', 'data', 'design', 
  'finance', 'fitness', 'gardening', 'health', 'history', 'home', 
  'language', 'marketing', 'math', 'music', 'photography', 'sales', 
  'science', 'sports', 'tech', 'wellness', 'writing'
];

// Mock data for skills
const MOCK_SKILLS = [
  {
    id: '1',
    title: 'Advanced Web Development',
    description: 'Learn modern web development techniques with React, Next.js, and TypeScript',
    category: 'coding',
    price: 50,
    rating: 4.8,
    guru: 'Alex Johnson'
  },
  {
    id: '2',
    title: 'Digital Marketing Strategy',
    description: 'Master digital marketing with SEO, social media, and content marketing',
    category: 'marketing',
    price: 75,
    rating: 4.9,
    guru: 'Sarah Williams'
  },
  {
    id: '3',
    title: 'French Language Basics',
    description: 'Start your journey to learning French with conversational basics',
    category: 'language',
    price: 40,
    rating: 4.7,
    guru: 'Pierre Dubois'
  },
  {
    id: '4',
    title: 'Italian Cooking Classes',
    description: 'Learn authentic Italian recipes and cooking techniques',
    category: 'cooking',
    price: 60,
    rating: 4.9,
    guru: 'Marco Rossi'
  },
  {
    id: '5',
    title: 'Personal Finance Management',
    description: 'Take control of your finances with budgeting and investment strategies',
    category: 'finance',
    price: 35,
    rating: 4.6,
    guru: 'Michael Chen'
  },
  {
    id: '6',
    title: 'Yoga for Beginners',
    description: 'Start your yoga journey with basic poses and mindfulness techniques',
    category: 'fitness',
    price: 30,
    rating: 4.8,
    guru: 'Emma Thompson'
  }
];

export default function SkillSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [results, setResults] = useState(MOCK_SKILLS);
  
  useEffect(() => {
    // In a real implementation, this would be an API call
    // For now, we'll filter the mock data
    let filtered = MOCK_SKILLS;
    
    if (searchTerm) {
      filtered = filtered.filter(skill => 
        skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.guru.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }
    
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      filtered = filtered.filter(skill => {
        if (max) {
          return skill.price >= min && skill.price <= max;
        } else {
          return skill.price >= min;
        }
      });
    }
    
    setResults(filtered);
  }, [searchTerm, selectedCategory, selectedPriceRange]);
  
  return (
    <SearchContainer>
      <SearchHeader>Find Skills to Learn</SearchHeader>
      
      <SearchInput
        type="text"
        placeholder="Search for skills, categories, or Gurus..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <FilterContainer>
        <FilterSelect 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {SKILL_CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </FilterSelect>
        
        <FilterSelect 
          value={selectedPriceRange} 
          onChange={(e) => setSelectedPriceRange(e.target.value)}
        >
          <option value="">Any Price</option>
          <option value="0-25">Under $25</option>
          <option value="25-50">$25 - $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100">Over $100</option>
        </FilterSelect>
      </FilterContainer>
      
      <ResultsContainer>
        {results.length > 0 ? (
          results.map(skill => (
            <SkillCard key={skill.id}>
              <SkillTitle>{skill.title}</SkillTitle>
              <SkillDescription>{skill.description}</SkillDescription>
              <SkillMeta>
                <SkillCategory>
                  {skill.category.charAt(0).toUpperCase() + skill.category.slice(1)}
                </SkillCategory>
                <SkillPrice>${skill.price}/hr</SkillPrice>
              </SkillMeta>
              <div style={{color: '#b0b0b0', fontSize: '0.9rem', marginTop: '0.5rem'}}>
                by {skill.guru} • ★ {skill.rating}
              </div>
            </SkillCard>
          ))
        ) : (
          <NoResults>No skills found matching your criteria.</NoResults>
        )}
      </ResultsContainer>
    </SearchContainer>
  );
}