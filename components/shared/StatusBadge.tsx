import React from "react";

type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral";

const variantClasses: Record<StatusVariant, { badge: string; dot: string }> = {
  success: {
    badge: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40",
    dot: "bg-emerald-500",
  },
  warning: {
    badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/40",
    dot: "bg-amber-500",
  },
  danger: {
    badge: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/40",
    dot: "bg-rose-500",
  },
  info: {
    badge: "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200/50 dark:border-sky-900/40",
    dot: "bg-sky-500",
  },
  neutral: {
    badge: "bg-[#F1F5F9] dark:bg-[#232F72]/80 text-[#2F578A] dark:text-[#F1F5F9]/80 border-[#2F578A]/30 dark:border-[#2F578A]/40",
    dot: "bg-[#2F578A]",
  },
};

interface StatusBadgeProps {
  label: string;
  variant: StatusVariant;
  showDot?: boolean;
}

export function StatusBadge({ label, variant, showDot = true }: StatusBadgeProps) {
  const { badge, dot } = variantClasses[variant];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${badge}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {label}
    </span>
  );
}
