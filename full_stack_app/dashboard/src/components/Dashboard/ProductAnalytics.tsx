import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { TrendingUp, ShoppingBag, ArrowRight } from 'lucide-react';

interface ProductAnalyticsProps {
  recommendations?: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
}

const defaultRecommendations = [
  {
    title: 'Bundle Popular Items',
    description: 'Create a combo with your top-selling coffee and pastries',
    impact: '+15% revenue potential'
  },
  {
    title: 'Peak Hour Optimization',
    description: 'Increase staff during 2-4 PM rush hour',
    impact: '+20% service efficiency'
  },
  {
    title: 'Stock Management',
    description: 'Adjust inventory levels for seasonal items',
    impact: '-10% waste reduction'
  }
];

export function ProductAnalytics({ recommendations = defaultRecommendations }: ProductAnalyticsProps) {
  const { t } = useLanguage();
  
  const topProducts = [
    { name: 'Cappuccino', sales: 1234, growth: 15, trend: 'up' },
    { name: 'Croissant', sales: 956, growth: 8, trend: 'up' },
    { name: 'Latte', sales: 823, growth: -3, trend: 'down' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboard.productAnalytics.title')}
        </h2>
        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1">
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
            Top Performing Products
          </h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{product.sales.toLocaleString()} sales</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  product.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  <TrendingUp className="w-4 h-4" />
                  <span>{Math.abs(product.growth)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
            Smart Recommendations
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div 
                key={index} 
                className="p-4 border-l-4 border-indigo-500 dark:border-indigo-400 bg-gray-50 dark:bg-gray-700/50 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {rec.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {rec.description}
                </p>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  {rec.impact}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}