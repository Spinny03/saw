'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import * as Avatar from '@radix-ui/react-avatar';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import * as Dialog from '@radix-ui/react-dialog';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import LoginDialog from './LogInDialog';

type SearchResult = {
  boards: Array<{
    id: number;
    title: string;
    owner: { name: string };
  }>;
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
  const [searchStatus, setSearchStatus] = useState<
    'idle' | 'searching' | 'complete' | 'nextSearch'
  >('idle');
  const [searchResults, setSearchResults] = useState<SearchResult>({
    boards: [],
    columns: [],
    cardTitles: [],
    cardMessages: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const isMainPage = usePathname() === '/';
  const isLandingPage = usePathname() === '/landing';

  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input field

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  const fetchResults = async (query: string) => {
    setSearchStatus('searching'); // Set status to searching when starting
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
      console.log('Risultati ricerca:', data);
      setSearchStatus('complete'); // Set status to complete after receiving results
    } catch (error) {
      console.error('Errore durante la ricerca:', error);
      setSearchStatus('idle'); // Reset to idle on error
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchResults(event.currentTarget.value);
    }
  };

  const highlightSearchQuery = (text: string, query: string) => {
    if (!text) return '';

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
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'selectedBoard',
        newValue: boardId.toString(),
      })
    );
    console.log('Navigating to board:', boardId);
  };

  function emptyResults() {
    setSearchResults({
      boards: [],
      columns: [],
      cardTitles: [],
      cardMessages: [],
    });
  }

  // Clear search results when the modal is closed
  useEffect(() => {
    if (!isSearchModalOpen) {
      emptyResults();
      setSearchStatus('idle');
    }
  }, [isSearchModalOpen]);

  // Check if search results are empty
  const isSearchEmpty = !(
    searchResults.columns.length > 0 ||
    searchResults.cardTitles.length > 0 ||
    searchResults.cardMessages.length > 0 ||
    searchResults.boards.length > 0
  );

  return (
    <Toolbar.Root className="flex items-center justify-between bg-gray-800 px-6 py-4 text-gray-100">
      <Toolbar.Button
        className="text-lg font-bold transition-all hover:text-white focus:outline-none"
        onClick={() => router.push('/landing')}
      >
        CoralApp
      </Toolbar.Button>

      {!isMainPage && session && (
        <button
          onClick={() => router.push('/')}
          className="ml-12 mr-auto text-white transition-all hover:text-white"
        >
          Visualizza le board
        </button>
      )}

      {session && isMainPage && (
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
              onClick={() => router.push('/')}
            >
              Boards
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
        <Dialog.Overlay
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => {
            console.log('Overlay clicked, closing modal');
            setIsSearchModalOpen(false);
          }}
        />
        <Dialog.Content
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full max-w-md scale-100 transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ease-out">
            <span className="flex items-center justify-between">
              <Dialog.Title className="text-2xl font-semibold text-gray-800">
                Cerca
              </Dialog.Title>
              <Dialog.Close className="text-sm font-medium text-blue-500 transition duration-200 hover:text-blue-700">
                Chiudi
              </Dialog.Close>
            </span>
            <input
              ref={inputRef}
              type="text"
              autoFocus
              placeholder="Cerca..."
              className="mt-4 w-full rounded-md border-2 border-gray-300 bg-gray-100 px-4 py-2 text-gray-700 transition duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                emptyResults();
                setSearchStatus('nextSearch');
              }}
            />
            <div className="mt-4 max-h-60 overflow-y-auto">
              {isSearchEmpty ? (
                <div className="mt-4">
                  {searchStatus === 'idle' && (
                    <p className="text-center text-sm font-normal text-gray-700 opacity-80">
                      Prova ad usare i tag{' '}
                      <span className="font-medium text-blue-600">@Column</span>{' '}
                      e <span className="font-medium text-blue-600">@Card</span>{' '}
                      per cercare!
                    </p>
                  )}
                  {searchStatus === 'searching' && (
                    <p className="animate-wave text-center text-sm font-normal text-blue-500 opacity-90">
                      Ricerca in corso...
                    </p>
                  )}
                  {searchStatus === 'complete' && (
                    <p className="text-center text-sm font-normal text-gray-600 opacity-80">
                      Nessun Risultato Trovato
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {searchResults.columns &&
                    searchResults.columns.length > 0 && (
                      <div>
                        <h3 className="mb-2 font-semibold text-gray-800">
                          Colonne
                        </h3>
                        <ul>
                          {searchResults.columns.map((column) => (
                            <li
                              key={column.id}
                              className="cursor-pointer rounded-md px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-100"
                              onClick={() => goToBoard(column.boardId)}
                            >
                              {highlightSearchQuery(column.title, searchQuery)}{' '}
                              <span className="text-xs text-gray-400">
                                (Board ID: {column.boardId})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  {searchResults.cardTitles &&
                    searchResults.cardTitles.length > 0 && (
                      <div className="mt-4">
                        <h3 className="mb-2 font-semibold text-gray-800">
                          Card Titoli
                        </h3>
                        <ul>
                          {searchResults.cardTitles.map((card) => (
                            <li
                              key={card.id}
                              className="cursor-pointer rounded-md px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-100"
                              onClick={() => goToBoard(card.boardId)}
                            >
                              {highlightSearchQuery(card.title, searchQuery)}{' '}
                              <span className="text-xs text-gray-400">
                                (Board ID: {card.boardId})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  {searchResults.cardMessages &&
                    searchResults.cardMessages.length > 0 && (
                      <div className="mt-4">
                        <h3 className="mb-2 font-semibold text-gray-800">
                          Messaggi Card
                        </h3>
                        <ul>
                          {searchResults.cardMessages.map((card) => (
                            <li
                              key={card.id}
                              className="cursor-pointer rounded-md px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-100"
                              onClick={() => goToBoard(card.boardId)}
                            >
                              {highlightSearchQuery(card.message, searchQuery)}{' '}
                              <span className="text-xs text-gray-400">
                                (Board ID: {card.boardId})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  {searchResults.boards && searchResults.boards.length > 0 && (
                    <div className="mt-4">
                      <h3 className="mb-2 font-semibold text-gray-800">
                        Boards
                      </h3>
                      <ul>
                        {searchResults.boards.map((board) => (
                          <li
                            key={board.id}
                            className="cursor-pointer rounded-md px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-100"
                            onClick={() => goToBoard(board.id)}
                          >
                            {highlightSearchQuery(board.title, searchQuery)}{' '}
                            <span className="text-xs text-gray-400">
                              (Owner: {board.owner.name}, Board ID: {board.id})
                            </span>
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
