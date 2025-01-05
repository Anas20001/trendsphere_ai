import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

export function DashboardLayout() {
  const { direction } = useLanguage();

  return (
    <div className={`flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}