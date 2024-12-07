import { prisma } from '@/prisma';
import { authOptions } from '@/auth.config';
import { getServerSession } from 'next-auth';
import { User } from '@prisma/client';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  const user: User | null = await prisma.user.findUnique({
    where: {
      email: session.user.email ?? undefined,
    },
  });
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  return new Response(user.email, { status: 200 });
}
