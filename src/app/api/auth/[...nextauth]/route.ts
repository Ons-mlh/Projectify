export const dynamic = "force-dynamic"

import NextAuth, { DefaultSession } from "next-auth";
import { authOptions } from "@/lib/auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    expiresAt?: number;
    error?: string;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
