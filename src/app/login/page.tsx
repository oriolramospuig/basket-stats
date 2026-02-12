'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/components/AuthProvider';

function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-6xl">🏀</span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">Basket Stats</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Inicia sesión en tu cuenta</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-gray-200 min-h-[44px]"
              placeholder="Tu nombre de usuario"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-gray-200 min-h-[44px]"
              placeholder="Tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-medium min-h-[48px]"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-orange-600 hover:underline">
              Regístrate
            </Link>
          </p>
        </form>

        <p className="mt-4 text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
