'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import SessionForm from '@/components/SessionForm';
import StatsCard, { StatsCardSkeleton } from '@/components/StatsCard';
import TrendChart, { TrendChartSkeleton } from '@/components/TrendChart';
import UserSelector from '@/components/UserSelector';
import PeriodSelector from '@/components/PeriodSelector';
import SessionsTable, { SessionsTableSkeleton } from '@/components/SessionsTable';
import { Period, ShootingSession } from '@/lib/types';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const [period, setPeriod] = useState<Period>('monthly');
  const [userId, setUserId] = useState<string>('');
  const [stats, setStats] = useState<any>(null);
  const [daily, setDaily] = useState<any[]>([]);
  const [sessions, setSessions] = useState<ShootingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileForm, setShowMobileForm] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('period', period);
      if (userId) params.set('userId', userId);

      const [statsRes, sessionsRes] = await Promise.all([
        fetch(`/api/stats?${params}`),
        fetch(`/api/sessions?${params}&limit=10`),
      ]);

      const statsData = await statsRes.json();
      const sessionsData = await sessionsRes.json();

      setStats(statsData.stats);
      setDaily(statsData.daily || []);
      setSessions(sessionsData.sessions || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [period, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteSession = async (id: number) => {
    try {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      toast.success('Sesión eliminada');
      fetchData();
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Error al eliminar la sesión');
    }
  };

  const handleFormSuccess = () => {
    setShowMobileForm(false);
    fetchData();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
          <span className="text-gray-500">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="main-content container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left column - Form (desktop only) */}
          <div className="hidden lg:block lg:col-span-1">
            <SessionForm onSuccess={fetchData} />
          </div>

          {/* Right column - Stats */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
                <div className="flex-1">
                  <UserSelector
                    value={userId}
                    onChange={setUserId}
                    includeAll={true}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Período
                  </label>
                  <PeriodSelector value={period} onChange={setPeriod} />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            {loading ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <StatsCardSkeleton key={i} />
                  ))}
                </div>
                <TrendChartSkeleton />
                <div>
                  <div className="skeleton w-36 h-5 rounded mb-4" />
                  <SessionsTableSkeleton />
                </div>
              </>
            ) : stats ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <StatsCard
                    title="Tiros Libres"
                    value={`${stats.free_throw_percentage}%`}
                    subtitle={`${stats.total_free_throws_made}/${stats.total_free_throws_attempted}`}
                    icon="🎯"
                    color="blue"
                  />
                  <StatsCard
                    title="Triples"
                    value={`${stats.three_pointer_percentage}%`}
                    subtitle={`${stats.total_three_pointers_made}/${stats.total_three_pointers_attempted}`}
                    icon="🏀"
                    color="green"
                  />
                  <StatsCard
                    title="Global"
                    value={`${stats.overall_percentage}%`}
                    subtitle="Todos los tiros"
                    icon="📊"
                    color="orange"
                  />
                  <StatsCard
                    title="Sesiones"
                    value={stats.total_sessions}
                    subtitle="Entrenamientos"
                    icon="📅"
                    color="purple"
                  />
                </div>

                {/* Trend Chart */}
                <TrendChart data={daily} />

                {/* Recent Sessions */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">
                    Últimas Sesiones
                  </h3>
                  <SessionsTable
                    sessions={sessions}
                    onDelete={user ? handleDeleteSession : undefined}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No hay datos disponibles
              </div>
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

export default function HomePage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
