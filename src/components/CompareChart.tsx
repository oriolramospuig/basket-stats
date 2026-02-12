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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Comparativa de Jugadores
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Comparativa de Porcentajes
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <Tooltip formatter={(value) => [`${value}%`, '']} />
          <Legend />
          <Bar dataKey="Tiros Libres" fill="#3b82f6" />
          <Bar dataKey="Triples" fill="#10b981" />
          <Bar dataKey="Global" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
