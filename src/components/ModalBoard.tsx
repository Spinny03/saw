'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';

export default function ModalBoard() {
  interface User {
    id: number;
    name: string;
    image: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch('/api/user');
      const data = await response.json();
      setUsers(data);
    }
    fetchUsers();
  }, []);

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
              <Select.Root
                onValueChange={(value) =>
                  setSelectedUser(
                    users.find((user) => user.id === parseInt(value)) || null
                  )
                }
              >
                <Select.Trigger className="mt-2 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 shadow-sm sm:leading-6">
                  <Select.Value placeholder="Seleziona un utente" />
                </Select.Trigger>
                <Select.Content className="mt-2 rounded-md bg-white shadow-lg">
                  <Select.ScrollUpButton />
                  <Select.Viewport>
                    {users.map((user) => (
                      <Select.Item key={user.id} value={user.id.toString()}>
                        <Select.ItemText>
                          {' '}
                          <div className="flex cursor-pointer items-center p-2 hover:bg-gray-200">
                            <img
                              src={user.image}
                              alt={user.name}
                              className="mr-2 h-6 w-6 rounded-full"
                            />

                            {user.name}
                          </div>
                        </Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton />
                </Select.Content>
              </Select.Root>
            </div>
            {selectedUser && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900">
                  Utente selezionato: {selectedUser.name}
                </p>
              </div>
            )}
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
