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

  let searchQuery = query;
  let searchType: 'card' | 'column' | 'both' = 'both';

  if (query.includes('@Card')) {
    searchQuery = query.replace('@Card', '').trim();
    searchType = 'card';
  } else if (query.includes('@Column')) {
    searchQuery = query.replace('@Column', '').trim();
    searchType = 'column';
  }

  const truncateMessage = (message: string, searchQuery: string) => {
    const words = message.split(' ');
    const start = Math.max(0, words.indexOf(searchQuery) - 2); // Due parole prima della parola cercata
    const end = Math.min(words.length, words.indexOf(searchQuery) + 3); // Tre parole dopo la parola cercata

    const truncatedWords = words.slice(start, end);

    if (start > 0) {
      return `... ${truncatedWords.join(' ')} ...`;
    } else {
      return `${truncatedWords.join(' ')} ...`;
    }
  };

  try {
    let columns: any[] = [];
    let cardTitles: any[] = [];
    let cardMessages: any[] = [];

    if (searchType === 'both' || searchType === 'column') {
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

    if (searchType === 'both' || searchType === 'card') {
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

      // Troncamento dei messaggi
      cardMessages = cardMessages.map((card) => ({
        ...card,
        message: truncateMessage(card.message, searchQuery),
      }));
    }

    return new Response(
      JSON.stringify({
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
    console.error('Errore durante la ricerca:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
