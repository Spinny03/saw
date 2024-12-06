// app/page.tsx
"use client";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div>
        <h1>Benvenuto nella mia applicazione!</h1>
        <p>Logged in as {session.user?.name}</p>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    );
  }
  return (
    <div>
      <h1>Benvenuto nella mia applicazione!</h1>
      <p>Non sei autenticato</p>
      <button onClick={() => signIn()}>Login</button>
    </div>
  );
}
