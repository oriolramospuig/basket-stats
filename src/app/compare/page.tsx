'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import PeriodSelector from '@/components/PeriodSelector';
import CompareChart from '@/components/CompareChart';
import { Period, User } from '@/lib/types';

interface ComparisonData {
  user_id: number;
  display_name: string;
  total_sessions: number;
  total_free_throws_made: number;
  total_free_throws_attempted: number;
  total_three_pointers_made: number;
  total_three_pointers_attempted: number;
  free_throw_percentage: number;
  three_pointer_percentage: number;
  overall_percentage: number;
}

function CompareContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [period, setPeriod] = useState<Period>('all');
  const [comparisons, setComparisons] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchComparisons = useCallback(async () => {
    if (selectedUsers.length === 0) {
      setComparisons([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('userIds', selectedUsers.join(','));
      params.set('period', period);

      const res = await fetch(`/api/stats/compare?${params}`);
      const data = await res.json();
      setComparisons(data.comparisons || []);
    } catch (error) {
      console.error('Error fetching comparisons:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedUsers, period]);

  useEffect(() => {
    fetchComparisons();
  }, [fetchComparisons]);

  const toggleUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAll = () => {
    setSelectedUsers(users.map((u) => u.id));
  };

  const clearAll = () => {
    setSelectedUsers([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          📊 Comparar Estadísticas
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left - User selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Seleccionar Jugadores
              </h2>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={selectAll}
                  className="text-sm text-orange-600 hover:underline"
                >
                  Seleccionar todos
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={clearAll}
                  className="text-sm text-gray-500 hover:underline"
                >
                  Limpiar
                </button>
              </div>

              <div className="space-y-2">
                {users.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUser(user.id)}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-gray-700">{user.display_name}</span>
                  </label>
                ))}
              </div>

              {users.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No hay usuarios registrados
                </p>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período
                </label>
                <PeriodSelector value={period} onChange={setPeriod} />
              </div>
            </div>
          </div>

          {/* Right - Comparison results */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Cargando comparativa...
              </div>
            ) : (
              <>
                {/* Chart */}
                <CompareChart data={comparisons} />

                {/* Table */}
                {comparisons.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Jugador
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Sesiones
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Tiros Libres
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Triples
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Global
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {comparisons.map((comp) => (
                          <tr key={comp.user_id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                              {comp.display_name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-gray-600">
                              {comp.total_sessions}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <span className="font-semibold text-blue-600">
                                {comp.free_throw_percentage}%
                              </span>
                              <span className="text-gray-400 text-sm ml-1">
                                ({comp.total_free_throws_made}/{comp.total_free_throws_attempted})
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <span className="font-semibold text-green-600">
                                {comp.three_pointer_percentage}%
                              </span>
                              <span className="text-gray-400 text-sm ml-1">
                                ({comp.total_three_pointers_made}/{comp.total_three_pointers_attempted})
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <span className="font-semibold text-orange-600">
                                {comp.overall_percentage}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ComparePage() {
  return (
    <AuthProvider>
      <CompareContent />
    </AuthProvider>
  );
}
