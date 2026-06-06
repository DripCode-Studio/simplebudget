/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { Transaction, TransactionType, IncomeFrequency, ExpenseCategory } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  type: TransactionType;
  editingTransaction: Transaction | null;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'> & { id?: number }) => void;
}

export default function TransactionModal({
  isOpen,
  type,
  editingTransaction,
  onClose,
  onSave,
}: TransactionModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<IncomeFrequency>('monthly');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');

  // Sync state when opening or when editing editingTransaction changes
  useEffect(() => {
    if (editingTransaction) {
      setName(editingTransaction.name);
      setAmount(editingTransaction.amount.toString());
      if (editingTransaction.frequency) setFrequency(editingTransaction.frequency);
      if (editingTransaction.category) setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setNotes(editingTransaction.notes || '');
    } else {
      setName('');
      setAmount('');
      setFrequency('monthly');
      setCategory('other');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [editingTransaction, isOpen, type]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !amount || parseFloat(amount) <= 0) return;

    onSave({
      id: editingTransaction?.id,
      type,
      name: name.trim(),
      amount: parseFloat(amount),
      frequency: type === 'income' ? frequency : null,
      category: type === 'expense' ? category : null,
      date,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95, y: 15, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/70 dark:bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md rounded-3xl p-6 md:p-8 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h3 className="font-sans font-bold text-xl text-zinc-900 dark:text-zinc-50">
                {editingTransaction
                  ? type === 'income'
                    ? 'Edit Income Source'
                    : 'Edit Expense'
                  : type === 'income'
                    ? 'Add Income Source'
                    : 'Add Expense'}
              </h3>
              <p className="font-geist text-xs text-zinc-500 mt-1 dark:text-zinc-400">
                Configure your budget metrics carefully.
              </p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-geist text-[11px] font-semibold text-zinc-500 dark:text-[#a1a1aa] uppercase tracking-widest mb-1.5">
                  Name / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder={type === 'income' ? 'e.g. Main Salary, Freelance' : 'e.g. Rent, Netflix, Groceries'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-[#27272a] focus:border-zinc-400 dark:focus:border-zinc-500 rounded-xl px-4 py-3 focus:outline-none transition-all text-zinc-900 dark:text-zinc-100 font-sans text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-geist text-[11px] font-semibold text-zinc-500 dark:text-[#a1a1aa] uppercase tracking-widest mb-1.5">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-[#27272a] focus:border-zinc-400 dark:focus:border-zinc-500 rounded-xl px-4 py-3 focus:outline-none transition-all text-zinc-900 dark:text-zinc-100 font-mono text-sm"
                  />
                </div>

                {type === 'income' ? (
                  <div>
                    <label className="block font-geist text-[11px] font-semibold text-zinc-500 dark:text-[#a1a1aa] uppercase tracking-widest mb-1.5">
                      Frequency
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as IncomeFrequency)}
                      className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-[#27272a] focus:border-zinc-400 dark:focus:border-zinc-500 rounded-xl px-3 py-3 focus:outline-none transition-all text-zinc-900 dark:text-zinc-100 font-sans text-sm cursor-pointer"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Biweekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block font-geist text-[11px] font-semibold text-zinc-500 dark:text-[#a1a1aa] uppercase tracking-widest mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                      className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-[#27272a] focus:border-zinc-400 dark:focus:border-zinc-500 rounded-xl px-3 py-3 focus:outline-none transition-all text-zinc-900 dark:text-zinc-100 font-sans text-sm cursor-pointer"
                    >
                      <option value="housing">Housing</option>
                      <option value="food">Food & Dining</option>
                      <option value="transport">Transportation</option>
                      <option value="entertainment">Fun & Entertainment</option>
                      <option value="shopping">Shopping</option>
                      <option value="education">Education</option>
                      <option value="health">Health</option>
                      <option value="utilities">Utilities</option>
                      <option value="insurance">Insurance</option>
                      <option value="other">Other Stuff</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block font-geist text-[11px] font-semibold text-zinc-500 dark:text-[#a1a1aa] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5" /> Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-[#27272a] focus:border-zinc-400 dark:focus:border-zinc-500 rounded-xl px-4 py-3 focus:outline-none transition-all text-zinc-900 dark:text-zinc-100 font-mono text-sm cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-geist text-[11px] font-semibold text-zinc-500 dark:text-[#a1a1aa] uppercase tracking-widest mb-1.5">
                  Optional Notes
                </label>
                <textarea
                  placeholder="Any additional details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-[#27272a] focus:border-zinc-400 dark:focus:border-zinc-500 rounded-xl px-4 py-2.5 focus:outline-none transition-all text-zinc-900 dark:text-zinc-100 font-sans text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:opacity-90 font-sans font-bold text-sm shadow-md transition-all active:scale-[0.98] mt-6 cursor-pointer"
              >
                {editingTransaction ? 'Update Transaction' : 'Save Transaction'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
