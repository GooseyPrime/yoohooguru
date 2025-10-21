// NextAuth configuration for cross-subdomain authentication
// This is a shared configuration base that apps can extend

import type { NextAuthOptions } from 'next-auth';

export const getAuthOptions = (overrides: Partial<NextAuthOptions> = {}): NextAuthOptions => {
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
          domain: process.env.AUTH_COOKIE_DOMAIN || (process.env.NODE_ENV === 'production' ? '.yoohoo.guru' : undefined),
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
