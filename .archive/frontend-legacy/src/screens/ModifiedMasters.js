/**
 * Hero Guru's Page (formerly Modified Masters)
 * Accessibility-first skill sharing marketplace for disability communities
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { get, post } from '../utils/http';
import AccessibilityToolbar from '../components/AccessibilityToolbar';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text || '#ffffff'};
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary || '#cccccc'};
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const DonateButton = styled.a`
  display: inline-block;
  background: ${props => props.theme.colors.primary || '#6c5ce7'};
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: background-color 0.2s ease;
  margin-bottom: 2rem;
  
  &:hover {
    background: ${props => props.theme.colors.primaryHover || '#5a4fcf'};
  }
  
  &:focus {
    outline: 3px solid ${props => props.theme.colors.accent || '#ff6b6b'};
    outline-offset: 2px;
  }
`;

const FiltersContainer = styled.div`
  background: ${props => props.theme.colors.surface || '#2a2a2a'};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid ${props => props.theme.colors.border || '#444444'};
`;

const FiltersTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: ${props => props.theme.colors.text || '#ffffff'};
  font-size: 1.1rem;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  color: ${props => props.theme.colors.textSecondary || '#cccccc'};
  font-size: 0.9rem;
  font-weight: 500;
`;

const FilterInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${props => props.theme.colors.border || '#444444'};
  border-radius: 6px;
  background: ${props => props.theme.colors.background || '#1a1a1a'};
  color: ${props => props.theme.colors.text || '#ffffff'};
  font-size: 1rem;
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary || '#6c5ce7'};
    outline-offset: 2px;
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${props => props.theme.colors.border || '#444444'};
  border-radius: 6px;
  background: ${props => props.theme.colors.background || '#1a1a1a'};
  color: ${props => props.theme.colors.text || '#ffffff'};
  font-size: 1rem;
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary || '#6c5ce7'};
    outline-offset: 2px;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SkillCard = styled.div`
  background: ${props => props.theme.colors.surface || '#2a2a2a'};
  border: 1px solid ${props => props.theme.colors.border || '#444444'};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.backgroundHover || '#3a3a3a'};
    border-color: ${props => props.theme.colors.primary || '#6c5ce7'};
  }
`;

const SkillTitle = styled.h3`
  margin: 0 0 0.75rem 0;
  color: ${props => props.theme.colors.text || '#ffffff'};
  font-size: 1.2rem;
  font-weight: 600;
`;

const SkillSummary = styled.p`
  margin: 0 0 1rem 0;
  color: ${props => props.theme.colors.textSecondary || '#cccccc'};
  line-height: 1.5;
`;

const CoachName = styled.p`
  margin: 0 0 1rem 0;
  color: ${props => props.theme.colors.text || '#ffffff'};
  font-weight: 500;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: ${props => props.theme.colors.primary || '#6c5ce7'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const RequestButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.primary || '#6c5ce7'};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primaryHover || '#5a4fcf'};
  }
  
  &:focus {
    outline: 3px solid ${props => props.theme.colors.accent || '#ff6b6b'};
    outline-offset: 2px;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface || '#2a2a2a'};
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textSecondary || '#cccccc'};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.error || '#ff6b6b'};
  background: ${props => props.theme.colors.surface || '#2a2a2a'};
  border-radius: 8px;
  margin-bottom: 2rem;
`;

function HeroGurus() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    tag: '',
    style: ''
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [config, setConfig] = useState({});

  useEffect(() => {
    fetchConfig();
    fetchSkills();
  }, [fetchSkills]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSkills();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchSkills]);

  const fetchConfig = async () => {
    try {
      // Try new endpoint first, fallback to legacy
      const configData = await get('/heroes/config').catch(() => get('/modified-masters/config'));
      setConfig(configData);
    } catch (error) {
      console.warn('Failed to load Hero Guru\'s config:', error);
    }
  };

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('q', filters.search);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.style) params.append('style', filters.style);
      
      const query = params.toString();
      // Try new endpoint first, fallback to legacy
      const endpoint = query ? `/heroes/skills?${query}` : '/heroes/skills';
      const legacyEndpoint = query ? `/modified-masters/skills?${query}` : '/modified-masters/skills';
      
      const data = await get(endpoint).catch(() => get(legacyEndpoint));
      setSkills(data.skills || []);
      setError(null);
    } catch (error) {
      setError(error.message);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.tag, filters.style]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const openRequestModal = (skillId) => {
    setSelectedSkillId(skillId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSkillId(null);
  };

  return (
    <>
      <Container>
        <Header>
          <Title>Hero Guru's</Title>
          <Subtitle>
            Accessibility-first skill sharing for disability communities. 
            Learn and teach with understanding, patience, and adaptive approaches.
          </Subtitle>
          
          {config.donateUrl && (
            <DonateButton 
              href={config.donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Support Hero Guru's with a donation"
            >
              💝 Support Hero Guru's
            </DonateButton>
          )}
        </Header>

        <FiltersContainer>
          <FiltersTitle>Find Skills</FiltersTitle>
          <FilterRow>
            <FilterGroup>
              <FilterLabel htmlFor="search-skills">Search Skills</FilterLabel>
              <FilterInput
                id="search-skills"
                type="text"
                placeholder="e.g., programming, cooking, music"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel htmlFor="filter-tag">Accessibility Focus</FilterLabel>
              <FilterSelect
                id="filter-tag"
                value={filters.tag}
                onChange={(e) => handleFilterChange('tag', e.target.value)}
              >
                <option value="">All Focus Areas</option>
                <option value="mobility">Mobility</option>
                <option value="vision">Vision</option>
                <option value="hearing">Hearing</option>
                <option value="neurodiversity">Neurodiversity</option>
                <option value="communication">Communication</option>
              </FilterSelect>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel htmlFor="filter-style">Teaching Style</FilterLabel>
              <FilterSelect
                id="filter-style"
                value={filters.style}
                onChange={(e) => handleFilterChange('style', e.target.value)}
              >
                <option value="">All Styles</option>
                <option value="visual-demos">Visual Demos</option>
                <option value="hands-on">Hands-on</option>
                <option value="step-by-step">Step-by-step</option>
                <option value="slow-pace">Slow Pace</option>
                <option value="verbal-explainer">Verbal Explanation</option>
              </FilterSelect>
            </FilterGroup>
          </FilterRow>
        </FiltersContainer>

        {loading && (
          <LoadingMessage>
            Loading Hero Guru's skills...
          </LoadingMessage>
        )}

        {error && (
          <ErrorMessage>
            Error loading skills: {error}
          </ErrorMessage>
        )}

        <SkillsGrid role="list" aria-label="Available skills">
          {skills.map((skill) => (
            <SkillCard key={skill.id} role="listitem">
              <SkillTitle>{skill.title}</SkillTitle>
              <CoachName>Coach: {skill.coachName}</CoachName>
              <SkillSummary>{skill.summary}</SkillSummary>
              
              {(skill.accessibilityTags?.length > 0 || skill.coachingStyles?.length > 0) && (
                <TagsContainer>
                  {skill.accessibilityTags?.map(tag => (
                    <Tag key={tag} style={{ background: '#27ae60' }}>
                      ♿ {tag}
                    </Tag>
                  ))}
                  {skill.coachingStyles?.map(style => (
                    <Tag key={style}>
                      🎯 {style.replace('-', ' ')}
                    </Tag>
                  ))}
                </TagsContainer>
              )}
              
              <RequestButton 
                onClick={() => openRequestModal(skill.id)}
                aria-haspopup="dialog"
              >
                Request Distance Session
              </RequestButton>
            </SkillCard>
          ))}
        </SkillsGrid>

        {skills.length === 0 && !loading && !error && (
          <LoadingMessage>
            No skills found with current filters. Try adjusting your search criteria.
          </LoadingMessage>
        )}
      </Container>

      <AccessibilityToolbar />

      {modalOpen && (
        <RequestSessionModal 
          skillId={selectedSkillId} 
          onClose={closeModal}
        />
      )}
    </>
  );
}

// Simple session request modal component
function RequestSessionModal({ skillId, onClose }) {
  const [formData, setFormData] = useState({
    mode: 'video',
    startTime: '',
    endTime: '',
    joinUrl: '',
    captionsRequired: false,
    aslRequested: false,
    recordPolicy: 'allow-with-consent'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // Convert datetime-local strings to epoch timestamps
      const startTime = new Date(formData.startTime).getTime();
      const endTime = new Date(formData.endTime).getTime();
      
      await post('/sessions', {
        skillId,
        learnerId: '__SELF__', // Backend resolves to current user
        mode: formData.mode,
        startTime,
        endTime,
        joinUrl: formData.joinUrl,
        captionsRequired: formData.captionsRequired,
        aslRequested: formData.aslRequested,
        recordPolicy: formData.recordPolicy
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create session: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Modal role="dialog" aria-modal="true" aria-labelledby="session-modal-title">
      <ModalContent>
        <h2 id="session-modal-title">Request a Distance Session</h2>
        <form onSubmit={handleSubmit}>
          <FilterGroup>
            <FilterLabel htmlFor="session-mode">Session Mode</FilterLabel>
            <FilterSelect
              id="session-mode"
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              required
            >
              <option value="video">Video Call</option>
              <option value="phone">Phone Call</option>
              <option value="chat">Text Chat</option>
              <option value="async">Async Messages</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel htmlFor="start-time">Start Time</FilterLabel>
            <FilterInput
              id="start-time"
              name="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel htmlFor="end-time">End Time</FilterLabel>
            <FilterInput
              id="end-time"
              name="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel htmlFor="join-url">Join URL (optional)</FilterLabel>
            <FilterInput
              id="join-url"
              name="joinUrl"
              type="url"
              placeholder="https://meet.jit.si/Room-abc123"
              value={formData.joinUrl}
              onChange={handleChange}
            />
          </FilterGroup>

          <div style={{ margin: '1rem 0' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>Accessibility Options</h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
              <input
                type="checkbox"
                name="captionsRequired"
                checked={formData.captionsRequired}
                onChange={handleChange}
              />
              Captions required
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
              <input
                type="checkbox"
                name="aslRequested"
                checked={formData.aslRequested}
                onChange={handleChange}
              />
              ASL interpreter requested
            </label>
          </div>

          <FilterGroup>
            <FilterLabel htmlFor="record-policy">Recording Policy</FilterLabel>
            <FilterSelect
              id="record-policy"
              name="recordPolicy"
              value={formData.recordPolicy}
              onChange={handleChange}
            >
              <option value="prohibited">No recording allowed</option>
              <option value="allowed">Recording allowed</option>
              <option value="allow-with-consent">Recording with consent</option>
            </FilterSelect>
          </FilterGroup>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <RequestButton type="submit" disabled={submitting}>
              {submitting ? 'Sending Request...' : 'Send Request'}
            </RequestButton>
            <RequestButton 
              type="button" 
              onClick={onClose}
              style={{ background: 'transparent', border: '1px solid #666' }}
            >
              Cancel
            </RequestButton>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default HeroGurus;

// Legacy export for backwards compatibility
export { HeroGurus as ModifiedMasters };