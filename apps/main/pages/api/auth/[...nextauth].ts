import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getAuthOptions } from "@yoohooguru/auth";
import { JWT } from "next-auth/jwt";

// TypeScript module augmentations for next-auth and next-auth/jwt have been moved to types/next-auth.d.ts for better organization.

// Get base NextAuth options with cross-subdomain cookie configuration
const authOptions = getAuthOptions({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Fetch user role from database
        // This is a placeholder - in a real implementation, you would fetch from your database
        token.role = 'gunu'; // Default role
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allow redirect to any subdomain of yoohoo.guru
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      try {
        const urlObj = new URL(url);
        const baseUrlObj = new URL(baseUrl);
        
        // Allow redirects to subdomains
        if (urlObj.hostname.endsWith(baseUrlObj.hostname) || 
            urlObj.hostname.endsWith('.yoohoo.guru') ||
            urlObj.hostname === 'yoohoo.guru') {
          return url;
        }
      } catch (error) {
        console.error('Redirect URL parsing error:', error);
      }
      
      return baseUrl;
    },
  },
});

export default NextAuth(authOptions);