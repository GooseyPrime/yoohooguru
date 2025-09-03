import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
  background: var(--light-gray);
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  padding: 3rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
`;

const Title = styled.h1`
  font-size: var(--text-4xl);
  margin-bottom: 1rem;
  color: var(--gray-900);
  text-align: center;
  border-bottom: 3px solid var(--primary);
  padding-bottom: 1rem;
`;

const LastUpdated = styled.p`
  text-align: center;
  color: var(--gray-600);
  font-style: italic;
  margin-bottom: 3rem;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;

  h2 {
    font-size: var(--text-2xl);
    margin-bottom: 1rem;
    color: var(--gray-900);
    border-left: 4px solid var(--primary);
    padding-left: 1rem;
  }

  h3 {
    font-size: var(--text-xl);
    margin-bottom: 0.75rem;
    color: var(--gray-800);
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
  return (
    <Container>
      <Content>
        <Title>Terms and Conditions</Title>
        <LastUpdated>Last updated: December 2024</LastUpdated>

        <Section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            Welcome to yoohoo.guru! These Terms and Conditions (&quot;Terms&quot;) govern your use of our neighborhood-based 
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
            yoohoo.guru is a platform that enables users to share skills, discover purpose, and create positive 
            community impact through neighborhood-based connections. Our services include:
          </p>
          <ul>
            <li>Skill-sharing marketplace connecting community members</li>
            <li>User profiles and skill discovery tools</li>
            <li>Communication and coordination features</li>
            <li>Community events and mentorship programs</li>
            <li>Safety and trust features</li>
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
            Skill exchanges occur directly between community members. yoohoo.guru facilitates connections but 
            is not a party to any agreements between users.
          </p>

          <h3>Your Responsibilities</h3>
          <ul>
            <li>Accurately represent your skills and availability</li>
            <li>Fulfill commitments made to other community members</li>
            <li>Respect others&apos; time and expertise</li>
            <li>Provide feedback and ratings honestly</li>
            <li>Report any issues or conflicts promptly</li>
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
            You retain ownership of content you post, but grant yoohoo.guru a license to use, display, and 
            distribute your content on the platform for the purpose of providing our services.
          </p>

          <h3>Platform Content</h3>
          <p>
            yoohoo.guru&apos;s platform, including design, features, and proprietary content, is protected by 
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
          <h2>9. Termination</h2>
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
          <h2>10. Disclaimers and Limitations</h2>
          <h3>Service Availability</h3>
          <p>
            We strive to maintain platform availability but cannot guarantee uninterrupted service. We may 
            temporarily suspend service for maintenance or updates.
          </p>

          <h3>User Interactions</h3>
          <p>
            yoohoo.guru is not responsible for the quality, safety, or legality of skills offered, 
            the truth of user profiles, or the performance of skill exchanges.
          </p>

          <h3>Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, yoohoo.guru shall not be liable for any indirect, 
            incidental, or consequential damages arising from your use of the platform.
          </p>
        </Section>

        <Section>
          <h2>11. Dispute Resolution</h2>
          <p>
            We encourage users to resolve disputes directly. If you have a dispute with another user or with 
            yoohoo.guru, please contact us first to seek resolution.
          </p>
        </Section>

        <Section>
          <h2>12. Changes to Terms</h2>
          <p>
            We may update these Terms periodically. Material changes will be communicated through the platform 
            or via email. Continued use after changes constitutes acceptance of the new Terms.
          </p>
        </Section>

        <Section>
          <h2>13. Governing Law</h2>
          <p>
            These Terms are governed by applicable local laws. Any disputes will be resolved in accordance 
            with the jurisdiction where yoohoo.guru is based.
          </p>
        </Section>

        <ContactInfo>
          <h3>Contact Us</h3>
          <p>If you have any questions about these Terms and Conditions, please contact us:</p>
          <p><strong>Email:</strong> legal@yoohoo.guru</p>
          <p><strong>Support:</strong> support@yoohoo.guru</p>
          <p><strong>Address:</strong> yoohoo.guru, Legal Department</p>
        </ContactInfo>
      </Content>
    </Container>
  );
}

export default TermsAndConditionsPage;