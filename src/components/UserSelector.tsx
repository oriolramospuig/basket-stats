'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';

interface UserSelectorProps {
  value: string;
  onChange: (userId: string) => void;
  includeAll?: boolean;
  label?: string;
}

export default function UserSelector({
  value,
  onChange,
  includeAll = true,
  label = 'Filtrar por jugador',
}: UserSelectorProps) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      console.error('Error fetching users');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
      >
        {includeAll && <option value="">Todos los jugadores</option>}
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.display_name}
          </option>
        ))}
      </select>
    </div>
  );
}
