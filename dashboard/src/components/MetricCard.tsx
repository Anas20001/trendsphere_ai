import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

export function MetricCard({ title, value, change, icon }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        <div className="p-2 bg-indigo-50 rounded-lg">{icon}</div>
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold">{value}</h3>
        <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
          <span className="text-sm font-medium ml-1">{Math.abs(change)}%</span>
        </div>
      </div>
    </div>
  );
}