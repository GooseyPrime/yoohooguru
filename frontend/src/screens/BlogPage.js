import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import SEOMetadata from '../components/SEOMetadata';
import Button from '../components/Button';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: var(--background);
  color: var(--text);
  min-height: 80vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text);
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BlogCard = styled.article`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
`;

const BlogImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  opacity: 0.8;
`;

const BlogTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text);
  line-height: 1.4;
`;

const BlogExcerpt = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ReadMoreLink = styled(Link)`
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ArticleContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ArticleHeader = styled.div`
  margin-bottom: 3rem;
  text-align: center;
`;

const ArticleTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text);
  line-height: 1.3;
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
`;

const ArticleContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text);
  
  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 2rem 0 1rem 0;
    color: var(--text);
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1.5rem 0 1rem 0;
    color: var(--text);
  }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  ul, ol {
    margin: 1rem 0;
    padding-left: 2rem;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
  
  blockquote {
    border-left: 4px solid var(--primary);
    padding: 1rem 1.5rem;
    margin: 2rem 0;
    background: var(--surface-secondary);
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: var(--text-secondary);
  }
`;

const BackButton = styled(Button)`
  margin-bottom: 2rem;
`;

// Sample blog posts data
const blogPosts = [
  {
    id: 'getting-started-skill-sharing',
    title: 'Getting Started with Skill Sharing: A Beginner\'s Guide',
    excerpt: 'Learn how to make the most of yoohoo.guru, from creating your profile to booking your first skill exchange session.',
    content: `
# Getting Started with Skill Sharing: A Beginner's Guide

Welcome to yoohoo.guru! Whether you're looking to learn new skills or share your expertise with others, our platform makes it easy to connect with your neighbors and build meaningful learning relationships.

## Creating Your Profile

Your profile is the foundation of your yoohoo.guru experience. Here's how to set yourself up for success:

### 1. Choose Skills to Share
Think about what you're genuinely good at and enjoy doing. This could be anything from:
- Cooking techniques you've mastered
- Musical instruments you play
- Technical skills from your profession
- Hobbies you're passionate about
- Languages you speak fluently

### 2. Identify Skills to Learn
Be specific about what you want to learn. Instead of "cooking," try "Italian pasta making" or "knife skills for beginners."

### 3. Set Your Availability
Be realistic about when you're available. It's better to offer fewer, consistent time slots than to overcommit.

## Making Your First Connection

Start small! Look for skills that genuinely interest you and reach out to people whose teaching style seems like a good fit.

> "The best skill exchanges happen when both people are genuinely excited about what they're sharing and learning." - Community Member

## Tips for Success

- **Be patient**: Great skill exchanges take time to develop
- **Communicate clearly**: Set expectations upfront
- **Show up prepared**: Come ready to learn and teach
- **Give feedback**: Help make the community better for everyone

Ready to get started? [Create your profile](/signup) and join thousands of neighbors already sharing skills!
    `,
    author: 'yoohoo.guru Team',
    date: '2024-01-15',
    readTime: '5 min read',
    emoji: '🌟'
  },
  {
    id: 'building-stronger-communities',
    title: 'Building Stronger Communities Through Skill Sharing',
    excerpt: 'Discover how neighborhoods across the country are using skill sharing to create more connected, resilient communities.',
    content: `
# Building Stronger Communities Through Skill Sharing

In an era of increasing digital connection but decreasing local relationships, skill sharing offers a unique opportunity to rebuild the social fabric of our neighborhoods.

## The Community Connection Crisis

Research shows that fewer Americans know their neighbors than ever before. Yet studies consistently demonstrate that strong local connections lead to:
- Increased happiness and life satisfaction
- Better mental and physical health
- More resilient communities during crises
- Stronger local economies

## How Skill Sharing Changes Everything

When Maria taught her neighbor Tom how to grow tomatoes, something magical happened. Tom not only learned gardening—he discovered a passion he never knew he had. Now he tends a community garden that feeds dozens of families.

This isn't unusual. Skill sharing creates ripple effects that transform entire neighborhoods.

## Success Stories from Our Community

### The Johnson City Maker Network
What started as one person teaching 3D printing has grown into a network of 50+ makers sharing everything from electronics to woodworking.

### The Portland Cooking Circle
A group of neighbors teaching each other family recipes has preserved cultural traditions and created lasting friendships across generational and cultural lines.

### The Austin Language Exchange
Spanish, Mandarin, and ASL learners gathering weekly have created an inclusive community where everyone has something to teach and learn.

## Getting Started in Your Neighborhood

1. **Start small**: Offer to teach one skill to one neighbor
2. **Be consistent**: Regular meetups build stronger bonds
3. **Include everyone**: The most successful exchanges welcome all skill levels
4. **Document the journey**: Share your successes to inspire others

The future of strong communities isn't built by technology—it's built by neighbors helping neighbors learn, grow, and thrive together.
    `,
    author: 'Community Team',
    date: '2024-01-20',
    readTime: '7 min read',
    emoji: '🏘️'
  },
  {
    id: 'ai-coaching-revolution',
    title: 'The AI Coaching Revolution: Personalized Learning for Everyone',
    excerpt: 'Learn how our AI coaching system adapts to your learning style and helps you master new skills more effectively.',
    content: `
# The AI Coaching Revolution: Personalized Learning for Everyone

Learning isn't one-size-fits-all. Some people learn by doing, others by watching, and still others through detailed explanations. Our AI coaching system recognizes this and adapts to help every learner succeed.

## How AI Coaching Works

Our system analyzes three key factors:
1. **Learning preferences**: How you best absorb new information
2. **Skill progression**: Your current level and optimal next steps  
3. **Teaching compatibility**: Matching you with instructors whose style fits your needs

## The Science Behind Personalized Learning

Research in cognitive science shows that personalized learning approaches can improve skill acquisition by up to 40%. Our AI uses this research to:

### Identify Learning Patterns
- Visual learners get more demonstrations and diagrams
- Kinesthetic learners get hands-on practice immediately
- Auditory learners receive detailed verbal explanations

### Optimize Practice Sessions
- Break complex skills into manageable chunks
- Suggest practice schedules based on memory consolidation research
- Identify when you're ready for the next challenge level

### Prevent Learning Plateaus
- Recognize when progress stalls
- Suggest alternative approaches or different instructors
- Recommend complementary skills to maintain momentum

## Real Results from Our Beta Users

**Sarah (Guitar Student)**: "The AI noticed I was struggling with chord transitions and suggested a fingering exercise sequence that made everything click."

**Marcus (Cooking Teacher)**: "It helped me understand that my student learns better with visual cues than verbal instructions. Now our sessions are so much more effective."

**Jennifer (Language Learner)**: "The system identified that I learn vocabulary better through context than memorization, and adjusted my lessons accordingly."

## The Future of Skill Sharing

AI coaching is just the beginning. We're working on features that will:
- Predict which skills you'll want to learn next
- Suggest optimal learning paths for complex skill combinations
- Connect you with the perfect learning community for your goals

Ready to experience personalized learning? [Join our beta program](/signup) and see how AI can accelerate your skill development!
    `,
    author: 'AI Development Team',
    date: '2024-01-25',
    readTime: '6 min read',
    emoji: '🤖'
  },
  {
    id: 'modified-masters-impact',
    title: 'Modified Masters: Inclusive Skills for Every Ability',
    excerpt: 'Discover how our Modified Masters program is making skill sharing accessible to people with disabilities and creating more inclusive communities.',
    content: `
# Modified Masters: Inclusive Skills for Every Ability

Skills don't discriminate, and neither should skill sharing. Our Modified Masters program ensures that everyone, regardless of ability, can participate fully in learning and teaching.

## The Accessibility Challenge

Traditional skill sharing often overlooks the unique needs of people with disabilities. This exclusion means communities miss out on incredible talents and perspectives.

## Our Inclusive Approach

Modified Masters adapts skill sharing through:

### Universal Design Principles
- Sessions designed to work for the widest range of abilities
- Multiple ways to participate in every activity
- Flexible pacing and alternative methods

### Assistive Technology Integration
- Screen readers and voice control support
- Visual aids for hearing-impaired participants
- Adaptive tools for physical limitations

### Community-Centered Support
- Peer mentorship programs
- Accessibility advocates in every neighborhood
- Continuous feedback to improve our platform

## Inspiring Success Stories

**David teaches coding using voice recognition**: After losing mobility in his hands, David developed innovative ways to program using voice commands. Now he teaches these techniques to others.

**Maria's accessible cooking classes**: Born with limited vision, Maria teaches cooking through touch, smell, and taste—creating incredibly rich learning experiences for all her students.

**The Johnson family's sign language circle**: What started as ASL lessons has become a multilingual skill exchange bringing together deaf and hearing community members.

## Impact Beyond Individual Skills

Modified Masters creates ripple effects:
- Employers discover untapped talent
- Communities become more welcoming and accessible
- Stereotypes about disability are replaced with recognition of capability
- Innovation increases as diverse perspectives solve problems

## Join the Movement

Whether you're a person with disabilities looking to share your skills, or someone wanting to learn from diverse teachers, Modified Masters welcomes you.

> "The best teachers are often those who've had to find creative solutions. Disability often breeds the most innovative approaches to learning." - Program Participant

Ready to be part of inclusive skill sharing? [Learn more about Modified Masters](/modified) and discover how diverse abilities create stronger communities.
    `,
    author: 'Accessibility Team',
    date: '2024-02-01',
    readTime: '8 min read',
    emoji: '♿'
  }
];

function BlogPage() {
  const { slug } = useParams();
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (slug) {
      const post = blogPosts.find(p => p.id === slug);
      setSelectedPost(post);
    } else {
      setSelectedPost(null);
    }
  }, [slug]);

  // If viewing a specific article
  if (selectedPost) {
    return (
      <PageContainer>
        <SEOMetadata
          title={`${selectedPost.title} - yoohoo.guru Blog`}
          description={selectedPost.excerpt}
          ogType="article"
        />
        
        <BackButton 
          variant="outline" 
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={16} />
          Back to Blog
        </BackButton>
        
        <ArticleContainer>
          <ArticleHeader>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {selectedPost.emoji}
            </div>
            <ArticleTitle>{selectedPost.title}</ArticleTitle>
            <ArticleMeta>
              <MetaItem>
                <User />
                {selectedPost.author}
              </MetaItem>
              <MetaItem>
                <Calendar />
                {new Date(selectedPost.date).toLocaleDateString()}
              </MetaItem>
              <MetaItem>
                <Clock />
                {selectedPost.readTime}
              </MetaItem>
            </ArticleMeta>
          </ArticleHeader>
          
          <ArticleContent>
            {selectedPost.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return <h2 key={index}>{paragraph.replace('# ', '')}</h2>;
              } else if (paragraph.startsWith('## ')) {
                return <h2 key={index}>{paragraph.replace('## ', '')}</h2>;
              } else if (paragraph.startsWith('### ')) {
                return <h3 key={index}>{paragraph.replace('### ', '')}</h3>;
              } else if (paragraph.startsWith('> ')) {
                return <blockquote key={index}>{paragraph.replace('> ', '')}</blockquote>;
              } else if (paragraph.trim() === '') {
                return null;
              } else {
                return <p key={index}>{paragraph}</p>;
              }
            })}
          </ArticleContent>
        </ArticleContainer>
      </PageContainer>
    );
  }

  // Blog listing page
  return (
    <PageContainer>
      <SEOMetadata
        title="Blog - yoohoo.guru"
        description="Discover stories, tips, and insights from our community of skill sharers. Learn how to make the most of skill sharing and build stronger communities."
        ogType="website"
      />
      
      <Header>
        <Title>yoohoo.guru Blog</Title>
        <Subtitle>
          Discover stories, tips, and insights from our community of skill sharers. 
          Learn how to make the most of skill sharing and build stronger communities.
        </Subtitle>
      </Header>

      <BlogGrid>
        {blogPosts.map((post) => (
          <BlogCard key={post.id}>
            <BlogImage>
              {post.emoji}
            </BlogImage>
            <BlogTitle>{post.title}</BlogTitle>
            <BlogMeta>
              <MetaItem>
                <User />
                {post.author}
              </MetaItem>
              <MetaItem>
                <Calendar />
                {new Date(post.date).toLocaleDateString()}
              </MetaItem>
              <MetaItem>
                <Clock />
                {post.readTime}
              </MetaItem>
            </BlogMeta>
            <BlogExcerpt>{post.excerpt}</BlogExcerpt>
            <ReadMoreLink to={`/blog/${post.id}`}>
              Read More →
            </ReadMoreLink>
          </BlogCard>
        ))}
      </BlogGrid>
    </PageContainer>
  );
}

export default BlogPage;