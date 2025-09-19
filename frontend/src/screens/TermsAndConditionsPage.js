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
    color: var(--gray-700);
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  ul {
    color: var(--gray-700);
    line-height: 1.7;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

const HighlightBox = styled.div`
  background: var(--light-gray);
  border-left: 4px solid var(--growth-green);
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-radius: var(--radius-lg);

  p {
    margin-bottom: 0;
    font-weight: var(--font-medium);
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

function TermsAndConditionsPage() {
  const seoData = {
    title: 'Terms and Conditions - yoohoo.guru',
    description: 'Read our Terms and Conditions for using the yoohoo.guru skill-sharing platform. Understand your rights and responsibilities as a community member.',
    keywords: 'terms, conditions, legal, agreements, yoohoo.guru, skill sharing',
    canonicalUrl: window.location.href
  };

  return (
    <Container>
      <SEOMetadata {...seoData} />
      <Content>
        <Title>Terms and Conditions</Title>
        <LastUpdated>Last updated: December 2024</LastUpdated>

        <Section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            Welcome to {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'}! These Terms and Conditions (&quot;Terms&quot;) govern your use of our neighborhood-based 
            skill-sharing platform. By accessing or using our services, you agree to be bound by these Terms.
          </p>
          <HighlightBox>
            <p>
              If you do not agree with any part of these Terms, please do not use our platform.
            </p>
          </HighlightBox>
        </Section>

        <Section>
          <h2>2. Description of Service</h2>
          <p>
            {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} is a comprehensive neighborhood-based skill-sharing platform that enables users to share skills, discover purpose, and create exponential 
            community impact through local connections. Our services include:
          </p>
          <ul>
            <li><strong>Skill-sharing marketplace</strong> - Connect with community members to teach or learn skills</li>
            <li><strong>Guru dashboard</strong> - Tools for teachers and coaches to manage their offerings</li>
            <li><strong>Angel's List</strong> - Service marketplace for professional services</li>
            <li><strong>Specialized subdomains</strong> - Domain-specific communities (cooking.yoohoo.guru, tech.yoohoo.guru, etc.)</li>
            <li><strong>User profiles and skill discovery</strong> - Advanced matching and discovery tools</li>
            <li><strong>Communication and coordination features</strong> - Safe messaging and scheduling</li>
            <li><strong>Community events and mentorship programs</strong> - Local workshops and ongoing mentorships</li>
            <li><strong>Safety and trust features</strong> - Background checks, ratings, and verification systems</li>
            <li><strong>Premium features</strong> - Enhanced tools for professional skill providers</li>
          </ul>
        </Section>

        <Section>
          <h2>3. User Accounts and Registration</h2>
          <h3>Account Creation</h3>
          <p>To use our platform, you must:</p>
          <ul>
            <li>Be at least 13 years old (or the minimum age in your jurisdiction)</li>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>

          <h3>Account Responsibilities</h3>
          <p>You agree to:</p>
          <ul>
            <li>Keep your profile information current and accurate</li>
            <li>Not share your account with others</li>
            <li>Notify us immediately of any unauthorized use</li>
            <li>Be responsible for all activities on your account</li>
          </ul>
        </Section>

        <Section>
          <h2>4. Skill Sharing and Exchanges</h2>
          <h3>User-to-User Transactions</h3>
          <p>
            Skill exchanges occur directly between community members. {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} facilitates connections but 
            is not a party to any agreements between users. We provide the platform infrastructure including specialized subdomains, 
            Guru dashboards, and the Angel's List marketplace.
          </p>

          <h3>Types of Exchanges</h3>
          <ul>
            <li><strong>Skill Swaps:</strong> Direct exchanges where members teach each other different skills</li>
            <li><strong>Paid Services:</strong> Professional services offered through the Angel's List marketplace</li>
            <li><strong>Mentorship Programs:</strong> Ongoing learning relationships between experienced gurus and understudies</li>
            <li><strong>Community Workshops:</strong> Group learning sessions and events</li>
            <li><strong>Subdomain Specializations:</strong> Category-specific exchanges on dedicated subdomains</li>
          </ul>

          <h3>Your Responsibilities</h3>
          <ul>
            <li>Accurately represent your skills, qualifications, and availability</li>
            <li>Maintain appropriate certifications for professional services on Angel's List</li>
            <li>Fulfill commitments made to other community members</li>
            <li>Respect others&apos; time, expertise, and property</li>
            <li>Provide honest feedback and ratings after exchanges</li>
            <li>Report any issues, conflicts, or safety concerns promptly</li>
            <li>Follow subdomain-specific guidelines and community standards</li>
          </ul>
        </Section>

        <Section>
          <h2>5. Community Guidelines and Conduct</h2>
          <p>To maintain a positive and safe community, you agree NOT to:</p>
          <ul>
            <li>Harass, discriminate against, or harm other users</li>
            <li>Post false, misleading, or inappropriate content</li>
            <li>Spam or send unsolicited communications</li>
            <li>Violate any laws or regulations</li>
            <li>Impersonate others or create fake accounts</li>
            <li>Share inappropriate or offensive content</li>
            <li>Attempt to circumvent platform safety measures</li>
          </ul>
        </Section>

        <Section>
          <h2>6. Content and Intellectual Property</h2>
          <h3>Your Content</h3>
          <p>
            You retain ownership of content you post, but grant {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} a license to use, display, and 
            distribute your content on the platform for the purpose of providing our services.
          </p>

          <h3>Platform Content</h3>
          <p>
            {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'}&apos;s platform, including design, features, and proprietary content, is protected by 
            intellectual property laws and remains our property.
          </p>
        </Section>

        <Section>
          <h2>7. Safety and Security</h2>
          <HighlightBox>
            <p>
              Your safety is important to us. Always exercise caution when meeting community members and 
              report any concerns immediately.
            </p>
          </HighlightBox>
          
          <h3>Safety Guidelines</h3>
          <ul>
            <li>Meet new community members in public places when possible</li>
            <li>Trust your instincts and report suspicious behavior</li>
            <li>Keep personal information private until you feel comfortable</li>
            <li>Use platform communication features when possible</li>
          </ul>
        </Section>

        <Section>
          <h2>8. Privacy and Data Protection</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, 
            use, and protect your information. By using our services, you consent to our privacy practices.
          </p>
        </Section>

        <Section>
          <h2>9. Platform-Specific Features</h2>
          <h3>Specialized Subdomains</h3>
          <p>
            Our platform includes specialized subdomains (e.g., cooking.yoohoo.guru, tech.yoohoo.guru) that provide 
            category-specific experiences. Each subdomain maintains the same core safety and community standards 
            while offering specialized tools and content for that skill area.
          </p>

          <h3>Angel's List Marketplace</h3>
          <p>
            The Angel's List is our professional services marketplace where certified providers offer premium services. 
            Participation requires additional verification and may involve background checks, insurance requirements, 
            and professional certifications depending on the service category.
          </p>

          <h3>Guru Dashboard and Premium Features</h3>
          <p>
            Certified Gurus gain access to enhanced dashboard features including analytics, advanced scheduling, 
            priority support, and promotional tools. Premium features may require subscription fees and additional 
            terms of service.
          </p>

          <h3>AI-Powered Matching</h3>
          <p>
            Our platform uses AI algorithms to suggest skill matches and learning opportunities. While we strive for 
            accuracy, you are responsible for evaluating the suitability of suggested matches and making your own 
            decisions about skill exchanges.
          </p>
        </Section>

        <Section>
          <h2>10. Termination</h2>
          <h3>By You</h3>
          <p>You may delete your account at any time through your account settings.</p>

          <h3>By Us</h3>
          <p>We may suspend or terminate your account if you:</p>
          <ul>
            <li>Violate these Terms or our Community Guidelines</li>
            <li>Engage in fraudulent or illegal activities</li>
            <li>Harm the platform or other users</li>
            <li>Remain inactive for an extended period</li>
          </ul>
        </Section>

        <Section>
          <h2>11. Disclaimers and Limitations</h2>
          <h3>Service Availability</h3>
          <p>
            We strive to maintain platform availability but cannot guarantee uninterrupted service. We may 
            temporarily suspend service for maintenance or updates.
          </p>

          <h3>User Interactions and Skill-Sharing Activities</h3>
          <p>

            {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} is not responsible for the quality, safety, or legality of skills offered, 
            the truth of user profiles, or the performance of skill exchanges. Users participate in 
            skill-sharing activities at their own risk and responsibility.
          </p>

          <HighlightBox>
            <p>
              <strong>Important:</strong> Skill-sharing activities may involve inherent risks including but not 
              limited to physical injury, property damage, financial loss, or personal harm. Users must 
              exercise their own judgment and take appropriate precautions.
            </p>
          </HighlightBox>

          <h3>Assumption of Risk</h3>
          <p>
            By using our platform and participating in skill exchanges, you expressly acknowledge and agree that:
          </p>
          <ul>
            <li>You understand the risks associated with skill-sharing activities</li>
            <li>You voluntarily assume all risks of injury, damage, or loss</li>
            <li>You are responsible for your own safety and well-being</li>
            <li>You will exercise proper caution and follow safety guidelines</li>
            <li>You have adequate insurance coverage for your activities</li>
          </ul>

          <h3>Release of Claims</h3>
          <p>
            You hereby release, waive, discharge, and hold harmless {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'}, its officers, 
            directors, employees, agents, and affiliates from any and all liability, claims, demands, 
            actions, or causes of action arising out of or related to:
          </p>
          <ul>
            <li>Your participation in skill-sharing activities</li>
            <li>Interactions with other users</li>
            <li>Any injury, damage, or loss during skill exchanges</li>
            <li>The conduct or actions of other platform users</li>
            <li>Equipment, tools, or materials used during skill exchanges</li>
          </ul>

          <h3>Indemnification</h3>
          <p>
            You agree to indemnify, defend, and hold harmless {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} from and against any 
            and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable 
            attorney fees) arising from or relating to:
          </p>
          <ul>
            <li>Your use of the platform or participation in skill exchanges</li>
            <li>Your violation of these Terms or applicable laws</li>
            <li>Your infringement of any third-party rights</li>
            <li>Any injury or damage caused by your actions or negligence</li>
          </ul>

          <h3>Property Damage Disclaimer</h3>
          <p>
            {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} is not responsible for any damage to personal property, real estate, 
            or belongings that may occur during skill exchanges. Users are responsible for ensuring 
            appropriate insurance coverage and taking necessary precautions to protect their property.
          </p>

          <h3>Limitation of Liability</h3>
          <p>

            To the maximum extent permitted by law, {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'}&apos;s total liability to you for 
            all damages, losses, and causes of action (whether in contract, tort, or otherwise) 
            shall not exceed the amount you have paid to {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} in the twelve (12) months 
            preceding the claim. In no event shall {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} be liable for:
          </p>
          <ul>
            <li>Indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, revenues, data, or business opportunities</li>
            <li>Personal injury or property damage arising from skill exchanges</li>
            <li>Actions or omissions of other users</li>
            <li>Force majeure events beyond our reasonable control</li>
          </ul>

          <h3>No Warranty</h3>
          <p>
            The platform and all services are provided &quot;as is&quot; and &quot;as available&quot; without warranties 
            of any kind, either express or implied, including but not limited to warranties of 
            merchantability, fitness for a particular purpose, or non-infringement.
          </p>
        </Section>

        <Section>
          <h2>12. Dispute Resolution</h2>
          <p>
            We encourage users to resolve disputes directly. If you have a dispute with another user or with 
            {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'}, please contact us first to seek resolution.
          </p>
        </Section>

        <Section>
          <h2>13. Changes to Terms</h2>
          <p>
            We may update these Terms periodically. Material changes will be communicated through the platform 
            or via email. Continued use after changes constitutes acceptance of the new Terms.
          </p>
        </Section>

        <Section>
          <h2>14. Governing Law</h2>
          <p>
            These Terms are governed by applicable local laws. Any disputes will be resolved in accordance 
            with the jurisdiction where {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} is based.
          </p>
        </Section>

        <ContactInfo>
          <h3>Contact Us</h3>
          <p>If you have any questions about these Terms and Conditions, please contact us:</p>
          <p><strong>Email:</strong> {process.env.REACT_APP_LEGAL_EMAIL || 'legal@yoohoo.guru'}</p>
          <p><strong>Support:</strong> {process.env.REACT_APP_SUPPORT_EMAIL || 'support@yoohoo.guru'}</p>
          <p><strong>Address:</strong> {process.env.REACT_APP_CONTACT_ADDRESS || 'yoohoo.guru, Legal Department'}</p>
        </ContactInfo>
      </Content>
    </Container>
  );
}

export default TermsAndConditionsPage;