import { Header, Footer } from '@yoohooguru/shared'
import Head from 'next/head'
import styled from 'styled-components'
import Seo from '../components/Seo';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 3rem;
  margin-bottom: 2rem;
`

const Title = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
`

const LastUpdated = styled.p`
  color: #b0b0b0;
  text-align: center;
  margin-bottom: 2rem;
  font-style: italic;
`

const SectionTitle = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  margin: 2rem 0 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
`

const SubSectionTitle = styled.h3`
  color: #ffffff;
  font-size: 1.25rem;
  margin: 1.5rem 0 0.75rem 0;
`

const Paragraph = styled.p`
  color: #d0d0d0;
  line-height: 1.6;
  margin-bottom: 1rem;
`

const List = styled.ul`
  color: #d0d0d0;
  line-height: 1.6;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
`

const ListItem = styled.li`
  margin-bottom: 0.5rem;
`

const ContactInfo = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin: 2rem 0;
`

const ContactTitle = styled.h4`
  color: #667eea;
  margin-bottom: 0.75rem;
`

const ContactDetails = styled.p`
  color: #d0d0d0;
  margin: 0.25rem 0;
`

export default function Privacy() {
  return (
    <Container>
      <Seo
        title="Privacy Policy - YooHoo.Guru"
        description="Learn how YooHoo.Guru protects your privacy and handles your personal information."
        url="https://www.yoohoo.guru/privacy"
        image="https://www.yoohoo.guru/assets/og-privacy.jpg"
      />

      <Header />

      <Main>
        <ContentCard>
          <Title>Privacy Policy</Title>
          <LastUpdated>Last updated: October 22, 2025</LastUpdated>

          <SectionTitle>1. Introduction</SectionTitle>
          <Paragraph>
            Welcome to YooHoo.Guru (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and personal information.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
            skill-sharing platform and community marketplace.
          </Paragraph>

          <SectionTitle>2. Information We Collect</SectionTitle>
          
          <SubSectionTitle>2.1 Personal Information</SubSectionTitle>
          <Paragraph>We may collect the following personal information:</Paragraph>
          <List>
            <ListItem>Name and email address (via Google OAuth)</ListItem>
            <ListItem>Profile picture (via Google OAuth)</ListItem>
            <ListItem>Skills, expertise, and learning interests</ListItem>
            <ListItem>Contact preferences and communication history</ListItem>
            <ListItem>Payment information (processed securely through Stripe)</ListItem>
          </List>

          <SubSectionTitle>2.2 Usage Information</SubSectionTitle>
          <Paragraph>We automatically collect certain information about your use of our platform:</Paragraph>
          <List>
            <ListItem>Log data including IP address, browser type, and device information</ListItem>
            <ListItem>Pages visited, time spent on pages, and navigation patterns</ListItem>
            <ListItem>Search queries and platform interactions</ListItem>
            <ListItem>Performance analytics and error reports</ListItem>
          </List>

          <SectionTitle>3. How We Use Your Information</SectionTitle>
          <Paragraph>We use your information to:</Paragraph>
          <List>
            <ListItem>Provide and maintain our skill-sharing platform</ListItem>
            <ListItem>Authenticate your account and ensure platform security</ListItem>
            <ListItem>Match you with relevant skills, teachers, and learning opportunities</ListItem>
            <ListItem>Process payments and transactions</ListItem>
            <ListItem>Send important platform updates and communications</ListItem>
            <ListItem>Improve our services through analytics and user feedback</ListItem>
            <ListItem>Prevent fraud and ensure platform safety</ListItem>
          </List>

          <SectionTitle>4. Information Sharing</SectionTitle>
          <Paragraph>We do not sell your personal information. We may share your information in the following circumstances:</Paragraph>
          <List>
            <ListItem><strong>With other users:</strong> Your profile information and skills may be visible to other platform members</ListItem>
            <ListItem><strong>Service providers:</strong> We work with trusted third parties (Google, Stripe, Firebase) to provide our services</ListItem>
            <ListItem><strong>Legal compliance:</strong> When required by law or to protect our rights and safety</ListItem>
            <ListItem><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets</ListItem>
          </List>

          <SectionTitle>5. Data Security</SectionTitle>
          <Paragraph>
            We implement appropriate technical and organizational security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure data transmission, 
            and regular security assessments.
          </Paragraph>

          <SectionTitle>6. Your Rights and Choices</SectionTitle>
          <Paragraph>You have the right to:</Paragraph>
          <List>
            <ListItem>Access, update, or delete your personal information</ListItem>
            <ListItem>Opt out of marketing communications</ListItem>
            <ListItem>Request data portability</ListItem>
            <ListItem>Object to certain data processing activities</ListItem>
            <ListItem>Withdraw consent where processing is based on consent</ListItem>
          </List>

          <SectionTitle>7. Cookies and Tracking</SectionTitle>
          <Paragraph>
            We use cookies and similar technologies to enhance your experience, analyze platform usage, and provide personalized content. 
            You can control cookie preferences through your browser settings.
          </Paragraph>

          <SectionTitle>8. Third-Party Services</SectionTitle>
          <Paragraph>Our platform integrates with third-party services:</Paragraph>
          <List>
            <ListItem><strong>Google OAuth:</strong> For secure authentication</ListItem>
            <ListItem><strong>Stripe:</strong> For payment processing</ListItem>
            <ListItem><strong>Firebase:</strong> For data storage and real-time features</ListItem>
            <ListItem><strong>Vercel Analytics:</strong> For platform performance monitoring</ListItem>
          </List>

          <SectionTitle>9. Children&apos;s Privacy</SectionTitle>
          <Paragraph>
            Our platform is not intended for children under 13. We do not knowingly collect personal information from children under 13. 
            If you believe we have collected such information, please contact us immediately.
          </Paragraph>

          <SectionTitle>10. International Data Transfers</SectionTitle>
          <Paragraph>
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards 
            are in place to protect your information during such transfers.
          </Paragraph>

          <SectionTitle>11. Changes to This Policy</SectionTitle>
          <Paragraph>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new
            Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </Paragraph>

          <SectionTitle>12. Contact Us</SectionTitle>
          <ContactInfo>
            <ContactTitle>Questions about this Privacy Policy?</ContactTitle>
            <ContactDetails>Email: privacy@yoohoo.guru</ContactDetails>
            <ContactDetails>Website: www.yoohoo.guru</ContactDetails>
            <ContactDetails>
              For data protection inquiries, please include &quot;Privacy Request&quot; in your subject line.
            </ContactDetails>
          </ContactInfo>
        </ContentCard>
      </Main>

      <Footer />
    </Container>
  )
}