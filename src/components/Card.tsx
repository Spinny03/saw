'use client';
import { Card as CardType } from '@prisma/client';
import { Cross1Icon, BellIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

interface CardProps {
  readonly card: CardType;
  readonly deleteCard: (card: CardType) => void;
  readonly editable: boolean;
}

const editCard = async (
  card: CardType,
  showToast: (message: string) => void
) => {
  try {
    const response = await fetch(
      `/api/columns/${card.columnId}/cards/${card.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: card.title,
          message: card.message,
          deadline: card.deadline,
        }),
      }
    );
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

export default function Card({ card, deleteCard, editable }: CardProps) {
  const [title, setTitle] = useState(card.title);
  const [message, setMessage] = useState(card.message);
  const [showDeadline, setShowDeadline] = useState(false);
  const { toast, setToast } = useToast();

  const showToast = (message: string) => {
    setToast({ open: true, title: message });
  };

  const handleTitleBlur = () => {
    if (title !== card.title) {
      card.title = title;
      editCard(card, showToast);
    }
  };

  const handleMessageBlur = () => {
    if (message !== card.message) {
      card.message = message;
      editCard(card, showToast);
    }
  };

  return (
    <div key={card.id} className="mb-2 rounded-md bg-white p-2 shadow">
      {editable && (
        <button
          className="float-right rounded-md p-1 text-black hover:bg-gray-300"
          onClick={() => {
            deleteCard(card);
          }}
        >
          <Cross1Icon />
        </button>
      )}
      <input
        type="text"
        value={title}
        readOnly={!editable}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
        className="w-full border-none text-lg font-bold focus:outline-none"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        readOnly={!editable}
        onBlur={handleMessageBlur}
        className="mt-2 w-full resize-none border-none focus:outline-none"
      />
      <span className="flex items-center">
        {showDeadline && (
          <div className="flex space-x-2">
            <input
              type="date"
              value={card.deadline ? card.deadline.getDate() : ''}
            />
            <input
              type="time"
              value={card.deadline ? card.deadline.getTime() : ''}
            />
          </div>
        )}
        <button
          className="ml-auto"
          onClick={() => {
            if (editable) {
              setShowDeadline((prev) => !prev);
            }
          }}
        >
          <BellIcon
            className={`h-5 w-5 ${
              showDeadline ? 'text-gray-900' : 'text-gray-300'
            }`}
            style={{ strokeWidth: 2 }}
          />
        </button>
      </span>
    </div>
  );
}
