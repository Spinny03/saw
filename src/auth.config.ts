import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/prisma';
import type { AuthOptions, DefaultSession } from 'next-auth';
const fs = require('fs');
const path = require('path');
declare module 'next-auth' {
  interface Session {
    user: {
      address: string;
      id: string;
    } & DefaultSession['user'];
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database' as const,
  },
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
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  events: {
    async signIn(message) {
      const userId = message.user.id;
      const imageUrl = message.user.image;

      if (!imageUrl) {
        console.error('Image URL is undefined or null');
        return;
      }

      const extension = path.extname(imageUrl);
      const filePath = path.join(
        process.cwd(),
        'public',
        'profile',
        `${userId}${extension}`
      );

      const downloadImage = async (url: string, filePath: string) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filePath, buffer);
      };

      downloadImage(imageUrl, filePath)
        .then(() => console.log('Image saved successfully'))
        .catch((err) => console.error('Error saving image', err));

      await prisma.user.update({
        where: { id: userId },
        data: { image: `/profile/${userId}${extension}` },
      });
    },
    async signOut(message) {
      console.log('Sign Out', message);
    },
    async createUser(message) {
      console.log('User Created', message);
    },
  },
};
