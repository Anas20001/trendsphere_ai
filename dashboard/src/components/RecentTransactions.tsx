import React from 'react';

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
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{transaction.customer.name}</h3>
                <p className="text-sm text-gray-500">ID: {transaction.customer.id}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${transaction.total.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{transaction.timestamp}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                {transaction.items.map((item, index) => (
                  <span key={index}>
                    {item.quantity}x {item.name}
                    {index < transaction.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}