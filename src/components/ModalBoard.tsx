'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';

export default function ModalBoard() {
  interface User {
    id: number;
    name: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch('https://api.example.com/users');
      const data = await response.json();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger className="mt-2 rounded bg-blue-500 p-2 text-white">
        +
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-bold">
              Aggiungi Utente
            </Dialog.Title>
            <Dialog.Close className="ml-2 rounded-md bg-red-500 p-2 text-white">
              <Cross1Icon />
            </Dialog.Close>
          </div>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="input-ricerca"
                className="text-sm font-medium text-gray-900"
              >
                Cerca Utente
              </label>
              <input
                id="input-ricerca"
                className="mt-2 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 shadow-sm sm:leading-6"
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
              <ul className="mt-2 max-h-40 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => 0}
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Dialog.Close
            onClick={() => {
              // addCard(form.title, form.message);
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
