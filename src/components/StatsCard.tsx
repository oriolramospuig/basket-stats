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
    orange: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400',
    blue: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className={`rounded-lg border-2 p-3 sm:p-4 transition-all duration-150 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between min-w-0">
        <span className="text-xl sm:text-2xl">{icon}</span>
        <span className="text-xl sm:text-3xl font-bold truncate ml-2">{value}</span>
      </div>
      <h3 className="mt-1.5 sm:mt-2 font-semibold text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700 p-3 sm:p-4 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="skeleton w-8 h-8 rounded" />
        <div className="skeleton w-16 h-8 rounded" />
      </div>
      <div className="skeleton w-20 h-4 rounded mt-2" />
      <div className="skeleton w-14 h-3 rounded mt-1" />
    </div>
  );
}
