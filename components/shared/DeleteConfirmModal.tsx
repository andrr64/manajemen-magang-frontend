"use client";

import React from "react";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  show: boolean;
  title: string;
  body: React.ReactNode;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function DeleteConfirmModal({
  show,
  title,
  body,
  isDeleting,
  onConfirm,
  onCancel,
  confirmLabel = "Ya, Hapus Data",
  cancelLabel = "Batal",
}: DeleteConfirmModalProps) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#121358] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-center space-y-6 animate-float"
      >
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-200/50 dark:border-rose-900/40 flex items-center justify-center mx-auto shadow-md">
          <Trash2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h4 className="font-extrabold text-lg text-[#232F72] dark:text-[#FFFFFF]">{title}</h4>
          <div className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold leading-relaxed">
            {body}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 text-xs">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-[#2F578A]/50 dark:border-[#2F578A] text-[#232F72] dark:text-[#F1F5F9] font-bold hover:bg-[#F1F5F9] dark:hover:bg-[#232F72] transition-all cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white font-extrabold rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Menghapus...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
