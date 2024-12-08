'use client';

interface ColumnProps {
  readonly id: number;
  readonly title: string;
}

export default function Column({ id, title }: ColumnProps) {
  return (
    <div key={id} className="rounded-md bg-gray-200 p-4">
      <h2 className="text-lg font-bold">{title}</h2>
      {/* Add tasks or other column content here */}
    </div>
  );
}
