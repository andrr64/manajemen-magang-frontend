"use client";

import React from "react";

interface DashboardPaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  /** "mentor" = active page uses #232F72; "mahasiswa" = active uses #36ADA3 */
  variant?: "mentor" | "mahasiswa";
}

export function DashboardPagination({
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20],
  variant = "mentor",
}: DashboardPaginationProps) {
  const btnBase =
    "px-3 py-1.5 border border-[#2F578A]/50 dark:border-[#2F578A] rounded-xl text-xs font-bold text-[#232F72] dark:text-[#F1F5F9] hover:bg-[#F1F5F9] dark:hover:bg-[#232F72] disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer";

  const activeClass =
    variant === "mahasiswa"
      ? "bg-[#36ADA3] text-white border-[#36ADA3] shadow-[0_0_8px_rgba(54,173,163,0.3)]"
      : "bg-[#232F72] dark:bg-[#232F72] text-white border-[#232F72] shadow-md shadow-[#232F72]/20";

  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between border-t border-slate-100 dark:border-[#2F578A] pt-4 mt-4 flex-wrap gap-3">
      <span className="text-[11px] font-semibold text-[#2F578A]/80 dark:text-[#F1F5F9]/50">
        Halaman {page} dari {totalPages}
      </span>

      <div className="flex items-center gap-1.5 flex-wrap">
        <button onClick={() => onPageChange(1)} disabled={page === 1} className={btnBase}>
          Awal
        </button>
        <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1} className={btnBase}>
          Sebelumnya
        </button>

        {pageNums.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
              p === page ? activeClass : "border-[#2F578A]/50 dark:border-[#2F578A] text-[#232F72] dark:text-[#F1F5F9] hover:bg-[#F1F5F9] dark:hover:bg-[#232F72]"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className={btnBase}
        >
          Selanjutnya
        </button>
        <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages} className={btnBase}>
          Akhir
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[#2F578A]/80 dark:text-[#F1F5F9]/50 text-[11px] font-medium">
          Baris per halaman:
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="px-2 py-1 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-lg text-xs focus:outline-none dark:text-white"
        >
          {pageSizeOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
