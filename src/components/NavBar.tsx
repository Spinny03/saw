// components/Navbar.tsx
'use client';
import React from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import * as Avatar from '@radix-ui/react-avatar';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Navbar: React.FC = () => {
  const router = useRouter();
  const session = useSession();

  return (
    <Toolbar.Root className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
      {/* Logo */}
      <Toolbar.Button
        className="text-lg font-bold focus:outline-none"
        onClick={() => router.push('/')}
      >
        MyApp
      </Toolbar.Button>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Cerca..."
        className="flex-1 mx-4 px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      />

      {/* Profile Icon */}
      <Avatar.Root className="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full cursor-pointer">
        <Avatar.Image
          src={session.data?.user?.image || '/path-to-profile-image.jpg'}
          alt="Profile"
          className="w-full h-full rounded-full"
          onClick={() => router.push('/profile')}
        />
        <Avatar.Fallback className="text-white font-medium">P</Avatar.Fallback>
      </Avatar.Root>
    </Toolbar.Root>
  );
};

export default Navbar;
