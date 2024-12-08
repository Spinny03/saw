'use client';
import { useEffect, useState } from 'react';
import { Root, Item } from '@radix-ui/react-toggle-group';
import { Board } from '@prisma/client';

interface SideBarProps {
  onBlockSelect: (blockId: string) => void;
}

export default function SideBar({ onBlockSelect }: SideBarProps) {
  const [selectedBlock, setSelectedBlock] = useState('1');
  const [blocks, setBlocks] = useState<Board[]>([]);
  const [boardName, setBoardName] = useState('');

  const handleValueChange = (value: string) => {
    if (!value) return;
    setSelectedBlock(value);
    onBlockSelect(value);
  };

  const createBoard = async () => {
    const response = await fetch('/api/board', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: boardName }),
    });

    if (response.ok) {
      const newBoard = await response.json();
      setBoardName('');
      setBlocks([...blocks, newBoard]);
    } else {
      console.error('Errore nella creazione della board');
    }
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
  }, []); // Ricarica le board quando boardCreated cambia

  return (
    <div className="flex h-screen w-20 flex-col items-center overflow-y-auto bg-gray-100 p-4">
      <div className="w-full pb-4">
        <button
          onClick={createBoard}
          className="mt-2 w-12 rounded-md bg-blue-500 p-3 text-white"
        >
          +
        </button>
      </div>
      <div>
        <Root
          type="single"
          defaultValue="1"
          aria-label="Sidebar blocks"
          className="flex flex-col gap-4"
          onValueChange={handleValueChange}
        >
          {blocks.length > 0 ? (
            blocks.map((block: Board) => (
              <Item
                key={block.id}
                value={block.id.toString()}
                aria-label={`Block ${block.id}`}
                className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-md hover:bg-blue-700 active:ring-2 active:ring-gray-500 active:ring-offset-2 ${
                  selectedBlock === block.id.toString()
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                {block.id}
              </Item>
            ))
          ) : (
            <p>No blocks available</p>
          )}
        </Root>
      </div>
    </div>
  );
}
