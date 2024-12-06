//layout.tsx
import { ReactNode } from 'react';
import SessionProvider from './SessionProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  console.log('layout.tsx');
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
