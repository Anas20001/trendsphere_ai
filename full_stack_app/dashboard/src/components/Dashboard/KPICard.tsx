import React from 'react';
import { LucideIcon, ArrowUp, ArrowDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
  description?: string;
}

export function KPICard({ title, value, change, icon: Icon, description }: KPICardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h3>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {description}
        </p>
      )}
    </div>
  );
}