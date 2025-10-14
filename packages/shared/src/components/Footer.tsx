import React from 'react';
import styled from 'styled-components';
import Logo from './Logo';

const FooterContainer = styled.footer`
  background: #1a1a2e;
  color: #b0b0b0;
  padding: 3rem 0 1.5rem;
  margin-top: auto;
  border-top: 1px solid #2a2a3e;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: #ffffff;
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 0.5rem;
    line-height: 1.6;
    color: #b0b0b0;
  }

  a {
    color: #b0b0b0;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #667eea;
    }
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 0.5rem;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #2a2a3e;
  color: #b0b0b0;
  font-size: 0.875rem;
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <Logo showText={true} size="normal" to="/" />
            <p>
              A neighborhood-based skill-sharing platform where users exchange skills,
              discover purpose, and create exponential community impact.
            </p>
          </FooterSection>

          <FooterSection>
            <h3>Platform</h3>
            <FooterLinks>
              <li><a href="/about">About Us</a></li>
              <li><a href="/how-it-works">How It Works</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/blog">Blog</a></li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h3>Support</h3>
            <FooterLinks>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/safety">Safety</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/faq">FAQ</a></li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h3>Legal</h3>
            <FooterLinks>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/cookies">Cookie Policy</a></li>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <p>&copy; {currentYear} YooHoo.Guru. All rights reserved.</p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
