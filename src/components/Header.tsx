/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Trash2 } from 'lucide-react';

interface HeaderProps {
  onClearData: () => void;
}

export default function Header({ onClearData }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-4 md:px-10 py-5 w-full sticky top-0 z-50 backdrop-blur-md bg-opacity-80 border-b border-zinc-800/40 bg-[#09090b]/85">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
          <span className="font-sans font-bold text-lg text-emerald-500">S</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-zinc-50">
          SimpleBudget
        </h1>
      </div>
      <button
        onClick={onClearData}
        className="p-2.5 rounded-full bg-zinc-805 hover:bg-zinc-800 border border-zinc-700/30 transition-all duration-300 group cursor-pointer"
        aria-label="Clear all data"
        title="Clear all data"
      >
        <Trash2 className="h-4 w-4 text-zinc-400 group-hover:text-rose-400 transition-colors" />
      </button>
    </header>
  );
}
