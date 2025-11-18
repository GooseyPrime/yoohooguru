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
          console.error('Missing credentials');
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

          console.log('Attempting Firebase authentication for:', credentials.email);

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
          console.log('Firebase authentication successful for:', authData.email);

          // Fetch user profile from backend (optional - gracefully handle failures)
          let userData = null;
          try {
            const backendUrl = process.env.BACKEND_API_URL || 'https://api.yoohoo.guru';
            const profileUrl = `${backendUrl}/api/auth/profile`;
            
            console.log('Fetching user profile from:', profileUrl);
            
            const profileResponse = await fetch(profileUrl, {
              headers: {
                'Authorization': `Bearer ${authData.idToken}`,
                'Content-Type': 'application/json'
              }
            });

            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              userData = profileData.data;
              console.log('User profile fetched successfully');
            } else {
              console.warn('Profile fetch returned non-OK status:', profileResponse.status);
            }
          } catch (profileError) {
            // Profile fetch failed, continue with Firebase data only
            console.warn('Backend profile fetch failed, using Firebase data only:', profileError);
          }

          // Return user object for NextAuth session
          const user = {
            id: authData.localId,
            email: authData.email,
            name: userData?.displayName || authData.displayName || authData.email.split('@')[0],
            role: userData?.role || 'gunu'
          };

          console.log('Returning user object:', { ...user, id: '***' });
          return user;
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
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'gunu';
      }
      
      // Add account info for OAuth providers
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.role = token.role as string | undefined;
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
  // Add debug logging in non-production
  debug: process.env.NODE_ENV !== 'production',
});

export default NextAuth(authOptions);