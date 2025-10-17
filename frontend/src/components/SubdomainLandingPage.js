import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import logger from '../utils/logger';
import { 
  ChefHat, Music, Dumbbell, Laptop, Palette, MessageCircle, 
  Briefcase, Sparkles, PenTool, Camera, Sprout, Wrench, 
  Heart, Target, ArrowLeft, Calendar, Clock, User 
} from 'lucide-react';

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--bg, #0a0a0f);
  color: var(--text, #ffffff);
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${props => props.$primaryColor}22, ${props => props.$secondaryColor}22);
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
    background: radial-gradient(circle at 30% 20%, ${props => props.$primaryColor}15, transparent 50%),
                radial-gradient(circle at 70% 80%, ${props => props.$secondaryColor}15, transparent 50%);
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
  color: ${props => props.$primaryColor};
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.3rem;
  color: var(--muted, #B4C6E7);
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
  background: ${props => props.$primaryColor}15;
  color: ${props => props.$primaryColor};
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 2px solid ${props => props.$primaryColor}30;
  text-transform: capitalize;
`;

const ValueProposition = styled.p`
  font-size: 1.1rem;
  color: var(--muted, #B4C6E7);
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
    color: var(--muted, #B4C6E7);
    margin-bottom: 0.25rem;
  }
  
  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.$primaryColor};
  }
