'use client';
import { Card as CardType } from '@prisma/client';
import { useState } from 'react';

interface CardProps {
  readonly card: CardType;
}

const editCardName = async (card: CardType, cardName: string) => {
  try {
    const response = await fetch(`/api/columns/${card.columnId}/cards/id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: card.id, title: cardName }),
    });
    if (response.ok) {
      console.log('Card name updated');
    } else {
      console.error('Error updating card title');
    }
  } catch (error) {
    console.error('Error updating card title:', error);
  }
};

const editCardMessage = async (card: CardType, cardMessage: string) => {
  try {
    const response = await fetch(
      `/api/columns/${card.columnId}/cards/message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: card.id, message: cardMessage }),
      }
    );
    if (response.ok) {
      console.log('Card message updated');
    } else {
      console.error('Error updating card message');
    }
  } catch (error) {
    console.error('Error updating card message:', error);
  }
};

export default function Card({ card }: CardProps) {
  const [title, setTitle] = useState(card.title);
  const [message, setMessage] = useState(card.message);

  const handleTitleBlur = () => {
    if (title !== card.title) {
      editCardName(card, title);
    }
  };

  const handleMessageBlur = () => {
    if (message !== card.message) {
      editCardMessage(card, message);
    }
  };

  return (
    <div key={card.id} className="mb-2 rounded-md bg-white p-2 shadow">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
        className="w-full border-none text-lg font-bold focus:outline-none"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onBlur={handleMessageBlur}
        className="mt-2 w-full resize-none border-none focus:outline-none"
      />
    </div>
  );
}
