'use client';

interface CardProps {
  readonly id: number;
  readonly title: string;
}

export default function Card({ id, title }: CardProps) {
  return (
    <div key={id} className="mb-2 rounded-md bg-white p-2 shadow">
      <p>{title}</p>
    </div>
  );
}
