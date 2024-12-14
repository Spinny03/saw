'use client';

interface AccField {
  readonly val: string;
}

export default function Card({ val }: AccField) {
  return (
    <div>
      <label className="mb-1 block font-medium text-gray-700">{val}</label>
      <input
        type={val}
        className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
