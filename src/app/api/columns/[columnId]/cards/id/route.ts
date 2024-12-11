import { getUserId } from '@/libs/userClient';
import { prisma } from '@/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ columnId: string }> }
) {
  const { columnId } = await params;
  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const cards = await prisma.card.findMany({
    where: {
      columnId: parseInt(columnId),
    },
  });

  return new Response(JSON.stringify(cards), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ columnId: string }> }
) {
  const { columnId } = await params;

  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { id, newTitle } = await request.json();

  const newCard = await prisma.card.update({
    where: {
      id: parseInt(id),
      columnId: parseInt(columnId),
    },
    data: {
      title: newTitle,
    },
  });

  return new Response(JSON.stringify(newCard), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
