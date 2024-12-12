'use client';

import Card from './Card';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';

interface ColumnProps {
  readonly columnProp: any;
}

export default function Column({ columnProp }: ColumnProps) {
  const [column, setColumn] = useState<any>(columnProp);

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

  return (
    <div key={column.id} className="rounded-md bg-gray-200 p-4">
      <h2 className="text-lg font-bold">{column.title}</h2>
      <div className="mt-2">
        {column.cards?.map((card: any) => <Card key={card.id} card={card} />)}
        <Dialog.Root>
          <Dialog.Trigger className="mt-2 rounded bg-blue-500 p-2 text-white">
            Aggiungi Scheda
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
            <Dialog.Content className="-translate-x-1.2 fixed left-1/2 top-1/2 -translate-y-1/2 rounded-md bg-white p-8 text-gray-900 shadow">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-bold">
                  Aggiungi Scheda
                </Dialog.Title>
                <Dialog.Close className="rounded-md bg-red-500 p-2 text-white">
                  <Cross1Icon />
                </Dialog.Close>
              </div>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="input-titolo"
                    className="text-sm font-medium text-gray-900"
                  >
                    Titolo
                  </label>
                  <input
                    id="input-titolo"
                    autoFocus
                    className="mt-2 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 shadow-sm sm:leading-6"
                    type="text"
                    defaultValue={'New Card'}
                  />
                </div>
                <div>
                  <label
                    htmlFor="input-contenuto"
                    className="text-sm font-medium text-gray-900"
                  >
                    Contenuto
                  </label>
                  <input
                    id="input-contenuto"
                    autoFocus
                    className="mt-2 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 shadow-sm sm:leading-6"
                    type="text"
                    defaultValue={''}
                  />
                </div>
              </div>
              <Dialog.Close
                onClick={() => {
                  const inputName = document.getElementById(
                    'input-titolo'
                  ) as HTMLInputElement;
                  const inputMessage = document.getElementById(
                    'input-contenuto'
                  ) as HTMLInputElement;
                  addCard(inputName.value, inputMessage.value);
                }}
                className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white"
              >
                Aggiungi
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
