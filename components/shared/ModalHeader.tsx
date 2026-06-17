import React from "react";

interface ModalHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function ModalHeader({ icon, title, subtitle }: ModalHeaderProps) {
  return (
    <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-[#2F578A]">
      <div className="p-2.5 bg-[#F8FAFC] dark:bg-[#232F72] border border-[#2F578A]/30 text-[#232F72] dark:text-[#FFFFFF] rounded-xl flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-extrabold text-sm text-[#232F72] dark:text-[#FFFFFF] leading-tight">
          {title}
        </h4>
        {subtitle && (
          <p className="text-[10px] text-slate-500 dark:text-slate-500 font-semibold mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
