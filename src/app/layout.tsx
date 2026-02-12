import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Basket Stats - Estadísticas de Tiro',
  description: 'Registra y analiza tus estadísticas de tiro de baloncesto',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Basket Stats',
  },
  icons: {
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ea580c',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <ThemeProvider>
          {children}
          <Toaster position="top-center" richColors closeButton duration={3000} />
        </ThemeProvider>
      </body>
    </html>
  );
}
