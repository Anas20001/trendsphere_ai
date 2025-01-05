import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface InsightCardProps {
  title: string;
  value: string;
  trend: number;
  details: string[];
}

export function InsightCard({ title, value, trend, details }: InsightCardProps) {
  return (
    <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-indigo-100 dark:hover:border-indigo-900 transition-colors bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100">{title}</h4>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`flex items-center ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
          <span className="text-sm font-medium ml-1">{Math.abs(trend)}%</span>
        </div>
      </div>
      <div className="space-y-1">
        {details.map((detail, idx) => (
          <p key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            {detail}
          </p>
        ))}
      </div>
    </div>
  );
}