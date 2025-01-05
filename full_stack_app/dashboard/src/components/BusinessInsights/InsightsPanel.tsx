import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { InsightCard } from './InsightCard';

const insights = {
  performance: [
    {
      title: 'Peak Hours',
      value: '2PM - 4PM',
      trend: 12,
      details: ['Average order value +28%', 'Customer satisfaction 98%']
    },
    {
      title: 'Best Sellers',
      value: 'Cappuccino',
      trend: 15,
      details: ['42% of morning sales', '78% ordered with pastries']
    }
  ],
  customers: [
    {
      title: 'Retention Rate',
      value: '76%',
      trend: 5,
      details: ['Loyalty program: 45% returns', 'Avg visits: 3x/week']
    }
  ],
  revenue: [
    {
      title: 'Growth Rate',
      value: '+23%',
      trend: 23,
      details: ['Month-over-month steady', 'Online orders +28%']
    }
  ]
};

export function InsightsPanel() {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
      <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
        {t('dashboard.insights.title')}
      </h2>
      <div className="space-y-6">
        {Object.entries(insights).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t(`dashboard.insights.${category}`)}
            </h3>
            {items.map((insight, index) => (
              <InsightCard key={index} {...insight} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}