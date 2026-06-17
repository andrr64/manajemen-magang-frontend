"use client";

import React from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
  /** Extra classes on the inner card (e.g. "space-y-5") */
  cardClassName?: string;
}

/**
 * Generic mentor-style modal: dark overlay + rounded-3xl card.
 * Click outside the card triggers onClose.
 */
export function Modal({
  show,
  onClose,
  maxWidth = "max-w-sm",
  children,
  cardClassName = "space-y-5",
}: ModalProps) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white dark:bg-[#121358] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-3xl p-6 md:p-8 ${maxWidth} w-full shadow-2xl animate-float max-h-[90vh] overflow-y-auto ${cardClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
