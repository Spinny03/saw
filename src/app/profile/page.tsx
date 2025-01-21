// app/profile/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@radix-ui/themes';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState(session?.user.email || '');
  const [name, setName] = useState(session?.user.name || '');
  const [surname, setSurname] = useState(session?.user.surname || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setEmail(session?.user.email || '');
    setName(session?.user.name || '');
    setSurname(session?.user.surname || '');
  }, [session]);

  const handleImageClick = () => {
    document.getElementById('profileImageInput')?.click();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!currentPassword || !newPassword) {
      setErrorMessage('Inserisci entrambe le password');
      return;
    }

    const response = await fetch('/api/user/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (response.ok) {
      setSuccessMessage('Password modificata con successo!');
      setCurrentPassword('');
      setNewPassword('');
    } else if (response.status === 401) {
      setErrorMessage('Password corrente non valida');
    } else {
      setErrorMessage('Errore durante il cambio password');
    }
  };

  const handleSaveChanges = async () => {
    console.log('Email:', email);
    console.log('Name:', name);
    console.log('Surname:', surname);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('surname', surname);
    if (profileImage) {
      formData.append('image', profileImage);
    }

    const response = await fetch('/api/user/me', {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      setSuccessMessage('Modifiche salvate con successo!');
      setTimeout(() => setSuccessMessage(''), 3000); // Nascondi il messaggio dopo 3 secondi
    }
  };

  if (session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
          {successMessage && (
            <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-700">
              {successMessage}
            </div>
          )}
          <div className="mb-6 flex items-center">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt="Avatar"
                className="mr-4 h-16 w-16 cursor-pointer rounded-full"
                onClick={handleImageClick}
              />
            ) : (
              <div
                className="mr-4 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white"
                onClick={handleImageClick}
              >
                {session.user.name?.slice(0, 2).toUpperCase()}
              </div>
            )}
            <h1 className="text-xl font-bold">Modifica Credenziali</h1>
          </div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveChanges();
            }}
          >
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Cognome
              </label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                id="profileImageInput"
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>
            <Button
              type="submit"
              className="w-full transform rounded-lg bg-blue-500 px-6 py-3 font-bold text-white shadow-md transition-all duration-200 hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Salva Modifiche
            </Button>
          </form>

          {/* Password Change Form */}
          <div className="mt-8 border-t pt-6">
            <h2 className="mb-4 text-lg font-bold">Cambia Password</h2>
            {errorMessage && (
              <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
                {errorMessage}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleChangePassword}>
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Password Corrente
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Nuova Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full transform rounded-lg bg-green-500 px-6 py-3 font-bold text-white shadow-md transition-all duration-200 hover:bg-green-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Cambia Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
