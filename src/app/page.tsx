'use client';
import { useSession } from 'next-auth/react';
import SideBar from '../components/SideBar';
import { useEffect, useMemo, useState } from 'react';
import Column from '../components/Column';
import { Avatar, AvatarGroup } from '@mui/material';
import ModalBoard from '@/components/ModalBoard';
import LandingPage from '@/components/LandingPage';
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

interface ColumnType extends PrismaColumn {
  cards: PrismaCard[];
}

export default function HomePage() {
  const { data: session } = useSession();
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [board, setBoard] = useState<any>([]);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const columnsIds = useMemo(() => columns.map((c) => c.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    if (!session) return;

    const loadLastSelectedBoard = () => {
      // Attempt to load selected board from sessionStorage
      const storedBoard = sessionStorage.getItem('selectedBoard');
      if (storedBoard) {
        setSelectedBoard(storedBoard);
        handleBlockSelect(storedBoard);
      } else {
        // If no stored board, fallback to session user data
        const userBoard = session.user.lastBoard;
        if (userBoard) {
          setSelectedBoard(userBoard);
          handleBlockSelect(userBoard);
        }
      }
    };

    loadLastSelectedBoard();
  }, [session]);

  const handleBlockSelect = async (blockId: string) => {
    setSelectedBoard(blockId);
    try {
      const response = await fetch(`/api/board/${blockId}`);
      const data = await response.json();
      setBoard(data || []);
      const sortedColumns = (data.columns || []).sort(
        (a: ColumnType, b: ColumnType) => a.boardOrder - b.boardOrder
      );
      setColumns(sortedColumns);
      sessionStorage.setItem('selectedBoard', blockId); // Sync with sessionStorage
    } catch (error) {
      console.error('Error fetching columns:', error);
    }
  };

  const addUser = async (userId: string) => {
    if (!selectedBoard) return;
    if (userId === session?.user.id) return;
    if (board.users.some((user: any) => user.id === userId)) return;
    try {
      const response = await fetch(`/api/board/${selectedBoard}/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        const newUser = await response.json();
        setBoard((prevBoard: any) => ({
          ...prevBoard,
          users: [...prevBoard.users, newUser],
        }));
      } else {
        console.error('Error adding user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
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

  function deleteColumn(column: ColumnType): void {
    fetch(`/api/columns/${column.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          setColumns((prevColumns) =>
            prevColumns.filter((c) => c.id !== column.id)
          );
          console.log('Column deleted');
        } else {
          console.error('Error deleting column');
        }
      })
      .catch((error) => {
        console.error('Error deleting column:', error);
      });
  }

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!session) return;
      if (selectedBoard) {
        sessionStorage.setItem('selectedBoard', selectedBoard); // Sync with sessionStorage
        console.log('Saving selected board in sessionStorage:', selectedBoard);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload, {
      capture: true,
    });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [selectedBoard]);

  // Automatically update selectedBoard from sessionStorage when it changes
  useEffect(() => {
    const onStorageChange = () => {
      const storedBoard = sessionStorage.getItem('selectedBoard');
      console.log('Session board changed', storedBoard);
      if (storedBoard !== selectedBoard) {
        setSelectedBoard(storedBoard);
        handleBlockSelect(storedBoard || ''); // Handle empty string or fallback
      }
    };

    console.log('SessionStorage Event Listener Added!');
    window.addEventListener('storage', onStorageChange);
    return () => {
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  if (session) {
    return (
      <div className="flex min-h-screen overflow-x-hidden">
        <SideBar
          onBlockSelect={handleBlockSelect}
          initialBlock={selectedBoard ?? ''}
        />
        <div className="mb-20 flex-1 overflow-x-auto px-5">
          {board.users && (
            <div className="flex flex-row gap-4 py-2">
              <ModalBoard addUser={addUser} currUser={session.user.id} />
              <AvatarGroup total={board.users.length} max={4}>
                {board.users?.map((user: any) => (
                  <Avatar key={user.id} src={user.image} alt={user.name} />
                ))}
              </AvatarGroup>
            </div>
          )}
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
      </div>
    );
  } else {
    return <LandingPage />;
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'column') {
      setActiveColumn(event.active.data.current.column);
    }
  }

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
}
