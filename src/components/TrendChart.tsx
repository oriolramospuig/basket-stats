'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  date: string;
  free_throw_percentage: number;
  three_pointer_percentage: number;
  overall_percentage: number;
}

interface TrendChartProps {
  data: DataPoint[];
  title?: string;
}

export default function TrendChart({ data, title = 'Evolución del Porcentaje de Tiro' }: TrendChartProps) {
  if (data.length === 0) {
    return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>
      <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
          No hay datos suficientes para mostrar el gráfico
        </div>
      </div>
    );
  }

  const formattedData = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
    }),
    free_throw_percentage: Math.round(d.free_throw_percentage * 10) / 10,
    three_pointer_percentage: Math.round(d.three_pointer_percentage * 10) / 10,
    overall_percentage: Math.round(d.overall_percentage * 10) / 10,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={formattedData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
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
          <Tooltip
            formatter={(value) => [`${value}%`, '']}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
          />
          <Line
            type="monotone"
            dataKey="free_throw_percentage"
            name="T. Libres"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="three_pointer_percentage"
            name="Triples"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="overall_percentage"
            name="Global"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ fill: '#f97316', r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
      <div className="skeleton w-48 h-5 rounded mb-4" />
      <div className="skeleton w-full h-[250px] rounded" />
    </div>
  );
}
