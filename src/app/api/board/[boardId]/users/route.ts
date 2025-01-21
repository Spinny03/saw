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
  const board = await prisma.board.findUnique({
    where: {
      id: parseInt(boardId),
    },
  });
  if (board?.ownerId !== userIdAuth) {
    return new Response('Unauthorized', { status: 401 });
  }
  // Parse the body
  const {
    usersToAdd,
    usersToRemove,
  }: { usersToAdd: string[]; usersToRemove: string[] } = await request.json();

  // Validate user IDs in usersToAdd
  const validUsersToAdd = await Promise.all(
    usersToAdd.map(async (userId) => {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return user ? user : null;
    })
  );

  if (validUsersToAdd.includes(null)) {
    return new Response('One or more users to add were not found', {
      status: 404,
    });
  }

  // Validate user IDs in usersToRemove
  const validUsersToRemove = await Promise.all(
    usersToRemove.map(async (userId) => {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return user ? user : null;
    })
  );

  if (validUsersToRemove.includes(null)) {
    return new Response('One or more users to remove were not found', {
      status: 404,
    });
  }

  // Update the board with the new users to add
  await prisma.board.update({
    where: {
      id: parseInt(boardId),
    },
    data: {
      users: {
        connect: usersToAdd.map((userId) => ({ id: userId })),
        disconnect: usersToRemove.map((userId) => ({ id: userId })),
      },
    },
  });

  return new Response(
    JSON.stringify({ message: 'Board updated successfully' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
