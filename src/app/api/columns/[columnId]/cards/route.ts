import { prisma } from '@/prisma';
import { authOptions } from '@/auth.config';
import { getServerSession } from 'next-auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ columnId: string }> }
) {
  const { columnId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
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
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { title } = await request.json();

  const newCard = await prisma.card.create({
    data: {
      title,
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
