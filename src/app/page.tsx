// app/page.tsx
'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { Flex, Text, Button } from '@radix-ui/themes';
import SideBar from '../components/SideBar';

export default function HomePage() {
  const { data: session } = useSession();
  const [boardName, setBoardName] = useState('');
  const [boardCreated, setBoardCreated] = useState(false);

  const createBoard = async () => {
    if (!boardName) return;

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
      setBoardCreated(true); // Notifica che una nuova board è stata creata
    } else {
      console.error('Errore nella creazione della board');
    }
  };

  if (session) {
    return (
      <div className="min-h-screen flex">
        <SideBar
          boardCreated={boardCreated}
          setBoardCreated={setBoardCreated}
        />
        <div className="flex-1">
          <Flex>
            <Text>Benvenuto nella mia applicazione!</Text>
            <p>Logged in as {session.user?.name}</p>
            <Button onClick={() => signOut()}>Logout</Button>
          </Flex>
          <div>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Nome della board"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
            <Button onClick={createBoard}>Crea Board</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <SideBar boardCreated={boardCreated} setBoardCreated={setBoardCreated} />
      <div className="flex-1">
        <Flex>
          <Text>Benvenuto nella mia applicazione!</Text>
          <p>Non sei autenticato</p>
          <Button onClick={() => signIn()}>Login</Button>
        </Flex>
      </div>
    </div>
  );
}
