import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface HeroGurusAccessGateProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function HeroGurusAccessGate({ 
  children, 
  redirectTo = '/attestation/disability' 
}: HeroGurusAccessGateProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for session to load
      if (status === 'loading') {
        return;
      }

      // Redirect to login if not authenticated
      if (!session) {
        router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
        return;
      }

      try {
        // Check if user has attested to having a disability
        const response = await fetch('/api/backend/hero-gurus/access-check');
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.data.hasAccess) {
            setHasAccess(true);
          } else {
            // User needs to complete attestation
            setHasAccess(false);
            router.push(`${redirectTo}?redirect=${encodeURIComponent(router.asPath)}`);
          }
        } else {
          // API error - deny access
          setHasAccess(false);
          router.push('/dashboard?error=access-check-failed');
        }
      } catch (error) {
        console.error('Access check error:', error);
        setHasAccess(false);
        router.push('/dashboard?error=access-check-failed');
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [session, status, router, redirectTo]);

  // Show loading state while checking access
  if (isChecking || hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white-80">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If access is denied, show nothing (user will be redirected)
  if (!hasAccess) {
    return null;
  }

  // User has access - render children
  return <>{children}</>;
}