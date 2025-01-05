import React from 'react';
import { BarChart2, Brain, Zap, Users } from 'lucide-react';

const features = [
  {
    title: 'Real-time Analytics',
    description: 'Get instant insights with live data updates and dynamic visualizations.',
    icon: BarChart2,
  },
  {
    title: 'AI-Powered Insights',
    description: 'Leverage machine learning to uncover hidden patterns and trends.',
    icon: Brain,
  },
  {
    title: 'Lightning Fast',
    description: 'Experience blazing-fast performance with our optimized platform.',
    icon: Zap,
  },
  {
    title: 'Team Collaboration',
    description: 'Work seamlessly with your team using shared dashboards and reports.',
    icon: Users,
  },
];

export function Features() {
  return (
    <div className="py-24 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Modern Teams
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to analyze, understand, and grow your business.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-100 dark:hover:border-indigo-800 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors duration-200">
                <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}