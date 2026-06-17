import React from "react";

interface FormSectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

export function FormSectionHeader({ icon, title }: FormSectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 pb-1.5 border-b border-dashed border-[#2F578A]/20 dark:border-[#2F578A]/40">
      <span className="text-[#36ADA3] flex-shrink-0">{icon}</span>
      <h5 className="font-extrabold text-xs text-[#2F578A]/80 dark:text-[#F1F5F9]/50 uppercase tracking-widest">
        {title}
      </h5>
    </div>
  );
}
