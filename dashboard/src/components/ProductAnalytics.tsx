import React from 'react';
import { SalesChart } from './SalesChart';

interface ProductAnalyticsProps {
  recommendations: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
}

export function ProductAnalytics({ recommendations }: ProductAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SalesChart />
      
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Bundle Recommendations</h2>
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <div key={index} className="border-l-4 border-indigo-500 pl-4">
              <h3 className="font-medium text-lg mb-1">{rec.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{rec.description}</p>
              <p className="text-sm text-indigo-600 font-medium">
                Potential Impact: {rec.impact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}