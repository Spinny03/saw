import { getUserId } from '@/libs/userClient';
import { prisma } from '@/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;
  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

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
