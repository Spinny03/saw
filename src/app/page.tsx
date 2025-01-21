'use client';
import { useSession } from 'next-auth/react';
import StartingGuide from '../components/StartingGuide';
import SideBar from '../components/SideBar';
import { useEffect, useMemo, useState } from 'react';
import Column from '../components/Column';
import ModalBoard from '@/components/ModalBoard';
import { useRouter } from 'next/navigation';
import { Column as PrismaColumn, Card as PrismaCard } from '@prisma/client';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import ChatButton from '@/components/ChatButton';
import { ReloadIcon, TrashIcon } from '@radix-ui/react-icons';
import LoadingScreen from '@/components/LoadingScreen';
import Spinner from '@/components/Spinner';

interface ColumnType extends PrismaColumn {
  cards: PrismaCard[];
}

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [board, setBoard] = useState<any>([]);
  const [boardTitle, setBoardTitle] = useState<string>(''); // Board title state
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [addingCol, setAddingCol] = useState<boolean>(false);
  const columnsIds = useMemo(() => columns.map((c) => c.id), [columns]);

  const [sidebarTrigger, setSidebarTrigger] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [loadingColumns, setLoadingColumns] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/landing');
      return;
    }

    const loadLastSelectedBoard = () => {
      const storedBoard = sessionStorage.getItem('selectedBoard');
      if (storedBoard) {
        setSelectedBoard(storedBoard);
        handleBlockSelect(storedBoard);
      } else {
        const userBoard = session?.user.lastBoard;
        if (userBoard) {
          handleBlockSelect(userBoard);
        }
      }
    };

    loadLastSelectedBoard();
    setLoading(false);
  }, [status, session, router]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      const eventVals = {
        key: event.key,
        boardId: event.newValue,
      };
      console.log('Storage event:', eventVals);
      if (eventVals.key === 'selectedBoard') {
        handleBlockSelect(eventVals.boardId ?? '');
        console.log('Selected board:', eventVals.boardId);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleBlockSelect = async (blockId: string) => {
    setSelectedBoard(blockId);
    setLoadingColumns(true);
    try {
      const response = await fetch(`/api/board/${blockId}`);
      const data = await response.json();
      setBoard(data || []);
      setBoardTitle(data?.title || ''); // Initialize the board title
      const sortedColumns = (data.columns || []).sort(
        (a: ColumnType, b: ColumnType) => a.boardOrder - b.boardOrder
      );
      setColumns(sortedColumns);
      sessionStorage.setItem('selectedBoard', blockId);
    } catch (error) {
      console.error('Error fetching columns:', error);
    }
    setLoadingColumns(false);
  };

  const editUsers = async (usersToAdd: string[], usersToRemove: string[]) => {
    if (!selectedBoard || !session) return;

    if (
      usersToAdd.includes(session.user.id) ||
      usersToRemove.includes(session.user.id)
    ) {
      console.error('Cannot add or remove the current user.');
      return;
    }

    try {
      const response = await fetch(`/api/board/${selectedBoard}/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usersToAdd, usersToRemove }),
      });

      if (response.ok) {
        const updatedUsers = await response.json();
        setBoard((prevBoard: any) => ({
          ...prevBoard,
          users: prevBoard.users
            .filter((user: any) => !usersToRemove.includes(user.id))
            .concat(updatedUsers),
        }));
        handleBlockSelect(selectedBoard);
      } else {
        console.error('Error updating users');
      }
    } catch (error) {
      console.error('Error updating users:', error);
    }
  };

  const updateBoardTitle = async (newTitle: string) => {
    try {
      const response = await fetch(`/api/board/${selectedBoard}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle }),
      });
      if (!response.ok) {
        console.error('Failed to update the board title.');
      }
      setSidebarTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Error updating board title:', error);
    }
  };

  const deleteBoard = async () => {
    try {
      const response = await fetch(`/api/board/${selectedBoard}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        console.error('Failed to delete current Board.');
      }
      setSidebarTrigger((prev) => prev + 1);
      handleBlockSelect('');
    } catch (error) {
      console.error('Error deleting current board:', error);
    }
  };

  const handleTitleBlur = () => {
    if (boardTitle !== board.title) {
      setBoard((prevBoard: any) => ({ ...prevBoard, title: boardTitle }));
      updateBoardTitle(boardTitle);
    }
  };

  const addColumn = async () => {
    if (!selectedBoard) return;
    setAddingCol(true);
    try {
      const response = await fetch(`/api/board/${selectedBoard}/columns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New Column',
          boardOrder: columns.length,
        }),
      });
      if (response.ok) {
        const newColumn = await response.json();
        setColumns((prevColumns) => {
          const updatedColumns = [...prevColumns, newColumn];
          updatedColumns.sort((a, b) => a.boardOrder - b.boardOrder);
          return updatedColumns;
        });
      } else {
        console.error('Error adding column');
      }
    } catch (error) {
      console.error('Error adding column:', error);
    }
    setAddingCol(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // funzioni per il Drago

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'column') {
      setActiveColumn(event.active.data.current.column);
    }
  }

  const deleteColumn = async (columnId: number) => {
    try {
      const response = await fetch(`/api/columns/${columnId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setColumns((columns) =>
          columns.filter((column) => column.id !== columnId)
        );
      }
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  function moveColumn(fromIndex: number, toIndex: number) {
    setColumns((columns) => {
      const updatedColumns = arrayMove(columns, fromIndex, toIndex);
      updatedColumns.forEach((column, index) => {
        if (column.boardOrder !== index) {
          column.boardOrder = index;
          fetch(`/api/columns/${column.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ boardOrder: index }),
          });
        }
      });
      return updatedColumns;
    });
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;
    const activeIndex = columns.findIndex((c) => c.id === activeColumnId);
    const overIndex = columns.findIndex((c) => c.id === overColumnId);

    moveColumn(activeIndex, overIndex);
  }

  if (session) {
    return (
      <div className="flex min-h-screen overflow-x-hidden">
        <SideBar
          onBlockSelect={handleBlockSelect}
          initialBlock={selectedBoard ?? ''}
          sidebarTrigger={sidebarTrigger}
        />
        {loadingColumns ? (
          <LoadingScreen />
        ) : selectedBoard && selectedBoard !== '' ? (
          <div className="mb-20 flex-1 px-5" id="boardContents">
            <div className="flex items-center justify-between pb-10 pt-2">
              {/* Editable Board Title */}

              <div className="flex items-center rounded-lg bg-white p-4 shadow-md">
                <input
                  type="text"
                  value={boardTitle}
                  onChange={(e) => setBoardTitle(e.target.value)}
                  readOnly={session?.user.id !== board.ownerId}
                  onBlur={handleTitleBlur}
                  className={`rounded-md border-none bg-transparent px-2 text-lg font-semibold text-gray-800 ${session?.user.id === board.ownerId ? 'focus:outline-none focus:ring-2 focus:ring-blue-500' : ''}`}
                />
                <button
                  onClick={() => handleBlockSelect(selectedBoard)}
                  className="grey-500 rounded-md p-1 hover:bg-gray-300"
                >
                  <ReloadIcon />
                </button>
                {session?.user.id === board.ownerId && (
                  <button
                    onClick={() => deleteBoard()}
                    className="grey-500 ml-1 rounded-md p-1 hover:bg-gray-300"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>

              {/* "Utenti" Section */}
              {board.users && (
                <div className="flex items-center gap-2 rounded-lg bg-white p-4 shadow-md">
                  <span className="text-sm font-semibold text-gray-600">
                    Gestisci
                    <br />
                    Utenti:
                  </span>
                  <ModalBoard
                    editUsers={editUsers}
                    currUser={session.user.id}
                    board={board}
                    clickable={session?.user.id === board.ownerId}
                  />
                </div>
              )}
            </div>
            <DndContext
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              sensors={sensors}
            >
              <div className="flex flex-col gap-4 overflow-y-auto overflow-x-visible lg:flex-row lg:overflow-x-auto lg:overflow-y-visible">
                <SortableContext items={columnsIds}>
                  {columns
                    .toSorted((a, b) => a.boardOrder - b.boardOrder)
                    .map((column: ColumnType) => (
                      <Column
                        key={column.id}
                        columnProp={column}
                        deleteColumn={deleteColumn}
                        owner={board.ownerId}
                      />
                    ))}
                </SortableContext>
                {selectedBoard && session?.user.id === board.ownerId && (
                  <button
                    onClick={addColumn}
                    className="ml-1 mt-1 h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-blue-500 text-white"
                  >
                    {addingCol ? <Spinner /> : '+'}
                  </button>
                )}
              </div>
            </DndContext>
          </div>
        ) : (
          <StartingGuide />
        )}

        {selectedBoard && <ChatButton selectedBoard={selectedBoard} />}
      </div>
    );
  } else {
    return <div>Unauthenticated</div>;
  }
}
