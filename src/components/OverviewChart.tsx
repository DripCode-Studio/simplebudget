/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

interface OverviewChartProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export default function OverviewChart({
  totalIncome,
  totalExpenses,
  balance,
}: OverviewChartProps) {
  // Let's compute relative heights
  const maxVal = Math.max(totalIncome, totalExpenses, Math.max(0, balance), 1);
  const incomeHeight = `${Math.min(100, Math.max(0, (totalIncome / maxVal) * 100))}%`;
  const expenseHeight = `${Math.min(100, Math.max(0, (totalExpenses / maxVal) * 100))}%`;
  const balanceHeight = `${Math.min(100, Math.max(0, (balance / maxVal) * 100))}%`;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="p-6 rounded-3xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] hover:border-zinc-300 dark:hover:border-[#3f3f46] hover:shadow-lg transition-all duration-350">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-sans font-bold text-lg text-zinc-900 dark:text-zinc-50">
          Financial Overview
        </h3>
        <span className="font-geist text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-[#a1a1aa]">Monthly Ratio</span>
      </div>

      <div className="flex items-end justify-between h-[200px] px-6 pt-10 border-b border-zinc-200/50 dark:border-zinc-800/20 pb-4">
        {/* In Flow Bar */}
        <div className="flex flex-col items-center gap-2.5 w-1/4 h-full justify-end group">
          <div className="w-full relative flex items-end justify-center group h-[85%]">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: incomeHeight }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-10 bg-emerald-500/80 dark:bg-[#4edea3] hover:opacity-100 dark:hover:opacity-100 transition-opacity rounded-t-lg relative group cursor-pointer"
            >
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-950 dark:bg-zinc-800 text-zinc-50 font-mono text-[10px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-20">
                {formatCurrency(totalIncome)}
              </div>
            </motion.div>
          </div>
          <span className="font-geist text-xs font-semibold text-zinc-500 dark:text-zinc-400">In</span>
        </div>

        {/* Out Flow Bar */}
        <div className="flex flex-col items-center gap-2.5 w-1/4 h-full justify-end group">
          <div className="w-full relative flex items-end justify-center group h-[85%]">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: expenseHeight }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              className="w-10 bg-rose-500/80 dark:bg-[#ffb4ab] hover:opacity-100 transition-opacity rounded-t-lg relative group cursor-pointer"
            >
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-950 dark:bg-zinc-800 text-zinc-50 font-mono text-[10px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-20">
                {formatCurrency(totalExpenses)}
              </div>
            </motion.div>
          </div>
          <span className="font-geist text-xs font-semibold text-zinc-500 dark:text-zinc-400">Out</span>
        </div>

        {/* Left Flow Bar */}
        <div className="flex flex-col items-center gap-2.5 w-1/4 h-full justify-end group">
          <div className="w-full relative flex items-end justify-center group h-[85%]">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: balanceHeight }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="w-10 bg-violet-500/80 dark:bg-[#d0bcff] hover:opacity-100 transition-opacity rounded-t-lg relative group cursor-pointer"
            >
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-950 dark:bg-zinc-800 text-zinc-50 font-mono text-[10px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-20">
                {formatCurrency(balance >= 0 ? balance : 0)}
              </div>
            </motion.div>
          </div>
          <span className="font-geist text-xs font-semibold text-zinc-500 dark:text-zinc-400">Left</span>
        </div>
      </div>
    </section>
  );
}
