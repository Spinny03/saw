'use client';
import { useSession } from 'next-auth/react';
import SideBar from '../components/SideBar';
import { useEffect, useMemo, useState } from 'react';
import Column from '../components/Column';
import ModalBoard from '@/components/ModalBoard';
import { useRouter } from 'next/navigation';
import { Column as PrismaColumn, Card as PrismaCard } from '@prisma/client';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import ChatButton from '@/components/ChatButton';

interface ColumnType extends PrismaColumn {
  cards: PrismaCard[];
}

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [board, setBoard] = useState<any>([]);
  const [boardTitle, setBoardTitle] = useState<string>(''); // Board title state
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const columnsIds = useMemo(() => columns.map((c) => c.id), [columns]);

  const [sidebarTrigger, setSidebarTrigger] = useState<number>(0);
  const [loading, setLoading] = useState(true);

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

  const handleBlockSelect = async (blockId: string) => {
    setSelectedBoard(blockId);
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

  const handleTitleBlur = () => {
    if (boardTitle !== board.title) {
      setBoard((prevBoard: any) => ({ ...prevBoard, title: boardTitle }));
      updateBoardTitle(boardTitle);
    }
  };

  const addColumn = async () => {
    if (!selectedBoard) return;
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
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex min-h-screen overflow-x-hidden">
        <SideBar
          onBlockSelect={handleBlockSelect}
          initialBlock={selectedBoard ?? ''}
          sidebarTrigger={sidebarTrigger}
        />
        <div className="mb-20 flex-1 px-5">
          <div className="flex items-center justify-between">
            {/* Editable Board Title */}
            {selectedBoard && (
              <div className="flex items-center rounded-lg bg-white p-4 shadow-md">
                <input
                  type="text"
                  value={boardTitle}
                  onChange={(e) => setBoardTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  className="rounded-md border-none bg-transparent px-2 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* "Utenti" Section */}
            {board.users && (
              <div className="flex items-center gap-2 rounded-lg bg-white p-4 shadow-md">
                <span className="text-sm font-medium text-gray-700">
                  👥 Utenti:
                </span>
                <ModalBoard
                  editUsers={editUsers}
                  currUser={session.user.id}
                  board={board}
                />
              </div>
            )}
          </div>

          <DndContext sensors={sensors}>
            <div className="flex flex-col gap-4 overflow-y-auto overflow-x-visible lg:flex-row lg:overflow-x-auto lg:overflow-y-visible">
              <SortableContext items={columnsIds}>
                {columns
                  .toSorted((a, b) => a.boardOrder - b.boardOrder)
                  .map((column: ColumnType) => (
                    <Column
                      key={column.id}
                      columnProp={column}
                      deleteColumn={() => {}}
                      owner={board.ownerId}
                    />
                  ))}
              </SortableContext>
              {selectedBoard && (
                <div className="w-full pb-4">
                  <button
                    onClick={addColumn}
                    className="mt-2 w-12 rounded-md bg-blue-500 p-3 text-white"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </DndContext>
        </div>
        {selectedBoard && <ChatButton selectedBoard={selectedBoard} />}
      </div>
    );
  } else {
    return <div>Unauthenticated</div>;
  }
}
