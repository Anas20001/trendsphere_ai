import React from 'react';
import { 
  MetricCards, 
  SalesChart, 
  RecentTransactions,
  ProductAnalytics
} from '../components/Dashboard';
import { ChatAssistant } from '../components/ChatAssistant';
import { useLanguage } from '../contexts/LanguageContext';

export function Dashboard() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 transition-colors duration-200">
      {/* Header */}
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {t('dashboard.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {t('dashboard.welcome')}
        </p>
      </header>

      {/* Top Row - KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCards />
      </section>

      {/* Middle Row - Chart and Transactions */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <SalesChart />
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50">
          <RecentTransactions />
        </div>
      </section>

      {/* Bottom Row - Product Analytics */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
        <ProductAnalytics />
      </section>

      {/* Chat Assistant */}
      <ChatAssistant />
    </div>
  );
}