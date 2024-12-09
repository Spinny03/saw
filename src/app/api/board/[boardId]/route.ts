import { prisma } from '@/prisma';
import { NextRequest } from 'next/server';
import { getUserId } from '@/libs/userClient';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;

  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const boardIdParsed = parseInt(boardId, 10);
  const board = await prisma.board.findUnique({
    where: {
      id: boardIdParsed,
    },
    include: {
      columns: {
        include: {
          cards: true,
        },
      },
      users: true,
    },
  });

  if (!board || !board.users.find((user) => user.id === userId)) {
    return new Response('Board not found', { status: 404 });
  }

  return new Response(JSON.stringify(board), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
