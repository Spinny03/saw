import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/prisma';
import type { AuthOptions, DefaultSession } from 'next-auth';
import { put } from '@vercel/blob';

const fs = require('fs');
const path = require('path');
declare module 'next-auth' {
  interface Session {
    user: {
      address: string;
      id: string;
      lastBoard: string;
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
        session.user.lastBoard = user.lastBoard;
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
      const filePath = path.join('profile', `${userId}${extension}`);

      const downloadImage = async (imgUrl: string, filePath: string) => {
        const response = await fetch(imgUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { url } = await put(filePath, buffer, {
          access: 'public',
        });
        return url;
      };
      let url;
      try {
        url = await downloadImage(imageUrl, filePath);
      } catch (error) {
        console.error('Error downloading image:', error);
      }
      console.log('URL:', url);
      await prisma.user.update({
        where: { id: userId },
        data: { image: url },
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
