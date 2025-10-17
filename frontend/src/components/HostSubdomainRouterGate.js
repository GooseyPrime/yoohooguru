/**
 * Host Subdomain Router Gate
 * Handles automatic routing for subdomain-based access
 */

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSubdomainRoute } from '../hosting/hostRules';
import logger from '../utils/logger';

export function HostSubdomainRouterGate() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const host = window.location.hostname;
    const targetRoute = getSubdomainRoute(host);
    
    // If we're on a subdomain and not already on the target route, redirect
    if (targetRoute && location.pathname !== targetRoute) {
      logger.info(`Redirecting ${host} from ${location.pathname} to ${targetRoute}`);
      navigate(targetRoute, { replace: true });
    }
  }, [navigate, location.pathname]);

  // This component renders nothing - it's just for side effects
  return null;
}

export default HostSubdomainRouterGate;