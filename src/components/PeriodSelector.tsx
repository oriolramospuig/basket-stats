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
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base font-medium transition-all duration-150 active:scale-95 ${
            value === period.value
              ? 'bg-orange-600 text-white shadow-sm'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
