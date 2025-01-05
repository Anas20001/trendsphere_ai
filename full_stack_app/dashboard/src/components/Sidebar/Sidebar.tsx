import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Menu, X, TrendingUp } from 'lucide-react';
import { Navigation } from './Navigation';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useLanguage } from '../../contexts/LanguageContext';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useLocalStorage('sidebarCollapsed', true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { direction, t } = useLanguage();
  
  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md"
      >
        <Menu size={24} className="text-gray-600 dark:text-gray-300" />
      </button>

      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      <div className={`
        fixed top-0 ${direction === 'rtl' ? 'right-0' : 'left-0'} h-screen bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg z-50 transform transition-all duration-300 ease-in-out shadow-lg
        ${isMobileMenuOpen ? 'translate-x-0' : direction === 'rtl' ? 'translate-x-full' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:block
        ${isCollapsed ? 'w-16' : 'w-[20%]'}
        border-r border-gray-200/50 dark:border-gray-700/50
      `}>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4"
        >
          <X size={24} className="text-gray-600 dark:text-gray-300" />
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            hidden lg:flex absolute -${direction === 'rtl' ? 'left' : 'right'}-3 top-8 items-center justify-center w-6 h-6 
            bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm z-50 
            hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-indigo-200 transition-all duration-200 group
          `}
        >
          {direction === 'rtl' ? (
            isCollapsed ? (
              <ChevronLeft size={14} className="text-gray-400 dark:text-gray-500 group-hover:text-indigo-600" />
            ) : (
              <ChevronRight size={14} className="text-gray-400 dark:text-gray-500 group-hover:text-indigo-600" />
            )
          ) : (
            isCollapsed ? (
              <ChevronRight size={14} className="text-gray-400 dark:text-gray-500 group-hover:text-indigo-600" />
            ) : (
              <ChevronLeft size={14} className="text-gray-400 dark:text-gray-500 group-hover:text-indigo-600" />
            )
          )}
        </button>

        <div className="h-full flex flex-col">
          <div className="flex items-center h-16 px-4 border-b border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <span className="ml-3 text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                {t('common.appName')}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
            <Navigation isCollapsed={isCollapsed} />
          </div>
        </div>
      </div>
    </>
  );
}