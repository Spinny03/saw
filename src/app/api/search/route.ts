import { getUserId } from '@/libs/userClient';
import { prisma } from '@/prisma';

export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const url = new URL(request.url);
  const query = url.searchParams.get('query');

  if (!query) {
    return new Response('Query is required', { status: 400 });
  }

  const tags = {
    card: query.includes('@Card'),
    column: query.includes('@Column'),
    board: query.includes('@Board'),
  };

  let searchQuery = query
    .replace('@Card', '')
    .replace('@Column', '')
    .replace('@Board', '')
    .trim();

  const truncateMessage = (message: string, searchQuery: string) => {
    const words = message.split(' ');
    const start = Math.max(0, words.indexOf(searchQuery) - 2); // Two words before the query
    const end = Math.min(words.length, words.indexOf(searchQuery) + 3); // Three words after the query

    const truncatedWords = words.slice(start, end);

    if (start > 0) {
      return `... ${truncatedWords.join(' ')} ...`;
    } else {
      return `${truncatedWords.join(' ')} ...`;
    }
  };

  try {
    let boards: any[] = [];
    let columns: any[] = [];
    let cardTitles: any[] = [];
    let cardMessages: any[] = [];

    if (tags.board || (!tags.card && !tags.column)) {
      if (tags.board || (!tags.card && !tags.column)) {
        boards = await prisma.board.findMany({
          where: {
            title: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          select: {
            id: true,
            title: true,
            owner: {
              select: {
                name: true,
              },
            },
          },
        });

        boards = boards.map((board) => ({
          ...board,
          ownerName: board.owner.name, // adding ownerName to the board result
        }));
      }
    }

    if (tags.column || (!tags.card && !tags.board)) {
      columns = await prisma.column.findMany({
        where: {
          title: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          title: true,
          boardId: true,
        },
      });
    }

    if (tags.card || (!tags.column && !tags.board)) {
      cardTitles = await prisma.card.findMany({
        where: {
          title: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          title: true,
          columnId: true,
          column: {
            select: {
              boardId: true,
            },
          },
        },
      });

      cardMessages = await prisma.card.findMany({
        where: {
          message: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          message: true,
          columnId: true,
          column: {
            select: {
              boardId: true,
            },
          },
        },
      });

      // Truncate messages
      cardMessages = cardMessages.map((card) => ({
        ...card,
        message: truncateMessage(card.message, searchQuery),
      }));
    }

    return new Response(
      JSON.stringify({
        boards: boards.map((board) => ({
          title: board.title,
          id: board.id,
          ownerId: board.ownerId,
          owner: board.owner,
        })),
        columns: columns.map((column) => ({
          title: column.title,
          id: column.id,
          boardId: column.boardId,
        })),
        cardTitles: cardTitles.map((card) => ({
          title: card.title,
          id: card.id,
          columnId: card.columnId,
          boardId: card.column.boardId,
        })),
        cardMessages: cardMessages.map((card) => ({
          message: card.message,
          id: card.id,
          columnId: card.columnId,
          boardId: card.column.boardId,
        })),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error during search:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
