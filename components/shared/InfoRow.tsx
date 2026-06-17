import React from "react";

interface InfoRowProps {
  icon: React.ElementType;
  value: string;
  /** Tailwind text-color class for the icon. Defaults to "text-indigo-500" */
  iconColor?: string;
  truncate?: boolean;
}

export function InfoRow({
  icon: Icon,
  value,
  iconColor = "text-indigo-500",
  truncate = true,
}: InfoRowProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
      <span className={`text-slate-800 dark:text-white text-xs font-semibold ${truncate ? "truncate" : ""}`}>
        {value}
      </span>
    </div>
  );
}
