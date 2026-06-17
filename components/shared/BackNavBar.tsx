import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackNavBarProps {
  href: string;
  label?: string;
  rightContent?: React.ReactNode;
}

export function BackNavBar({ href, label = "Kembali", rightContent }: BackNavBarProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-3.5 py-2 border border-[#2F578A]/50 dark:border-[#2F578A] hover:border-[#232F72] dark:hover:border-[#36ADA3] rounded-xl text-xs font-bold text-[#232F72] dark:text-[#F1F5F9] bg-white dark:bg-[#121358]/40 transition-all hover:scale-[1.02] active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        {label}
      </Link>
      {rightContent && (
        <div className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/50 font-bold">
          {rightContent}
        </div>
      )}
    </div>
  );
}
