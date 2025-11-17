import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extend the default User type to include id and role
   */
  interface User extends DefaultUser {
    id: string;
    role?: string;
  }

  /**
   * Extend the default Session type to include id and role in user
   */
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the default JWT type to include id and role
   */
  interface JWT extends DefaultJWT {
    id?: string;
    role?: string;
  }
}