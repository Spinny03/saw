// app/page.tsx
'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Flex, Text, Button } from '@radix-ui/themes';
import SideBar from '../components/SideBar';
import { useState } from 'react';
import Column from '../components/Column';
import { Column as ColumnType } from '@prisma/client';

export default function HomePage() {
  const { data: session } = useSession();
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [columns, setColumns] = useState<ColumnType[]>([]);

  const handleBlockSelect = async (blockId: string) => {
    setSelectedBoard(blockId);
    try {
      const response = await fetch(`/api/board/${blockId}/columns`);
      const data = await response.json();
      setColumns(data || []);
    } catch (error) {
      console.error('Error fetching columns:', error);
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
        setColumns([...columns, newColumn]);
      } else {
        console.error('Error adding column');
      }
    } catch (error) {
      console.error('Error adding column:', error);
    }
  };

  if (session) {
    return (
      <div className="flex min-h-screen">
        <SideBar onBlockSelect={handleBlockSelect} />
        <div className="flex-1">
          <h1>Selezionato: {selectedBoard}</h1>
          <div className="flex flex-row gap-4">
            {columns.map((column) => (
              <Column key={column.id} id={column.id} title={column.title} />
            ))}
            {selectedBoard && (
              <Button onClick={addColumn}>Aggiungi Colonna</Button>
            )}
          </div>
        </div>
      </div>
    );
  }
  // ...existing code...
}
