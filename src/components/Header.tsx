/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Header({ isDark, onToggleTheme }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-4 md:px-10 py-5 w-full sticky top-0 z-50 backdrop-blur-md bg-opacity-80 transition-colors duration-300 border-b border-zinc-200/50 dark:border-zinc-800/40 bg-white/70 dark:bg-[#09090b]/85">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
          <span className="font-sans font-bold text-lg text-emerald-500">S</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-zinc-900 dark:text-zinc-50">
          SimpleBudget
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          id="theme-toggle-btn"
          onClick={onToggleTheme}
          className="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-805 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/30 transition-all duration-300 group cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
          ) : (
            <Moon className="h-5 w-5 text-zinc-600 group-hover:-rotate-12 transition-transform duration-500" />
          )}
        </button>
      </div>
    </header>
  );
}
