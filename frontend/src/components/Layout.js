import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import RouteTransition from './motion/RouteTransition';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 70px; /* Account for fixed header */
`;

function Layout() {
  const { key } = useLocation();
  
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        <RouteTransition locationKey={key}>
          <Outlet />
        </RouteTransition>
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
}

export default Layout;