/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'income' | 'expense';

export type IncomeFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export type ExpenseCategory = 'housing' | 'food' | 'transport' | 'entertainment' | 'shopping' | 'education' | 'health' | 'utilities' | 'insurance' | 'other';

export interface Transaction {
  id: number;
  type: TransactionType;
  name: string;
  amount: number;
  frequency: IncomeFrequency | null; // e.g. for income
  category: ExpenseCategory | null;   // e.g. for expenses
  date: string;                       // e.g. 'YYYY-MM-DD'
  notes?: string;
}

export interface BudgetState {
  income: Transaction[];
  expenses: Transaction[];
}
