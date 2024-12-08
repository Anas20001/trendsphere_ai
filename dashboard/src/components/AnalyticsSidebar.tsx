import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, Clock, Package, Star, ChevronRight } from 'lucide-react';

interface InsightCard {
  title: string;
  value: string | number;
  trend: number;
  icon: React.ReactNode;
  details: string[];
}

export function AnalyticsSidebar() {
  const [activeSection, setActiveSection] = useState('performance');

  const insights: Record<string, InsightCard[]> = {
    performance: [
      {
        title: 'Peak Hours',
        value: '2PM - 4PM',
        trend: 12,
        icon: <Clock className="text-purple-500" size={20} />,
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
        icon: <Star className="text-yellow-500" size={20} />,
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
        icon: <Users className="text-blue-500" size={20} />,
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
        icon: <Package className="text-green-500" size={20} />,
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
        icon: <DollarSign className="text-emerald-500" size={20} />,
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
        icon: <TrendingUp className="text-rose-500" size={20} />,
        details: [
          'Month-over-month growth steady',
          'New product lines +45% revenue',
          'Online orders growing 28% faster'
        ]
      }
    ]
  };

  return (
    <div className="w-80 bg-white h-screen border-l border-gray-200 overflow-y-auto">
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
          {insights[activeSection].map((insight, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-gray-100 hover:border-indigo-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {insight.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{insight.title}</h3>
                    <p className="text-2xl font-semibold mt-1">{insight.value}</p>
                  </div>
                </div>
                <div className={`flex items-center ${
                  insight.trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <ChevronRight
                    size={16}
                    className={`transform ${insight.trend >= 0 ? 'rotate-90' : '-rotate-90'}`}
                  />
                  <span className="text-sm font-medium">{Math.abs(insight.trend)}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                {insight.details.map((detail, idx) => (
                  <p key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}