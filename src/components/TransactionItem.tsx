/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import {
  Wallet,
  Home,
  Utensils,
  Car,
  Film,
  ShoppingBag,
  GraduationCap,
  Heart,
  Zap,
  ShieldCheck,
  Tag,
  Edit,
  Trash2,
  Calendar,
} from 'lucide-react';
import { Transaction, IncomeFrequency, ExpenseCategory } from '../types';

interface TransactionItemProps {
  key?: number | string;
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

const getCategoryIcon = (category: ExpenseCategory | null, type: string) => {
  if (type === 'income') {
    return <Wallet className="h-5 w-5 text-emerald-500" />;
  }

  switch (category) {
    case 'housing':
      return <Home className="h-5 w-5 text-sky-500" />;
    case 'food':
      return <Utensils className="h-5 w-5 text-amber-500" />;
    case 'transport':
      return <Car className="h-5 w-5 text-indigo-500" />;
    case 'entertainment':
      return <Film className="h-5 w-5 text-rose-500" />;
    case 'shopping':
      return <ShoppingBag className="h-5 w-5 text-fuchsia-500" />;
    case 'education':
      return <GraduationCap className="h-5 w-5 text-orange-500" />;
    case 'health':
      return <Heart className="h-5 w-5 text-red-500" />;
    case 'utilities':
      return <Zap className="h-5 w-5 text-yellow-500" />;
    case 'insurance':
      return <ShieldCheck className="h-5 w-5 text-cyan-500" />;
    default:
      return <Tag className="h-5 w-5 text-zinc-400" />;
  }
};

const getCategoryLabel = (category: ExpenseCategory | null) => {
  if (!category) return '';
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const getFrequencyLabel = (frequency: IncomeFrequency | null) => {
  if (!frequency) return '';
  return frequency.charAt(0).toUpperCase() + frequency.slice(1);
};

export default function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between p-3.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-all duration-200 group border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-800/20"
    >
      <div className="flex items-center gap-4">
        {/* Circle Icon Container */}
        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center border border-zinc-200/20 dark:border-zinc-700/10">
          {getCategoryIcon(transaction.category, transaction.type)}
        </div>
        <div>
          <p className="font-sans font-medium text-sm text-zinc-900 dark:text-zinc-100">
            {transaction.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-geist text-xs text-zinc-500 dark:text-zinc-400">
              {transaction.type === 'income'
                ? transaction.frequency
                  ? `${getFrequencyLabel(transaction.frequency)}`
                  : 'Recurring'
                : getCategoryLabel(transaction.category)}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700 text-xs">•</span>
            <span className="font-geist text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {transaction.date}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
          {formatCurrency(transaction.amount)}
        </p>
        <div className="flex gap-1.5 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(transaction)}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Edit item"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="p-1 rounded-md text-zinc-500 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-rose-950/20 transition-colors"
            title="Delete item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
