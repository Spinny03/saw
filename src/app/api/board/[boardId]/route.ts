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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;

  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const boardIdParsed = parseInt(boardId, 10);

  // Parse the request body for the new title
  let body: { title?: string };
  try {
    body = await request.json();
  } catch (error) {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { title } = body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return new Response('Invalid title', { status: 400 });
  }

  // Ensure the user is authorized to update the board
  const board = await prisma.board.findUnique({
    where: { id: boardIdParsed },
    include: { users: true },
  });

  if (!board || !board.users.find((user) => user.id === userId)) {
    return new Response('Board not found or access denied', { status: 404 });
  }
  if (userId !== board.ownerId) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Update the board title
  try {
    const updatedBoard = await prisma.board.update({
      where: { id: boardIdParsed },
      data: { title: title.trim() },
    });

    return new Response(JSON.stringify(updatedBoard), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating board title:', error);
    return new Response('Error updating board title', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;

  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const board = await prisma.board.findUnique({
    where: {
      id: parseInt(boardId),
    },
  });
  if (board?.ownerId !== userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  await prisma.board.delete({
    where: {
      id: parseInt(boardId),
    },
  });

  return new Response('Board Deleted', {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
