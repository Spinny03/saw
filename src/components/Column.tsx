'use client';

import { useState, useEffect } from 'react';
import Card from './Card';

interface ColumnProps {
  readonly id: number;
  readonly title: string;
}

interface CardType {
  id: number;
  title: string;
}

export default function Column({ id, title }: ColumnProps) {
  const [cards, setCards] = useState<CardType[]>([]);

  useEffect(() => {
    // Fetch cards for this column
    fetch(`/api/columns/${id}/cards`)
      .then((response) => response.json())
      .then((data) => setCards(data || []))
      .catch((error) => console.error('Error fetching cards:', error));
  }, [id]);

  const addCard = async () => {
    try {
      const response = await fetch(`/api/columns/${id}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'New Card' }),
      });
      if (response.ok) {
        const newCard = await response.json();
        setCards([...cards, newCard]);
      } else {
        console.error('Error adding card');
      }
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  return (
    <div key={id} className="rounded-md bg-gray-200 p-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-2">
        {cards.map((card) => (
          <Card key={card.id} id={card.id} title={card.title} />
        ))}
        <button
          onClick={addCard}
          className="mt-2 rounded bg-blue-500 p-2 text-white"
        >
          Aggiungi Scheda
        </button>
      </div>
    </div>
  );
}
