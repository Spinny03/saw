import { prisma } from '@/prisma';
import { authOptions } from '@/auth.config';
import { getServerSession } from 'next-auth';
import { Board } from '@prisma/client';
import { getUserEmail } from '@/libs/userClient';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email ?? undefined,
    },
    include: {
      boards: true,
    },
  });
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  return new Response(JSON.stringify(user.boards), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(request: Request) {
  const user = await prisma.user.findUnique({
    where: {
      email: await getUserEmail(),
    },
    include: {
      boards: true,
    },
  });
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  let board: Board = await request.json();
  await prisma.board.create({
    data: {
      title: board.title,
      owner: {
        connect: {
          id: user.id,
        },
      },
      users: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  return new Response(JSON.stringify(board), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
