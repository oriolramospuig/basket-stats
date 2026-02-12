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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="main-content container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">
          📊 Comparar Estadísticas
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Left - User selection */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Seleccionar Jugadores
              </h2>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={selectAll}
                  className="text-sm text-orange-600 hover:underline active:scale-95 transition-all duration-150"
                >
                  Seleccionar todos
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={clearAll}
                  className="text-sm text-gray-500 hover:underline active:scale-95 transition-all duration-150"
                >
                  Limpiar
                </button>
              </div>

              <div className="space-y-1">
                {users.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer min-h-[44px] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUser(user.id)}
                      className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{user.display_name}</span>
                  </label>
                ))}
              </div>

              {users.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No hay usuarios registrados
                </p>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Período
                </label>
                <PeriodSelector value={period} onChange={setPeriod} />
              </div>
            </div>
          </div>

          {/* Right - Comparison results */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
                  <div className="skeleton w-48 h-5 rounded mb-4" />
                  <div className="skeleton w-full h-[250px] rounded" />
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton w-full h-12 rounded mb-2" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Chart */}
                <CompareChart data={comparisons} />

                {/* Mobile cards */}
                {comparisons.length > 0 && (
                  <div className="md:hidden space-y-3">
                    {comparisons.map((comp) => (
                      <div key={comp.user_id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{comp.display_name}</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                            <div className="text-xs text-gray-500">Sesiones</div>
                            <div className="font-bold text-gray-800">{comp.total_sessions}</div>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-2.5 text-center">
                            <div className="text-xs text-gray-500">Global</div>
                            <div className="font-bold text-orange-600">{comp.overall_percentage}%</div>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-2.5 text-center">
                            <div className="text-xs text-gray-500">T. Libres</div>
                            <div className="font-semibold text-blue-600">{comp.free_throw_percentage}%</div>
                            <div className="text-xs text-gray-400">{comp.total_free_throws_made}/{comp.total_free_throws_attempted}</div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2.5 text-center">
                            <div className="text-xs text-gray-500">Triples</div>
                            <div className="font-semibold text-green-600">{comp.three_pointer_percentage}%</div>
                            <div className="text-xs text-gray-400">{comp.total_three_pointers_made}/{comp.total_three_pointers_attempted}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Desktop table */}
                {comparisons.length > 0 && (
                  <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 dark:bg-gray-700">
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
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {comparisons.map((comp) => (
                            <tr key={comp.user_id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                              <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
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
