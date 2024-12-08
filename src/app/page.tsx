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
          <h1>Selezionato: {selectedBoard}</h1>
        </div>
      </div>
    );
  }
}
