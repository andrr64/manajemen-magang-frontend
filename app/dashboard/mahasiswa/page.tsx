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
import { useDashboardMahasiswaStats } from "@/modules/dashboard-mahasiswa/hooks";
import { useStudentDetail } from "@/modules/mahasiswa/hooks";
import { useActivities } from "@/modules/kegiatan/hooks";

export default function StudentDashboardHome() {
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  // Hardcode ID 1 as simulation for the logged in student
  const { stats, isLoading } = useDashboardMahasiswaStats(1);

  // Retrieve student API data
  const { student: apiStudent, isLoading: isStudentLoading } = useStudentDetail(1);
  const { activities, isLoading: isActivitiesLoading } = useActivities();

  // Dynamic Profile Object
  const studentProfile = {
    name: apiStudent?.name || "Memuat...",
    nim: apiStudent?.nim || "-",
    email: apiStudent?.email || "-",
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

  const recentLogbooks = activities.slice(0, 5).map((act, idx) => ({
    id: act.id,
    week: `Aktivitas ${activities.length - idx}`,
    date: act.date,
    topic: act.title,
    hours: 8,
    status: act.status === "Sudah Diunggah" ? "Disetujui" : "Menunggu"
  }));

  return (
    <div className="space-y-6">
      
      {/* WELCOME BANNER CARD */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-indigo-950 text-white relative overflow-hidden shadow-xl shadow-indigo-950/20">
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

          <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm text-center min-w-[200px]">
            <span className="text-[10px] font-black uppercase text-violet-300 tracking-wider">Progres Magang</span>
            <span className="text-4xl font-black text-white mt-1">{studentProfile.progress}%</span>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-3.5">
              <div className="bg-gradient-to-r from-violet-400 to-fuchsia-400 h-full rounded-full" style={{ width: `${studentProfile.progress}%` }} />
            </div>
            <span className="text-[9px] font-bold text-violet-200/80 mt-2 block">Minggu ke-8 dari 12 Minggu</span>
          </div>
        </div>
      </div>

      {/* METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Metric 1: Kehadiran */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block">
              Total Kehadiran
            </span>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
              ) : (
                `${stats?.totalKehadiran ?? studentProfile.attendance.present} / 80 Hari`
              )}
            </h4>
            <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 block pt-1">
              Kehadiran Anda {isLoading ? "..." : (stats ? ((stats.totalKehadiran / 80) * 100).toFixed(1) : 96.2)}% (Sangat Baik)
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/20 shadow-sm">
            <Clock className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Metric 2: Sisa Waktu */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block">
              Sisa Waktu Magang
            </span>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
              ) : (
                `${stats?.sisaWaktuMagangDays ?? 64} Hari Lagi`
              )}
            </h4>
            <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400 block pt-1">
              {isLoading ? "Menghitung sisa waktu..." : (stats?.sisaWaktuMagangFormatted ?? "Hingga tanggal 31 Juli 2026")}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/20 shadow-sm">
            <Calendar className="w-5.5 h-5.5" />
          </div>
        </div>

      </div>      {/* WEEKLY LOGBOOK CHECKLIST */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-505 block">
              Logbook Kegiatan Mingguan
            </span>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              Pengisian Aktivitas Harian Minggu Ini
            </h4>
          </div>
          <Link 
            href="/dashboard/mahasiswa/logbook" 
            className="text-[10px] text-violet-600 dark:text-violet-400 font-bold hover:underline flex items-center gap-0.5"
          >
            Lihat Detail
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Checklist items representing Mon-Fri */}
        <div className="space-y-3">
          {[
            { day: "Senin", date: "25 Mei 2026", text: "Refactoring layout and sidebar dashboard mahasiswa", status: "Selesai" },
            { day: "Selasa", date: "26 Mei 2026", text: "Integrasi state manajemen absensi terverifikasi geofence", status: "Selesai" },
            { day: "Rabu", date: "27 Mei 2026", text: "Testing and bug fixing integration routing Next.js 15", status: "Selesai" },
            { day: "Kamis", date: "28 Mei 2026", text: "Menyusun dokumentasi skripsi & laporan magang bab 3", status: "Selesai" },
            { day: "Jumat", date: "29 Mei 2026", text: "Pengembangan modul rekap nilai mahasiswa dan feedback", status: "Sedang Berjalan" }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-900/40 dark:hover:bg-[#0a1538]/60 border border-slate-200/40 dark:border-slate-850 rounded-xl transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] uppercase ${
                  item.status === "Selesai" 
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" 
                    : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 animate-pulse"
                }`}>
                  {item.day.substring(0, 3)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">{item.text}</p>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">{item.date}</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                item.status === "Selesai"
                  ? "bg-emerald-950/20 text-emerald-400 border border-emerald-900/30"
                  : "bg-amber-950/20 text-amber-400 border border-amber-900/30"
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* RECENT SUBMISSIONS TABLE */}
      <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm overflow-hidden flex flex-col bg-white dark:bg-[#070e24]/40 space-y-4">
        <div>
          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Riwayat Kegiatan</h4>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest text-left">
                <th className="pb-3 pl-2 font-bold">Minggu Ke</th>
                <th className="pb-3 font-bold">Tanggal Kirim</th>
                <th className="pb-3 font-bold">Aktivitas Utama</th>
                <th className="pb-3 font-bold">Durasi Kerja</th>
                <th className="pb-3 pr-2 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {recentLogbooks.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors group cursor-pointer">
                  <td className="py-3.5 pl-2 font-extrabold text-slate-900 dark:text-white">{log.week}</td>
                  <td className="py-3.5 text-slate-500 dark:text-slate-400 font-medium">{log.date}</td>
                  <td className="py-3.5 font-bold text-slate-700 dark:text-slate-350 truncate max-w-[220px]">{log.topic}</td>
                  <td className="py-3.5 font-semibold text-slate-600 dark:text-slate-400">{log.hours} Jam Kerja</td>
                  <td className="py-3.5 pr-2 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900/30">
                      <CheckCircle className="w-3 h-3" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
