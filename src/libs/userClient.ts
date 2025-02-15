import { authOptions } from '@/auth.config';
import { getServerSession } from 'next-auth';

export async function getUserEmail(): Promise<string> {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? '';
}

export async function getUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? '';
}
