/**
 * Resources Section Component
 * Displays popular resources, links, and files for subdomain communities
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { get } from '../utils/http';

const ResourcesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text || '#ffffff'};
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary || '#cccccc'};
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const CategoryCard = styled.div`
  background: ${props => props.theme.colors.surface || '#2a2a2a'};
  border: 1px solid ${props => props.theme.colors.border || '#444444'};
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary || '#6c5ce7'};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const CategoryIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text || '#ffffff'};
`;

const ResourcesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ResourceItem = styled.li`
  margin-bottom: 0.75rem;
`;

const ResourceLink = styled.a`
  color: ${props => props.theme.colors.primary || '#6c5ce7'};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(108, 92, 231, 0.1);
    text-decoration: underline;
  }
`;

const ResourceIcon = styled.span`
  font-size: 1.2rem;
`;

const PopularBadge = styled.span`
  background: #ff6b6b;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 12px;
  margin-left: auto;
`;

const SearchBox = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border || '#444444'};
  border-radius: 8px;
  background: ${props => props.theme.colors.surface || '#2a2a2a'};
  color: ${props => props.theme.colors.text || '#ffffff'};
  font-size: 1rem;
  margin: 0 auto 2rem auto;
  display: block;

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary || '#cccccc'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary || '#6c5ce7'};
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${props => props.theme.colors.textSecondary || '#cccccc'};
`;

function ResourcesSection({ subdomain }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const data = await get(`/resources/${subdomain || 'general'}`);
      setResources(data.categories || []);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      setError(error.message);
      // Fallback to default resources
      setResources(getDefaultResources(subdomain));
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  const getDefaultResources = (domain) => {
    const defaultResources = {
      tech: [
        {
          title: '💻 Development Tools',
          icon: '🛠️',
          resources: [
            { name: 'VS Code Extensions Guide', url: 'https://code.visualstudio.com/docs/editor/extension-gallery', icon: '📝', popular: true },
            { name: 'GitHub Learning Lab', url: 'https://lab.github.com/', icon: '🎓', popular: true },
            { name: 'Stack Overflow', url: 'https://stackoverflow.com/', icon: '❓', popular: true },
            { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', icon: '📚' },
            { name: 'FreeCodeCamp', url: 'https://www.freecodecamp.org/', icon: '🎯' }
          ]
        },
        {
          title: '📱 Mobile Development',
          icon: '📱',
          resources: [
            { name: 'React Native Docs', url: 'https://reactnative.dev/', icon: '⚛️', popular: true },
            { name: 'Flutter Documentation', url: 'https://flutter.dev/', icon: '🦋' },
            { name: 'iOS Developer Guide', url: 'https://developer.apple.com/', icon: '🍎' },
            { name: 'Android Developers', url: 'https://developer.android.com/', icon: '🤖' }
          ]
        }
      ],
      design: [
        {
          title: '🎨 Design Resources',
          icon: '🎨',
          resources: [
            { name: 'Figma Community', url: 'https://www.figma.com/community/', icon: '🎯', popular: true },
            { name: 'Dribbble Inspiration', url: 'https://dribbble.com/', icon: '🏀', popular: true },
            { name: 'Adobe Creative Suite', url: 'https://www.adobe.com/creativecloud.html', icon: '📐' },
            { name: 'Canva Templates', url: 'https://www.canva.com/', icon: '🌟' },
            { name: 'Color Hunt Palettes', url: 'https://colorhunt.co/', icon: '🎨' }
          ]
        },
        {
          title: '📚 Learning Materials',
          icon: '📖',
          resources: [
            { name: 'Design Principles', url: 'https://www.interaction-design.org/', icon: '📊' },
            { name: 'Typography Handbook', url: 'https://typographyhandbook.com/', icon: '✍️' },
            { name: 'UX Laws', url: 'https://lawsofux.com/', icon: '⚖️', popular: true }
          ]
        }
      ],
      business: [
        {
          title: '📈 Business Growth',
          icon: '💼',
          resources: [
            { name: 'Harvard Business Review', url: 'https://hbr.org/', icon: '📰', popular: true },
            { name: 'Google Analytics Academy', url: 'https://analytics.google.com/analytics/academy/', icon: '📊' },
            { name: 'HubSpot Academy', url: 'https://academy.hubspot.com/', icon: '🎓', popular: true },
            { name: 'SCORE Business Mentors', url: 'https://www.score.org/', icon: '👥' }
          ]
        }
      ]
    };

    return defaultResources[domain] || [
      {
        title: '📚 General Resources',
        icon: '📖',
        resources: [
          { name: 'Khan Academy', url: 'https://www.khanacademy.org/', icon: '🎓', popular: true },
          { name: 'Coursera', url: 'https://www.coursera.org/', icon: '🎓' },
          { name: 'YouTube Learning Playlists', url: 'https://www.youtube.com/channel/UCtFRv9O2AHqOZjjynzrv-xg', icon: '📺' },
          { name: 'Reddit Community Support', url: 'https://www.reddit.com/', icon: '💬' }
        ]
      }
    ];
  };

  const filteredResources = resources.filter(category => 
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.resources.some(resource => 
      resource.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <ResourcesContainer>
        <LoadingSpinner>
          <div>Loading resources...</div>
        </LoadingSpinner>
      </ResourcesContainer>
    );
  }

  return (
    <ResourcesContainer>
      <Title>Community Resources</Title>
      <Subtitle>
        Discover popular tools, guides, and resources shared by our community members
      </Subtitle>

      <SearchBox
        type="text"
        placeholder="Search resources..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <CategoryGrid>
        {filteredResources.map((category, index) => (
          <CategoryCard key={index}>
            <CategoryIcon>{category.icon}</CategoryIcon>
            <CategoryTitle>{category.title}</CategoryTitle>
            <ResourcesList>
              {category.resources.map((resource, resourceIndex) => (
                <ResourceItem key={resourceIndex}>
                  <ResourceLink 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ResourceIcon>{resource.icon}</ResourceIcon>
                    {resource.name}
                    {resource.popular && <PopularBadge>Popular</PopularBadge>}
                  </ResourceLink>
                </ResourceItem>
              ))}
            </ResourcesList>
          </CategoryCard>
        ))}
      </CategoryGrid>

      {error && (
        <div style={{ 
          textAlign: 'center', 
          color: '#ff6b6b', 
          marginTop: '2rem',
          background: 'rgba(255, 107, 107, 0.1)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid rgba(255, 107, 107, 0.3)'
        }}>
          Failed to load some resources: {error}
        </div>
      )}
    </ResourcesContainer>
  );
}

export default ResourcesSection;