import { getUserId } from '@/libs/userClient';
import { prisma } from '@/prisma';

import { User } from '@prisma/client';

export async function GET() {
  const user: User[] = await prisma.user.findMany({});

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
