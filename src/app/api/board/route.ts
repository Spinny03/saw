import { prisma } from '@/prisma';
import { authOptions } from '@/auth.config';
import { getServerSession } from 'next-auth';
import { User, Board } from '@prisma/client';
import { getUserEmail } from '@/libs/userClient';

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
  const boards: Board[] = await prisma.board.findMany({
    where: {
      ownerId: user.id,
    },
  });

  return new Response(JSON.stringify(boards), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(request: Request) {
  const user: User | null = await prisma.user.findUnique({
    where: {
      email: await getUserEmail(),
    },
  });
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  let board: Board = await request.json();

  board.ownerId = user.id;
  await prisma.board.create({ data: board });

  return new Response(JSON.stringify(board), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
