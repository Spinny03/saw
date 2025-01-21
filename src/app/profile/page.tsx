// app/profile/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@radix-ui/themes';

export default function ProfilePage() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt="Avatar"
                className="mr-4 h-16 w-16 rounded-full"
              />
            ) : (
              <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white">
                {session.user.name?.slice(0, 2).toUpperCase()}
              </div>
            )}
            <h1 className="text-xl font-bold">Modifica Credenziali</h1>
          </div>
          <form className="space-y-4">
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                onChange={() => console.log(session.user)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Nome Utente
              </label>
              <input
                type="text"
                onChange={() => console.log(session.user.name)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button className="w-full transform rounded-lg bg-blue-500 px-6 py-3 font-bold text-white shadow-md transition-all duration-200 hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300">
              Salva Modifiche
            </Button>
          </form>
        </div>
      </div>
    );
  }
}
