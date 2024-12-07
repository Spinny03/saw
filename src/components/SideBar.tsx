'use client';
import { useEffect, useState } from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Board } from '@prisma/client';

interface SideBarProps {
  boardCreated: boolean;
  setBoardCreated: (created: boolean) => void;
}

export default function SideBar({
  boardCreated,
  setBoardCreated,
}: SideBarProps) {
  const [selectedBlock, setSelectedBlock] = useState('1');
  const [blocks, setBlocks] = useState<Board[]>([]);

  const handleValueChange = (value: string) => {
    setSelectedBlock(value);
  };

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await fetch('/api/board');
        const data = await response.json();
        setBlocks(data || []);
      } catch (error) {
        console.error('Error fetching blocks:', error);
      }
    };

    fetchBlocks();
  }, [boardCreated]); // Ricarica le board quando boardCreated cambia

  useEffect(() => {
    if (boardCreated) {
      setBoardCreated(false); // Resetta lo stato dopo aver ricaricato le board
    }
  }, [boardCreated, setBoardCreated]);

  return (
    <div className="w-20 h-screen bg-gray-100 flex flex-col items-center p-4 overflow-y-auto">
      <ToggleGroup.Root
        type="single"
        defaultValue="1"
        aria-label="Sidebar blocks"
        className="flex flex-col gap-4"
        onValueChange={handleValueChange}
      >
        {blocks.length > 0 ? (
          blocks.map((block: Board) => (
            <ToggleGroup.Item
              key={block.id}
              value={block.id.toString()}
              aria-label={`Block ${block.id}`}
              className={`w-12 h-12 flex items-center justify-center rounded-md cursor-pointer hover:bg-blue-700 active:ring-2 active:ring-offset-2 active:ring-gray-500 ${
                selectedBlock === block.id.toString()
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {block.id}
            </ToggleGroup.Item>
          ))
        ) : (
          <p>No blocks available</p>
        )}
      </ToggleGroup.Root>
    </div>
  );
}
