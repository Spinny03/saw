'use client';

import { useSession } from 'next-auth/react';
import Card from './Card';
import { useState } from 'react';
import { Column as ColumnType } from '@prisma/client';
import { Card as CardType } from '@prisma/client';
import ModalCard from './ModalCard';
import { TrashIcon } from '@radix-ui/react-icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
      body: JSON.stringify({ title: column.title }),
    });
    if (response.ok) {
      console.log('Card name updated');
    } else if (response.status === 401) {
      showToast('Non autorizzato');
    } else {
      console.error('Error updating card title');
    }
  } catch (error) {
    console.error('Error updating card title:', error);
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
  const { data: session } = useSession(); // Recupera i dati della sessione
  const [column, setColumn] = useState<any>(columnProp);
  const [title, setTitle] = useState(column.title);
  const { toast, setToast } = useToast();

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const currUser = session?.user?.id;
  if (!currUser) {
    throw new Error('User is not authenticated'); // Lancia un errore se l'ID utente non è disponibile
  }

  const showToast = (message: string) => {
    setToast({ open: true, title: message });
  };

  const handleTitleBlur = () => {
    if (title !== column.title) {
      column.title = title;
      editColumn(column, showToast);
    }
  };

  const addCard = async (cardTitle: string, cardMessage: string) => {
    try {
      const response = await fetch(`/api/columns/${column.id}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: cardTitle, message: cardMessage }),
      });
      if (response.ok) {
        const newCard = await response.json();
        if (!column.cards) {
          column.cards = [];
        }
        column.cards.push(newCard);
        setColumn({ ...column });
      } else {
        console.error('Error adding card');
      }
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const deleteCard = async (card: CardType) => {
    try {
      const response = await fetch(
        `/api/columns/${card.columnId}/cards/${card.id}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        column.cards = column.cards.filter((c: CardType) => c.id !== card.id);
        setColumn({ ...column });
        console.log('Card deleted');
      } else {
        console.error('Error deleting card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-md border-2 border-gray-400 bg-gray-200 p-4 opacity-60"
      ></div>
    );
  }

  if (owner == currUser) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        key={column.id}
        className="rounded-md bg-gray-200 p-4"
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
            onClick={() => {
              deleteColumn(column);
            }}
            className="grey-500 rounded-md p-1 hover:bg-gray-300"
          >
            <TrashIcon />
          </button>
        </div>
        <div className="mt-2">
          {column.cards?.map((card: any) => (
            <Card
              key={card.id}
              card={card}
              deleteCard={deleteCard}
              editable={owner == currUser}
            />
          ))}
          <ModalCard addCard={addCard} />
        </div>
      </div>
    );
  } else {
    return (
      <div key={column.id} className="rounded-md bg-gray-200 p-4">
        <h2 className="text-lg font-bold">{column.title}</h2>
        <div className="mt-2">
          {column.cards?.map((card: any) => (
            <Card
              key={card.id}
              card={card}
              deleteCard={deleteCard}
              editable={owner == currUser}
            />
          ))}
        </div>
      </div>
    );
  }
}
