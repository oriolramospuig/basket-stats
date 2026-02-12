'use client';

import { ShootingSession } from '@/lib/types';

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
  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No hay sesiones registradas
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const calculatePercentage = (made: number, attempted: number) => {
    if (attempted === 0) return '-';
    return `${Math.round((made / attempted) * 100)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
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
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.map((session) => {
              const totalMade =
                session.free_throws_made + session.three_pointers_made;
              const totalAttempted =
                session.free_throws_attempted + session.three_pointers_attempted;

              return (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(session.session_date)}
                  </td>
                  {showUser && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
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
                        onClick={() => onDelete(session.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
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
  );
}
