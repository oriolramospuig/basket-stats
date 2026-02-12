interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: 'orange' | 'blue' | 'green' | 'purple';
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon = '📊',
  color = 'orange',
}: StatsCardProps) {
  const colorClasses = {
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <h3 className="mt-2 font-semibold text-gray-700">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}
