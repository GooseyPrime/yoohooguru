import React from 'react';
import styled from 'styled-components';
import SEOMetadata from '../components/SEOMetadata';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.bg};
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: ${props => props.theme.colors.surface};
  padding: 3rem;
  border-radius: var(--r-xl);
  box-shadow: ${props => props.theme.shadow.card};
  border: 1px solid ${props => props.theme.colors.border};
`;

const Title = styled.h1`
  font-size: var(--text-4xl);
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
  border-bottom: 3px solid ${props => props.theme.colors.pri};
  padding-bottom: 1rem;
`;

const LastUpdated = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.muted};
  font-style: italic;
  margin-bottom: 3rem;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;

  h2 {
    font-size: var(--text-2xl);
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text};
    border-left: 4px solid ${props => props.theme.colors.pri};
    padding-left: 1rem;
  }

  h3 {
    font-size: var(--text-xl);
    margin-bottom: 0.75rem;
    color: ${props => props.theme.colors.text};
    margin-top: 1.5rem;
  }

  p {
    color: ${props => props.theme.colors.muted};
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  ul {
    color: ${props => props.theme.colors.muted};
    line-height: 1.7;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

const ContactInfo = styled.div`
  background: var(--light-gray);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  margin-top: 2rem;
  text-align: center;

  h3 {
    color: var(--primary);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 0.5rem;
  }
`;

function PrivacyPolicyPage() {
  const seoData = {
    title: 'Privacy Policy - yoohoo.guru', 
    description: 'Learn how yoohoo.guru protects your privacy and handles your personal information on our skill-sharing platform.',
    keywords: 'privacy policy, data protection, personal information, yoohoo.guru',
    canonicalUrl: window.location.href
  };

  return (
    <Container>
      <SEOMetadata {...seoData} />
      <Content>
        <Title>Privacy Policy</Title>
        <LastUpdated>Last updated: December 2024</LastUpdated>

        <Section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you use our neighborhood-based skill-sharing platform.
          </p>
          <p>
            At {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'}, we believe in creating positive community impact through skill sharing while respecting your 
            privacy and maintaining the security of your personal information.
          </p>
        </Section>

        <Section>
          <h2>2. Information We Collect</h2>
          
          <h3>Personal Information</h3>
          <p>When you create an account or use our services, we may collect:</p>
          <ul>
            <li>Name, email address, and contact information</li>
            <li>Profile information, including skills, interests, and bio</li>
            <li>Geographic location (neighborhood/city level)</li>
            <li>Profile photos and other content you choose to share</li>
          </ul>

          <h3>Usage Information</h3>
          <p>We automatically collect certain information about your interaction with our platform:</p>
          <ul>
            <li>Log data, including IP address, browser type, and device information</li>
            <li>Usage patterns, including pages visited and features used</li>
            <li>Communication data from skill exchanges and platform interactions</li>
            <li>Subdomain activity (cooking.yoohoo.guru, tech.yoohoo.guru, etc.)</li>
            <li>Search queries and skill matching preferences</li>
            <li>Performance data and analytics for service improvement</li>
          </ul>

          <h3>Angel&apos;s List and Professional Services</h3>
          <p>For users providing professional services through Angel&apos;s List, we may also collect:</p>
          <ul>
            <li>Professional certifications and licenses</li>
            <li>Background check results (where applicable)</li>
            <li>Insurance information and policy details</li>
            <li>Business registration information</li>
            <li>Tax identification numbers for payment processing</li>
          </ul>
        </Section>

        <Section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our skill-sharing platform and specialized subdomains</li>
            <li>Connect you with other community members for skill exchanges and mentorships</li>
            <li>Enable AI-powered skill matching and recommendations</li>
            <li>Process payments and facilitate Angel&apos;s List professional services</li>
            <li>Verify credentials and conduct background checks for Angel&apos;s List providers</li>
            <li>Improve our services, develop new features, and enhance user experience</li>
            <li>Send you updates, notifications, community news, and relevant opportunities</li>
            <li>Ensure platform safety, prevent fraud, and investigate suspicious activity</li>
            <li>Provide customer support and resolve disputes</li>
            <li>Comply with legal obligations and regulatory requirements</li>
            <li>Generate analytics and insights to improve our matching algorithms</li>
          </ul>
        </Section>

        <Section>
          <h2>4. Information Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
          <ul>
            <li><strong>With Other Users:</strong> Your profile information and skills are visible to other community members based on your privacy settings</li>
            <li><strong>Subdomain Communities:</strong> Information may be shared across relevant specialized subdomains (e.g., cooking.yoohoo.guru)</li>
            <li><strong>Angel&apos;s List Verification:</strong> Professional credentials and verification status may be displayed to potential clients</li>
            <li><strong>Payment Processors:</strong> Financial information shared with Stripe and other payment providers for transaction processing</li>
            <li><strong>Service Providers:</strong> We may share information with trusted third-party services that help us operate our platform (Firebase, analytics providers, etc.)</li>
            <li><strong>AI Matching Services:</strong> Anonymized data used to improve our AI-powered skill matching algorithms</li>
            <li><strong>Background Check Providers:</strong> Information shared with certified background check services for Angel&apos;s List verification</li>
            <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety</li>
            <li><strong>Business Transfers:</strong> Information may be transferred in connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </Section>

        <Section>
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the 
            internet is 100% secure.
          </p>
        </Section>

        <Section>
          <h2>6. Your Rights and Choices</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access, update, or delete your personal information</li>
            <li>Control your profile visibility and communication preferences</li>
            <li>Opt out of promotional communications</li>
            <li>Request a copy of your data or account deletion</li>
            <li>Withdraw consent where applicable</li>
          </ul>
        </Section>

        <Section>
          <h2>7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide 
            personalized content. You can control cookie settings through your browser preferences.
          </p>
        </Section>

        <Section>
          <h2>8. Children&rsquo;s Privacy</h2>
          <p>
            Our platform is not intended for children under 13. We do not knowingly collect personal information from 
            children under 13. If we become aware of such collection, we will take steps to delete the information.
          </p>
        </Section>

        <Section>
          <h2>9. International Data Transfers</h2>
          <p>
            Your information may be processed in countries other than your own. We ensure appropriate safeguards are 
            in place when transferring personal information internationally.
          </p>
        </Section>

        <Section>
          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you of any material changes by posting the 
            new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </Section>

        <ContactInfo>
          <h3>Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <p><strong>Email:</strong> {process.env.REACT_APP_PRIVACY_EMAIL || 'privacy@yoohoo.guru'}</p>
          <p><strong>Address:</strong> {process.env.REACT_APP_CONTACT_ADDRESS || 'yoohoo.guru, Privacy Department'}</p>
        </ContactInfo>
      </Content>
    </Container>
  );
}

export default PrivacyPolicyPage;