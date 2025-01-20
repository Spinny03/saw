import { prisma } from '@/prisma';
import { getUserId } from '@/libs/userClient';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
  const { boardId } = params;

  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const messages = await prisma.message.findMany({
    where: {
      boardId: parseInt(boardId, 10),
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return new Response(JSON.stringify(messages), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
  const { boardId } = params;

  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { message } = await request.json();

  const newMessage = await prisma.message.create({
    data: {
      message,
      boardId: parseInt(boardId, 10),
      userId,
    },
    include: {
      user: true,
    },
  });

  return new Response(JSON.stringify(newMessage), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
