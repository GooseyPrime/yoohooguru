// NextAuth configuration for cross-subdomain authentication
// This is a shared configuration base that apps can extend

import type { NextAuthOptions } from 'next-auth';

export const getAuthOptions = (overrides: Partial<NextAuthOptions> = {}): NextAuthOptions => {
  // Validate NEXTAUTH_SECRET
  if (!process.env.NEXTAUTH_SECRET) {
    console.warn('⚠️ WARNING: NEXTAUTH_SECRET is not set!');
    if (process.env.NODE_ENV === 'production') {
      throw new Error('NEXTAUTH_SECRET must be set in production');
    }
  }
  
  // Validate NEXTAUTH_URL
  if (!process.env.NEXTAUTH_URL) {
    console.warn('⚠️ WARNING: NEXTAUTH_URL is not set!');
  } else {
    console.log(`ℹ️ NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`);
  }
  
  // Log cookie domain configuration
  const cookieDomain = (() => {
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.AUTH_COOKIE_DOMAIN) {
        console.error('❌ AUTH_COOKIE_DOMAIN must be set in production for cross-subdomain authentication');
        throw new Error('AUTH_COOKIE_DOMAIN must be set in production for secure cookie handling.');
      }
      console.log(`ℹ️ Cookie domain: ${process.env.AUTH_COOKIE_DOMAIN}`);
      return process.env.AUTH_COOKIE_DOMAIN;
    }
    console.log('ℹ️ Cookie domain: undefined (development mode)');
    return undefined;
  })();
  
  return {
    // Configuration shared across all apps
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    cookies: {
      sessionToken: {
        name: `__Secure-next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          // CRITICAL: Cross-subdomain cookie domain
          domain: cookieDomain,
        }
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV !== 'production',
    ...overrides,
  } as NextAuthOptions;
};

// Basic auth options for apps without providers
export const authOptions = getAuthOptions();
