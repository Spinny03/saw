import { prisma } from '@/prisma';

export const getBoards = async (ownerId: string) => {
  return prisma.board.findMany({
    where: {
      ownerId,
    },
  });
};
