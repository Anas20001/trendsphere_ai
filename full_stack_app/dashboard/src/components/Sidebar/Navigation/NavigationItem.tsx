import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavigationItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  badge?: string | number;
}

export function NavigationItem({
  icon: Icon,
  label,
  isActive = false,
  isCollapsed = false,
  onClick,
  badge
}: NavigationItemProps) {
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? `${label}${badge ? ` (${badge})` : ''}` : undefined}
      className={`
        group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mx-auto
        transition-all duration-200 focus:outline-none
        hover:bg-gray-50 active:bg-gray-100
        ${isActive 
          ? 'bg-indigo-50/80 text-indigo-600 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-0.5 before:bg-indigo-600 before:rounded-r' 
          : 'text-gray-600 hover:bg-gray-50'
        }
      `}
    >
      <Icon className={`
        w-5 h-5 transition-all duration-200
        ${isCollapsed ? 'mx-auto group-hover:scale-110 group-hover:text-indigo-600' : ''}
        ${isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-600'}
      `} />
      {!isCollapsed && (
        <>
          <span className={`text-sm font-medium flex-1 text-left transition-colors duration-200 ${
            isActive ? 'text-indigo-600' : 'text-gray-700 group-hover:text-gray-900'
          }`}>{label}</span>
          {badge && (
            <span className={`
              px-2 py-0.5 text-xs rounded-full transition-colors duration-200 font-medium
              ${isActive 
                ? 'bg-indigo-100 text-indigo-600' 
                : 'bg-gray-100/80 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
              }
            `}>
              {badge}
            </span>
          )}
        </>
      )}
      {isCollapsed && badge && (
        <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center bg-indigo-600 text-white rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}