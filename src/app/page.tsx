// app/page.tsx
'use client';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { Flex, Text, Button } from '@radix-ui/themes';

export default function HomePage() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="min-h-screen">
        <Flex>
          <Text>Benvenuto nella mia applicazione!</Text>
          <p>Logged in as {session.user?.name}</p>
          <Button onClick={() => signOut()}>Logout</Button>
        </Flex>
      </div>
    );
  }
  return (
    <Flex>
      <Text>Benvenuto nella mia applicazione!</Text>
      <p>Non sei autenticato</p>
      <Button onClick={() => signIn()}>Login</Button>
    </Flex>
  );
}
