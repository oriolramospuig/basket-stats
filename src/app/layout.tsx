import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Basket Stats - Estadísticas de Tiro',
  description: 'Registra y analiza tus estadísticas de tiro de baloncesto',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
