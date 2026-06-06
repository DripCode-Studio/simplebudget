/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import TransactionItem from './components/TransactionItem';
import DistributionChart from './components/DistributionChart';
import OverviewChart from './components/OverviewChart';
import TransactionModal from './components/TransactionModal';
import { Transaction, TransactionType } from './types';
import { Plus, CheckCircle, AlertTriangle, ReceiptText, CircleDollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'simple-budget-data';
const THEME_KEY = 'simple-budget-theme';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDark, setIsDark] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>('income');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // 1. Load data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        setTransactions(JSON.parse(storedData));
      } catch {
        setTransactions([]);
      }
    }

    // Load theme
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme) {
      setIsDark(storedTheme === 'dark');
    } else {
      setIsDark(true); // Default to Dark mode as in simple budget screenshot
    }
  }, []);

  // 2. Synchronize theme with class injection
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDark]);

  // Helper to calculate standard monthly equivalents for different income frequencies
  const getMonthlyEquivalent = (amount: number, frequency: string | null) => {
    const val = parseFloat(amount.toString());
    if (!frequency) return val;
    switch (frequency) {
      case 'daily':
        return val * 30.44;
      case 'weekly':
        return val * 4.33;
      case 'biweekly':
        return val * 2.16;
      case 'monthly':
      default:
        return val;
    }
  };

  // Grouped datasets
  const incomes = transactions.filter((t) => t.type === 'income');
  const expenses = transactions.filter((t) => t.type === 'expense');

  // Core metrics computations
  const totalMonthlyIncome = incomes.reduce(
    (sum, t) => sum + getMonthlyEquivalent(t.amount, t.frequency),
    0
  );
  const totalMonthlyExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalMonthlyIncome - totalMonthlyExpenses;
  const savingsRate = totalMonthlyIncome > 0 ? (Math.max(0, netBalance) / totalMonthlyIncome) * 100 : 0;

  // CRUD handlers
  const handleAddTransaction = (type: TransactionType) => {
    setEditingTransaction(null);
    setModalType(type);
    setModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setModalType(transaction.type);
    setModalOpen(true);
  };

  const handleDeleteTransaction = (id: number) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSaveTransaction = (
    fields: Omit<Transaction, 'id'> & { id?: number }
  ) => {
    let updated: Transaction[];
    if (fields.id) {
      // Edit mode
      updated = transactions.map((t) =>
        t.id === fields.id ? { ...t, ...fields } as Transaction : t
      );
    } else {
      // Add mode
      const newTx: Transaction = {
        ...fields,
        id: Date.now(),
      } as Transaction;
      updated = [newTx, ...transactions];
    }
    setTransactions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-[#fafafa] transition-colors duration-300 font-sans antialiased">
      {/* Structural AppBar */}
      <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />

      {/* Main Container */}
      <main className="max-w-[1240px] mx-auto px-4 md:px-10 py-8">
        {transactions.length > 0 && (
          <AnimatePresence mode="wait">
            {netBalance >= 0 ? (
              <motion.div
                key="positive-cash"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-4 rounded-2xl flex items-center gap-3 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-[#4edea3] border border-emerald-500/20 shadow-sm"
              >
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                <div className="flex flex-col">
                  <span className="font-sans font-bold text-sm">Positive Cash Flow</span>
                  <span className="font-geist text-[11px] opacity-75 mt-0.5 font-medium uppercase tracking-wider dark:text-[#a1a1aa]">
                    You&apos;re saving{' '}
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                      netBalance
                    )}{' '}
                    per month ({savingsRate.toFixed(0)}% savings rate).
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="negative-cash"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-4 rounded-2xl flex items-center gap-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-sm"
              >
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
                <div className="flex flex-col">
                  <span className="font-sans font-bold text-sm">Budget Deficit</span>
                  <span className="font-geist text-[11px] opacity-75 mt-0.5 font-medium uppercase tracking-wider dark:text-[#a1a1aa]">
                    Your expenses exceed income by{' '}
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                      Math.abs(netBalance)
                    )}{' '}
                    per month.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Dashboard 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Transaction Management (Col Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Income Card Module */}
            <section className="p-6 rounded-3xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] hover:border-zinc-300 dark:hover:border-[#3f3f46] hover:shadow-lg transition-all duration-350">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-sans font-bold text-lg text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-[#3b82f6]">
                    <CircleDollarSign className="h-5 w-5" />
                  </div>
                  Income Sources
                </h2>
                <button
                  onClick={() => handleAddTransaction('income')}
                  className="flex items-center gap-1 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 px-4 py-2 rounded-xl font-sans font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Source
                </button>
              </div>

              {incomes.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-zinc-800/60 rounded-2xl">
                  <p className="font-sans text-xs text-zinc-500">No active income sources recorded</p>
                  <button
                    onClick={() => handleAddTransaction('income')}
                    className="text-xs font-semibold text-[#3b82f6] mt-2 underline cursor-pointer hover:opacity-80"
                  >
                    Add one now
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <AnimatePresence initial={false}>
                    {incomes.map((item) => (
                      <TransactionItem
                        key={item.id}
                        transaction={item}
                        onEdit={handleEditTransaction}
                        onDelete={handleDeleteTransaction}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>

            {/* Expenses Card Module */}
            <section className="p-6 rounded-3xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] hover:border-zinc-300 dark:hover:border-[#3f3f46] hover:shadow-lg transition-all duration-350">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-sans font-bold text-lg text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
                    <ReceiptText className="h-5 w-5" />
                  </div>
                  Expenses Log
                </h2>
                <button
                  onClick={() => handleAddTransaction('expense')}
                  className="flex items-center gap-1 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 px-4 py-2 rounded-xl font-sans font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Expense
                </button>
              </div>

              {expenses.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-zinc-800/60 rounded-2xl">
                  <p className="font-sans text-xs text-zinc-500">No active expenses recorded</p>
                  <button
                    onClick={() => handleAddTransaction('expense')}
                    className="text-xs font-semibold text-rose-500 mt-2 underline cursor-pointer hover:opacity-80"
                  >
                    Add one now
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <AnimatePresence initial={false}>
                    {expenses.map((item) => (
                      <TransactionItem
                        key={item.id}
                        transaction={item}
                        onEdit={handleEditTransaction}
                        onDelete={handleDeleteTransaction}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>

          </div>

          {/* Right Panel: Aggregations, Summary & Micro-Charts (Col Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* KPI Cards Hub */}
            <SummaryCards
              totalIncome={totalMonthlyIncome}
              totalExpenses={totalMonthlyExpenses}
              balance={netBalance}
              savingsRate={savingsRate}
            />

            {/* Pizza Gauge Chart */}
            <DistributionChart expenses={expenses} />

            {/* Financial Status Column Bars */}
            <OverviewChart
              totalIncome={totalMonthlyIncome}
              totalExpenses={totalMonthlyExpenses}
              balance={netBalance}
            />

          </div>

        </div>
      </main>

      {/* Reusable Transaction Editing Modal */}
      <TransactionModal
        isOpen={modalOpen}
        type={modalType}
        editingTransaction={editingTransaction}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}
