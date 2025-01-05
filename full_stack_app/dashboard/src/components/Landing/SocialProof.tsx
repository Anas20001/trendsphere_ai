import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Thompson',
    role: 'CEO at TechCorp',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    quote: 'This platform has transformed how we analyze our data. The insights we\'ve gained have been invaluable.',
  },
  {
    name: 'Michael Chen',
    role: 'Data Analyst',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    quote: 'The AI-powered insights have helped us identify opportunities we would have otherwise missed.',
  },
];

const stats = [
  { label: 'Active Users', value: '10,000+' },
  { label: 'Data Points Analyzed', value: '1B+' },
  { label: 'Customer Satisfaction', value: '99%' },
];

export function SocialProof() {
  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Join thousands of companies using our platform to drive growth.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
            >
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {testimonial.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}