// app/page.tsx
'use client';
import { useSession } from 'next-auth/react';
import { Button } from '@radix-ui/themes';
import SideBar from '../components/SideBar';
import { useEffect, useState } from 'react';
import Column from '../components/Column';

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
        board.columns.push(newColumn);
        setBoard({ ...board });
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
            {board.columns?.map((column: any) => (
              <Column key={column.id} columnProp={column} />
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
