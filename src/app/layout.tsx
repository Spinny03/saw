//layout.tsx
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  console.log("layout.tsx");
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
