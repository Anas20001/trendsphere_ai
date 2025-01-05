import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-indigo-300">
              Transform Your Business Analytics
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Unlock powerful insights and drive growth with our AI-powered analytics platform. Make data-driven decisions with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-200">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                Watch Demo
                <Play className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
                alt="Analytics Dashboard"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}