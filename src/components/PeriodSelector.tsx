'use client';

import { Period } from '@/lib/types';

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const periods: { value: Period; label: string }[] = [
    { value: 'daily', label: 'Hoy' },
    { value: 'weekly', label: 'Semana' },
    { value: 'monthly', label: 'Mes' },
    { value: 'yearly', label: 'Año' },
    { value: 'all', label: 'Todo' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={`px-4 py-2 rounded-md font-medium transition ${
            value === period.value
              ? 'bg-orange-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
