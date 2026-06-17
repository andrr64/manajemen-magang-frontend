"use client";

import React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

interface SuccessModalProps {
  show: boolean;
  title: string;
  description: string;
  redirectText?: string;
  /** "mentor" = dark:bg-[#121358]; "indigo" = dark:bg-[#070e24] */
  variant?: "mentor" | "indigo";
}

export function SuccessModal({
  show,
  title,
  description,
  redirectText = "Mengalihkan kembali ke dashboard...",
  variant = "mentor",
}: SuccessModalProps) {
  if (!show) return null;

  const cardBg =
    variant === "indigo"
      ? "bg-white dark:bg-[#070e24]"
      : "bg-white dark:bg-[#121358]";
  const borderColor =
    variant === "indigo"
      ? "border border-slate-200 dark:border-slate-800"
      : "border border-[#2F578A]/50 dark:border-[#2F578A]";

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className={`${cardBg} ${borderColor} rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-4 animate-float`}>
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-200/50 dark:border-emerald-900/40 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>
        <div className="space-y-1.5">
          <h4 className="font-black text-lg text-[#232F72] dark:text-white">{title}</h4>
          <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-[#2F578A]/80 dark:text-[#F1F5F9]/50">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#36ADA3]" />
          {redirectText}
        </div>
      </div>
    </div>
  );
}
