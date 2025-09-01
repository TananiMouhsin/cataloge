import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
  change?: {
    value: number;
    isPositive: boolean;
  };
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  change, 
  trend,
  className = '' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="ml-4 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
      {(change || trend) && (
        <div className="mt-4">
          <div className={`text-sm ${
            (trend?.isPositive || change?.isPositive) ? 'text-green-600' : 'text-red-600'
          }`}>
            {(trend?.isPositive || change?.isPositive) ? '↗' : '↘'} 
            {Math.abs(trend?.value || change?.value || 0)}%
            {trend && ' from last month'}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
