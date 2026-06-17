import React from "react";
import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  text?: string;
  /** Tailwind text-color class for the spinner. Defaults to "text-[#36ADA3]" */
  spinnerColor?: string;
  minHeight?: string;
}

export function PageLoader({
  text = "Memuat data...",
  spinnerColor = "text-[#36ADA3]",
  minHeight = "min-h-[400px]",
}: PageLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${minHeight} space-y-4`}>
      <Loader2 className={`w-10 h-10 ${spinnerColor} animate-spin`} />
      {text && (
        <p className="text-[#2F578A] dark:text-[#F1F5F9]/60 font-extrabold text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
