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
  Eye,
  XCircle,
  Activity,
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
  const [viewingActivityFile, setViewingActivityFile] = useState<{ activityName: string; fileUrls: string[] } | null>(null);

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

  const activities = student.dataKegiatan || [];
  const approvedCount = activities.filter(
    (l) => l.status?.toLowerCase() === "disetujui"
  ).length;
  const pendingCount = activities.filter(
    (l) => l.status?.toLowerCase() === "belum disetujui" || l.status?.toLowerCase() === "dalam review"
  ).length;
  const totalActivities = activities.length;

  const getStatusLabel = (status: string | undefined) => {
    if (!status) return "Draft";
    const s = status.toLowerCase();
    if (s === "disetujui") return "Disetujui";
    if (s === "ditolak") return "Ditolak";
    if (s === "belum disetujui" || s === "dalam review") return "Dalam Review";
    return status;
  };

  return (
    <div className="space-y-6">
      {/* FILE LIST MODAL */}
      {viewingActivityFile !== null && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setViewingActivityFile(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-[#121358] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#2F578A]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#F8FAFC] dark:bg-[#232F72] border border-[#2F578A]/30 text-[#232F72] dark:text-white rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white leading-tight">Berkas Lampiran</h4>
                  <p className="text-[10px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold mt-0.5">{viewingActivityFile.activityName}</p>
                </div>
              </div>
              <button onClick={() => setViewingActivityFile(null)} className="p-1.5 hover:bg-[#F8FAFC] dark:hover:bg-[#232F72] rounded-xl text-[#2F578A]/80 dark:text-[#F1F5F9]/50 cursor-pointer transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {viewingActivityFile.fileUrls.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-[#2F578A]/60 mx-auto" />
                <p className="text-xs font-bold text-[#232F72] dark:text-white">Tidak ada lampiran</p>
              </div>
            ) : (
              <div className="space-y-2">
                {viewingActivityFile.fileUrls.map((url, i) => {
                  const name = url.split("/").pop() || `berkas-${i + 1}`;
                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] dark:bg-[#232F72]/40 border border-[#2F578A]/20 dark:border-[#2F578A]/50 rounded-2xl hover:border-[#36ADA3] hover:bg-[#36ADA3]/5 transition-all group"
                    >
                      <div className="p-2 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl flex-shrink-0">
                        <Eye className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#232F72] dark:text-white truncate group-hover:text-[#36ADA3] transition-colors">{name}</span>
                    </a>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button onClick={() => setViewingActivityFile(null)} className="px-5 py-2 bg-[#232F72] hover:brightness-110 text-white font-extrabold rounded-xl text-xs shadow-md active:scale-95 transition-all cursor-pointer">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

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
                { label: "Hadir", count: (student?.attendance?.present || 0), bg: "from-[#36ADA3]/10 to-[#36ADA3]/5", border: "border-[#36ADA3]/30", text: "text-[#36ADA3]", dot: "bg-[#36ADA3]" },
                { label: "Sakit", count: (student?.attendance?.sick || 0), bg: "from-amber-500/10 to-amber-500/5", border: "border-amber-400/30", text: "text-amber-500", dot: "bg-amber-500" },
                { label: "Izin", count: (student?.attendance?.leave || 0), bg: "from-[#2F578A]/10 to-[#2F578A]/5", border: "border-[#2F578A]/30", text: "text-[#2F578A] dark:text-blue-300", dot: "bg-[#2F578A]" },
                { label: "Tidak Hadir", count: (student?.attendance?.absent || 0), bg: "from-rose-500/10 to-rose-500/5", border: "border-rose-400/30", text: "text-rose-500", dot: "bg-rose-500" },
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
                <Calendar className="w-4 h-4 text-[#36ADA3]" />
              </div>
              Periode Magang
            </h4>

            <div className="relative p-5 rounded-2xl border border-[#2F578A]/20 dark:border-[#2F578A]/40 bg-[#F8FAFC] dark:bg-[#232F72]/20 overflow-hidden hover:border-[#36ADA3]/40 transition-all">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#36ADA3]/5 rounded-full blur-2xl" />
              <h5 className="font-extrabold text-base text-[#232F72] dark:text-white leading-snug">{student.period}</h5>
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
                  Daftar Kegiatan Magang
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
              {activities?.map((log, idx) => {
                const uiStatus = getStatusLabel(log.status);
                const displayDate = new Date(log.waktu).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
                return (
                <div key={log.id || idx} className="relative group">
                  {/* dot */}
                  <span
                    className={`absolute -left-8 top-3 w-5 h-5 rounded-full border-2 border-white dark:border-[#121358] flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${
                      uiStatus === "Dalam Review"
                        ? "bg-amber-500 shadow-amber-400/40 animate-pulse"
                        : "bg-[#36ADA3] shadow-[#36ADA3]/40"
                    }`}
                  >
                    {uiStatus === "Disetujui" ? (
                      <Check className="w-2.5 h-2.5 text-white" />
                    ) : (
                      <Clock className="w-2.5 h-2.5 text-white" />
                    )}
                  </span>

                  {/* card */}
                  <div
                    className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                      uiStatus === "Dalam Review"
                        ? "border-amber-300/50 dark:border-amber-700/40 bg-amber-50/50 dark:bg-amber-950/10 hover:border-amber-400/60"
                        : "border-[#2F578A]/20 dark:border-[#2F578A]/30 bg-[#F8FAFC]/50 dark:bg-[#232F72]/10 hover:border-[#36ADA3]/30"
                    }`}
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                      <div>
                        <span className="text-[9px] font-bold text-[#2F578A] dark:text-[#F1F5F9]/50 uppercase tracking-widest block">
                          Kegiatan • {displayDate}
                        </span>
                        <h5 className="font-extrabold text-xs text-[#232F72] dark:text-white leading-snug mt-0.5">
                          {log.judul}
                        </h5>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                            uiStatus === "Disetujui"
                              ? "bg-[#36ADA3]/10 text-[#36ADA3] border-[#36ADA3]/30"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-400/30"
                          }`}
                        >
                          {uiStatus === "Disetujui" ? <BadgeCheck className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                          {uiStatus}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] leading-relaxed text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold whitespace-pre-wrap">
                      {log.deskripsi}
                    </p>

                    {log.fileUrls && log.fileUrls.length > 0 && (
                      <div className="mt-3">
                        <button
                          onClick={() => setViewingActivityFile({ activityName: log.judul, fileUrls: log.fileUrls! })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#232F72] dark:bg-[#232F72]/40 hover:text-white dark:hover:bg-[#121358] text-[#232F72] dark:text-white border border-[#2F578A]/30 rounded-xl font-bold transition-all text-[10px] hover:scale-[1.02] active:scale-95 shadow-sm cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{log.fileUrls.length} berkas</span>
                        </button>
                      </div>
                    )}

                    {uiStatus === "Dalam Review" && (
                      <div className="pt-3 mt-2 flex items-center justify-end gap-2 border-t border-amber-200/40 dark:border-amber-800/30">
                        <button
                          onClick={() => handleApproveLogbook(idx + 1)}
                          className="px-4 py-1.5 bg-gradient-to-r from-[#36ADA3] to-[#2F578A] hover:from-[#36ADA3]/90 hover:to-[#2F578A]/90 active:scale-95 text-white font-extrabold text-[10px] rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#36ADA3]/20"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Setujui Logbook
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );})}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
