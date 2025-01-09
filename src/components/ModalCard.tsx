'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

export default function ModalCard({
  addCard,
  setIsDraggable,
}: {
  addCard: (title: string, message: string) => void;
  setIsDraggable: (isDraggable: boolean) => void;
}) {
  interface AddColumnForm {
    title: string;
    message: string;
  }

  const [form, setForm] = useState<AddColumnForm>({
    title: '',
    message: '',
  });

  return (
    <Dialog.Root onOpenChange={(isOpen) => setIsDraggable(isOpen)}>
      <Dialog.Trigger className="mt-2 rounded bg-blue-500 p-2 text-white hover:bg-blue-700">
        Aggiungi Scheda
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-bold">
              Aggiungi Scheda
            </Dialog.Title>
            <Dialog.Close className="ml-2 rounded-md bg-red-500 p-2 text-white">
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
                onChange={(e) => setForm({ ...form, title: e.target.value })}
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
              <textarea
                id="input-contenuto"
                autoFocus
                className="mt-2 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 shadow-sm sm:leading-6"
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                defaultValue={''}
                rows={4}
              />
            </div>
          </div>
          <Dialog.Close
            onClick={() => {
              addCard(form.title, form.message);
            }}
            className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Aggiungi
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
