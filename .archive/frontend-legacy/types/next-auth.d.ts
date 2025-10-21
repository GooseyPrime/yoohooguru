import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Extends the built-in session types with custom properties
   */
  interface Session {
    user: {
      id: string
      membershipTier: string
    } & DefaultSession["user"]
  }

  /**
   * Extends the built-in user types
   */
  interface User {
    id: string
    email: string
    membershipTier?: string
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the JWT token to include custom properties
   */
  interface JWT {
    id: string
    membershipTier: string
  }
}
