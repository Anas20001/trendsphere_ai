import React from 'react';
import { Coffee, DollarSign, Users, TrendingUp } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { RecentTransactions } from './components/RecentTransactions';
import { ProductAnalytics } from './components/ProductAnalytics';
import { ChatAssistant } from './components/ChatAssistant';
import { Sidebar } from './components/Sidebar';

// Mock data
const metrics = [
  {
    title: 'Total Sales',
    value: '2,847',
    change: 12.5,
    icon: <Coffee className="text-indigo-600" size={24} />,
  },
  {
    title: 'Revenue',
    value: '$34,892',
    change: 8.2,
    icon: <DollarSign className="text-indigo-600" size={24} />,
  },
  {
    title: 'Customers',
    value: '1,438',
    change: -2.4,
    icon: <Users className="text-indigo-600" size={24} />,
  },
  {
    title: 'Growth',
    value: '+15.3%',
    change: 4.1,
    icon: <TrendingUp className="text-indigo-600" size={24} />,
  },
];

const recentTransactions = [
  {
    id: 'TX123',
    customer: { id: 'C789', name: 'Sarah Johnson' },
    items: [
      { name: 'Cappuccino', quantity: 2, price: 4.50 },
      { name: 'Croissant', quantity: 1, price: 3.25 },
    ],
    total: 12.25,
    timestamp: '2 minutes ago',
  },
  {
    id: 'TX122',
    customer: { id: 'C790', name: 'Michael Chen' },
    items: [
      { name: 'Latte', quantity: 1, price: 4.00 },
      { name: 'Breakfast Sandwich', quantity: 1, price: 6.50 },
    ],
    total: 10.50,
    timestamp: '15 minutes ago',
  },
  {
    id: 'TX121',
    customer: { id: 'C791', name: 'Emma Davis' },
    items: [
      { name: 'Green Tea', quantity: 1, price: 3.50 },
      { name: 'Muffin', quantity: 2, price: 2.75 },
    ],
    total: 9.00,
    timestamp: '32 minutes ago',
  },
];

const recommendations = [
  {
    title: 'Coffee & Pastry Bundle',
    description: 'Pair any coffee with a freshly baked pastry for a 15% discount',
    impact: '+25% in morning sales',
  },
  {
    title: 'Afternoon Tea Special',
    description: 'Tea and cake combo during 2-5 PM',
    impact: '+40% in afternoon revenue',
  },
  {
    title: 'Weekend Brunch Deal',
    description: 'Full breakfast with coffee at a special price',
    impact: '+30% in weekend morning sales',
  },
];

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-2">Welcome back! Here's what's happening today.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ProductAnalytics recommendations={recommendations} />
            </div>
            <div className="lg:col-span-1">
              <RecentTransactions transactions={recentTransactions} />
            </div>
          </div>
        </div>
      </div>
      <ChatAssistant />
    </div>
  );
}

export default App;