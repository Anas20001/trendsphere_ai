import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InsightCardProps {
  title: string;
  value: string | number;
  trend: number;
  icon: LucideIcon;
  details: string[];
}

export function InsightCard({
  title,
  value,
  trend,
  icon: Icon,
  details
}: InsightCardProps) {
  return (
    <div className="p-4 rounded-xl border border-gray-100 hover:border-indigo-100 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Icon className="text-indigo-600" size={20} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-2xl font-semibold mt-1">{value}</p>
          </div>
        </div>
        <div className={`flex items-center ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <span className="text-sm font-medium">{Math.abs(trend)}%</span>
        </div>
      </div>
      
      <div className="space-y-2">
        {details.map((detail, idx) => (
          <p key={idx} className="text-sm text-gray-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            {detail}
          </p>
        ))}
      </div>
    </div>
  );
}