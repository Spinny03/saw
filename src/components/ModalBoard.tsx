'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';
import { Avatar, AvatarGroup } from '@mui/material';

export default function ModalBoard({
  editUsers,
  currUser,
  board,
  clickable,
}: {
  editUsers: (usersToAdd: string[], usersToRemove: string[]) => Promise<void>;
  currUser: string;
  board: any;
  clickable: boolean;
}) {
  interface User {
    id: string;
    name: string;
    image: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [usersToRemove, setUsersToRemove] = useState<string[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch('/api/user');
      const data = await response.json();
      setUsers(data);

      // Preload users already in the board into selectedUsers
      const boardUserIds = board.users.map((user: any) => user.id);
      setSelectedUsers(boardUserIds);
    }
    fetchUsers();
  }, [board.users]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prevSelected) => {
      const isSelected = prevSelected.includes(userId);
      const newSelectedUsers = isSelected
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId];

      // If deselected, add to usersToRemove if the user was already in the board
      if (isSelected) {
        // If it was already in the board, add it to usersToRemove
        if (board.users.some((user: any) => user.id === userId)) {
          setUsersToRemove((prev) => [...prev, userId]);
        }
      } else {
        // If selected again, remove it from usersToRemove
        setUsersToRemove((prev) => prev.filter((id) => id !== userId));
      }

      return newSelectedUsers;
    });
  };

  const handleConfirm = async () => {
    const boardUserIds = board.users.map((user: any) => user.id);

    // Create usersToAdd by filtering out the users already in the board from selectedUsers
    const usersToAdd = selectedUsers.filter(
      (id) => !boardUserIds.includes(id) && id !== board.ownerId
    );

    // Ensure usersToRemove only contains users that were originally in the board
    const usersToRemoveFinal = usersToRemove.filter((userId) =>
      board.users.some((user: any) => user.id === userId)
    );

    // Call the editUsers API to add and remove users
    await editUsers(usersToAdd, usersToRemoveFinal);
  };

  return (
    <Dialog.Root>
      {clickable ? (
        <Dialog.Trigger>
          <AvatarGroup total={board.users.length} max={4}>
            {board.users
              ?.toSorted((a: any, b: any) =>
                a.id === board.ownerId ? -1 : b.id === board.ownerId ? 1 : 0
              )
              .map((user: any) => (
                <Avatar key={user.id} src={user.image} alt={user.name} />
              ))}
          </AvatarGroup>
        </Dialog.Trigger>
      ) : (
        <div>
          <AvatarGroup className="z-10" total={board.users.length} max={4}>
            {board.users?.map((user: any) => (
              <Avatar key={user.id} src={user.image} alt={user.name} />
            ))}
          </AvatarGroup>
        </div>
      )}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-bold">
              Gestisci Utenti
            </Dialog.Title>
            <Dialog.Close className="ml-2 rounded-md bg-red-500 p-2 text-white">
              <Cross1Icon />
            </Dialog.Close>
          </div>
          <div className="mt-4 space-y-4">
            <div className="h-48 overflow-y-auto rounded-md border border-gray-300">
              {users.length > 0 ? (
                users.map((user) => {
                  // Skip the owner of the board
                  if (user.id === board.ownerId) return null;

                  const isSelected = selectedUsers.includes(user.id);

                  return (
                    <div
                      key={user.id}
                      className="flex cursor-pointer items-center justify-between p-2 hover:bg-gray-200"
                      onClick={() => toggleUserSelection(user.id)}
                    >
                      <div className="flex items-center">
                        <img
                          src={user.image}
                          alt={user.name}
                          className="mr-2 h-8 w-8 rounded-full"
                        />
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                      </div>
                      {isSelected && (
                        <span className="text-sm text-blue-500">✔</span>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="p-2 text-sm text-gray-500">
                  Nessun utente disponibile.
                </p>
              )}
            </div>
          </div>
          <Dialog.Close
            onClick={handleConfirm}
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Conferma
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
