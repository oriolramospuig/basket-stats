'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Home, BarChart3, ClipboardList, LogOut, LogIn, UserPlus, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/compare', label: 'Comparar', icon: BarChart3 },
    { href: '/sessions', label: 'Sesiones', icon: ClipboardList },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop top navbar */}
      <nav className="hidden md:block bg-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🏀</span>
              <span className="font-bold text-xl">Basket Stats</span>
            </Link>

            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md transition-all duration-150 flex items-center gap-2 ${
                    isActive(item.href)
                      ? 'bg-orange-700 font-semibold'
                      : 'hover:bg-orange-700'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}

              <div className="w-px h-8 bg-orange-400 mx-2" />

              <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-orange-700 transition-all duration-150 active:scale-95"
                aria-label="Cambiar tema"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-orange-200 text-sm">
                    {user.displayName}
                  </span>
                  <button
                    onClick={logout}
                    className="bg-orange-700 hover:bg-orange-800 px-3 py-2 rounded-md transition-all duration-150 active:scale-95 flex items-center gap-1.5"
                  >
                    <LogOut size={16} />
                    Salir
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="hover:bg-orange-700 px-3 py-2 rounded-md transition-all duration-150 flex items-center gap-1.5"
                  >
                    <LogIn size={16} />
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white text-orange-600 hover:bg-orange-100 px-3 py-2 rounded-md transition-all duration-150 font-medium flex items-center gap-1.5"
                  >
                    <UserPlus size={16} />
                    Registro
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile top bar (minimal) */}
      <div className="md:hidden bg-orange-600 text-white shadow-lg">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl">🏀</span>
            <span className="font-bold text-lg">Basket Stats</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="text-orange-200 hover:text-white p-2 rounded-md transition-all duration-150 active:scale-95"
                aria-label="Cambiar tema"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={logout}
                className="text-orange-200 hover:text-white p-2 rounded-md transition-all duration-150 active:scale-95"
                aria-label="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="text-orange-200 hover:text-white p-2 rounded-md transition-all duration-150 active:scale-95"
                aria-label="Cambiar tema"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link
                href="/login"
                className="text-orange-200 hover:text-white p-2 rounded-md transition-all duration-150"
              >
                <LogIn size={20} />
              </Link>
              <Link
                href="/register"
                className="bg-white text-orange-600 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 active:scale-95"
              >
                Registro
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom navigation bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 py-2 rounded-lg transition-all duration-150 active:scale-95 min-h-[48px] ${
                  active
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <item.icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-xs mt-0.5 ${active ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
