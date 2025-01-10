import { getUserId } from '@/libs/userClient';
import { prisma } from '@/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ callerId: string }> }
) {
  const { callerId } = await params;

  const userId = await getUserId();
  if (!userId || userId !== callerId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { boardId } = await request.json();

  const savedBoard = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      lastBoardId: parseInt(boardId),
    },
  });

  return new Response(JSON.stringify(savedBoard), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ callerId: string }> }
) {
  const { callerId } = await params;

  const userId = await getUserId();
  if (!userId || userId !== callerId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      lastBoardId: true,
    },
  });

  if (!user) {
    return new Response('User not found', { status: 404 });
  }

  const lastBoardId = user.lastBoardId;

  if (!lastBoardId) {
    return new Response('No last board found', { status: 404 });
  }

  return new Response(JSON.stringify({ lastBoardId }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
