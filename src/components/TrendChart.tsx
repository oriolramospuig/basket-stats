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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <Tooltip
            formatter={(value: number) => [`${value}%`, '']}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="free_throw_percentage"
            name="Tiros Libres"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6' }}
          />
          <Line
            type="monotone"
            dataKey="three_pointer_percentage"
            name="Triples"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981' }}
          />
          <Line
            type="monotone"
            dataKey="overall_percentage"
            name="Global"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ fill: '#f97316' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
