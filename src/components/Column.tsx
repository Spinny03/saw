'use client';

import Card from './Card';
import { useState, useRef } from 'react';
import { Card as CardType } from '@prisma/client';
import ModalCard from './ModalCard';
import * as Toast from '@radix-ui/react-toast';

interface ColumnProps {
  readonly columnProp: any;
  readonly deleteColumn: (column: any) => void;
}

export default function Column({ columnProp, deleteColumn }: ColumnProps) {
  const [column, setColumn] = useState<any>(columnProp);
  const [open, setOpen] = useState(false);
  const eventDateRef = useRef(new Date());
  const timerRef = useRef(0);

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
    console.log('Deleting card:', card);
    const response = await fetch(
      `/api/columns/${card.columnId}/cards/${card.id}`,
      {
        method: 'DELETE',
      }
    );
    console.log('Response:', response);
    if (response.ok) {
      column.cards = column.cards.filter((c: CardType) => c.id !== card.id);
      setColumn({ ...column });
      console.log('Card deleted');
    } else if (response.status === 401) {
      console.log('Non autorizzato');
      setOpen(true);
    } else {
      console.error('Error deleting card');
    }
  };

  return (
    <>
      <div key={column.id} className="rounded-md bg-gray-200 p-4">
        <h2 className="text-lg font-bold">{column.title}</h2>
        <div className="mt-2">
          {column.cards?.map((card: any) => (
            <Card key={card.id} card={card} deleteCard={deleteCard} />
          ))}
          <ModalCard addCard={addCard} />
        </div>
      </div>
      <Toast.Root open={open} onOpenChange={setOpen}>
        <Toast.Title>No</Toast.Title>
        <Toast.Description asChild>
          <time dateTime={eventDateRef.current.toISOString()}>
            {eventDateRef.current.toLocaleString()}
          </time>
        </Toast.Description>
        <Toast.Action asChild altText="Goto schedule to undo">
          <button>Undo</button>
        </Toast.Action>
      </Toast.Root>
    </>
  );
}
