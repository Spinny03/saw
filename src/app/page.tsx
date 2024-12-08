// app/page.tsx
'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Flex, Text, Button } from '@radix-ui/themes';
import SideBar from '../components/SideBar';
import { useState } from 'react';

export default function HomePage() {
  const { data: session } = useSession();
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);

  const handleBlockSelect = (blockId: string) => {
    setSelectedBoard(blockId);
  };

  if (session) {
    return (
      <div className="flex min-h-screen">
        <SideBar onBlockSelect={handleBlockSelect} />
        <div className="flex-1">
          <Flex>
            <Text>Benvenuto nella mia applicazione!</Text>
            <p>Logged in as {session.user?.name}</p>
            <p>Selected Board: {selectedBoard}</p>
            <Button onClick={() => signOut()}>Logout</Button>
          </Flex>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <SideBar onBlockSelect={handleBlockSelect} />
      <div className="flex-1">
        <Flex>
          <Text>Benvenuto nella mia applicazione!</Text>
          <p>Non sei autenticato</p>
          <p>Selected Board: {selectedBoard}</p>
          <Button onClick={() => signIn()}>Login</Button>
        </Flex>
      </div>
    </div>
  );
}
