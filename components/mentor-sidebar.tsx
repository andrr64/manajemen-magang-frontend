"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Award,
  User,
  LogOut,
  X,
  Clock,
  Activity,
  FileBadge,
  Scroll
} from "lucide-react";

interface MentorSidebarProps {
  onClose?: () => void;
}

export default function MentorSidebar({ onClose }: MentorSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard/mentor", icon: LayoutDashboard },
    { name: "Data Mahasiswa", href: "/dashboard/mentor/data-mahasiswa", icon: Users },
    { name: "Data Absensi", href: "/dashboard/mentor/data-absensi", icon: Clock },
    { name: "Data Kegiatan", href: "/dashboard/mentor/data-kegiatan", icon: Activity },
    { name: "Penilaian Magang", href: "/dashboard/mentor/penilaian", icon: Award },
    { name: "Sertifikat Magang", href: "/dashboard/mentor/sertifikat", icon: FileBadge },
    { name: "Surat Keterangan", href: "/dashboard/mentor/surat-keterangan", icon: Scroll },
    { name: "Profil Saya", href: "/dashboard/mentor/profil", icon: User }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-[#070e24]">
      {/* Sidebar Brand Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
            Intern<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
          </span>
        </div>
        {onClose && (
          <button
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 md:hidden"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Sidebar Mentor Profile Card */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white font-extrabold flex items-center justify-center shadow-inner">
            AH
          </div>
          <div className="overflow-hidden">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">Dr. Ahmad Hidayat, M.T.</h4>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold truncate mt-0.5">Dosen & Pembimbing</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">NIDN. 0423127801</p>
          </div>
        </div>
      </div>

      {/* Sidebar Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Cek kecocokan rute aktif secara presisi
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Bottom Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
        <Link
          href="/"
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon />
          <span>Kembali ke Beranda</span>
        </Link>
        <button
          onClick={() => {
            if (confirm("Apakah Anda yakin ingin keluar?")) {
              window.location.href = "/login";
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Keluar Sistem</span>
        </button>
      </div>
    </div>
  );
}

// Icon helper untuk tombol "Kembali ke Beranda"
function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}
