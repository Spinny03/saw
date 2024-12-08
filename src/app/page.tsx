// app/page.tsx
'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Flex, Text, Button } from '@radix-ui/themes';
import SideBar from '../components/SideBar';

export default function HomePage() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="min-h-screen flex">
        <SideBar />
        <div className="flex-1">
          <Flex>
            <Text>Benvenuto nella mia applicazione!</Text>
            <p>Logged in as {session.user?.name}</p>
            <Button onClick={() => signOut()}>Logout</Button>
          </Flex>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <SideBar />
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
