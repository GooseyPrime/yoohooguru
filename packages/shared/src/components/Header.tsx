import React, { useState } from 'react';
import styled from 'styled-components';
import Logo from './Logo';

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: #1a1a2e;
  border-bottom: 1px solid #2a2a3e;
  padding: 1rem 0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: #b0b0b0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #667eea;
  }
`;

const Button = styled.a`
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  background: #667eea;
  color: white;

  &:hover {
    background: #5568d3;
    transform: translateY(-1px);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #b0b0b0;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNav = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background: #1a1a2e;
    border-top: 1px solid #2a2a3e;
  }
`;

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <Logo showText={true} size="normal" to="/" />
          
          <Nav>
            <NavLink href="https://www.yoohoo.guru">Home</NavLink>
            <NavLink href="https://angel.yoohoo.guru">Angel's List</NavLink>
            <NavLink href="https://coach.yoohoo.guru">Coach Guru</NavLink>
            <NavLink href="https://heroes.yoohoo.guru">Hero Guru's</NavLink>
            <Button href="https://dashboard.yoohoo.guru">Dashboard</Button>
          </Nav>

          <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰
          </MobileMenuButton>
        </HeaderContent>
      </HeaderContainer>

      <MobileNav isOpen={mobileMenuOpen}>
        <NavLink href="https://www.yoohoo.guru">Home</NavLink>
        <NavLink href="https://angel.yoohoo.guru">Angel's List</NavLink>
        <NavLink href="https://coach.yoohoo.guru">Coach Guru</NavLink>
        <NavLink href="https://heroes.yoohoo.guru">Hero Guru's</NavLink>
        <NavLink href="https://dashboard.yoohoo.guru">Dashboard</NavLink>
      </MobileNav>
    </>
  );
};

export default Header;
