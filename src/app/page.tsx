'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import SessionForm from '@/components/SessionForm';
import StatsCard from '@/components/StatsCard';
import TrendChart from '@/components/TrendChart';
import UserSelector from '@/components/UserSelector';
import PeriodSelector from '@/components/PeriodSelector';
import SessionsTable from '@/components/SessionsTable';
import { Period, ShootingSession } from '@/lib/types';

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const [period, setPeriod] = useState<Period>('monthly');
  const [userId, setUserId] = useState<string>('');
  const [stats, setStats] = useState<any>(null);
  const [daily, setDaily] = useState<any[]>([]);
  const [sessions, setSessions] = useState<ShootingSession[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  }, [period, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteSession = async (id: number) => {
    if (!confirm('¿Eliminar esta sesión?')) return;

    try {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Form */}
          <div className="lg:col-span-1">
            <SessionForm onSuccess={fetchData} />
          </div>

          {/* Right column - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-1">
                  <UserSelector
                    value={userId}
                    onChange={setUserId}
                    includeAll={true}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Período
                  </label>
                  <PeriodSelector value={period} onChange={setPeriod} />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Cargando estadísticas...
              </div>
            ) : stats ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Últimas Sesiones
                  </h3>
                  <SessionsTable
                    sessions={sessions}
                    onDelete={user ? handleDeleteSession : undefined}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay datos disponibles
              </div>
            )}
          </div>
        </div>
      </main>
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
