/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity, Percent } from 'lucide-react';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
}

export default function SummaryCards({
  totalIncome,
  totalExpenses,
  balance,
  savingsRate,
}: SummaryCardsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4"
    >
      {/* Monthly Income Card */}
      <motion.div
        variants={itemVariants}
        className="p-5 rounded-3xl flex flex-col justify-between border-l-4 border-emerald-500 hover:border-l-8 hover:shadow-lg bg-white dark:bg-[#18181b] border-y border-r border-zinc-200 dark:border-[#27272a] transition-all duration-350 cursor-pointer group hover:border-zinc-300 dark:hover:border-[#3f3f46]"
      >
        <div className="flex justify-between items-start">
          <p className="font-geist text-xs text-zinc-500 dark:text-[#a1a1aa] font-semibold uppercase tracking-widest">
            Monthly Income
          </p>
          <div className="p-1 px-1.5 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
        <p className="font-mono text-xl md:text-2xl font-bold text-emerald-500 mt-3 tabular-nums">
          {formatCurrency(totalIncome)}
        </p>
      </motion.div>

      {/* Monthly Expenses Card */}
      <motion.div
        variants={itemVariants}
        className="p-5 rounded-3xl flex flex-col justify-between border-l-4 border-rose-500 hover:border-l-8 hover:shadow-lg bg-white dark:bg-[#18181b] border-y border-r border-zinc-200 dark:border-[#27272a] transition-all duration-350 cursor-pointer group hover:border-zinc-300 dark:hover:border-[#3f3f46]"
      >
        <div className="flex justify-between items-start">
          <p className="font-geist text-xs text-zinc-500 dark:text-[#a1a1aa] font-semibold uppercase tracking-widest">
            Monthly Expenses
          </p>
          <div className="p-1 px-1.5 rounded-md bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
            <ArrowDownRight className="h-4 w-4" />
          </div>
        </div>
        <p className="font-mono text-xl md:text-2xl font-bold text-rose-500 mt-3 tabular-nums">
          {formatCurrency(totalExpenses)}
        </p>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        variants={itemVariants}
        className={`p-5 rounded-3xl flex flex-col justify-between border-l-4 ${
          balance >= 0 ? 'border-violet-500' : 'border-amber-500'
        } hover:border-l-8 hover:shadow-lg bg-white dark:bg-[#18181b] border-y border-r border-zinc-200 dark:border-[#27272a] transition-all duration-350 cursor-pointer group hover:border-zinc-300 dark:hover:border-[#3f3f46]`}
      >
        <div className="flex justify-between items-start">
          <p className="font-geist text-xs text-zinc-500 dark:text-[#a1a1aa] font-semibold uppercase tracking-widest">
            Balance
          </p>
          <div className={`p-1 px-1.5 rounded-md ${
            balance >= 0 ? 'bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400' : 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
          }`}>
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <p className={`font-mono text-xl md:text-2xl font-bold mt-3 tabular-nums ${
          balance >= 0 ? 'text-zinc-900 dark:text-zinc-50' : 'text-amber-500'
        }`}>
          {formatCurrency(balance)}
        </p>
      </motion.div>

      {/* Savings Rate Card */}
      <motion.div
        variants={itemVariants}
        className="p-5 rounded-3xl flex flex-col justify-between border-l-4 border-fuchsia-500 hover:border-l-8 hover:shadow-lg bg-white dark:bg-[#18181b] border-y border-r border-zinc-200 dark:border-[#27272a] transition-all duration-350 cursor-pointer group hover:border-zinc-300 dark:hover:border-[#3f3f46]"
      >
        <div className="flex justify-between items-start">
          <p className="font-geist text-xs text-zinc-500 dark:text-[#a1a1aa] font-semibold uppercase tracking-widest">
            Savings Rate
          </p>
          <div className="p-1 px-1.5 rounded-md bg-fuchsia-500/10 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400">
            <Percent className="h-4 w-4" />
          </div>
        </div>
        <p className="font-mono text-xl md:text-2xl font-bold text-fuchsia-500 mt-3 tabular-nums">
          {savingsRate.toFixed(1)}%
        </p>
      </motion.div>
    </motion.div>
  );
}
