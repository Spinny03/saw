import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/prisma";
import GoogleProvider from "next-auth/providers/google";

export const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database" as const, // Usa "database" se vuoi salvare la sessione nel DB
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub; // Associa l'ID utente al token
      return session;
    },
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    },
  },
  events: {
    async signIn(message) {
      console.log("Sign In", message);
    },
    async signOut(message) {
      console.log("Sign Out", message);
    },
    async createUser(message) {
      console.log("User Created", message);
    },
  },
});
