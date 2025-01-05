import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Transaction {
  id: string;
  customer: {
    id: string;
    name: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  timestamp: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

const defaultTransactions: Transaction[] = [
  {
    id: '1',
    customer: {
      id: 'C001',
      name: 'John Doe'
    },
    items: [
      { name: 'Cappuccino', quantity: 2, price: 4.50 },
      { name: 'Croissant', quantity: 1, price: 3.25 }
    ],
    total: 12.25,
    timestamp: '2024-03-15 14:30'
  },
  {
    id: '2',
    customer: {
      id: 'C002',
      name: 'Jane Smith'
    },
    items: [
      { name: 'Latte', quantity: 1, price: 4.00 },
      { name: 'Muffin', quantity: 2, price: 2.75 }
    ],
    total: 9.50,
    timestamp: '2024-03-15 14:15'
  }
];

export function RecentTransactions({ transactions = defaultTransactions }: RecentTransactionsProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 transition-all duration-200">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboard.recentTransactions.title')}
        </h2>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
        {transactions.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {t('dashboard.recentTransactions.noTransactions')}
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {transaction.customer.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {transaction.customer.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${transaction.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.timestamp}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {transaction.items.map((item, index) => (
                    <span key={index}>
                      {item.quantity}x {item.name}
                      {index < transaction.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}