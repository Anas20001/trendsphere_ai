import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const plans = [

export function Pricing() {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  return (
    <div className="py-24 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`
                relative p-8 bg-white dark:bg-gray-800 rounded-xl border
                transition-all duration-300
                ${hoveredPlan === index || plan.recommended
                  ? 'border-indigo-500 dark:border-indigo-400 shadow-xl scale-105 z-10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-600'
                }
              `}
            >
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <ul className="space-y-2 mt-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="w-5 h-5 text-indigo-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <button
                    className={`
                      w-full py-3 rounded-lg text-white font-semibold
                      ${plan.recommended
                        ? 'bg-indigo-500 hover:bg-indigo-600'
                        : 'bg-gray-500 hover:bg-gray-600'
                      }
                    `}
                  >
                    <Link
                      to="/signup"
                      className="block w-full h-full"
                    >
                      Get Started
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}