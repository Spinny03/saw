import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/prisma';
import type { AuthOptions, DefaultSession } from 'next-auth';
import { put } from '@vercel/blob';
import bcrypt from 'bcrypt';
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

function compare(password: string, hash: string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(
      password,
      hash,
      (err: Error | undefined, result: boolean) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt' as const,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const email = credentials?.email as string;
          const password = credentials?.password as string;

          if (!email || !password) {
            throw new Error('Email o password mancanti');
          }

          const user = await prisma.user.findFirst({
            where: {
              email,
            },
          });

          if (!user) {
            throw new Error('Credenziali non corrette');
          } else {
            if (!user.password) {
              throw new Error('Credenziali non corrette');
            }
            const valid = await compare(password, user.password);
            if (!valid) {
              throw new Error('Credenziali non corrette');
            }
          }

          return {
            email: user.email,
            name: user.name,
            surname: user.surname,
            id: user.id,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error('Errore sconosciuto');
          }
        }
      },
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
    async session({ session, token }) {
      console.log('Session:', session);
      if (session.user && token.sub) {
        session.user.id = token.sub;
        let user = await prisma.user.findFirst({
          where: { id: token.sub },
        });
        if (!user) {
          return session;
        }
        session.user.lastBoard = user.lastBoard || '';
        session.user.image = user.image || '';
      }
      console.log('Session:', session);
      return session;
    },
  },
  events: {
    async signIn(message) {
      console.log('Sign In', message);
      if (message.account?.type === 'credentials') {
        return;
      }
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
