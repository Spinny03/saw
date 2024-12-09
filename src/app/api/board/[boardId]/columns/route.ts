import { getUserId } from '@/libs/userClient';
import { prisma } from '@/prisma';

import { NextRequest } from 'next/server';

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
  const columns = await prisma.column.findMany({
    where: {
      boardId: boardIdParsed,
    },
    include: {
      cards: true,
    },
  });

  return new Response(JSON.stringify(columns), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;

  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const boardIdParsed = parseInt(boardId, 10);
  const { title } = await request.json();

  const newColumn = await prisma.column.create({
    data: {
      title,
      boardId: boardIdParsed,
    },
  });

  return new Response(JSON.stringify(newColumn), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
