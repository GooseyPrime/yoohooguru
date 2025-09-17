import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${props => props.primaryColor}22, ${props => props.secondaryColor}22);
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, ${props => props.primaryColor}15, transparent 50%),
                radial-gradient(circle at 70% 80%, ${props => props.secondaryColor}15, transparent 50%);
    z-index: -1;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  z-index: 1;
  position: relative;
`;

const DomainIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: ${props => props.primaryColor};
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.3rem;
  color: #666;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SkillTags = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 2rem;
`;

const SkillTag = styled.span`
  background: ${props => props.primaryColor}15;
  color: ${props => props.primaryColor};
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 2px solid ${props => props.primaryColor}30;
  text-transform: capitalize;
`;

const ValueProposition = styled.p`
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 2rem;
`;

const CTAButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
  
  .label {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.25rem;
  }
  
  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.primaryColor};
  }
`;

const Section = styled.section`
  padding: 4rem 2rem;
  background: ${props => props.background || 'white'};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PostCard = styled.article`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  border: 1px solid #eee;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const PostTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const PostExcerpt = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #999;
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const NewsCard = styled.article`
  background: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.primaryColor};
`;

const NewsTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const NewsSummary = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
`;

const NewsSource = styled.div`
  font-size: 0.8rem;
  color: #999;
  font-weight: 500;
`;

const CrossDomainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const DomainCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-2px);
  }

  .icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .name {
    font-weight: 600;
    color: #2c3e50;
    text-transform: capitalize;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .message {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  .submessage {
    font-size: 0.95rem;
  }
`;

const Footer = styled.footer`
  background: #2c3e50;
  color: white;
  padding: 2rem;
  text-align: center;
  
  .links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  
  .link {
    color: #ecf0f1;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  .disclaimer {
    font-size: 0.85rem;
    color: #bdc3c7;
    margin-top: 1rem;
  }
`;

function SubdomainLandingPage({ subdomain, config }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [homeData, setHomeData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // All available subdomains for cross-domain links  
  const allSubdomains = {
    cooking: { icon: '🍳', category: 'culinary' },
    music: { icon: '🎵', category: 'audio' },
    fitness: { icon: '💪', category: 'health' },
    tech: { icon: '💻', category: 'technology' },
    art: { icon: '🎨', category: 'creative' },
    language: { icon: '🗣️', category: 'education' },
    business: { icon: '💼', category: 'professional' },
    design: { icon: '✨', category: 'creative' },
    writing: { icon: '✍️', category: 'creative' },
    photography: { icon: '📸', category: 'creative' },
    gardening: { icon: '🌱', category: 'lifestyle' },
    crafts: { icon: '🛠️', category: 'creative' },
    wellness: { icon: '🧘', category: 'health' },
    finance: { icon: '💰', category: 'professional' },
    home: { icon: '🏠', category: 'lifestyle' }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch home data and news data in parallel
        const [homeResponse, newsResponse] = await Promise.allSettled([
          axios.get(`${process.env.REACT_APP_API_URL}/api/${subdomain}/home`, {
            headers: {
              'Host': `${subdomain}.yoohoo.guru`
            }
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/news/${subdomain}`, {
            headers: {
              'Host': `${subdomain}.yoohoo.guru`
            }
          })
        ]);

        // Handle home data
        if (homeResponse.status === 'fulfilled') {
          setHomeData(homeResponse.value.data);
        }

        // Handle news data  
        if (newsResponse.status === 'fulfilled') {
          setNewsData(newsResponse.value.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching subdomain data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [subdomain]);

  const handleCTAClick = (action) => {
    switch (action) {
      case 'get-started':
        if (currentUser) {
          navigate('/dashboard');
        } else {
          navigate('/signup');
        }
        break;
      case 'view-content':
        navigate('/blog');
        break;
      case 'book-session':
        navigate(`/book?category=${config?.category}`);
        break;
      default:
        break;
    }
  };

  const handlePostClick = (post) => {
    navigate(`/blog/${post.slug || post.id}`);
  };

  const handleDomainClick = (domain) => {
    if (domain === subdomain) return;
    window.location.href = `https://${domain}.yoohoo.guru/`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const generateSEOTitle = (seoTitle) => {
    if (!seoTitle) return `${subdomain.charAt(0).toUpperCase() + subdomain.slice(1)} - Master Essential Skills`;
    
    // Remove character names (e.g., "Chef Guru - " becomes "Cooking - ")
    const domainName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
    return seoTitle.replace(/^\w+\s+Guru\s+-\s+/, `${domainName} - `);
  };

  const generateValueProposition = () => {
    const category = config?.category || subdomain;
    const skills = config?.primarySkills?.slice(0, 3).join(', ') || 'essential skills';
    
    return `Master ${skills} with expert guidance from certified professionals. Our platform connects you with experienced instructors who provide personalized learning experiences, practical techniques, and ongoing support to help you achieve your ${category} goals.`;
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Section>
          <Container>
            <EmptyState>
              <div className="icon">⚠️</div>
              <div className="message">Unable to Load Content</div>
              <div className="submessage">Please try again later.</div>
            </EmptyState>
          </Container>
        </Section>
      </PageContainer>
    );
  }

  const primaryColor = config?.theme?.primaryColor || '#6c5ce7';
  const secondaryColor = config?.theme?.secondaryColor || '#a29bfe';
  const domainIcon = config?.theme?.icon || allSubdomains[subdomain]?.icon || '🎯';

  return (
    <PageContainer>
      <Helmet>
        <title>{generateSEOTitle(config?.seo?.title)}</title>
        <meta name="description" content={config?.seo?.description || `Learn ${subdomain} skills from expert instructors`} />
        <meta name="keywords" content={config?.seo?.keywords?.join(', ') || `${subdomain}, learning, skills, education`} />
        <link rel="canonical" href={`https://${subdomain}.yoohoo.guru/`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={generateSEOTitle(config?.seo?.title)} />
        <meta property="og:description" content={config?.seo?.description || `Learn ${subdomain} skills from expert instructors`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://${subdomain}.yoohoo.guru/`} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={generateSEOTitle(config?.seo?.title)} />
        <meta name="twitter:description" content={config?.seo?.description || `Learn ${subdomain} skills from expert instructors`} />
      </Helmet>

      {/* Hero Section */}
      <HeroSection primaryColor={primaryColor} secondaryColor={secondaryColor}>
        <HeroContent>
          <DomainIcon>{domainIcon}</DomainIcon>
          <Title primaryColor={primaryColor}>
            Master {subdomain.charAt(0).toUpperCase() + subdomain.slice(1)} Skills
          </Title>
          <Subtitle>
            Learn from certified professionals and advance your expertise
          </Subtitle>
          
          <SkillTags>
            {config?.primarySkills?.slice(0, 5).map((skill, index) => (
              <SkillTag key={index} primaryColor={primaryColor}>
                {skill.replace('-', ' ')}
              </SkillTag>
            ))}
          </SkillTags>
          
          <ValueProposition>
            {generateValueProposition()}
          </ValueProposition>
          
          <CTAButtons>
            <Button 
              primary
              onClick={() => handleCTAClick('get-started')}
              style={{ backgroundColor: primaryColor }}
            >
              Get Started
            </Button>
            <Button 
              secondary
              onClick={() => handleCTAClick('view-content')}
            >
              View Learning Content
            </Button>
            <Button 
              secondary
              onClick={() => handleCTAClick('book-session')}
            >
              Book a Session
            </Button>
          </CTAButtons>
          
          {/* Platform Statistics */}
          {homeData?.stats && Object.keys(homeData.stats).length > 0 && (
            <StatsRow>
              {homeData.stats.totalPosts && (
                <StatItem primaryColor={primaryColor}>
                  <div className="label">Learning Resources</div>
                  <div className="value">{homeData.stats.totalPosts}</div>
                </StatItem>
              )}
              {homeData.stats.totalViews && (
                <StatItem primaryColor={primaryColor}>
                  <div className="label">Views</div>
                  <div className="value">{homeData.stats.totalViews}</div>
                </StatItem>
              )}
              {homeData.stats.monthlyVisitors && (
                <StatItem primaryColor={primaryColor}>
                  <div className="label">Monthly Visitors</div>
                  <div className="value">{homeData.stats.monthlyVisitors}</div>
                </StatItem>
              )}
              {homeData.stats.totalLeads && (
                <StatItem primaryColor={primaryColor}>
                  <div className="label">Students Helped</div>
                  <div className="value">{homeData.stats.totalLeads}</div>
                </StatItem>
              )}
            </StatsRow>
          )}
        </HeroContent>
      </HeroSection>

      {/* Featured Content Section */}
      <Section>
        <Container>
          <SectionTitle>Featured Learning Resources</SectionTitle>
          <SectionSubtitle>
            Discover expert insights, tutorials, and guides to accelerate your learning journey
          </SectionSubtitle>
          
          {homeData?.featuredPosts && homeData.featuredPosts.length > 0 ? (
            <PostsGrid>
              {homeData.featuredPosts.slice(0, 6).map((post, index) => (
                <PostCard key={post.id || index} onClick={() => handlePostClick(post)}>
                  <PostTitle>{post.title}</PostTitle>
                  <PostExcerpt>
                    {post.excerpt || post.content?.substring(0, 150) + '...' || 'Expert insights and practical guidance to help you succeed.'}
                  </PostExcerpt>
                  <PostMeta>
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>5 min read</span>
                  </PostMeta>
                </PostCard>
              ))}
            </PostsGrid>
          ) : (
            <EmptyState>
              <div className="icon">📚</div>
              <div className="message">Content Coming Soon!</div>
              <div className="submessage">
                Amazing learning resources are being prepared for you.
              </div>
            </EmptyState>
          )}
        </Container>
      </Section>

      {/* In the News Section */}
      {newsData?.articles && newsData.articles.length > 0 && (
        <Section background="#f8f9fa">
          <Container>
            <SectionTitle>In the News</SectionTitle>
            <SectionSubtitle>
              Latest developments and insights in {config?.category || subdomain}
            </SectionSubtitle>
            
            <NewsGrid>
              {newsData.articles.map((article, index) => (
                <NewsCard key={article.id || index} primaryColor={primaryColor}>
                  <NewsTitle>
                    {article.url === '#' ? (
                      article.title
                    ) : (
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        {article.title}
                      </a>
                    )}
                  </NewsTitle>
                  <NewsSummary>{article.summary}</NewsSummary>
                  <NewsSource>{article.source}</NewsSource>
                </NewsCard>
              ))}
            </NewsGrid>
          </Container>
        </Section>
      )}

      {/* Cross-Domain Links */}
      <Section>
        <Container>
          <SectionTitle>Explore Other Skills</SectionTitle>
          <SectionSubtitle>
            Discover learning opportunities across all domains
          </SectionSubtitle>
          
          <CrossDomainGrid>
            {Object.entries(allSubdomains)
              .filter(([domain]) => domain !== subdomain)
              .map(([domain, info]) => (
                <DomainCard 
                  key={domain} 
                  onClick={() => handleDomainClick(domain)}
                >
                  <div className="icon">{info.icon}</div>
                  <div className="name">Explore {domain}</div>
                </DomainCard>
              ))}
          </CrossDomainGrid>
        </Container>
      </Section>

      {/* Footer */}
      <Footer>
        <div className="links">
          <a href="/terms" className="link">Terms of Service</a>
          <a href="/privacy" className="link">Privacy Policy</a>
          <a href="/safety" className="link">Community Guidelines</a>
          <a href="/liability" className="link">Liability Waiver</a>
        </div>
        <div className="disclaimer">
          All service providers (gurus) are independent contractors and not employees of the platform.
        </div>
      </Footer>
    </PageContainer>
  );
}

export default SubdomainLandingPage;