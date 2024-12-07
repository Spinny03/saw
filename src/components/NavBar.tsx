// components/Navbar.tsx
'use client';
import React, { useState } from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import * as Avatar from '@radix-ui/react-avatar';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import * as Dialog from '@radix-ui/react-dialog';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const Navbar: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
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

      {/* Profile Icon with Dropdown Menu */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Avatar.Root className="w-10 h-10 rounded-full cursor-pointer">
            <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-gray-700 text-white font-medium">
              {session?.user?.name?.charAt(0).toUpperCase() || 'P'}
            </Avatar.Fallback>
          </Avatar.Root>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-black rounded-md shadow-lg p-2">
          <DropdownMenu.Item
            className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            onClick={() => router.push('/profile')}
          >
            Profile
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            onClick={() => signOut()}
          >
            Logout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {/* Search Modal */}
      <Dialog.Root open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 bg-black rounded-md">
            <Dialog.Title className="text-lg font-bold">Cerca</Dialog.Title>
            <input
              type="text"
              placeholder="Cerca..."
              className="w-full mt-4 px-4 py-2 bg-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-black rounded-md"
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
