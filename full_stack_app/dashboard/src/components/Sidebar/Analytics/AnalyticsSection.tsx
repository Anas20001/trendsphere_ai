import React, { useState } from 'react';
import { Clock, Star, Users, Package, DollarSign, TrendingUp } from 'lucide-react';
import { AnalyticsInsightCard } from './AnalyticsInsightCard';

const insights = {
  performance: [
    {
      title: 'Peak Hours',
      value: '2PM - 4PM',
      trend: 12,
      icon: Clock,
      details: [
        'Average order value increases by 28%',
        'Customer satisfaction peaks at 98%',
        'Staff efficiency optimal during these hours'
      ]
    },
    {
      title: 'Best Sellers',
      value: 'Cappuccino',
      trend: 15,
      icon: Star,
      details: [
        '42% of morning sales',
        '78% ordered with pastries',
        'Highest profit margin item'
      ]
    }
  ],
  customers: [
    {
      title: 'Retention Rate',
      value: '76%',
      trend: 5,
      icon: Users,
      details: [
        'Loyalty program driving 45% returns',
        'Average customer visits: 3x/week',
        'Customer lifetime value: $850'
      ]
    },
    {
      title: 'New vs Returning',
      value: '32:68',
      trend: -2,
      icon: Package,
      details: [
        'Returning customers spend 2.4x more',
        'Word-of-mouth referrals up 15%',
        'Social media driving new customers'
      ]
    }
  ],
  revenue: [
    {
      title: 'Profit Margins',
      value: '34%',
      trend: 8,
      icon: DollarSign,
      details: [
        'Food cost reduced by 12%',
        'Labor efficiency improved 8%',
        'Utilities optimization saved 5%'
      ]
    },
    {
      title: 'Growth Rate',
      value: '+23%',
      trend: 23,
      icon: TrendingUp,
      details: [
        'Month-over-month growth steady',
        'New product lines +45% revenue',
        'Online orders growing 28% faster'
      ]
    }
  ]
};

export function AnalyticsSection() {
  const [activeSection, setActiveSection] = useState('performance');

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Business Insights</h2>
      
      <nav className="space-y-1 mb-8">
        {Object.keys(insights).map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`w-full px-4 py-2 rounded-lg text-left font-medium capitalize transition-colors ${
              activeSection === section
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {section}
          </button>
        ))}
      </nav>

      <div className="space-y-6">
        {insights[activeSection as keyof typeof insights].map((insight, index) => (
          <AnalyticsInsightCard key={index} {...insight} />
        ))}
      </div>
    </div>
  );
}