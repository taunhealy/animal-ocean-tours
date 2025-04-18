import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
// Add type declarations for enhanced session and JWT
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    sub?: string;
    role?: string;
    picture?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }

  interface User {
    id: string;
    role?: string;
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
