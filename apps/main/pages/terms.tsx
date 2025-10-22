import { Header, Footer } from '@yoohooguru/shared'
import Head from 'next/head'
import styled from 'styled-components'

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

const ImportantNotice = styled.div`
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin: 2rem 0;
`

const NoticeTitle = styled.h4`
  color: #ffc107;
  margin-bottom: 0.75rem;
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

export default function Terms() {
  return (
    <Container>
      <Head>
        <title>Terms of Service | YooHoo.Guru</title>
        <meta name="description" content="Terms of Service for YooHoo.Guru - Learn about the rules and guidelines for using our skill-sharing platform." />
      </Head>

      <Header />

      <Main>
        <ContentCard>
          <Title>Terms of Service</Title>
          <LastUpdated>Last updated: October 22, 2025</LastUpdated>

          <SectionTitle>1. Acceptance of Terms</SectionTitle>
          <Paragraph>
            Welcome to YooHoo.Guru! These Terms of Service ("Terms") govern your use of our skill-sharing platform and 
            community marketplace. By accessing or using our services, you agree to be bound by these Terms. If you do not 
            agree to these Terms, please do not use our platform.
          </Paragraph>

          <SectionTitle>2. Description of Service</SectionTitle>
          <Paragraph>
            YooHoo.Guru is a community-driven platform that connects people for skill sharing, learning, and personal development. 
            Our services include:
          </Paragraph>
          <List>
            <ListItem>Skill-sharing marketplace for finding teachers and learners</ListItem>
            <ListItem>Guru dashboard for educators and coaches</ListItem>
            <ListItem>Angel's List for service providers and seekers</ListItem>
            <ListItem>Community features for networking and collaboration</ListItem>
            <ListItem>Payment processing for premium features and services</ListItem>
          </List>

          <SectionTitle>3. User Accounts and Registration</SectionTitle>
          
          <SubSectionTitle>3.1 Account Creation</SubSectionTitle>
          <Paragraph>
            You must create an account to access most features of our platform. You agree to provide accurate, current, 
            and complete information during registration and to update such information as necessary.
          </Paragraph>

          <SubSectionTitle>3.2 Account Security</SubSectionTitle>
          <Paragraph>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities 
            that occur under your account. You must notify us immediately of any unauthorized use of your account.
          </Paragraph>

          <SectionTitle>4. User Conduct and Responsibilities</SectionTitle>
          
          <SubSectionTitle>4.1 Acceptable Use</SubSectionTitle>
          <Paragraph>You agree to use our platform responsibly and in compliance with all applicable laws. You will not:</Paragraph>
          <List>
            <ListItem>Violate any local, state, national, or international law or regulation</ListItem>
            <ListItem>Transmit or post any content that is unlawful, harmful, threatening, abusive, or discriminatory</ListItem>
            <ListItem>Impersonate any person or entity or misrepresent your affiliation</ListItem>
            <ListItem>Interfere with or disrupt the platform's operation or security</ListItem>
            <ListItem>Collect or harvest personal information from other users without consent</ListItem>
            <ListItem>Use the platform for commercial purposes without authorization</ListItem>
          </List>

          <SubSectionTitle>4.2 Content Standards</SubSectionTitle>
          <Paragraph>
            All content you post must be respectful, constructive, and relevant to skill sharing and learning. 
            We reserve the right to remove content that violates our community guidelines.
          </Paragraph>

          <SectionTitle>5. Skill Sharing and Teaching</SectionTitle>
          
          <SubSectionTitle>5.1 Guru Responsibilities</SubSectionTitle>
          <Paragraph>If you offer skills or teaching services, you agree to:</Paragraph>
          <List>
            <ListItem>Provide accurate descriptions of your skills and qualifications</ListItem>
            <ListItem>Deliver services as promised and maintain professional standards</ListItem>
            <ListItem>Respect learners' time and provide value in your interactions</ListItem>
            <ListItem>Handle any disputes or issues professionally and transparently</ListItem>
          </List>

          <SubSectionTitle>5.2 Learner Responsibilities</SubSectionTitle>
          <Paragraph>If you seek to learn skills, you agree to:</Paragraph>
          <List>
            <ListItem>Be respectful and punctual in your interactions with teachers</ListItem>
            <ListItem>Provide honest feedback and reviews</ListItem>
            <ListItem>Make payments promptly as agreed</ListItem>
            <ListItem>Use learned skills responsibly and ethically</ListItem>
          </List>

          <SectionTitle>6. Payments and Fees</SectionTitle>
          
          <SubSectionTitle>6.1 Payment Processing</SubSectionTitle>
          <Paragraph>
            Payments are processed securely through Stripe. By making a payment, you agree to Stripe's terms of service 
            and authorize us to charge your payment method for the specified amount.
          </Paragraph>

          <SubSectionTitle>6.2 Refunds and Disputes</SubSectionTitle>
          <Paragraph>
            Refund policies vary by service type and will be clearly communicated before purchase. 
            We encourage users to resolve disputes directly, but we may mediate when necessary.
          </Paragraph>

          <SectionTitle>7. Intellectual Property</SectionTitle>
          
          <SubSectionTitle>7.1 Platform Content</SubSectionTitle>
          <Paragraph>
            The YooHoo.Guru platform, including its design, features, and original content, is owned by us and protected 
            by copyright, trademark, and other intellectual property laws.
          </Paragraph>

          <SubSectionTitle>7.2 User Content</SubSectionTitle>
          <Paragraph>
            You retain ownership of content you create and post. By posting content, you grant us a non-exclusive, 
            worldwide license to use, display, and distribute your content solely for platform operation and improvement.
          </Paragraph>

          <SectionTitle>8. Privacy and Data Protection</SectionTitle>
          <Paragraph>
            Your privacy is important to us. Our use of your personal information is governed by our Privacy Policy, 
            which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our 
            data practices.
          </Paragraph>

          <SectionTitle>9. Platform Availability and Modifications</SectionTitle>
          <Paragraph>
            We strive to maintain platform availability but cannot guarantee uninterrupted service. We reserve the right 
            to modify, suspend, or discontinue any part of our platform at any time with reasonable notice.
          </Paragraph>

          <SectionTitle>10. Disclaimers and Limitation of Liability</SectionTitle>
          
          <ImportantNotice>
            <NoticeTitle>Important Legal Notice</NoticeTitle>
            <Paragraph>
              OUR PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, 
              EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </Paragraph>
          </ImportantNotice>

          <Paragraph>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages, including but not limited to loss of profits, data, or use.
          </Paragraph>

          <SectionTitle>11. Indemnification</SectionTitle>
          <Paragraph>
            You agree to indemnify and hold us harmless from any claims, damages, losses, and expenses (including legal fees) 
            arising from your use of the platform, violation of these Terms, or infringement of any rights of another.
          </Paragraph>

          <SectionTitle>12. Termination</SectionTitle>
          <Paragraph>
            We may terminate or suspend your account immediately, without prior notice, for conduct that we believe 
            violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
          </Paragraph>

          <SectionTitle>13. Governing Law and Dispute Resolution</SectionTitle>
          <Paragraph>
            These Terms are governed by the laws of the jurisdiction where our company is incorporated. 
            Any disputes will be resolved through binding arbitration, except for claims that may be brought in small claims court.
          </Paragraph>

          <SectionTitle>14. Changes to Terms</SectionTitle>
          <Paragraph>
            We may modify these Terms at any time. We will notify users of material changes by posting the updated Terms 
            on our platform and updating the "Last updated" date. Your continued use of the platform after such changes 
            constitutes acceptance of the new Terms.
          </Paragraph>

          <SectionTitle>15. Severability</SectionTitle>
          <Paragraph>
            If any provision of these Terms is found to be unenforceable, that provision will be modified to reflect 
            the parties' intention or eliminated while the remainder of the Terms remains in full force and effect.
          </Paragraph>

          <SectionTitle>16. Contact Information</SectionTitle>
          <ContactInfo>
            <ContactTitle>Questions about these Terms?</ContactTitle>
            <ContactDetails>Email: legal@yoohoo.guru</ContactDetails>
            <ContactDetails>Website: www.yoohoo.guru</ContactDetails>
            <ContactDetails>
              For legal inquiries, please include "Terms of Service" in your subject line.
            </ContactDetails>
          </ContactInfo>

          <ImportantNotice>
            <NoticeTitle>Effective Date</NoticeTitle>
            <Paragraph>
              These Terms of Service are effective as of October 22, 2025, and supersede all prior versions.
            </Paragraph>
          </ImportantNotice>
        </ContentCard>
      </Main>

      <Footer />
    </Container>
  )
}