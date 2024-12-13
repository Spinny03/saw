import { prisma } from '@/prisma';
import { getUserId } from '@/libs/userClient';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;

  const userIdAuth = await getUserId();
  if (!userIdAuth) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { userId } = await request.json();

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return new Response('User not found', { status: 404 });
  }

  await prisma.board.update({
    where: {
      id: parseInt(boardId),
    },
    data: {
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
