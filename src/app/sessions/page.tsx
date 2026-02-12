'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import SessionForm from '@/components/SessionForm';
import SessionsTable from '@/components/SessionsTable';
import UserSelector from '@/components/UserSelector';
import { ShootingSession } from '@/lib/types';

function SessionsContent() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ShootingSession[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (userId) params.set('userId', userId);
      params.set('limit', '100');

      const res = await fetch(`/api/sessions?${params}`);
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleDeleteSession = async (id: number) => {
    if (!confirm('¿Eliminar esta sesión?')) return;

    try {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      fetchSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          📋 Historial de Sesiones
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Form */}
          <div className="lg:col-span-1">
            <SessionForm onSuccess={fetchSessions} />
          </div>

          {/* Right - Sessions list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="max-w-xs">
                <UserSelector
                  value={userId}
                  onChange={setUserId}
                  includeAll={true}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Cargando sesiones...
              </div>
            ) : (
              <SessionsTable
                sessions={sessions}
                onDelete={user ? handleDeleteSession : undefined}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SessionsPage() {
  return (
    <AuthProvider>
      <SessionsContent />
    </AuthProvider>
  );
}
