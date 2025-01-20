'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import * as Avatar from '@radix-ui/react-avatar';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import * as Dialog from '@radix-ui/react-dialog';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import LoginDialog from './LogInDialog';

type SearchResult = {
  columns: Array<{
    id: number;
    title: string;
    boardId: number;
  }>;
  cardTitles: Array<{
    id: number;
    title: string;
    columnId: number;
    boardId: number;
  }>;
  cardMessages: Array<{
    id: number;
    message: string;
    columnId: number;
    boardId: number;
  }>;
};

const Navbar: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult>({
    columns: [],
    cardTitles: [],
    cardMessages: [],
  });
  const [searchQuery, setSearchQuery] = useState('');

  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input field

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  const fetchResults = async (query: string) => {
    try {
      const url = new URL(
        `/api/search?query=${encodeURIComponent(query)}`,
        window.location.origin
      );
      const response = await fetch(url.toString(), { method: 'GET' });

      if (!response.ok) {
        throw new Error(`Errore nella ricerca: ${response.statusText}`);
      }

      const data: SearchResult = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Errore durante la ricerca:', error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsSearching(true);
      fetchResults(event.currentTarget.value);
      setIsSearching(false);
    }
  };

  const highlightSearchQuery = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index}>{part}</strong>
      ) : (
        part
      )
    );
  };

  const goToBoard = (boardId: number) => {
    closeSearchModal();
    sessionStorage.setItem('selectedBoard', boardId.toString());
    window.dispatchEvent(new Event('storage'));
    console.log('Navigating to board:', boardId);
  };

  // Focus the input when the modal is opened
  useEffect(() => {
    if (isSearchModalOpen && inputRef.current) {
      inputRef.current.focus(); // Focus the input field
      inputRef.current.select();
    }
  }, [isSearchModalOpen]);

  // Check if search results are empty
  const isSearchEmpty = !(
    searchResults.columns.length > 0 ||
    searchResults.cardTitles.length > 0 ||
    searchResults.cardMessages.length > 0
  );

  return (
    <Toolbar.Root className="flex items-center justify-between bg-gray-800 px-6 py-4 text-white">
      <Toolbar.Button
        className="text-lg font-bold focus:outline-none"
        onClick={() => router.push('/')}
      >
        CoralApp
      </Toolbar.Button>

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
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Avatar.Root className="h-10 w-10 cursor-pointer rounded-full">
              <Avatar.Image
                src={session?.user?.image ?? '/vercel.svg'}
                alt={session?.user?.name ?? 'Profile'}
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
        <LoginDialog />
      )}

      <Dialog.Root open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-md bg-gray-400 p-6">
            <span>
              <Dialog.Title className="text-lg font-bold">Cerca</Dialog.Title>
              <button
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-black"
                onClick={closeSearchModal}
              >
                Chiudi
              </button>
            </span>
            <input
              ref={inputRef} // Attach the ref to the input
              type="text"
              placeholder="Cerca..."
              className="mt-4 w-full rounded-md bg-gray-200 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
              onKeyDown={handleKeyDown}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isSearching && (
              <div className="mt-2 text-gray-400">Cerca in corso...</div>
            )}
            <div className="mt-4 max-h-60 overflow-y-auto">
              {isSearchEmpty ? (
                <div className="text-center text-gray-500">
                  Nessun Risultato trovato
                </div>
              ) : (
                <>
                  {searchResults.columns &&
                    searchResults.columns.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-800">Colonne</h3>
                        <ul>
                          {searchResults.columns.map((column) => (
                            <li
                              key={column.id}
                              className="cursor-pointer py-2 text-gray-600"
                              onClick={() => goToBoard(column.boardId)}
                            >
                              {highlightSearchQuery(column.title, searchQuery)}{' '}
                              (Board ID: {column.boardId})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  {searchResults.cardTitles &&
                    searchResults.cardTitles.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-bold text-gray-800">Card Titoli</h3>
                        <ul>
                          {searchResults.cardTitles.map((card) => (
                            <li
                              key={card.id}
                              className="cursor-pointer py-2 text-gray-600"
                              onClick={() => goToBoard(card.boardId)}
                            >
                              {highlightSearchQuery(card.title, searchQuery)}{' '}
                              (Board ID: {card.boardId})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  {searchResults.cardMessages &&
                    searchResults.cardMessages.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-bold text-gray-800">
                          Messaggi Card
                        </h3>
                        <ul>
                          {searchResults.cardMessages.map((card) => (
                            <li
                              key={card.id}
                              className="cursor-pointer py-2 text-gray-600"
                              onClick={() => goToBoard(card.boardId)}
                            >
                              {highlightSearchQuery(card.message, searchQuery)}{' '}
                              (Board ID: {card.boardId})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </Toolbar.Root>
  );
};

export default Navbar;
