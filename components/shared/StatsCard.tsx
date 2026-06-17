import React from "react";

export interface StatItem {
  label: string;
  value: string | number;
  desc?: string;
  /** Full Tailwind class string: bg + text + border, e.g.
   *  "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40" */
  colorClass: string;
  icon: React.ElementType;
}

interface StatsCardProps extends StatItem {}

export function StatsCard({ label, value, desc, colorClass, icon: Icon }: StatsCardProps) {
  return (
    <div className={`p-4 rounded-2xl border ${colorClass} flex justify-between items-start shadow-sm`}>
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-85 block">
          {label}
        </span>
        <div className="flex items-baseline mt-2">
          <span className="text-2xl font-black tracking-tight">{value}</span>
        </div>
        {desc && (
          <span className="text-[10px] font-semibold opacity-75 block pt-1.5">{desc}</span>
        )}
      </div>
      <div className="p-2 bg-white/40 dark:bg-black/20 rounded-xl flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: StatItem[];
  /** Tailwind grid-cols class, default "grid-cols-2 md:grid-cols-4" */
  gridClass?: string;
}

export function StatsGrid({ stats, gridClass = "grid-cols-2 md:grid-cols-4" }: StatsGridProps) {
  return (
    <div className={`grid ${gridClass} gap-4`}>
      {stats.map((s, i) => (
        <StatsCard key={i} {...s} />
      ))}
    </div>
  );
}
