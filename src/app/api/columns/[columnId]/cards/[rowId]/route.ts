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
  { params }: { params: Promise<{ columnId: string }> }
) {
  const { columnId } = await params;

  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { title, message } = await request.json();

  const newCard = await prisma.card.update({
    where: {
      id: parseInt(columnId),
    },
    data: {
      title,
      message,
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
