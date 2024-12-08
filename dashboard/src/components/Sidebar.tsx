import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnalyticsSidebar } from './AnalyticsSidebar';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-8 bg-white border border-gray-200 rounded-full p-1.5 z-50 hover:bg-gray-50 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight size={16} className="text-gray-600" />
        ) : (
          <ChevronLeft size={16} className="text-gray-600" />
        )}
      </button>

      <div
        className={`fixed top-0 h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16 overflow-hidden' : 'w-80'
        }`}
      >
        {isCollapsed ? (
          <div className="h-full bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg" />
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
          </div>
        ) : (
          <AnalyticsSidebar />
        )}
      </div>
    </div>
  );
}