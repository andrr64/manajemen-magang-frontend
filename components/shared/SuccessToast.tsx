"use client";

import { CheckCircle, Check } from "lucide-react";
import React from "react";

// ─── Mentor variant ────────────────────────────────────────────────────────
// bg-emerald-50 / dark:bg-emerald-950, simple CheckCircle, single message line
// Used in: data-mahasiswa, data-absensi, data-kegiatan, penilaian, sertifikat,
//          surat-keterangan clients + mentor/profil

interface MentorToastProps {
  message: string;
  show: boolean;
  variant?: "mentor";
}

// ─── Mahasiswa variant ─────────────────────────────────────────────────────
// bg-emerald-550 (custom) / dark:bg-[#062419], boxed icon, title + message
// Used in: mahasiswa/absensi, kegiatan, penilaian, sertifikat, surat-keterangan, profil

interface MahasiswaToastProps {
  message: string;
  show: boolean;
  variant: "mahasiswa";
  title?: string;
  icon?: React.ReactNode;
}

type SuccessToastProps = MentorToastProps | MahasiswaToastProps;

export function SuccessToast(props: SuccessToastProps) {
  if (!props.show) return null;

  if (props.variant === "mahasiswa") {
    const { message, title = "Aksi Sukses", icon } = props as MahasiswaToastProps;
    return (
      <div className="fixed bottom-8 right-8 z-50 p-4 bg-emerald-550 dark:bg-[#062419] border border-emerald-450 dark:border-emerald-850 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-float max-w-sm">
        <div className="p-1.5 bg-white/20 rounded-lg flex-shrink-0">
          {icon ?? <Check className="w-5 h-5 text-white" />}
        </div>
        <div>
          <span className="text-xs font-black block">{title}</span>
          <span className="text-[10px] opacity-90 font-bold block mt-0.5">{message}</span>
        </div>
      </div>
    );
  }

  // mentor (default)
  return (
    <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-2xl shadow-xl flex items-center gap-3 animate-float max-w-sm">
      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
      <span className="text-xs font-bold leading-normal">{props.message}</span>
    </div>
  );
}
