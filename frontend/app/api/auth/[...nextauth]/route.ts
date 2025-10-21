import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import type { Adapter } from "next-auth/adapters";

// Import Firebase Admin SDK - we need to use a dynamic import to avoid build issues
let adminDb: any;
let adminAuth: any;

async function getFirebaseAdmin() {
  if (!adminDb) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const admin = require('firebase-admin');
    
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      };
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }
    
    adminDb = admin.firestore();
    adminAuth = admin.auth();
  }
  
  return { db: adminDb, auth: adminAuth };
}

export const authOptions: NextAuthOptions = {
  // Firestore Adapter for session persistence
  adapter: (async () => {
    const { db } = await getFirebaseAdmin();
    return FirestoreAdapter(db);
  })() as unknown as Adapter,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // CRITICAL: Cross-subdomain cookie configuration
  cookies: {
    sessionToken: {
      name: `${process.env.NEXTAUTH_URL?.startsWith('https://') ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // CRITICAL: Uses AUTH_COOKIE_DOMAIN environment variable for cross-subdomain authentication
        domain: process.env.AUTH_COOKIE_DOMAIN || (process.env.NODE_ENV === 'production' ? '.yoohoo.guru' : undefined), 
      }
    },
  },

  pages: {
    signIn: '/login',
    error: '/auth/error',
  },

  callbacks: {
    async jwt({ token, user, account: _account }) {
      if (user) {
        token.id = user.id;

        // CRITICAL: Fetch membership status from Firestore
        try {
          const { db } = await getFirebaseAdmin();
          const userDoc = await db.collection('users').doc(user.id).get();
          const userData = userDoc.data();
          
          token.membershipTier = userData?.membershipTier || userData?.tier || 'free';
          token.email = user.email;
        } catch (error) {
          console.error('Error fetching user membership:', error);
          token.membershipTier = 'free';
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.membershipTier = token.membershipTier as string || 'free';
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
  
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
