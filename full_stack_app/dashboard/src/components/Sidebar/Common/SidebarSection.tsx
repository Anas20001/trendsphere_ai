import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  isCollapsed?: boolean;
}

export function SidebarSection({ 
  title, 
  children, 
  isExpanded, 
  onToggle,
  isCollapsed = false 
}: SidebarSectionProps) {
  if (isCollapsed) {
    return <div className="px-3 space-y-4">{children}</div>;
  }

  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
      >
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      
      <div className={`
        px-3 mt-1 space-y-1 overflow-hidden transition-all duration-200
        ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        {children}
      </div>
    </div>
  );
}