// app/page.tsx
'use client';
import { useSession } from 'next-auth/react';
import { Button } from '@radix-ui/themes';
import SideBar from '../components/SideBar';
import { useEffect, useState } from 'react';
import Column from '../components/Column';
import { Avatar, AvatarGroup } from '@mui/material';
import ModalBoard from '../components/ModalBoard';

export default function HomePage() {
  const { data: session } = useSession();
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [board, setBoard] = useState<any>([]);

  const handleBlockSelect = async (blockId: string) => {
    setSelectedBoard(blockId);
    try {
      const response = await fetch(`/api/board/${blockId}`);
      const data = await response.json();
      setBoard(data || []);
    } catch (error) {
      console.error('Error fetching columns:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/board/${selectedBoard}`);
        const data = await response.json();
        setBoard(data || []);
      } catch (error) {
        console.error('Error fetching columns:', error);
      }
    };

    fetchData();
  }, [selectedBoard]);

  const addUser = async (userId: string) => {
    if (!selectedBoard) return;
    try {
      const response = await fetch(`/api/board/${selectedBoard}/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        const newUser = await response.json();
        board.users.push(newUser);
        setBoard({ ...board });
      } else {
        console.error('Error adding user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const addColumn = async () => {
    if (!selectedBoard) return;
    try {
      const response = await fetch(`/api/board/${selectedBoard}/columns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'New Column' }),
      });
      if (response.ok) {
        const newColumn = await response.json();
        if (!board.columns) {
          board.columns = [];
        }
        board.columns.push(newColumn);
        setBoard({ ...board });
      } else {
        console.error('Error adding column');
      }
    } catch (error) {
      console.error('Error adding column:', error);
    }
  };

  function deleteColumn(column: any): void {
    throw new Error('Function not implemented.');
  }

  if (session) {
    return (
      <div className="flex min-h-screen">
        <SideBar onBlockSelect={handleBlockSelect} />
        <div className="flex-1 px-5">
          {board.users && (
            <div className="flex flex-row gap-4 py-2">
              <ModalBoard addUser={addUser} />
              <AvatarGroup total={board.users.lenght} max={4}>
                {board.users?.map((user: any) => (
                  <Avatar key={user.id} src={user.image} alt={user.name} />
                ))}
              </AvatarGroup>
            </div>
          )}
          <div className="flex flex-row gap-4">
            {board.columns?.map((column: any) => (
              <Column
                key={column.id}
                columnProp={column}
                deleteColumn={deleteColumn}
              />
            ))}
            {selectedBoard && (
              <div className="w-full pb-4">
                <button
                  onClick={addColumn}
                  className="mt-2 w-12 rounded-md bg-blue-500 p-3 text-white"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  // ...existing code...
}
