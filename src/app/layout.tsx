//layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import SessionProvider from './SessionProvider';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Theme, ThemePanel } from '@radix-ui/themes';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  console.log('layout.tsx');
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Theme
            accentColor="crimson"
            grayColor="sand"
            radius="large"
            scaling="100%"
          >
            <div className="min-h-screen flex flex-col">
              <NavBar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </Theme>
        </SessionProvider>
      </body>
    </html>
  );
}
