import React from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$49',
    description: 'Perfect for small teams getting started',
    features: [
      'Up to 5 team members',
      'Basic analytics',
      'Real-time dashboard',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    price: '$99',
    description: 'For growing businesses',
    features: [
      'Up to 20 team members',
      'Advanced analytics',
      'Custom dashboards',
      'Priority support',
      'API access',
    ],
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited team members',
      'AI-powered insights',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'Advanced security',
    ],
  },
];

export function Pricing() {
  return (
    <div className="py-24 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose the plan that best fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`
                relative p-8 bg-white dark:bg-gray-800 rounded-xl border
                ${plan.recommended
                  ? 'border-indigo-500 dark:border-indigo-400 shadow-xl scale-105'
                  : 'border-gray-200 dark:border-gray-700'
                }
              `}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="inline-block bg-indigo-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Recommended
                  </div>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {plan.description}
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`
                  w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200
                  ${plan.recommended
                    ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                  }
                `}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}