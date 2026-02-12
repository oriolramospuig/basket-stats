'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-orange-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏀</span>
            <span className="font-bold text-xl">Basket Stats</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="hover:bg-orange-700 px-3 py-2 rounded-md transition"
            >
              Dashboard
            </Link>
            <Link
              href="/compare"
              className="hover:bg-orange-700 px-3 py-2 rounded-md transition"
            >
              Comparar
            </Link>
            <Link
              href="/sessions"
              className="hover:bg-orange-700 px-3 py-2 rounded-md transition"
            >
              Sesiones
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-orange-200">
                  Hola, {user.displayName}
                </span>
                <button
                  onClick={logout}
                  className="bg-orange-700 hover:bg-orange-800 px-3 py-2 rounded-md transition"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="hover:bg-orange-700 px-3 py-2 rounded-md transition"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-orange-600 hover:bg-orange-100 px-3 py-2 rounded-md transition font-medium"
                >
                  Registro
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
