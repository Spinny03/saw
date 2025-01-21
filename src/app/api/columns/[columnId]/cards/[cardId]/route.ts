import { getUserId } from '@/libs/userClient';
import { prisma } from '@/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ rowId: string }> }
) {
  const { rowId } = await params;
  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const cards = await prisma.card.findUnique({
    where: {
      id: parseInt(rowId),
    },
  });

  return new Response(JSON.stringify(cards), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ cardId: string; columnId: string }> }
) {
  const { cardId, columnId } = await params;

  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { title, message, starred } = await request.json();

  const newCard = await prisma.card.update({
    where: {
      id: parseInt(cardId),
    },
    data: {
      title,
      message,
      starred,
      columnId: parseInt(columnId),
    },
  });

  return new Response(JSON.stringify(newCard), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ cardId: string; columnId: string }> }
) {
  const { cardId, columnId } = await params;

  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const column = await prisma.column.findUnique({
    where: {
      id: parseInt(columnId),
    },
    include: {
      board: true,
    },
  });
  const board = column?.board;
  const owner = board?.ownerId;

  if (owner !== userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!column || !board) {
    return new Response('Error', { status: 500 });
  }

  await prisma.card.delete({
    where: {
      id: parseInt(cardId),
    },
  });

  return new Response('Card Deleted', {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
