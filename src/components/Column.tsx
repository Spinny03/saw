'use client';

import Card from './Card';

interface ColumnProps {
  readonly column: any;
}

export default function Column({ column }: ColumnProps) {
  const addCard = async () => {
    try {
      const response = await fetch(`/api/columns/${column.id}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'New Card' }),
      });
      if (response.ok) {
        const newCard = await response.json();
        column.cards.push(newCard);
      } else {
        console.error('Error adding card');
      }
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  return (
    <div key={column.id} className="rounded-md bg-gray-200 p-4">
      <h2 className="text-lg font-bold">{column.title}</h2>
      <div className="mt-2">
        {column.cards?.map((card: any) => <Card key={card.id} card={card} />)}
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
