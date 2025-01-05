import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  ShoppingBag,
  Settings,
  HelpCircle,
  Upload
} from 'lucide-react';
import { SidebarButton } from './Common/SidebarButton';
import { SidebarSection } from './Common/SidebarSection';

interface SidebarNavProps {
  isCollapsed?: boolean;
}

export function SidebarNav({ isCollapsed = false }: SidebarNavProps) {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [expandedSections, setExpandedSections] = useState({
    analytics: true,
    management: false,
    settings: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <nav className="flex flex-col py-4">
      {/* Primary Navigation */}
      <div className="px-3 mb-4">
        <SidebarButton
          icon={LayoutDashboard}
          label="Dashboard"
          isActive={activeItem === 'dashboard'}
          isCollapsed={isCollapsed}
          onClick={() => setActiveItem('dashboard')}
        />
      </div>

      {/* Upload Section */}
      <div className="px-3 mb-4">
        <SidebarButton
          icon={Upload}
          label="Upload Files"
          isActive={activeItem === 'upload'}
          isCollapsed={isCollapsed}
          onClick={() => setActiveItem('upload')}
        />
      </div>

      {/* Analytics Section */}
      <SidebarSection
        title="Analytics"
        isExpanded={expandedSections.analytics}
        onToggle={() => toggleSection('analytics')}
        isCollapsed={isCollapsed}
      >
        <SidebarButton
          icon={TrendingUp}
          label="Performance"
          isActive={activeItem === 'performance'}
          isCollapsed={isCollapsed}
          onClick={() => setActiveItem('performance')}
          badge="+15%"
        />
        <SidebarButton
          icon={Users}
          label="Customers"
          isActive={activeItem === 'customers'}
          isCollapsed={isCollapsed}
          onClick={() => setActiveItem('customers')}
          badge="1.2k"
        />
        <SidebarButton
          icon={ShoppingBag}
          label="Products"
          isActive={activeItem === 'products'}
          isCollapsed={isCollapsed}
          onClick={() => setActiveItem('products')}
        />
      </SidebarSection>

      {/* Settings & Help */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="px-3 space-y-1">
          <SidebarButton
            icon={Settings}
            label="Settings"
            isActive={activeItem === 'settings'}
            isCollapsed={isCollapsed}
            onClick={() => setActiveItem('settings')}
          />
          <SidebarButton
            icon={HelpCircle}
            label="Help & Support"
            isActive={activeItem === 'help'}
            isCollapsed={isCollapsed}
            onClick={() => setActiveItem('help')}
          />
        </div>
      </div>
    </nav>
  );
}