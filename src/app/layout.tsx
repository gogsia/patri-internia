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
        <title>Solarpunk Interiors | 3D Design Explorer</title>
        <meta
          name="description"
          content="Immersive 3D solarpunk interior design platform with godlike orbital navigation"
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
