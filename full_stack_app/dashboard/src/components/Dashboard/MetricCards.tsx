import React from 'react';
import { Coffee, DollarSign, Users, TrendingUp } from 'lucide-react';
import { KPICard } from './KPICard';
import { useLanguage } from '../../contexts/LanguageContext';

export function MetricCards() {
  const { t } = useLanguage();

  const metrics = [
    {
      title: t('dashboard.metrics.sales'),
      value: '2,847',
      change: 12.5,
      icon: Coffee,
      description: 'vs. last month'
    },
    {
      title: t('dashboard.metrics.revenue'),
      value: '$34,892',
      change: 8.2,
      icon: DollarSign,
      description: 'vs. last month'
    },
    {
      title: t('dashboard.metrics.customers'),
      value: '1,438',
      change: -2.4,
      icon: Users,
      description: 'vs. last month'
    },
    {
      title: t('dashboard.metrics.growth'),
      value: '+15.3%',
      change: 4.1,
      icon: TrendingUp,
      description: 'vs. last month'
    }
  ];

  return (
    <>
      {metrics.map((metric, index) => (
        <KPICard key={index} {...metric} />
      ))}
    </>
  );
}