'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ComparisonData {
  user_id: number;
  display_name: string;
  free_throw_percentage: number;
  three_pointer_percentage: number;
  overall_percentage: number;
  total_sessions: number;
}

interface CompareChartProps {
  data: ComparisonData[];
}

export default function CompareChart({ data }: CompareChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Comparativa de Jugadores
        </h3>
        <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Selecciona jugadores para comparar sus estadísticas
        </div>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.display_name,
    'Tiros Libres': d.free_throw_percentage,
    Triples: d.three_pointer_percentage,
    Global: d.overall_percentage,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Comparativa de Porcentajes
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={50}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fontSize: 11 }}
            width={40}
          />
          <Tooltip formatter={(value) => [`${value}%`, '']} />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
          />
          <Bar dataKey="Tiros Libres" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Triples" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Global" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
