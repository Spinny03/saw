'use client';
import React, { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import * as RadixDialog from '@radix-ui/react-dialog';

const LogIn = () => {
  const { data: session } = useSession();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn('credentials', { email, password });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    /* chiama l'endpoint di registrazione */
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name: firstName,
        surname: lastName,
      }),
    });
    if (response.ok) {
      await signIn('credentials', { email, password });
    } else if (response.status === 409) {
      alert('User already exists');
    } else if (response.status === 400) {
      alert('Invalid data');
    }
  };

  return (
    <div className="flex items-center justify-center">
      <RadixDialog.Root>
        <RadixDialog.Trigger asChild>
          <button className="rounded bg-blue-500 px-4 py-2 text-white">
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </RadixDialog.Trigger>
        <RadixDialog.Portal>
          <RadixDialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          <RadixDialog.Content className="fixed inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-md rounded bg-white p-6 shadow-lg">
              <RadixDialog.Title className="mb-4 text-xl font-bold">
                {isSignUp ? 'Sign Up' : 'Log In'}
              </RadixDialog.Title>
              <RadixDialog.Close asChild>
                <button className="absolute right-4 top-2 text-gray-500 hover:text-gray-700">
                  &times;
                </button>
              </RadixDialog.Close>
              <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                {isSignUp && (
                  <>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="mb-4 w-full rounded border p-2"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="mb-4 w-full rounded border p-2"
                    />
                  </>
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mb-4 w-full rounded border p-2"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mb-4 w-full rounded border p-2"
                />
                {isSignUp && (
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mb-4 w-full rounded border p-2"
                  />
                )}
                <button
                  type="submit"
                  className="w-full rounded bg-blue-500 px-4 py-2 text-white"
                >
                  {isSignUp ? 'Sign Up' : 'Log In'}
                </button>
              </form>
              <button
                className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white"
                onClick={() => signIn('google')}
              >
                Sign In with Google
              </button>
              <button
                className="mt-4 w-full px-4 py-2 text-blue-500"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? 'Already have an account? Log In'
                  : 'Don’t have an account? Sign Up'}
              </button>
            </div>
          </RadixDialog.Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    </div>
  );
};

export default LogIn;
