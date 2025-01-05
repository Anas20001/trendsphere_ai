import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { SidebarNav } from './SidebarNav';
import { AnalyticsSection } from './Analytics/AnalyticsSection';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md"
      >
        <Menu size={24} className="text-gray-600" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-screen bg-white z-50 transform transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:block
        ${isCollapsed ? 'w-16' : 'w-80'}
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4"
        >
          <X size={24} className="text-gray-600" />
        </button>

        {/* Desktop Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:block absolute -right-4 top-8 bg-white border border-gray-200 rounded-full p-1.5 z-50 hover:bg-gray-50 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="text-gray-600" />
          ) : (
            <ChevronLeft size={16} className="text-gray-600" />
          )}
        </button>

        {/* Sidebar Content */}
        <div className="h-full flex flex-col">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-xl">R</span>
            </div>
            {!isCollapsed && (
              <span className="ml-3 text-lg font-semibold text-gray-900">
                Restaurant
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <SidebarNav isCollapsed={isCollapsed} />
            {!isCollapsed && <AnalyticsSection />}
          </div>
        </div>
      </div>
    </>
  );
}