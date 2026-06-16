import React from "react";

interface PaginationProps {
  index: number;
  size: number;
  totalPages: number;
  length: number;
  onPageChange: (newIndex: number) => void;
  onSizeChange: (newSize: number) => void;
}

export function Pagination({
  index,
  size,
  totalPages,
  length,
  onPageChange,
  onSizeChange
}: PaginationProps) {
  const isFirst = index <= 1;
  const isLast = index >= totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-white dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/50 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <span>Tampilkan</span>
        <select
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>data per halaman. Total: {length} data.</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(index - 1)}
          disabled={isFirst}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            isFirst
              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
              : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm"
          }`}
        >
          Sebelumnya
        </button>

        <span className="px-3 py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
          Halaman {index} dari {Math.max(1, totalPages)}
        </span>

        <button
          onClick={() => onPageChange(index + 1)}
          disabled={isLast}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            isLast
              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
              : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm"
          }`}
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
