import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SidebarButtonProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  badge?: string | number;
}

export function SidebarButton({
  icon: Icon,
  label,
  isActive = false,
  isCollapsed = false,
  onClick,
  badge
}: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`
        group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
        transition-all duration-200 focus:outline-none focus:ring-2 
        focus:ring-indigo-500 focus:ring-offset-2
        ${isActive 
          ? 'bg-indigo-50 text-indigo-600' 
          : 'text-gray-600 hover:bg-gray-50'
        }
      `}
    >
      <Icon className={`
        w-5 h-5 transition-transform duration-200
        ${isCollapsed ? 'mx-auto group-hover:scale-110' : ''}
      `} />
      {!isCollapsed && (
        <>
          <span className="text-sm font-medium flex-1 text-left">{label}</span>
          {badge && (
            <span className={`
              px-2 py-1 text-xs rounded-full transition-colors duration-200
              ${isActive 
                ? 'bg-indigo-100 text-indigo-600' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
              }
            `}>
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );
}