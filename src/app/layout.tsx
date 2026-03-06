import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solarpunk Interiors | 3D Design Explorer",
  description:
    "Immersive 3D solarpunk interior design platform with godlike orbital navigation",
  keywords: "solarpunk, interior design, 3D, eco-futurism, interactive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100">{children}</body>
    </html>
  );
}
