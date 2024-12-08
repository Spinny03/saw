import { prisma } from '@/prisma';
import { authOptions } from '@/auth.config';
import { getServerSession } from 'next-auth';

export async function GET(
  request: Request,
  context: { params: { boardId: string } }
) {
  const params = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const boardId = params.boardId;
  const columns = await prisma.column.findMany({
    where: {
      boardId: parseInt(boardId),
    },
  });

  return new Response(JSON.stringify(columns), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(
  request: Request,
  context: { params: { boardId: string } }
) {
  const params = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const boardId = params.boardId;
  const { title } = await request.json();

  const newColumn = await prisma.column.create({
    data: {
      title,
      boardId: parseInt(boardId),
    },
  });

  return new Response(JSON.stringify(newColumn), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
