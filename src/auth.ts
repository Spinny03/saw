import NextAuth from 'next-auth';
import { authOptions } from '@/auth.config';

export const handlers = NextAuth({
  ...authOptions,
});
