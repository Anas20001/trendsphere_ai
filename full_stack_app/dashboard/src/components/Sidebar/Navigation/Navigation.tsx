import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  ShoppingBag,
  Settings,
  HelpCircle,
  Upload
} from 'lucide-react';
import { NavigationItem } from './NavigationItem';
import { SidebarSection } from './SidebarSection';
import { useLanguage } from '../../../contexts/LanguageContext';

interface NavigationProps {
  isCollapsed?: boolean;
}

export function Navigation({ isCollapsed = false }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [expandedSections, setExpandedSections] = useState({
    analytics: true,
    settings: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <nav className="relative flex flex-col py-4">
      <div className="px-3 mb-4">
        <NavigationItem
          icon={LayoutDashboard}
          label={t('nav.dashboard')}
          isActive={location.pathname === '/dashboard'}
          isCollapsed={isCollapsed}
          onClick={() => navigate('/dashboard')}
        />
      </div>

      <div className="px-3 mb-4">
        <NavigationItem
          icon={Upload}
          label={t('nav.upload')}
          isActive={location.pathname === '/dashboard/upload'}
          isCollapsed={isCollapsed}
          onClick={() => navigate('/dashboard/upload')}
          badge="New"
        />
      </div>

      <SidebarSection
        title={t('nav.analytics')}
        isExpanded={expandedSections.analytics}
        onToggle={() => toggleSection('analytics')}
        isCollapsed={isCollapsed}
      >
        <NavigationItem
          icon={TrendingUp}
          label={t('nav.performance')}
          isActive={location.pathname === '/dashboard/performance'}
          isCollapsed={isCollapsed}
          onClick={() => navigate('/dashboard/performance')}
          badge="+15%"
        />
        <NavigationItem
          icon={Users}
          label={t('nav.customers')}
          isActive={location.pathname === '/dashboard/customers'}
          isCollapsed={isCollapsed}
          onClick={() => navigate('/dashboard/customers')}
          badge="1.2k"
        />
        <NavigationItem
          icon={ShoppingBag}
          label={t('nav.products')}
          isActive={location.pathname === '/dashboard/products'}
          isCollapsed={isCollapsed}
          onClick={() => navigate('/dashboard/products')}
        />
      </SidebarSection>

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="px-3 space-y-1">
          <NavigationItem
            icon={Settings}
            label={t('nav.settings')}
            isActive={location.pathname === '/dashboard/settings'}
            isCollapsed={isCollapsed}
            onClick={() => navigate('/dashboard/settings')}
          />
          <NavigationItem
            icon={HelpCircle}
            label={t('nav.help')}
            isActive={location.pathname === '/dashboard/help'}
            isCollapsed={isCollapsed}
            onClick={() => navigate('/dashboard/help')}
          />
        </div>
      </div>
    </nav>
  );
}