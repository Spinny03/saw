import { getUserId } from '@/libs/userClient';
import { prisma } from '@/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ columnId: string }> }
) {
  const { columnId } = await params;

  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  await prisma.column.delete({
    where: {
      id: parseInt(columnId),
    },
  });

  return new Response('Card Deleted', {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ columnId: string }> }
) {
  const { columnId } = await params;

  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { title } = await request.json();

  const newColumn = await prisma.column.update({
    where: {
      id: parseInt(columnId),
    },
    data: {
      title,
    },
  });

  return new Response(JSON.stringify(newColumn), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
