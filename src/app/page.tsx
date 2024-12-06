// app/page.tsx
"use client";
import { signIn } from "next-auth/react";

export default function HomePage() {
  return (
    <div>
      <h1>Benvenuto nella mia applicazione!</h1>
      <button onClick={() => signIn("google")}>Login with Google</button>
    </div>
  );
}