`;

const Section = styled.section`
  padding: 4rem 2rem;
  background: ${props => props.background || 'var(--background)'};
  color: var(--text);
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
  color: var(--text, #F8FAFC);
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: var(--muted, #B4C6E7);
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
  background: var(--surface, #1A1530);
  color: var(--text, #F8FAFC);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow-md, 0 4px 20px rgba(0,0,0,0.4));
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  border: 1px solid var(--border, #2D2754);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  }
  
  &:focus-visible {
    outline: 2px solid var(--pri, #6366F1);
    outline-offset: 2px;
  }
`;

const PostTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text, #F8FAFC);
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const PostExcerpt = styled.p`
  color: var(--muted, #B4C6E7);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--muted, #B4C6E7);
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const NewsCard = styled.article`
  background: var(--surface, #1A1530);
  color: var(--text, #F8FAFC);
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: var(--shadow-sm, 0 2px 10px rgba(0,0,0,0.3));
  border-left: 4px solid ${props => props.$primaryColor};
`;

const NewsTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text, #F8FAFC);
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const NewsSummary = styled.p`
  color: var(--muted, #B4C6E7);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
`;

const NewsSource = styled.div`
  font-size: 0.8rem;
  color: var(--muted, #B4C6E7);
  font-weight: 500;
`;

const CrossDomainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const DomainCard = styled.div`
  background: var(--surface, #1A1530);
  color: var(--text, #F8FAFC);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: var(--shadow-sm, 0 2px 10px rgba(0,0,0,0.3));
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
    color: var(--text, #F8FAFC);
    text-transform: capitalize;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--muted, #B4C6E7);
  
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

// Blog detail view styled components
const BackButton = styled(Button)`
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ArticleContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: var(--surface, #1A1530);
  padding: 3rem 2rem;
  border-radius: 12px;
`;

const ArticleHeader = styled.div`
  margin-bottom: 3rem;
  text-align: center;
`;

const ArticleTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text, #F8FAFC);
  line-height: 1.3;
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  font-size: 0.95rem;
  color: var(--muted, #B4C6E7);
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  svg {
    width: 16px;
    height: 16px;
    margin-right: 0.25rem;
  }
`;

const ArticleContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text, #F8FAFC);
  
  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 2rem 0 1rem 0;
    color: var(--text, #F8FAFC);
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1.5rem 0 1rem 0;
    color: var(--text, #F8FAFC);
  }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  ul, ol {
    margin: 1rem 0 1.5rem 2rem;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
  
  blockquote {
    border-left: 4px solid var(--primary);
    padding: 1rem 1.5rem;
    margin: 2rem 0;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: var(--muted, #B4C6E7);
  }
  
  code {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
  }
`;

function SubdomainLandingPage({ subdomain, config }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { slug } = useParams(); // Add useParams to get the slug
  const [homeData, setHomeData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // Professional icon mapping using Lucide React icons
  const getSubdomainIcon = (subdomain) => {
    const iconMap = {
      cooking: ChefHat,
      music: Music,
      fitness: Dumbbell,
      tech: Laptop,
      art: Palette,
      language: MessageCircle,
      business: Briefcase,
      design: Sparkles,
      writing: PenTool,
      photography: Camera,
      gardening: Sprout,
      crafts: Wrench,
      wellness: Heart
    };
    
    return iconMap[subdomain] || Target;
  };

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
          axios.get(`${process.env.REACT_APP_API_URL}/api/gurus/${subdomain}/home`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/gurus/news/${subdomain}`)
        ]);

        // Handle home data
        if (homeResponse.status === 'fulfilled') {
          setHomeData(homeResponse.value.data);
          
          // If slug is provided, find the post
          if (slug && homeResponse.value.data?.posts) {
            const post = homeResponse.value.data.posts.find(
              p => p.slug === slug || p.id === slug
            );
            setSelectedPost(post);
          }
        }

        // Handle news data  
        if (newsResponse.status === 'fulfilled') {
          setNewsData(newsResponse.value.data);
        }

        setLoading(false);
      } catch (err) {
        logger.error('Error fetching subdomain data:', err);
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
          window.location.href = 'https://yoohoo.guru/dashboard';
        } else {
          window.location.href = 'https://yoohoo.guru/signup';
        }
        break;
      case 'view-content':
        // Navigate to subdomain blog page (exists in routing)
        navigate('/blog');
        break;
      case 'book-session':
        window.location.href = `https://yoohoo.guru/skills?category=${config?.category}`;
        break;
      default:
        break;
    }
  };

  const handlePostClick = (post) => {
    // Handle external URLs (if article has a URL, use it)
    if (post.url && post.url !== '#') {
      window.open(post.url, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Otherwise navigate to blog page with slug or id
    const identifier = post.slug || post.id;
    if (identifier) {
      navigate(`/blog/${identifier}`);
    } else {
      logger.warn('Post missing slug and id:', post);
    }
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
  const IconComponent = getSubdomainIcon(subdomain);

  // If viewing a specific blog post
  if (selectedPost) {
    return (
      <PageContainer>
        <Helmet>
          <title>{selectedPost.title} - {subdomain}.yoohoo.guru</title>
          <meta name="description" content={selectedPost.excerpt || selectedPost.content?.substring(0, 155)} />
        </Helmet>
        
        <Container>
          <BackButton
            variant="outline"
            onClick={() => navigate(`/blog`)}
          >
            <ArrowLeft size={16} />
            Back to Blog
          </BackButton>
          
          <ArticleContainer>
            <ArticleHeader>
              {selectedPost.featured && (
                <div style={{ 
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  background: primaryColor,
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  marginBottom: '1rem'
                }}>
                  Featured
                </div>
              )}
              <ArticleTitle>{selectedPost.title}</ArticleTitle>
              <ArticleMeta>
                {selectedPost.author && (
                  <span>
                    <User size={16} />
                    {selectedPost.author}
                  </span>
                )}
                {selectedPost.publishedAt && (
                  <span>
                    <Calendar size={16} />
                    {new Date(selectedPost.publishedAt).toLocaleDateString()}
                  </span>
                )}
                {selectedPost.estimatedReadTime && (
                  <span>
                    <Clock size={16} />
                    {selectedPost.estimatedReadTime}
                  </span>
                )}
              </ArticleMeta>
            </ArticleHeader>
            
            <ArticleContent>
              {selectedPost.content ? (
                selectedPost.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return <h2 key={index}>{paragraph.replace('# ', '')}</h2>;
                  } else if (paragraph.startsWith('## ')) {
                    return <h2 key={index}>{paragraph.replace('## ', '')}</h2>;
                  } else if (paragraph.startsWith('### ')) {
                    return <h3 key={index}>{paragraph.replace('### ', '')}</h3>;
                  } else if (paragraph.startsWith('> ')) {
                    return <blockquote key={index}>{paragraph.replace('> ', '')}</blockquote>;
                  } else if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                    return (
                      <ul key={index}>
                        {items.map((item, i) => (
                          <li key={i}>{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  } else if (paragraph.trim() === '') {
                    return null;
                  } else {
                    return <p key={index}>{paragraph}</p>;
                  }
                })
              ) : (
                <p>{selectedPost.excerpt}</p>
              )}
            </ArticleContent>
          </ArticleContainer>
        </Container>
      </PageContainer>
    );
  }

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
      <HeroSection $primaryColor={primaryColor} $secondaryColor={secondaryColor}>
        <HeroContent>
          <DomainIcon>
            <IconComponent size={64} color={primaryColor} />
          </DomainIcon>
          <Title $primaryColor={primaryColor}>
            Master {subdomain.charAt(0).toUpperCase() + subdomain.slice(1)} Skills
          </Title>
          <Subtitle>
            Learn from certified professionals and advance your expertise
          </Subtitle>
          
          <SkillTags>
            {config?.primarySkills?.slice(0, 5).map((skill, index) => (
              <SkillTag key={index} $primaryColor={primaryColor}>
                {skill.replace('-', ' ')}
              </SkillTag>
            ))}
          </SkillTags>
          
          <ValueProposition>
            {generateValueProposition()}
          </ValueProposition>
          
          <CTAButtons>
            <Button 
              variant="primary"
              onClick={() => handleCTAClick('get-started')}
              style={{ backgroundColor: primaryColor }}
            >
              Get Started
            </Button>
            <Button 
              variant="secondary"
              onClick={() => handleCTAClick('view-content')}
            >
              View Learning Content
            </Button>
            <Button 
              variant="secondary"
              onClick={() => handleCTAClick('book-session')}
            >
              Book a Session
            </Button>
          </CTAButtons>
          
          {/* Platform Statistics */}
          {homeData?.stats && Object.keys(homeData.stats).length > 0 && (
            <StatsRow>
              {homeData.stats.totalPosts && (
                <StatItem $primaryColor={primaryColor}>
                  <div className="label">Learning Resources</div>
                  <div className="value">{homeData.stats.totalPosts}</div>
                </StatItem>
              )}
              {homeData.stats.totalViews && (
                <StatItem $primaryColor={primaryColor}>
                  <div className="label">Views</div>
                  <div className="value">{homeData.stats.totalViews}</div>
                </StatItem>
              )}
              {homeData.stats.monthlyVisitors && (
                <StatItem $primaryColor={primaryColor}>
                  <div className="label">Monthly Visitors</div>
                  <div className="value">{homeData.stats.monthlyVisitors}</div>
                </StatItem>
              )}
              {homeData.stats.totalLeads && (
                <StatItem $primaryColor={primaryColor}>
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
                <PostCard 
                  key={post.id || index} 
                  onClick={() => handlePostClick(post)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePostClick(post);
                    }
                  }}
                  tabIndex={0}
                  role="link"
                  aria-label={`Read article: ${post.title}`}
                >
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
                <NewsCard key={article.id || index} $primaryColor={primaryColor}>
                  <NewsTitle>
                    {article.url && article.url !== '#' ? (
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        {article.title}
                      </a>
                    ) : (
                      <span style={{ opacity: 0.9 }}>{article.title}</span>
                    )}
                  </NewsTitle>
                  <NewsSummary>{article.summary}</NewsSummary>
                  <NewsSource>
                    {article.source}
                    {(!article.url || article.url === '#') && (
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', opacity: 0.7 }}>
                        • Full article coming soon
                      </span>
                    )}
                  </NewsSource>
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
          <a href="https://yoohoo.guru/terms" className="link">Terms of Service</a>
          <a href="https://yoohoo.guru/privacy" className="link">Privacy Policy</a>
          <a href="https://yoohoo.guru/safety" className="link">Community Guidelines</a>
          <a href="https://yoohoo.guru/contact" className="link">Contact Us</a>
        </div>
        <div className="disclaimer">
          All service providers (gurus) are independent contractors and not employees of the platform.
        </div>
      </Footer>
    </PageContainer>
  );
}

export default SubdomainLandingPage;