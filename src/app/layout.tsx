'use client';

import './globals.css';
import { HistoryProvider } from '@/hooks/useHistory';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Interia | 3D Interior Design Explorer</title>
        <meta
          name="description"
          content="Interia — immersive 3D interior design platform with portfolio showcase"
        />
        <meta
          name="keywords"
          content="solarpunk, interior design, 3D, eco-futurism, interactive"
        />
      </head>
      <body className="bg-gray-900 text-gray-100">
        <HistoryProvider>{children}</HistoryProvider>
      </body>
    </html>
  );
}
