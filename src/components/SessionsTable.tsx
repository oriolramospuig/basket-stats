'use client';

import { useState } from 'react';
import { ShootingSession } from '@/lib/types';
import { Trash2, X } from 'lucide-react';

interface SessionsTableProps {
  sessions: ShootingSession[];
  onDelete?: (id: number) => void;
  showUser?: boolean;
}

export default function SessionsTable({
  sessions,
  onDelete,
  showUser = true,
}: SessionsTableProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  if (sessions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center text-gray-500 dark:text-gray-400">
        No hay sesiones registradas
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const calculatePercentage = (made: number, attempted: number) => {
    if (attempted === 0) return '-';
    return `${Math.round((made / attempted) * 100)}%`;
  };

  const handleDelete = (id: number) => {
    if (confirmDeleteId === id) {
      onDelete?.(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      // Auto-cancel after 3 seconds
      setTimeout(() => setConfirmDeleteId((cur) => (cur === id ? null : cur)), 3000);
    }
  };

  return (
    <>
      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {sessions.map((session) => {
          const totalMade = session.free_throws_made + session.three_pointers_made;
          const totalAttempted = session.free_throws_attempted + session.three_pointers_attempted;

          return (
            <div key={session.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(session.session_date)}
                  </span>
                  {showUser && session.user_display_name && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      · {session.user_display_name}
                    </span>
                  )}
                </div>
                {onDelete && (
                  <button
                    onClick={() => handleDelete(session.id)}
                    className={`p-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-all duration-150 active:scale-95 ${
                      confirmDeleteId === session.id
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                    aria-label={confirmDeleteId === session.id ? 'Confirmar eliminar' : 'Eliminar'}
                  >
                    {confirmDeleteId === session.id ? (
                      <span className="text-xs font-bold">Confirmar</span>
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">T. Libres</div>
                  <div className="font-semibold text-blue-600 text-sm">
                    {session.free_throws_made}/{session.free_throws_attempted}
                  </div>
                  <div className="text-xs text-gray-400">
                    {calculatePercentage(session.free_throws_made, session.free_throws_attempted)}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Triples</div>
                  <div className="font-semibold text-green-600 text-sm">
                    {session.three_pointers_made}/{session.three_pointers_attempted}
                  </div>
                  <div className="text-xs text-gray-400">
                    {calculatePercentage(session.three_pointers_made, session.three_pointers_attempted)}
                  </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                  <div className="font-semibold text-orange-600 text-sm">
                    {totalMade}/{totalAttempted}
                  </div>
                  <div className="text-xs text-gray-400">
                    {calculatePercentage(totalMade, totalAttempted)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                {showUser && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jugador
                  </th>
                )}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiros Libres
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Triples
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                {onDelete && (
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sessions.map((session) => {
                const totalMade =
                  session.free_throws_made + session.three_pointers_made;
                const totalAttempted =
                  session.free_throws_attempted + session.three_pointers_attempted;

                return (
                  <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(session.session_date)}
                    </td>
                    {showUser && (
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {session.user_display_name}
                      </td>
                    )}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <span className="font-medium text-blue-600">
                        {session.free_throws_made}/{session.free_throws_attempted}
                      </span>
                      <span className="text-gray-400 ml-1">
                        ({calculatePercentage(session.free_throws_made, session.free_throws_attempted)})
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <span className="font-medium text-green-600">
                        {session.three_pointers_made}/{session.three_pointers_attempted}
                      </span>
                      <span className="text-gray-400 ml-1">
                        ({calculatePercentage(session.three_pointers_made, session.three_pointers_attempted)})
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <span className="font-medium text-orange-600">
                        {totalMade}/{totalAttempted}
                      </span>
                      <span className="text-gray-400 ml-1">
                        ({calculatePercentage(totalMade, totalAttempted)})
                      </span>
                    </td>
                    {onDelete && (
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleDelete(session.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md transition-all duration-150 active:scale-95 min-h-[40px] ${
                            confirmDeleteId === session.id
                              ? 'bg-red-100 text-red-700 font-medium'
                              : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 size={15} />
                          {confirmDeleteId === session.id ? 'Confirmar' : 'Eliminar'}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function SessionsTableSkeleton() {
  return (
    <div className="space-y-3 md:space-y-0">
      {/* Mobile skeleton */}
      <div className="md:hidden space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4">
            <div className="skeleton w-32 h-4 rounded mb-3" />
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="skeleton h-16 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Desktop skeleton */}
      <div className="hidden md:block bg-white rounded-lg shadow-md p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton w-full h-10 rounded mb-2" />
        ))}
      </div>
    </div>
  );
}
