//layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import SessionProvider from './SessionProvider';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Theme } from '@radix-ui/themes';
import * as Toast from '@radix-ui/react-toast';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>CoralApp</title>
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <Theme
            accentColor="crimson"
            grayColor="sand"
            radius="large"
            scaling="100%"
          >
            <Toast.Provider swipeDirection="down">
              <div className="flex min-h-screen flex-col">
                <NavBar />
                <Toast.Viewport />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </Toast.Provider>
          </Theme>
        </SessionProvider>
      </body>
    </html>
  );
}
