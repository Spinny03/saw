'use client';
import { Card as CardType } from '@prisma/client';

interface CardProps {
  readonly card: CardType;
}

function setTitle() {
  console.log('setTitle');
}

function setMessage() {
  console.log('setMessage');
}

export default function Card({ card }: CardProps) {
  return (
    <div key={card.id} className="mb-2 rounded-md bg-white p-2 shadow">
      <h3>
        <b>{card.title}</b>
      </h3>
      <p>{card.message}</p>
    </div>
  );
}
