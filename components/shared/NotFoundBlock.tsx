import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface NotFoundBlockProps {
  title: string;
  description: string;
  backHref: string;
  backLabel?: string;
}

export function NotFoundBlock({
  title,
  description,
  backHref,
  backLabel = "Kembali ke Daftar",
}: NotFoundBlockProps) {
  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-4">
      <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-full inline-block border border-rose-100 dark:border-rose-900/40">
        <AlertCircle className="w-10 h-10 animate-bounce" />
      </div>
      <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
        {description}
      </p>
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#232F72] hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-md transition-all mt-4 cursor-pointer active:scale-95"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {backLabel}
      </Link>
    </div>
  );
}
