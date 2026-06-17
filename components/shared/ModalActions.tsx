"use client";

import React from "react";
import Link from "next/link";
import { Loader2, Check } from "lucide-react";

interface ModalActionsProps {
  /** Pass either cancelHref (renders a Link) or onCancel (renders a button) */
  cancelHref?: string;
  onCancel?: () => void;
  cancelLabel?: string;
  submitLabel: string;
  submittingLabel?: string;
  isSubmitting: boolean;
  submitIcon?: React.ReactNode;
  /** "mentor" = #232F72 bg; "indigo" = indigo-600 bg */
  variant?: "mentor" | "indigo";
  disabled?: boolean;
}

export function ModalActions({
  cancelHref,
  onCancel,
  cancelLabel = "Batal",
  submitLabel,
  submittingLabel = "Menyimpan...",
  isSubmitting,
  submitIcon,
  variant = "mentor",
  disabled,
}: ModalActionsProps) {
  const submitBg =
    variant === "indigo"
      ? "bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-500/65 shadow-indigo-500/20"
      : "bg-[#232F72] hover:brightness-110 disabled:opacity-70 shadow-[#232F72]/20";

  const cancelClass =
    "px-5 py-2.5 rounded-xl border border-[#2F578A]/50 dark:border-[#2F578A] text-xs font-bold text-[#232F72] dark:text-[#F1F5F9] hover:bg-[#F1F5F9] dark:hover:bg-[#232F72] transition-all cursor-pointer";

  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#2F578A]">
      {cancelHref ? (
        <Link href={cancelHref} className={cancelClass}>
          {cancelLabel}
        </Link>
      ) : (
        <button type="button" onClick={onCancel} className={cancelClass}>
          {cancelLabel}
        </button>
      )}

      <button
        type="submit"
        disabled={isSubmitting || disabled}
        className={`px-6 py-2.5 rounded-xl ${submitBg} text-white text-xs font-extrabold flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {submittingLabel}
          </>
        ) : (
          <>
            {submitIcon ?? <Check className="w-4 h-4" />}
            {submitLabel}
          </>
        )}
      </button>
    </div>
  );
}
