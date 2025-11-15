import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
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
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Use Firebase Auth REST API to verify email/password
          const firebaseApiKey = process.env.FIREBASE_API_KEY;
          if (!firebaseApiKey) {
            console.error('FIREBASE_API_KEY not configured');
            return null;
          }

          const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`;

          const response = await fetch(signInUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              returnSecureToken: true
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Firebase auth error:', errorData.error?.message);
            return null;
          }

          const authData = await response.json();

          // Fetch user profile from backend
          const profileResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/backend/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${authData.idToken}`
            }
          });

          let userData = null;
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            userData = profileData.data;
          }

          // Return user object for NextAuth session
          return {
            id: authData.localId,
            email: authData.email,
            name: userData?.displayName || authData.email.split('@')[0],
            role: userData?.role || 'gunu'
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
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
        (session.user as { role?: string }).role = token.role as string | undefined;
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