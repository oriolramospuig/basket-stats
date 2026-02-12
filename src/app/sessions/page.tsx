'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import SessionForm from '@/components/SessionForm';
import SessionsTable, { SessionsTableSkeleton } from '@/components/SessionsTable';
import UserSelector from '@/components/UserSelector';
import { ShootingSession } from '@/lib/types';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

function SessionsContent() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ShootingSession[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showMobileForm, setShowMobileForm] = useState(false);

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
      toast.error('Error al cargar las sesiones');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleDeleteSession = async (id: number) => {
    try {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      toast.success('Sesión eliminada');
      fetchSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Error al eliminar la sesión');
    }
  };

  const handleFormSuccess = () => {
    setShowMobileForm(false);
    fetchSessions();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="main-content container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">
          📋 Historial de Sesiones
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left - Form (desktop only) */}
          <div className="hidden lg:block lg:col-span-1">
            <SessionForm onSuccess={fetchSessions} />
          </div>

          {/* Right - Sessions list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4">
              <div className="max-w-xs">
                <UserSelector
                  value={userId}
                  onChange={setUserId}
                  includeAll={true}
                />
              </div>
            </div>

            {loading ? (
              <SessionsTableSkeleton />
            ) : (
              <SessionsTable
                sessions={sessions}
                onDelete={user ? handleDeleteSession : undefined}
              />
            )}
          </div>
        </div>
      </main>

      {/* Mobile FAB - New Session */}
      {user && (
        <button
          onClick={() => setShowMobileForm(true)}
          className="lg:hidden fixed bottom-20 right-4 z-40 bg-orange-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 active:scale-90 hover:bg-orange-700 hover:shadow-xl"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
          aria-label="Nueva sesión"
        >
          <Plus size={28} />
        </button>
      )}

      {/* Mobile form overlay */}
      {showMobileForm && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-end">
          <div
            className="w-full bg-gray-50 dark:bg-gray-900 rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 px-4 pt-4 pb-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Nueva Sesión</h2>
              <button
                onClick={() => setShowMobileForm(false)}
                className="p-2 rounded-lg hover:bg-gray-200 transition-all duration-150 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Cerrar"
              >
                <X size={22} />
              </button>
            </div>
            <div className="p-4">
              <SessionForm onSuccess={handleFormSuccess} />
            </div>
          </div>
        </div>
      )}
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
