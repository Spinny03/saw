'use client';
import { Card as CardType } from '@prisma/client';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

interface CardProps {
  readonly card: CardType;
}

const editCard = async (card: CardType) => {
  try {
    const response = await fetch(
      `/api/columns/${card.columnId}/cards/${card.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: card.title, message: card.message }),
      }
    );
    if (response.ok) {
      console.log('Card name updated');
    } else {
      console.error('Error updating card title');
    }
  } catch (error) {
    console.error('Error updating card title:', error);
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
      console.log('Card deleted');
    } else {
      console.error('Error deleting card');
    }
  } catch (error) {
    console.error('Error deleting card:', error);
  }
};

export default function Card({ card }: CardProps) {
  const [title, setTitle] = useState(card.title);
  const [message, setMessage] = useState(card.message);

  const handleTitleBlur = () => {
    if (title !== card.title) {
      card.title = title;
      editCard(card);
    }
  };

  const handleMessageBlur = () => {
    if (message !== card.message) {
      card.message = message;
      editCard(card);
    }
  };

  return (
    <div key={card.id} className="mb-2 rounded-md bg-white p-2 shadow">
      <button
        className="float-right text-black"
        onClick={() => {
          deleteCard(card);
        }}
      >
        <Cross1Icon />
      </button>
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
