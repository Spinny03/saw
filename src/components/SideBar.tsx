'use client';
import { useEffect, useState } from 'react';
import { Root, Item } from '@radix-ui/react-toggle-group';
import { Board } from '@prisma/client';

interface SideBarProps {
  boardCreated: boolean;
  setBoardCreated: (created: boolean) => void;
}

export default function SideBar() {
  const [selectedBlock, setSelectedBlock] = useState('1');
  const [blocks, setBlocks] = useState<Board[]>([]);
  const [boardName, setBoardName] = useState('');

  const handleValueChange = (value: string) => {
    setSelectedBlock(value);
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
    <div className="w-20 h-screen bg-gray-100 flex flex-col items-center p-4 overflow-y-auto">
      <div className="w-full pb-4">
        <button
          onClick={createBoard}
          className="w-12 mt-2 p-3 bg-blue-500 text-white rounded-md"
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
                className={`w-12 h-12 flex items-center justify-center rounded-md cursor-pointer hover:bg-blue-700 active:ring-2 active:ring-offset-2 active:ring-gray-500 ${
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
