"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  defaultPerPage?: number;
  perPageOptions?: number[];
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

const ALIGN = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export function DataTable<T extends object>({
  columns,
  data,
  defaultPerPage = 10,
  perPageOptions = [5, 10, 20, 50],
  emptyMessage = "Tidak ada data.",
  loading = false,
  className = "",
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);

  // Reset to page 1 whenever the data array changes (e.g. filter applied)
  useEffect(() => {
    setPage(1);
  }, [data]);

  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * perPage;
  const endIdx = Math.min(startIdx + perPage, total);

  const pagedData = useMemo(
    () => data.slice(startIdx, endIdx),
    [data, startIdx, endIdx]
  );

  const isFirst = safePage <= 1;
  const isLast = safePage >= totalPages;

  function handlePerPageChange(newSize: number) {
    setPerPage(newSize);
    setPage(1);
  }

  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-[#2F578A]/50 overflow-hidden bg-white dark:bg-[#0d1238] shadow-sm ${className}`}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3.5 bg-[#F8FAFC] dark:bg-[#121358] border-b border-slate-200 dark:border-[#2F578A]/50">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-[#F1F5F9]/70">
          <span>Tampilkan</span>
          <select
            value={perPage}
            onChange={(e) => handlePerPageChange(Number(e.target.value))}
            className="bg-white dark:bg-[#0d1238] border border-slate-200 dark:border-[#2F578A]/50 text-slate-800 dark:text-[#F1F5F9] rounded-lg px-2 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-[#2F578A]/30 transition-all"
          >
            {perPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span>baris</span>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-[#F1F5F9]/50">
          {total === 0
            ? "Tidak ada data"
            : `${startIdx + 1}–${endIdx} dari ${total} data`}
        </span>
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-[#F1F5F9]/70 dark:bg-[#232F72]/60 border-b border-slate-200 dark:border-[#2F578A]/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-[#F1F5F9]/60 whitespace-nowrap ${ALIGN[col.align ?? "left"]} ${col.className ?? ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#2F578A]/30">
            {loading ? (
              Array.from({ length: perPage }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 bg-slate-200 dark:bg-[#232F72]/60 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : pagedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-14 text-center text-sm text-slate-400 dark:text-[#F1F5F9]/40"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pagedData.map((row, i) => (
                <tr
                  key={i}
                  className="group hover:bg-[#F8FAFC]/50 dark:hover:bg-[#121358]/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-sm text-slate-700 dark:text-[#F1F5F9]/80 ${ALIGN[col.align ?? "left"]} ${col.className ?? ""}`}
                    >
                      {col.render
                        ? col.render(row, startIdx + i)
                        : String((row as Record<string, unknown>)[col.key] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-[#F8FAFC] dark:bg-[#121358] border-t border-slate-200 dark:border-[#2F578A]/50">
        <span className="text-xs font-medium text-slate-500 dark:text-[#F1F5F9]/50">
          Halaman {safePage} dari {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={isFirst}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isFirst
                ? "bg-slate-100 dark:bg-[#232F72]/30 text-slate-300 dark:text-[#F1F5F9]/25 cursor-not-allowed"
                : "bg-white dark:bg-[#0d1238] border border-slate-200 dark:border-[#2F578A]/50 text-slate-700 dark:text-[#F1F5F9]/80 hover:bg-slate-50 dark:hover:bg-[#121358] shadow-sm"
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Sebelumnya
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={isLast}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isLast
                ? "bg-slate-100 dark:bg-[#232F72]/30 text-slate-300 dark:text-[#F1F5F9]/25 cursor-not-allowed"
                : "bg-white dark:bg-[#0d1238] border border-slate-200 dark:border-[#2F578A]/50 text-slate-700 dark:text-[#F1F5F9]/80 hover:bg-slate-50 dark:hover:bg-[#121358] shadow-sm"
            }`}
          >
            Selanjutnya
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
