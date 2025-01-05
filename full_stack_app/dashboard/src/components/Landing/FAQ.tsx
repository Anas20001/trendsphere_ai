import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How does the free trial work?',
    answer: 'Our 14-day free trial gives you full access to all features. No credit card required. Cancel anytime.',
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes, you can export your data in multiple formats including CSV, Excel, and PDF.',
  },
  {
    question: 'Do you offer custom solutions?',
    answer: 'Yes, our Enterprise plan includes custom solutions tailored to your specific needs.',
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'We offer email support for all plans, with priority support and dedicated account managers for higher tiers.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Find answers to common questions about our platform
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <button
                className="w-full px-6 py-4 text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}