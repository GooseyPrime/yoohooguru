import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-200);
  padding: 1rem 0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: var(--font-bold);
  color: var(--primary);
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
  }
`;

const RippleIcon = styled.span`
  font-size: 1.8rem;
  animation: ripple 3s infinite;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    border-bottom: 1px solid var(--gray-200);
    box-shadow: var(--shadow-lg);
    gap: 1rem;
  }
`;

const NavLink = styled(Link)`
  color: var(--gray-700);
  text-decoration: none;
  font-weight: var(--font-medium);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  &:hover {
    color: var(--primary);
    background: var(--gray-100);
    text-decoration: none;
  }

  &.active {
    color: var(--primary);
    background: rgba(0, 123, 255, 0.1);
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  color: var(--gray-700);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 0.5rem 0;
  min-width: 200px;
  z-index: 1001;
`;

const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--gray-700);
  font-weight: var(--font-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background var(--transition-fast);

  &:hover {
    background: var(--gray-100);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--gray-700);
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

function Header() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <RippleIcon>🌊</RippleIcon>
          RIPPLE
        </Logo>

        <Nav isOpen={isMenuOpen}>
          <NavLink 
            to="/" 
            className={isActive('/') ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/skills" 
            className={isActive('/skills') ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            Skills
          </NavLink>
          {currentUser && (
            <NavLink 
              to="/dashboard" 
              className={isActive('/dashboard') ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </NavLink>
          )}
        </Nav>

        <UserMenu>
          {currentUser ? (
            <>
              <UserButton 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User size={18} />
                {userProfile?.displayName || 'User'}
              </UserButton>
              
              {isUserMenuOpen && (
                <Dropdown>
                  <DropdownItem onClick={() => {
                    navigate('/profile');
                    setIsUserMenuOpen(false);
                  }}>
                    <Settings size={16} />
                    Profile
                  </DropdownItem>
                  <DropdownItem onClick={handleLogout}>
                    <LogOut size={16} />
                    Sign Out
                  </DropdownItem>
                </Dropdown>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </div>
          )}

          <MobileMenuButton 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </UserMenu>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;