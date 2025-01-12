'use client';

import { useSession } from 'next-auth/react';
import Card from './Card';
import { useState, useEffect } from 'react';
import { Column as PrismaColumn, Card as PrismaCard } from '@prisma/client';
import ModalCard from './ModalCard';
import { TrashIcon } from '@radix-ui/react-icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Estensione del tipo PrismaColumn per includere 'cards'
interface ColumnType extends PrismaColumn {
  cards: PrismaCard[]; // Aggiungiamo il campo 'cards' come array di Card
}

interface ColumnProps {
  readonly columnProp: ColumnType;
  readonly deleteColumn: (column: any) => void;
  owner: string;
}

const editColumn = async (
  column: ColumnType,
  showToast: (message: string) => void
) => {
  try {
    const response = await fetch(`/api/columns/${column.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: column.title,
        boardOrder: column.boardOrder, // Assicuriamoci che boardOrder venga sempre inviato
      }),
    });
    if (response.ok) {
      console.log('Column name updated');
    } else if (response.status === 401) {
      showToast('Non autorizzato');
    } else {
      console.error('Error updating column title');
    }
  } catch (error) {
    console.error('Error updating column title:', error);
  }
};

const useToast = () => {
  const [toast, setToast] = useState({ open: false, title: '' });
  return { toast, setToast };
};

export default function Column({
  columnProp,
  deleteColumn,
  owner,
}: ColumnProps) {
  const { data: session } = useSession();
  const [column, setColumn] = useState<ColumnType>(columnProp);
  const [cards, setCards] = useState<PrismaCard[]>(column.cards || []);
  const [title, setTitle] = useState(column.title);
  const { toast, setToast } = useToast();
  const [isDraggrable, setIsDraggable] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: column.id,
      data: {
        type: 'column',
        column,
      },
      disabled: isDraggrable,
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const currUser = session?.user?.id;
  if (!currUser) {
    throw new Error('User is not authenticated');
  }

  const showToast = (message: string) => {
    setToast({ open: true, title: message });
  };

  // Funzione per gestire il blur del titolo
  const handleTitleBlur = () => {
    if (title !== column.title) {
      column.title = title;

      // Verifica che boardOrder non sia null e assegna un valore valido se necessario
      const updatedColumn = {
        ...column,
        boardOrder: column.boardOrder ?? 0, // Se boardOrder è null, lo impostiamo a 0 (o un altro valore di default)
      };

      setColumn(updatedColumn); // Aggiorniamo la colonna nello stato
      editColumn(updatedColumn, showToast); // Inviamo la richiesta di aggiornamento
    }
  };

  // Funzione per aggiungere una carta
  const addCard = async (cardTitle: string, cardMessage: string) => {
    try {
      const response = await fetch(`/api/columns/${column.id}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: cardTitle,
          message: cardMessage,
          columnOrder: cards.length,
        }),
      });
      if (response.ok) {
        const newCard = await response.json();
        setCards((prevCards) => [...prevCards, newCard]);
      } else {
        console.error('Error adding card');
      }
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  // Funzione per eliminare una carta
  const deleteCard = async (card: PrismaCard) => {
    try {
      const response = await fetch(
        `/api/columns/${card.columnId}/cards/${card.id}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        setCards((prevCards) => prevCards.filter((c) => c.id !== card.id));
        console.log('Card deleted');
      } else {
        console.error('Error deleting card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  useEffect(() => {
    setCards(column.cards || []); // Aggiorna lo stato quando la colonna viene modificata
  }, [column]);

  if (owner == currUser) {
    return (
      <div
        ref={setNodeRef}
        key={column.id}
        className="m-1 flex-shrink-0 rounded-md bg-gray-200 p-4"
        style={style}
        {...attributes}
        {...listeners}
      >
        <div className="flex justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="w-full border-none bg-gray-200 text-lg font-bold focus:outline-none"
          />
          <button
            onClick={() => deleteColumn(column)}
            className="grey-500 rounded-md p-1 hover:bg-gray-300"
          >
            <TrashIcon />
          </button>
        </div>
        <div className="mt-2">
          {cards?.map((card: PrismaCard) => (
            <Card
              key={card.id}
              card={card}
              deleteCard={deleteCard}
              editable={owner === currUser}
            />
          ))}
          <ModalCard addCard={addCard} setIsDraggable={setIsDraggable} />
        </div>
      </div>
    );
  } else {
    return (
      <div key={column.id} className="rounded-md bg-gray-200 p-4">
        <h2 className="text-lg font-bold">{column.title}</h2>
        <div className="mt-2">
          {cards?.map((card: PrismaCard) => (
            <Card
              key={card.id}
              card={card}
              deleteCard={deleteCard}
              editable={owner === currUser}
            />
          ))}
        </div>
      </div>
    );
  }
}
