"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  School,
  User,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  Check,
  Loader2,
  Star,
  TrendingUp,
  FileText,
  Building2,
  GraduationCap,
  BadgeCheck,
  Zap,
} from "lucide-react";
import { useStudentDetail } from "@/modules/data_mahasiswa/hooks";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MentorStudentDetailPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const studentId = /^\d+$/.test(unwrappedParams.id)
    ? parseInt(unwrappedParams.id, 10)
    : unwrappedParams.id;

  const { student: apiStudent, isLoading } = useStudentDetail(studentId);
  const student = apiStudent;

  const [successMessage, setSuccessMessage] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#121358] to-[#36ADA3] animate-pulse" />
          <Loader2 className="w-8 h-8 animate-spin text-white absolute inset-0 m-auto" />
        </div>
        <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/60 font-bold tracking-wider uppercase">
          Memuat profil mahasiswa...
        </p>
      </div>
    );
  }

  const handleApproveLogbook = (week: number) => {
    setSuccessMessage(`Logbook Minggu ${week} berhasil disetujui!`);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  if (!student) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 border border-rose-200 dark:border-rose-900/40 flex items-center justify-center mx-auto shadow-lg">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div>
          <h4 className="font-black text-lg text-[#232F72] dark:text-white">
            Mahasiswa Tidak Ditemukan
          </h4>
          <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/60 leading-relaxed font-semibold mt-2">
            Data mahasiswa dengan ID #{unwrappedParams.id} tidak terdaftar di
            basis data bimbingan magang Anda.
          </p>
        </div>
        <Link
          href="/dashboard/mentor/data-mahasiswa"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121358] hover:bg-[#232F72] text-white text-xs font-bold rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

  const dummyLogbooks = [
    {
      week: 8,
      date: "25 Mei 2026",
      task: "Integrasi API Pembayaran & Pengujian Backend",
      desc: "Melakukan integrasi API pembayaran menggunakan gateway Midtrans. Membuat unit testing untuk skenario pembayaran sukses, tertunda, dan gagal. Menambahkan webhook listener untuk sinkronisasi status transaksi secara real-time.",
      status: "Dalam Review",
      category: "Technical Dev",
    },
    {
      week: 7,
      date: "18 Mei 2026",
      task: "Implementasi Dashboard Admin & Visualisasi Chart",
      desc: "Membangun tampilan dashboard admin dengan analitik statistik transaksi mingguan dan bulanan. Menggunakan Chart.js untuk visualisasi data interaktif. Menyempurnakan layout agar responsif di mobile.",
      status: "Disetujui",
      category: "Frontend UI/UX",
    },
    {
      week: 6,
      date: "11 Mei 2026",
      task: "Setup Database & Model Relasional Transaksi",
      desc: "Mendesain skema database relasional untuk menampung transaksi, detail pesanan, dan log aktivitas user. Membuat migrasi tabel, seeder data testing, serta mengoptimalkan query relational join.",
      status: "Disetujui",
      category: "Database Design",
    },
    {
      week: 5,
      date: "04 Mei 2026",
      task: "Autentikasi Pengguna & Manajemen Role (RBAC)",
      desc: "Mengembangkan modul registrasi, login, dan logout lengkap dengan proteksi JWT. Menerapkan Middleware Role-Based Access Control (RBAC) untuk memisahkan hak akses antara Admin, Merchant, dan Pelanggan umum.",
      status: "Disetujui",
      category: "Security & Auth",
    },
    {
      week: 4,
      date: "27 Apr 2026",
      task: "Slicing Figma UI & Komponen Dasar React",
      desc: "Melakukan konversi rancangan UI/UX Figma menjadi komponen-komponen Next.js yang reusable. Menyusun state global menggunakan Context API serta menambahkan feedback form interaktif.",
      status: "Disetujui",
      category: "Slicing UI",
    },
    {
      week: 3,
      date: "20 Apr 2026",
      task: "Uji Kelayakan Kebutuhan Pengguna & Riset Kompetitor",
      desc: "Melakukan survei singkat kepada 15 calon pengguna potensial untuk memvalidasi fitur-fitur utama. Menganalisis kelebihan serta kekurangan platform kompetitor sejenis untuk diferensiasi produk.",
      status: "Disetujui",
      category: "Business Analyst",
    },
  ];

  const approvedCount = dummyLogbooks.filter(
    (l) => l.status === "Disetujui"
  ).length;
  const pendingCount = dummyLogbooks.filter(
    (l) => l.status === "Dalam Review"
  ).length;

  return (
    <div className="space-y-6">
      {/* SUCCESS TOAST */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#36ADA3] text-white rounded-2xl shadow-2xl shadow-[#36ADA3]/30 flex items-center gap-3 animate-float max-w-sm border border-white/20">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-bold leading-normal">{successMessage}</span>
        </div>
      )}

      {/* BACK NAVIGATION */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/mentor/data-mahasiswa"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#2F578A]/30 dark:border-[#2F578A] bg-white dark:bg-[#121358]/30 text-[#232F72] dark:text-[#F1F5F9] text-xs font-bold hover:border-[#36ADA3] hover:text-[#36ADA3] transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar
        </Link>
        <span className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/50 font-bold tracking-widest uppercase bg-[#F1F5F9] dark:bg-[#121358]/50 px-3 py-1.5 rounded-lg border border-[#2F578A]/20 dark:border-[#2F578A]/40">
          ID: {student.id}
        </span>
      </div>

      {/* ── HERO PROFILE BANNER ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#121358] via-[#1a1f6e] to-[#232F72] shadow-2xl shadow-[#121358]/40">
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#36ADA3]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#2F578A]/30 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-4 right-8 opacity-10">
          <Star className="w-32 h-32 text-white" />
        </div>

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-tr ${student.avatarColor} text-white font-black flex items-center justify-center text-4xl shadow-xl shadow-black/30 ring-4 ring-white/10`}
            >
              {(student.name || "Mahasiswa")
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .substring(0, 2)}
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-1 bg-[#36ADA3] text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg border-2 border-[#121358]">
              {student.status}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
                {student.name}
              </h2>
              <p className="text-[#36ADA3] font-bold text-sm tracking-widest uppercase mt-1">
                NIM • {student.nim}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border ${
                  student.gender === "Laki-laki"
                    ? "bg-blue-500/20 text-blue-200 border-blue-400/30"
                    : "bg-pink-500/20 text-pink-200 border-pink-400/30"
                }`}
              >
                <User className="w-3 h-3" />
                {student.gender}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-white/10 text-white/80 border border-white/20">
                <GraduationCap className="w-3 h-3" />
                {student.program}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-white/10 text-white/80 border border-white/20">
                <Building2 className="w-3 h-3" />
                {student.company}
              </span>
            </div>

            {/* Quick stats inside hero */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { label: "Progress", value: `${student.progress}%`, icon: TrendingUp, color: "text-[#36ADA3]" },
                { label: "Logbook OK", value: `${approvedCount}/${dummyLogbooks.length}`, icon: BadgeCheck, color: "text-emerald-400" },
                { label: "Perlu Review", value: `${pendingCount}`, icon: Zap, color: "text-amber-400" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <stat.icon className={`w-4 h-4 ${stat.color} mb-1`} />
                  <p className="text-white font-black text-lg leading-none">{stat.value}</p>
                  <p className="text-white/50 text-[9px] font-bold uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-4 space-y-5">

          {/* CONTACT INFO CARD */}
          <div className="rounded-3xl border border-[#2F578A]/30 dark:border-[#2F578A]/60 bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md shadow-sm p-6 space-y-4">
            <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#121358] flex items-center justify-center">
                <User className="w-4 h-4 text-[#36ADA3]" />
              </div>
              Informasi Kontak
            </h4>

            <div className="space-y-3">
              {[
                { icon: School, label: "Universitas", value: student.university || "-" },
                { icon: Mail, label: "Email", value: student.email || "-", href: student.email ? `mailto:${student.email}` : undefined },
                { icon: Phone, label: "No. Telp", value: student.phone || "-", href: student.phone ? `tel:${(student.phone || "").replace(/[^0-9+]/g, "")}` : undefined },
                { icon: MapPin, label: "Alamat", value: student.address || "-" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/10 dark:border-[#2F578A]/30 hover:border-[#36ADA3]/40 transition-colors group">
                  <div className="w-8 h-8 rounded-xl bg-[#121358]/10 dark:bg-[#36ADA3]/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-[#36ADA3]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-[#2F578A] dark:text-[#F1F5F9]/50 uppercase tracking-wider">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-xs font-bold text-[#232F72] dark:text-white hover:text-[#36ADA3] dark:hover:text-[#36ADA3] transition-colors truncate block">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-xs font-bold text-[#232F72] dark:text-white leading-snug">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SCORE & PROGRESS CARD */}
          <div className="rounded-3xl border border-[#2F578A]/30 dark:border-[#2F578A]/60 bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md shadow-sm p-6 space-y-4">
            <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#121358] flex items-center justify-center">
                <Award className="w-4 h-4 text-[#36ADA3]" />
              </div>
              Progres & Penilaian
            </h4>

            {/* Score display */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#121358] to-[#232F72] overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-[#36ADA3]/20 rounded-full blur-2xl" />
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Nilai Bimbingan</p>
              <p className="text-4xl font-black text-white mt-1">
                {student.grade !== null ? student.grade : "—"}
                <span className="text-lg text-white/40 font-bold">/100</span>
              </p>
              <p className="text-[10px] text-[#36ADA3] font-bold mt-1 uppercase tracking-wider">
                {student.grade !== null
                  ? student.grade >= 85 ? "★ Sangat Baik" : student.grade >= 70 ? "Baik" : "Cukup"
                  : "Belum Diisi"}
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#232F72] dark:text-white">
                <span>Pengerjaan Proyek</span>
                <span className="text-[#36ADA3]">{student.progress}%</span>
              </div>
              <div className="w-full bg-[#F1F5F9] dark:bg-[#232F72] h-3 rounded-full overflow-hidden border border-[#2F578A]/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#121358] to-[#36ADA3] transition-all duration-700"
                  style={{ width: `${student.progress}%` }}
                />
              </div>
              <p className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/50 font-semibold text-right">
                {student.logbooksCount - student.logbooksPending}/{student.logbooksCount} logbook dikumpulkan
              </p>
            </div>
          </div>

          {/* ATTENDANCE CARD */}
          <div className="rounded-3xl border border-[#2F578A]/30 dark:border-[#2F578A]/60 bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md shadow-sm p-6 space-y-4">
            <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#121358] flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#36ADA3]" />
              </div>
              Rekapitulasi Kehadiran
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Hadir", count: student.attendance.present, bg: "from-[#36ADA3]/10 to-[#36ADA3]/5", border: "border-[#36ADA3]/30", text: "text-[#36ADA3]", dot: "bg-[#36ADA3]" },
                { label: "Sakit", count: student.attendance.sick, bg: "from-amber-500/10 to-amber-500/5", border: "border-amber-400/30", text: "text-amber-500", dot: "bg-amber-500" },
                { label: "Izin", count: student.attendance.leave, bg: "from-[#2F578A]/10 to-[#2F578A]/5", border: "border-[#2F578A]/30", text: "text-[#2F578A] dark:text-blue-300", dot: "bg-[#2F578A]" },
                { label: "Alfa", count: student.attendance.absent, bg: "from-rose-500/10 to-rose-500/5", border: "border-rose-400/30", text: "text-rose-500", dot: "bg-rose-500" },
              ].map((att, i) => (
                <div key={i} className={`p-4 rounded-2xl bg-gradient-to-br ${att.bg} border ${att.border} flex flex-col gap-1`}>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${att.dot}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${att.text}`}>{att.label}</span>
                  </div>
                  <p className="text-2xl font-black text-[#232F72] dark:text-white">{att.count}</p>
                  <p className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/50 font-semibold">Hari</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/50 font-semibold leading-relaxed text-center px-2 pt-1 border-t border-[#2F578A]/10 dark:border-[#2F578A]/20">
              Presensi tercatat via Geolocation & Face Recognition harian.
            </p>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-8 space-y-5">

          {/* INTERNSHIP DETAIL CARD */}
          <div className="rounded-3xl border border-[#2F578A]/30 dark:border-[#2F578A]/60 bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md shadow-sm p-6 space-y-4">
            <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#121358] flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-[#36ADA3]" />
              </div>
              Detail Penempatan Magang Industri
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: Building2,
                  label: "Perusahaan Mitra",
                  main: student.company,
                  details: [`Posisi: ${student.role}`, `Program Studi: ${student.program}`],
                  accent: "from-[#121358] to-[#232F72]",
                },
                {
                  icon: Calendar,
                  label: "Periode Magang",
                  main: student.period,
                  details: ["Durasi: 6 Bulan Kontrak", "Supervisor: Bpk. Hermawan S.T."],
                  accent: "from-[#2F578A] to-[#121358]",
                },
              ].map((item, i) => (
                <div key={i} className="relative p-5 rounded-2xl border border-[#2F578A]/20 dark:border-[#2F578A]/40 bg-[#F8FAFC] dark:bg-[#232F72]/20 overflow-hidden group hover:border-[#36ADA3]/40 transition-all">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#36ADA3]/5 rounded-full blur-2xl" />
                  <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${item.accent} flex items-center justify-center mb-3 shadow-md`}>
                    <item.icon className="w-4 h-4 text-[#36ADA3]" />
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#2F578A] dark:text-[#F1F5F9]/50 mb-1">{item.label}</p>
                  <h5 className="font-extrabold text-sm text-[#232F72] dark:text-white leading-snug mb-2">{item.main}</h5>
                  <div className="space-y-1">
                    {item.details.map((d, j) => (
                      <p key={j} className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/60 font-semibold flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#36ADA3] flex-shrink-0" />
                        {d}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOGBOOK TIMELINE CARD */}
          <div className="rounded-3xl border border-[#2F578A]/30 dark:border-[#2F578A]/60 bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md shadow-sm p-6 space-y-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#121358] flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[#36ADA3]" />
                  </div>
                  Logbook Mingguan Mahasiswa
                </h4>
                <p className="text-[11px] text-[#2F578A] dark:text-[#F1F5F9]/50 font-semibold mt-1 ml-9">
                  Tinjau dan setujui deskripsi tugas mingguan mahasiswa bimbingan
                </p>
              </div>
              {pendingCount > 0 && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-bold border border-amber-200/50 dark:border-amber-800/40 rounded-xl text-[10px] animate-pulse">
                  <Zap className="w-3 h-3" />
                  {pendingCount} Perlu Tinjauan
                </span>
              )}
            </div>

            {/* Timeline */}
            <div className="relative pl-8 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#36ADA3] before:via-[#2F578A]/40 before:to-transparent">
              {dummyLogbooks.map((log, idx) => (
                <div key={log.week} className="relative group">
                  {/* dot */}
                  <span
                    className={`absolute -left-8 top-3 w-5 h-5 rounded-full border-2 border-white dark:border-[#121358] flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${
                      log.status === "Dalam Review"
                        ? "bg-amber-500 shadow-amber-400/40 animate-pulse"
                        : "bg-[#36ADA3] shadow-[#36ADA3]/40"
                    }`}
                  >
                    {log.status === "Disetujui" ? (
                      <Check className="w-2.5 h-2.5 text-white" />
                    ) : (
                      <Clock className="w-2.5 h-2.5 text-white" />
                    )}
                  </span>

                  {/* card */}
                  <div
                    className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                      log.status === "Dalam Review"
                        ? "border-amber-300/50 dark:border-amber-700/40 bg-amber-50/50 dark:bg-amber-950/10 hover:border-amber-400/60"
                        : "border-[#2F578A]/20 dark:border-[#2F578A]/30 bg-[#F8FAFC]/50 dark:bg-[#232F72]/10 hover:border-[#36ADA3]/30"
                    }`}
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                      <div>
                        <span className="text-[9px] font-bold text-[#2F578A] dark:text-[#F1F5F9]/50 uppercase tracking-widest block">
                          Minggu Ke-{log.week} • {log.date}
                        </span>
                        <h5 className="font-extrabold text-xs text-[#232F72] dark:text-white leading-snug mt-0.5">
                          {log.task}
                        </h5>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-lg bg-[#121358]/10 dark:bg-[#F1F5F9]/10 text-[#2F578A] dark:text-[#F1F5F9]/60 border border-[#2F578A]/15 dark:border-[#2F578A]/30">
                          {log.category}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                            log.status === "Disetujui"
                              ? "bg-[#36ADA3]/10 text-[#36ADA3] border-[#36ADA3]/30"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-400/30"
                          }`}
                        >
                          {log.status === "Disetujui" ? <BadgeCheck className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                          {log.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] leading-relaxed text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold">
                      {log.desc}
                    </p>

                    {log.status === "Dalam Review" && (
                      <div className="pt-3 mt-2 flex items-center justify-between gap-2 border-t border-amber-200/40 dark:border-amber-800/30">
                        <span className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/50 font-medium flex items-center gap-1">
                          <FileText className="w-3 h-3 text-[#36ADA3]" />
                          <span className="text-[#36ADA3] font-bold hover:underline cursor-pointer">
                            laporan_mingguan_w{log.week}.pdf
                          </span>
                        </span>
                        <button
                          onClick={() => handleApproveLogbook(log.week)}
                          className="px-4 py-1.5 bg-gradient-to-r from-[#36ADA3] to-[#2F578A] hover:from-[#36ADA3]/90 hover:to-[#2F578A]/90 active:scale-95 text-white font-extrabold text-[10px] rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#36ADA3]/20"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Setujui Logbook
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
