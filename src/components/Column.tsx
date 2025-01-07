'use client';

import { useSession } from 'next-auth/react';
import Card from './Card';
import { useState } from 'react';
import { Card as CardType } from '@prisma/client';
import ModalCard from './ModalCard';
import { Cross1Icon } from '@radix-ui/react-icons';

interface ColumnProps {
  readonly columnProp: any;
  readonly deleteColumn: (column: any) => void;
  owner: string;
}

export default function Column({
  columnProp,
  deleteColumn,
  owner,
}: ColumnProps) {
  const { data: session } = useSession(); // Recupera i dati della sessione
  const [column, setColumn] = useState<any>(columnProp);

  const currUser = session?.user?.id;
  if (!currUser) {
    throw new Error('User is not authenticated'); // Lancia un errore se l'ID utente non è disponibile
  }

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

  if (owner == currUser) {
    return (
      <div key={column.id} className="rounded-md bg-gray-200 p-4">
        <h2 className="text-lg font-bold">{column.title}</h2>
        <button
          onClick={() => {
            deleteColumn(column);
          }}
          className="text-red-500"
        >
          <Cross1Icon />
        </button>
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
