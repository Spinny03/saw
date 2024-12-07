// components/Navbar.tsx
'use client';
import React, { useState } from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import * as Avatar from '@radix-ui/react-avatar';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as Dialog from '@radix-ui/react-dialog';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

const Navbar: React.FC = () => {
  const router = useRouter();
  const session = useSession();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  return (
    <Toolbar.Root className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
      {/* Logo */}
      <Toolbar.Button
        className="text-lg font-bold focus:outline-none"
        onClick={() => router.push('/')}
      >
        MyApp
      </Toolbar.Button>

      {/* Search Bar or Icon */}
      <div className="flex-1 mx-4">
        <div className="hidden sm:block">
          <input
            type="text"
            placeholder="Cerca..."
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="block sm:hidden">
          <MagnifyingGlassIcon
            className="w-6 h-6 cursor-pointer"
            onClick={openSearchModal}
          />
        </div>
      </div>

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

      {/* Search Modal */}
      <Dialog.Root open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 bg-white rounded-md">
            <Dialog.Title className="text-lg font-bold">Cerca</Dialog.Title>
            <input
              type="text"
              placeholder="Cerca..."
              className="w-full mt-4 px-4 py-2 bg-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={closeSearchModal}
            >
              Chiudi
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </Toolbar.Root>
  );
};

export default Navbar;
