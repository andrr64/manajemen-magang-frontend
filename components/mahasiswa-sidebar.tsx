"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Clock,
  Award,
  FileBadge,
  Scroll,
  User,
  LogOut,
  X,
  Activity
} from "lucide-react";
import { useIam } from "@/modules/iam/hooks";

interface MahasiswaSidebarProps {
  onClose?: () => void;
}

export default function MahasiswaSidebar({ onClose }: MahasiswaSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useIam();

  const avatarInitials = user?.nama
    ? user.nama.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "M";

  const menuItems = [
    { name: "Dashboard", href: "/dashboard/mahasiswa", icon: LayoutDashboard },
    { name: "Absensi Harian", href: "/dashboard/mahasiswa/absensi", icon: Clock },
    { name: "Kegiatan Magang", href: "/dashboard/mahasiswa/kegiatan", icon: Activity },
    { name: "Penilaian Magang", href: "/dashboard/mahasiswa/penilaian", icon: Award },
    { name: "Sertifikat Magang", href: "/dashboard/mahasiswa/sertifikat", icon: FileBadge },
    { name: "Surat Keterangan", href: "/dashboard/mahasiswa/surat-keterangan", icon: Scroll },
    { name: "Profil Saya", href: "/dashboard/mahasiswa/profil", icon: User }
  ];

  return (
    <div className="sticky top-0 h-screen w-full flex flex-col bg-white dark:bg-[#121358]">
      {/* Sidebar Brand Header */}
      <div className="p-6 border-b border-slate-200 dark:border-[#2F578A] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-r from-[#2F578A] to-[#36ADA3] text-[#FFFFFF] shadow-md shadow-[#36ADA3]/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#232F72] dark:text-[#FFFFFF]">
            Intern<span className="text-[#36ADA3]">Flow</span>
          </span>
        </div>
        {onClose && (
          <button
            className="p-1 rounded-lg text-slate-400 dark:text-[#F1F5F9]/70 hover:bg-slate-100 dark:hover:bg-[#121358] md:hidden"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Sidebar Student Profile Card */}
      <div className="p-5 border-b border-slate-200 dark:border-[#2F578A] bg-slate-50/50 dark:bg-[#232F72]/30">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#2F578A] to-[#36ADA3] text-[#FFFFFF] font-extrabold flex items-center justify-center shadow-inner">
            {avatarInitials}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-bold text-sm text-[#232F72] dark:text-[#FFFFFF] truncate">{user?.nama || user?.email || "Mahasiswa"}</h4>
            <p className="text-xs text-[#2F578A] dark:text-[#36ADA3] font-semibold truncate mt-0.5">{user?.role === "mahasiswa" ? "Mahasiswa Magang" : "Mahasiswa"}</p>
            <p className="text-[10px] text-slate-400 dark:text-[#F1F5F9]/50 truncate">{user?.nim ? `NIM. ${user.nim}` : "NIM. -"}</p>
          </div>
        </div>
      </div>

      {/* Sidebar Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[#232F72] text-[#FFFFFF] shadow-md"
                  : "text-[#2F578A] dark:text-[#F1F5F9]/70 hover:bg-slate-100 dark:hover:bg-[#121358]/50 hover:text-[#232F72] dark:hover:text-[#FFFFFF]"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Bottom Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-[#2F578A] space-y-2">
        <Link
          href="/"
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-[#2F578A] dark:text-[#F1F5F9]/70 hover:bg-slate-100 dark:hover:bg-[#121358]/50 hover:text-[#232F72] dark:hover:text-[#FFFFFF] transition-colors"
        >
          <ArrowLeftIcon />
          <span>Kembali ke Beranda</span>
        </Link>
        <button
          onClick={async () => {
            if (confirm("Apakah Anda yakin ingin keluar?")) {
              try {
                await logout();
              } catch (e) {
                console.error("Logout failed", e);
              }
              window.location.href = "/login";
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Keluar Sistem</span>
        </button>
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}
