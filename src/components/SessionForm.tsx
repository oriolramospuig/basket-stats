'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { User } from '@/lib/types';
import { toast } from 'sonner';

interface SessionFormProps {
  onSuccess?: () => void;
}

export default function SessionForm({ onSuccess }: SessionFormProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    user_id: '',
    session_date: new Date().toISOString().split('T')[0],
    free_throws_made: '',
    free_throws_attempted: '',
    three_pointers_made: '',
    three_pointers_attempted: '',
    notes: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (user && !formData.user_id) {
      setFormData((prev) => ({ ...prev, user_id: user.id.toString() }));
    }
  }, [user, formData.user_id]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      console.error('Error fetching users');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: parseInt(formData.user_id),
          session_date: formData.session_date,
          free_throws_made: parseInt(formData.free_throws_made) || 0,
          free_throws_attempted: parseInt(formData.free_throws_attempted) || 0,
          three_pointers_made: parseInt(formData.three_pointers_made) || 0,
          three_pointers_attempted: parseInt(formData.three_pointers_attempted) || 0,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setSuccess('¡Sesión registrada correctamente!');
      toast.success('¡Sesión registrada!');
      setFormData({
        user_id: user?.id.toString() || '',
        session_date: new Date().toISOString().split('T')[0],
        free_throws_made: '',
        free_throws_attempted: '',
        three_pointers_made: '',
        three_pointers_attempted: '',
        notes: '',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la sesión');
      toast.error('Error al guardar la sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-800 dark:text-yellow-300">
        <p>Debes iniciar sesión para registrar una sesión de tiro.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">📝 Registrar Sesión</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Jugador
          </label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-gray-200 min-h-[44px]"
          >
            <option value="">Seleccionar jugador</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.display_name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha
          </label>
          <input
            type="date"
            name="session_date"
            value={formData.session_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-gray-200 min-h-[44px]"
          />
        </div>

        {/* Free throws */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🎯 Tiros Libres
          </label>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div>
              <input
                type="number"
                name="free_throws_made"
                value={formData.free_throws_made}
                onChange={handleChange}
                min="0"
                placeholder="Anotados"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-gray-200 min-h-[44px]"
              />
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">/</span>
            <div>
              <input
                type="number"
                name="free_throws_attempted"
                value={formData.free_throws_attempted}
                onChange={handleChange}
                min="0"
                placeholder="Intentados"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-gray-200 min-h-[44px]"
              />
            </div>
          </div>
        </div>

        {/* Three pointers */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🏀 Triples
          </label>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div>
              <input
                type="number"
                name="three_pointers_made"
                value={formData.three_pointers_made}
                onChange={handleChange}
                min="0"
                placeholder="Anotados"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-gray-200 min-h-[44px]"
              />
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">/</span>
            <div>
              <input
                type="number"
                name="three_pointers_attempted"
                value={formData.three_pointers_attempted}
                onChange={handleChange}
                min="0"
                placeholder="Intentados"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-gray-200 min-h-[44px]"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notas (opcional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            placeholder="Ej: Buen día, viento fuerte, etc."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-medium min-h-[48px]"
      >
        {loading ? 'Guardando...' : 'Guardar Sesión'}
      </button>
    </form>
  );
}
