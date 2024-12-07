import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';

export default {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  logger: {
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    },
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      console.log('Authorized', auth);
      return !!auth;
    },
  },
  events: {
    async signIn(message) {
      console.log('Sign In', message);
    },
    async signOut(message) {
      console.log('Sign Out', message);
    },
    async createUser(message) {
      console.log('User Created', message);
    },
  },
} satisfies NextAuthConfig;
