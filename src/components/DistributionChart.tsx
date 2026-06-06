/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Transaction, ExpenseCategory } from '../types';

interface DistributionChartProps {
  expenses: Transaction[];
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  housing: '#0ea5e9',      // Sky
  food: '#f59e0b',         // Amber
  transport: '#6366f1',    // Indigo
  entertainment: '#f43f5e',// Rose
  shopping: '#d946ef',     // Fuchsia
  education: '#f97316',    // Orange
  health: '#ef4444',       // Red
  utilities: '#eab308',    // Yellow
  insurance: '#06b6d4',    // Cyan
  other: '#71717a',        // Zinc
};

export default function DistributionChart({ expenses }: DistributionChartProps) {
  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, exp) => {
    const cat = exp.category || 'other';
    acc[cat] = (acc[cat] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalExpense = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
  const categoriesList = Object.keys(categoryTotals) as ExpenseCategory[];

  // For circle chart calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  // Pre-calculate segments with their percentages and Dash parameters
  const segments = categoriesList.map((cat) => {
    const amt = categoryTotals[cat];
    const percentage = totalExpense > 0 ? (amt / totalExpense) * 100 : 0;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const offset = currentOffset;
    currentOffset += percentage;

    return {
      category: cat,
      amount: amt,
      percentage,
      strokeDasharray,
      strokeDashoffset,
      rotation: (offset / 100) * 360 - 90, // Rotate so it starts at the top
    };
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="p-6 rounded-3xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] hover:border-zinc-300 dark:hover:border-[#3f3f46] hover:shadow-lg transition-all duration-350 relative overflow-hidden flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-sans font-bold text-lg text-zinc-900 dark:text-zinc-50">
          Expense Distribution
        </h3>
        <span className="font-geist text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-[#a1a1aa] bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
          {expenses.length} Item{expenses.length !== 1 && 's'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Donut */}
        <div className="md:col-span-6 flex items-center justify-center relative h-[180px]">
          {expenses.length === 0 ? (
            <div className="relative w-40 h-40 rounded-full border-4 border-dashed border-zinc-250 dark:border-zinc-800 flex flex-col items-center justify-center text-center p-4">
              <span className="font-geist text-xs text-zinc-400 font-semibold uppercase tracking-widest">Categories</span>
              <span className="font-sans font-semibold text-2xl text-zinc-300 dark:text-zinc-700 mt-1">0</span>
            </div>
          ) : (
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform" viewBox="0 0 160 160">
                {/* Background Track */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  className="text-zinc-100 dark:text-zinc-800/20"
                  strokeWidth="10"
                />

                {/* Categories paths */}
                {segments.map((seg) => (
                  <circle
                    key={seg.category}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={CATEGORY_COLORS[seg.category]}
                    strokeWidth="11"
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                    style={{
                      transform: `rotate(${seg.rotation}deg)`,
                      transformOrigin: 'center',
                    }}
                    strokeLinecap="round"
                  />
                ))}
              </svg>

              {/* Central Text Panel */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-geist text-[9px] uppercase tracking-widest text-zinc-400 dark:text-[#a1a1aa] font-semibold">
                  Total outflow
                </span>
                <span className="font-sans font-bold text-lg text-zinc-900 dark:text-zinc-50">
                  {formatCurrency(totalExpense)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Categories breakdown Details */}
        <div className="md:col-span-6 flex flex-col gap-2.5 max-h-[180px] overflow-y-auto pr-1">
          {expenses.length === 0 ? (
            <p className="text-zinc-500 text-xs italic text-center md:text-left py-4">
              No transactions registered. Add some expenses to see category weights.
            </p>
          ) : (
            segments.map((seg) => (
              <div key={seg.category} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
                    style={{ backgroundColor: CATEGORY_COLORS[seg.category] }}
                  />
                  <span className="font-geist text-xs text-zinc-700 dark:text-zinc-300 font-medium capitalize">
                    {seg.category}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-200">
                    {formatCurrency(seg.amount)}
                  </p>
                  <p className="font-geist text-[10px] text-zinc-400">
                    {seg.percentage.toFixed(0)}%
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
