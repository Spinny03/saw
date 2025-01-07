// app/page.tsx
'use client';
import { useSession } from 'next-auth/react';
import SideBar from '../components/SideBar';
import { useEffect, useState } from 'react';
import Column from '../components/Column';
import { Avatar, AvatarGroup } from '@mui/material';
import ModalBoard from '../components/ModalBoard';

export default function HomePage() {
  const { data: session } = useSession();
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [board, setBoard] = useState<any>([]);

  const handleBlockSelect = async (blockId: string) => {
    setSelectedBoard(blockId);
    try {
      const response = await fetch(`/api/board/${blockId}`);
      const data = await response.json();
      setBoard(data || []);
    } catch (error) {
      console.error('Error fetching columns:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/board/${selectedBoard}`);
        const data = await response.json();
        setBoard(data || []);
      } catch (error) {
        console.error('Error fetching columns:', error);
      }
    };

    fetchData();
  }, [selectedBoard]);

  const addUser = async (userId: string) => {
    if (!selectedBoard) return;
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
        board.users.push(newUser);
        setBoard({ ...board });
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
        body: JSON.stringify({ title: 'New Column' }),
      });
      if (response.ok) {
        const newColumn = await response.json();
        if (!board.columns) {
          board.columns = [];
        }
        board.columns.push(newColumn);
        setBoard({ ...board });
      } else {
        console.error('Error adding column');
      }
    } catch (error) {
      console.error('Error adding column:', error);
    }
  };

  function deleteColumn(column: any): void {
    fetch(`/api/columns/${column.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          board.columns = board.columns.filter((c: any) => c.id !== column.id);
          setBoard({ ...board });
          console.log('Column deleted');
        } else {
          console.error('Error deleting column');
        }
      })
      .catch((error) => {
        console.error('Error deleting column:', error);
      });
  }

  if (session) {
    return (
      <div className="flex min-h-screen">
        <SideBar onBlockSelect={handleBlockSelect} />
        <div className="flex-1 px-5">
          {board.users && (
            <div className="flex flex-row gap-4 py-2">
              <ModalBoard addUser={addUser} />
              <AvatarGroup total={board.users.lenght} max={4}>
                {board.users?.map((user: any) => (
                  <Avatar key={user.id} src={user.image} alt={user.name} />
                ))}
              </AvatarGroup>
            </div>
          )}
          <div className="flex flex-row gap-4">
            {board.columns?.map((column: any) => (
              <Column
                key={column.id}
                columnProp={column}
                deleteColumn={deleteColumn}
              />
            ))}
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
        </div>
      </div>
    );
  } else {
    // MAINPAGE CON DESCRIZIONE TODO
    return (
      <div className="bg-gray-100 text-gray-900">
        {/* Header Section */}
        <header className="bg-teal-500 py-10 text-center text-white">
          <h1 className="text-4xl font-semibold">CoralApp</h1>
          <p className="mt-2 text-lg">
            Gestione Task per Team. Organizza, Collabora e Raggiungi i Tuoi
            Obiettivi!
          </p>
        </header>

        {/* Navigation Bar */}
        <nav className="bg-gray-800">
          <ul className="flex justify-center space-x-8 py-4">
            <li>
              <a
                href="#cosa-facciamo"
                className="rounded px-4 py-2 text-white hover:bg-teal-500"
              >
                Cosa Facciamo
              </a>
            </li>
            <li>
              <a
                href="#chi-siamo"
                className="rounded px-4 py-2 text-white hover:bg-teal-500"
              >
                Chi Siamo
              </a>
            </li>
            <li>
              <a
                href="#dove-siamo"
                className="rounded px-4 py-2 text-white hover:bg-teal-500"
              >
                Dove Siamo
              </a>
            </li>
            <li>
              <a
                href="#contatti"
                className="rounded px-4 py-2 text-white hover:bg-teal-500"
              >
                Contatti
              </a>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="mx-auto max-w-screen-xl px-4 py-16">
          {/* Cosa Facciamo */}
          <section id="cosa-facciamo" className="mb-20">
            <h2 className="mb-4 text-3xl font-bold">Cosa Facciamo</h2>
            <p className="text-lg leading-relaxed">
              CoralApp è uno strumento intuitivo e potente che aiuta i team a
              organizzare e monitorare i propri task. Con la possibilità di
              creare board condivise, assegnare attività, e collaborare in tempo
              reale, facilitiamo la gestione dei progetti, aumentando
              produttività e trasparenza.
            </p>
          </section>

          {/* Product Description */}
          <section className="mb-20 flex flex-col items-center justify-between lg:flex-row">
            <img
              src="https://via.placeholder.com/600x400"
              alt="CoralApp Example"
              className="mb-8 w-full rounded-lg shadow-lg lg:mb-0 lg:w-1/2"
            />
            <div className="lg:w-1/2">
              <h2 className="mb-4 text-2xl font-semibold">
                Organizza il tuo lavoro in modo semplice e visivo
              </h2>
              <p className="text-lg leading-relaxed">
                Con CoralApp puoi creare boards personalizzate per ogni
                progetto, aggiungere task, monitorare progressi e assegnare
                responsabilità. Rendi la gestione dei tuoi progetti chiara e
                facilmente comprensibile per tutti i membri del team.
              </p>
            </div>
          </section>

          {/* Chi Siamo */}
          <section id="chi-siamo" className="mb-20">
            <h2 className="mb-4 text-3xl font-bold">Chi Siamo</h2>
            <p className="text-lg leading-relaxed">
              Siamo un team di esperti in gestione dei progetti e sviluppo
              software. Il nostro obiettivo è semplificare la vita dei team di
              lavoro, creando strumenti potenti e facili da usare. Crediamo che
              un buon software di collaborazione possa fare la differenza nella
              produttività e nel successo di ogni azienda.
            </p>
          </section>

          {/* Dove Siamo */}
          <section id="dove-siamo" className="mb-20">
            <h2 className="mb-4 text-3xl font-bold">Dove Siamo</h2>
            <p className="text-lg leading-relaxed">
              CoralApp è un prodotto globale. Il nostro team è distribuito tra
              diverse località, ma lavoriamo insieme come una squadra per
              costruire un prodotto che aiuti team di ogni parte del mondo. La
              nostra sede principale si trova a Milano, Italia.
            </p>
          </section>

          {/* Team Section */}
          <section className="mb-20">
            <h2 className="mb-4 text-3xl font-bold">Il Nostro Team</h2>
            <div className="flex justify-around">
              <div className="text-center">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Filippo Spinella"
                  className="mb-4 rounded-full"
                />
                <p className="font-semibold">Filippo Spinella</p>
                <p>Fondatore</p>
              </div>
              <div className="text-center">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Andrea Garaccioni"
                  className="mb-4 rounded-full"
                />
                <p className="font-semibold">Andrea Garaccioni</p>
                <p>Co-Fondatore</p>
              </div>
            </div>
          </section>

          {/* Contatti */}
          <section id="contatti" className="mb-20">
            <h2 className="mb-4 text-3xl font-bold">Contattaci</h2>
            <p className="mb-4 text-lg leading-relaxed">
              Hai domande o desideri provare CoralApp? Contattaci oggi!
            </p>
            <p className="text-lg font-semibold">
              Email:{' '}
              <a href="mailto:support@coralapp.com" className="text-teal-500">
                support@coralapp.com
              </a>
            </p>
            <p className="text-lg font-semibold">Telefono: +39 123 456 789</p>
          </section>
        </div>
      </div>
    );
  }
  // ...existing code...
}
