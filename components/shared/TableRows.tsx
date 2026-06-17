import React from "react";
import { Loader2 } from "lucide-react";

// ─── TableLoadingRow ─────────────────────────────────────────────────────────

interface TableLoadingRowProps {
  colSpan: number;
  text?: string;
}

export function TableLoadingRow({ colSpan, text = "Memuat data..." }: TableLoadingRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-[#2F578A]/60 dark:text-[#F1F5F9]/30 text-xs font-bold">
          <Loader2 className="w-8 h-8 animate-spin text-[#36ADA3]" />
          <span>{text}</span>
        </div>
      </td>
    </tr>
  );
}

// ─── TableEmptyRow ───────────────────────────────────────────────────────────

interface TableEmptyRowProps {
  colSpan: number;
  title: string;
  description?: string;
  onReset?: () => void;
  resetLabel?: string;
}

export function TableEmptyRow({
  colSpan,
  title,
  description,
  onReset,
  resetLabel = "Setel Ulang Semua Filter",
}: TableEmptyRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-16 text-center">
        <div className="max-w-md mx-auto space-y-2">
          <p className="text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-extrabold text-sm">{title}</p>
          {description && (
            <p className="text-[#2F578A]/80 dark:text-[#F1F5F9]/50 text-xs">{description}</p>
          )}
          {onReset && (
            <button
              onClick={onReset}
              className="mt-2 text-xs font-bold text-[#232F72] dark:text-[#F1F5F9] underline underline-offset-2 hover:text-[#2F578A] transition-colors cursor-pointer"
            >
              {resetLabel}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
