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
    <Toolbar.Root className="flex items-center justify-between bg-gray-800 px-6 py-4 text-white">
      {/* Logo */}
      <Toolbar.Button
        className="text-lg font-bold focus:outline-none"
        onClick={() => router.push('/')}
      >
        CoralApp
      </Toolbar.Button>
      {/* Search Bar or Icon */}
      {session && (
        <div className="flex flex-1 justify-end">
          <div className="mx-40 hidden w-full md:block">
            <button
              className="w-full rounded-md bg-gray-700 px-4 py-2 text-left text-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
              onClick={openSearchModal}
            >
              Cerca...
            </button>
          </div>
          <div className="block md:hidden">
            <button className="p-2 text-gray-400 hover:text-white focus:outline-none">
              <MagnifyingGlassIcon
                className="h-6 w-6 text-gray-100"
                style={{ strokeWidth: 3 }}
                onClick={openSearchModal}
              />
            </button>
          </div>
        </div>
      )}
      {session ? (
        /* Profile Icon with Dropdown Menu */
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Avatar.Root className="h-10 w-10 cursor-pointer rounded-full">
              <Avatar.Image
                src={session?.user?.image || '/vercel.svg'}
                alt={session?.user?.name || 'Profile'}
                className="h-full w-full rounded-full"
              />
            </Avatar.Root>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="rounded-md bg-black p-2 shadow-lg">
            <DropdownMenu.Item
              className="cursor-pointer px-4 py-2 hover:bg-gray-200"
              onClick={() => router.push('/profile')}
            >
              Profile
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="cursor-pointer px-4 py-2 hover:bg-gray-200"
              onClick={() => signOut()}
            >
              Logout
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ) : (
        /* Login Button */
        <button
          className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => router.push('/api/auth/signin')}
        >
          LogIn/SingUp
        </button>
      )}
      {/* Search Modal */}
      <Dialog.Root open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-md bg-black p-6">
            <Dialog.Title className="text-lg font-bold">Cerca</Dialog.Title>
            <input
              type="text"
              placeholder="Cerca..."
              className="mt-4 w-full rounded-md bg-gray-200 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button
              className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-black"
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
