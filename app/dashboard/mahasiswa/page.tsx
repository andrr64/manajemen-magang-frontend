"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  FileText, 
  Calendar, 
  Award, 
  ChevronRight, 
  Clock, 
  CheckCircle,
  TrendingUp,
  MapPin,
  Building,
  User,
  ExternalLink,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Loader2
} from "lucide-react";
import { useDashboardMahasiswaStats } from "@/modules/dashboard_mahasiswa/hooks";
import { useStudentDetail, useSisaWaktuMagang } from "@/modules/data_mahasiswa/hooks";
import { useActivities } from "@/modules/data_kegiatan/hooks";
import { useIam } from "@/modules/iam/hooks";
import { useTotalKehadiran } from "@/modules/data_absensi/hooks";

export default function StudentDashboardHome() {
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  // Get current logged-in user
  const { user } = useIam();

  // Fetch data using the real logged in student's ID
  const { stats, isLoading } = useDashboardMahasiswaStats(user?.id);

  // Retrieve student API data
  const { student: apiStudent, isLoading: isStudentLoading } = useStudentDetail(user?.id);
  const { activities, isLoading: isActivitiesLoading } = useActivities();

  const { total, isLoading: isTotalKehadiranLoading } = useTotalKehadiran(user?.id);
  
  // Ambil sisa waktu magang dari server backend
  const { sisaWaktu: sisaWaktuServer, isLoading: isSisaWaktuLoading } = useSisaWaktuMagang();

  // Dynamic Profile Object
  const studentProfile = {
    name: user?.nama || apiStudent?.name || "Memuat...",
    nim: user?.nim || apiStudent?.nim || "-",
    email: user?.email || apiStudent?.email || "-",
    university: apiStudent?.university || "-",
    program: apiStudent?.program || "-",
    company: apiStudent?.company || "Belum Ditempatkan",
    role: apiStudent?.role || "-",
    period: apiStudent?.period || "-",
    progress: apiStudent?.progress || 0,
    attendance: apiStudent?.attendance || { present: 0, sick: 0, leave: 0, absent: 0 },
    logbooksCount: apiStudent?.logbooksCount || 0,
    logbooksPending: apiStudent?.logbooksPending || 0,
    grade: apiStudent?.grade || 0,
    mentorName: apiStudent?.namaMentor || "Belum Ada Mentor",
    mentorNIDN: "-",
    mentorEmail: "-"
  };

  // Sisa Waktu is now strictly from the backend endpoint
  let sisaWaktuDays = sisaWaktuServer;
  let sisaWaktuFormatted = "-";

  if (studentProfile.period && studentProfile.period.includes("-")) {
    const [, endStr] = studentProfile.period.split("-").map(s => s.trim());
    
    if (sisaWaktuDays > 0) {
      sisaWaktuFormatted = `Hingga tanggal ${endStr}`;
    } else if (!isSisaWaktuLoading && sisaWaktuDays === 0) {
      sisaWaktuFormatted = "Magang telah selesai";
    }
  }

  return (
    <div className="space-y-6">
      
      {/* WELCOME BANNER CARD */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#0d1637] via-[#102058] to-[#091129] text-white relative overflow-hidden shadow-xl shadow-[#232F72]/20">
        {/* Dynamic Spheres */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-violet-600/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-60 h-60 bg-cyan-600/10 rounded-full blur-[70px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-violet-200 bg-violet-850/60 border border-violet-750 px-3 py-1.5 rounded-lg">
              <Zap className="w-3.5 h-3.5 text-violet-300 animate-pulse" />
              STATUS MAGANG AKTIF • KELAS INDUSTRI
            </span>
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                Halo, {studentProfile.name}!
              </h3>
              <p className="text-xs text-violet-200 mt-1.5 font-semibold leading-relaxed max-w-xl">
                Anda sedang menempuh magang industri sebagai <strong className="text-white">{studentProfile.role}</strong> di <strong className="text-white">{studentProfile.company}</strong>. Tetap jaga kedisiplinan dan jangan lupa mengisi logbook mingguan Anda!
              </p>
            </div>
            
            {/* Meta Tags */}
            <div className="flex flex-wrap gap-4 pt-1.5 text-xs text-violet-200/90 font-medium">
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-violet-300" />
                {studentProfile.company}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-violet-300" />
                {studentProfile.period}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Metric 1: Kehadiran */}
        <div className="glass-card p-5 rounded-3xl border border-[#2F578A]/30 dark:border-[#2F578A] bg-white dark:bg-[#232F72]/40 dark:backdrop-blur-md flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
          <div>
            <span className="text-[10px] font-bold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 dark:text-slate-550 uppercase tracking-wider block">
              Total Kehadiran
            </span>
            <h4 className="text-2xl font-black tracking-tight text-[#232F72] dark:text-[#FFFFFF] mt-1">
              {isTotalKehadiranLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
              ) : (
                `${total} Hari`
              )}
            </h4>
            <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 block pt-1">
              Kehadiran Anda {isTotalKehadiranLoading ? "..." : (total ? ((total / 80) * 100).toFixed(1) : 96.2)}% (Sangat Baik)
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/20 shadow-sm">
            <Clock className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Metric 2: Sisa Waktu */}
        <div className="glass-card p-5 rounded-3xl border border-[#2F578A]/30 dark:border-[#2F578A] bg-white dark:bg-[#232F72]/40 dark:backdrop-blur-md flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
          <div>
            <span className="text-[10px] font-bold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 dark:text-slate-550 uppercase tracking-wider block">
              Sisa Waktu Magang
            </span>
            <h4 className="text-2xl font-black tracking-tight text-[#232F72] dark:text-[#FFFFFF] mt-1">
              {isStudentLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
              ) : (
                `${sisaWaktuDays} Hari Lagi`
              )}
            </h4>
            <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400 block pt-1">
              {isStudentLoading ? "Menghitung sisa waktu..." : sisaWaktuFormatted}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/20 shadow-sm">
            <Calendar className="w-5.5 h-5.5" />
          </div>
        </div>

      </div>
    </div>
  );
}
