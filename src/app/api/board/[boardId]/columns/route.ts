import { prisma } from '@/prisma';
import { authOptions } from '@/auth.config';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const boardIdParsed = parseInt(boardId, 10);
  const columns = await prisma.column.findMany({
    where: {
      boardId: boardIdParsed,
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
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const boardIdParsed = parseInt(boardId, 10);
  const { title } = await request.json();

  const newColumn = await prisma.column.create({
    data: {
      title,
      boardId: boardIdParsed,
    },
  });

  return new Response(JSON.stringify(newColumn), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
