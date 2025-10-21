import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.bg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  max-width: 600px;
  text-align: center;
  padding: 3rem 2rem;
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-lg);
  border: 1px solid ${props => props.theme.colors.border};
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const Description = styled.p`
  font-size: var(--text-lg);
  color: ${props => props.theme.colors.muted};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ComingSoonBadge = styled.div`
  display: inline-block;
  background: ${props => props.theme.colors.pri};
  color: ${props => props.theme.colors.bg};
  padding: 0.5rem 1rem;
  border-radius: var(--r-md);
  font-size: var(--text-sm);
  font-weight: 600;
  margin-bottom: 2rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  text-align: left;
  margin: 2rem 0;
  
  li {
    padding: 0.75rem 0;
    color: ${props => props.theme.colors.muted};
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    &:before {
      content: "→";
      color: ${props => props.theme.colors.pri};
      font-weight: bold;
    }
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.pri};
  color: white;
  text-decoration: none;
  border-radius: var(--r-md);
  font-weight: 500;
  transition: all var(--t-fast);
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.pri}dd;
    transform: translateY(-1px);
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

function ComingSoonPage({ title, description, features = [], showBackButton = true, alternativeLinks = [] }) {
  return (
    <Container>
      <Content>
        <ComingSoonBadge>Coming Soon</ComingSoonBadge>
        <Title>{title}</Title>
        <Description>{description}</Description>
        
        {features.length > 0 && (
          <FeatureList>
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </FeatureList>
        )}
        
        <Description style={{ fontSize: 'var(--text-base)', marginTop: '2rem' }}>
          We&apos;re working hard to bring you this feature. Check back soon!
        </Description>

        <NavigationButtons>
          {showBackButton && (
            <BackButton to="/">
              <ArrowLeft size={16} />
              Back to Home
            </BackButton>
          )}
          {alternativeLinks.map((link, index) => (
            <BackButton key={index} to={link.to}>
              {link.text}
            </BackButton>
          ))}
        </NavigationButtons>
      </Content>
    </Container>
  );
}

// Individual pages
export function HelpCenterPage() {
  return (
    <ComingSoonPage
      title="Help Center"
      description="Get answers to your questions and learn how to make the most of yoohoo.guru."
      features={[
        "Comprehensive FAQ section",
        "Step-by-step tutorials",
        "Video guides and walkthroughs",
        "Troubleshooting assistance",
        "Community support forum"
      ]}
      alternativeLinks={[
        { to: "/contact", text: "Contact Us" },
        { to: "/about", text: "About Us" }
      ]}
    />
  );
}

export function ContactUsPage() {
  return (
    <ComingSoonPage
      title="Contact Us"
      description="Reach out to our support team for help, feedback, or partnership opportunities."
      features={[
        "Live chat support",
        "Email support system",
        "Phone support hours",
        "Bug reporting system",
        "Feature request portal"
      ]}
      alternativeLinks={[
        { to: "/help", text: "Help Center" },
        { to: "/about", text: "About Us" }
      ]}
    />
  );
}

export function SafetyPage() {
  return (
    <ComingSoonPage
      title="Safety & Trust"
      description="Learn about our safety measures and trust features that protect our community."
      features={[
        "Background check verification",
        "User rating and review system",
        "Safety guidelines and best practices",
        "Incident reporting tools",
        "Insurance coverage information"
      ]}
      alternativeLinks={[
        { to: "/how-it-works", text: "How It Works" },
        { to: "/about", text: "About Us" }
      ]}
    />
  );
}

export function BlogPage() {
  return (
    <ComingSoonPage
      title="Blog"
      description="Discover stories, tips, and insights from our community of skill sharers."
      features={[
        "Success stories from members",
        "Skill-sharing tips and tricks",
        "Community highlights",
        "Expert guest posts",
        "Platform updates and news"
      ]}
      alternativeLinks={[
        { to: "/success-stories", text: "Success Stories" },
        { to: "/about", text: "About Us" }
      ]}
    />
  );
}

export function SuccessStoriesPage() {
  return (
    <ComingSoonPage
      title="Success Stories"
      description="Read inspiring stories from community members who've transformed their lives through skill sharing."
      features={[
        "Member transformation stories",
        "Before and after journeys",
        "Community impact highlights",
        "Skill mastery celebrations",
        "Neighborhood improvement tales"
      ]}
      alternativeLinks={[
        { to: "/blog", text: "Blog" },
        { to: "/events", text: "Community Events" }
      ]}
    />
  );
}

export function EventsPage() {
  return (
    <ComingSoonPage
      title="Community Events"
      description="Join local meetups, workshops, and skill-sharing events in your area."
      features={[
        "Local skill-sharing meetups",
        "Virtual learning workshops",
        "Community project events",
        "Networking opportunities",
        "Seasonal celebrations"
      ]}
      alternativeLinks={[
        { to: "/forum", text: "Discussion Forum" },
        { to: "/success-stories", text: "Success Stories" }
      ]}
    />
  );
}

export function ForumPage() {
  return (
    <ComingSoonPage
      title="Discussion Forum"
      description="Connect with fellow community members, ask questions, and share knowledge."
      features={[
        "Category-based discussions",
        "Q&A with experts",
        "Skill-specific communities",
        "Local area groups",
        "Mentorship connections"
      ]}
      alternativeLinks={[
        { to: "/events", text: "Community Events" },
        { to: "/mentorship", text: "Mentorship Program" }
      ]}
    />
  );
}

export function MentorshipPage() {
  return (
    <ComingSoonPage
      title="Mentorship Program"
      description="Connect with experienced mentors or become a mentor to help others grow."
      features={[
        "One-on-one mentorship matching",
        "Group mentorship programs",
        "Skill-based mentor networks",
        "Progress tracking tools",
        "Recognition and rewards system"
      ]}
      alternativeLinks={[
        { to: "/forum", text: "Discussion Forum" },
        { to: "/skills", text: "Browse Skills" }
      ]}
    />
  );
}

export default ComingSoonPage;