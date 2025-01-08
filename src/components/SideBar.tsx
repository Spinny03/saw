'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Root, Item } from '@radix-ui/react-toggle-group';
import { Board } from '@prisma/client';

interface SideBarProps {
  readonly onBlockSelect: (blockId: string) => void;
}

export default function SideBar({ onBlockSelect }: SideBarProps) {
  const [selectedBlock, setSelectedBlock] = useState('1');
  const [blocks, setBlocks] = useState<Board[]>([]);
  const [boardName, setBoardName] = useState('');
  const { data: session } = useSession(); // Recupera i dati della sessione

  const currUser = session?.user?.id;
  if (!currUser) {
    throw new Error('User is not authenticated'); // Lancia un errore se l'ID utente non è disponibile
  }

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
    <div className="w-25 flex h-screen flex-col items-center overflow-y-auto bg-gray-100 p-4">
      <h1>
        <strong>My Boards</strong>
      </h1>
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
          {blocks.length > 0
            ? blocks
                .filter((block: Board) => block.ownerId === currUser)
                .map((block: Board) => (
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
            : null}
        </Root>
        <h1 className="mb-4 mt-4">
          <strong>Host Boards</strong>
        </h1>
        <Root
          type="single"
          defaultValue="1"
          aria-label="Sidebar blocks"
          className="flex flex-col gap-4"
          onValueChange={handleValueChange}
        >
          {blocks.length > 0
            ? blocks
                .filter((block: Board) => block.ownerId !== currUser)
                .map((block: Board) => (
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
            : null}
        </Root>
      </div>
    </div>
  );
}
