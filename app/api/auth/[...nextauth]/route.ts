import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { CustomPrismaAdapter } from "@/lib/custom-prisma-adapter";

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

const handler = NextAuth({
  adapter: CustomPrismaAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Always allow sign in
      return true;
    },

    async redirect({ url, baseUrl }) {
      // If the URL starts with the base URL, allow it
      if (url.startsWith(baseUrl)) return url;
      // Otherwise, redirect to the base URL
      return baseUrl;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as string) || "CUSTOMER"; // Default to CUSTOMER if no role
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "CUSTOMER";
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
