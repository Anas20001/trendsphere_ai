import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';

interface TimeRange {
  label: string;
  value: string;
  data: Array<{
    label: string;
    sales: number;
  }>;
}

const timeRanges: TimeRange[] = [
  {
    label: 'Daily',
    value: 'daily',
    data: [
      { label: '9AM', sales: 45 },
      { label: '12PM', sales: 78 },
      { label: '3PM', sales: 92 },
      { label: '6PM', sales: 84 },
      { label: '9PM', sales: 62 },
    ],
  },
  {
    label: 'Weekly',
    value: 'weekly',
    data: [
      { label: 'Mon', sales: 124 },
      { label: 'Tue', sales: 145 },
      { label: 'Wed', sales: 132 },
      { label: 'Thu', sales: 167 },
      { label: 'Fri', sales: 189 },
      { label: 'Sat', sales: 212 },
      { label: 'Sun', sales: 178 },
    ],
  },
  {
    label: 'Monthly',
    value: 'monthly',
    data: [
      { label: 'Jan', sales: 3245 },
      { label: 'Feb', sales: 3568 },
      { label: 'Mar', sales: 3912 },
      { label: 'Apr', sales: 4289 },
    ],
  },
  {
    label: 'Yearly',
    value: 'yearly',
    data: [
      { label: '2021', sales: 38456 },
      { label: '2022', sales: 42789 },
      { label: '2023', sales: 45123 },
      { label: '2024', sales: 12456 },
    ],
  },
];

export function SalesChart() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>(timeRanges[1]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Sales Trends</h2>
        
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span>{selectedRange.label}</span>
            <ChevronDown size={16} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-10">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => {
                    setSelectedRange(range);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${
                    selectedRange.value === range.value ? 'bg-indigo-50 text-indigo-600' : ''
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={selectedRange.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="sales"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}