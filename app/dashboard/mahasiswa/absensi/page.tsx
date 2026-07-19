"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import ttdImage from "./assets/ttd-pak-agus.png";
import {
  FileText, UploadCloud, FileCheck,
  X, File as FileIcon, CheckCircle2, TrendingUp,
  CalendarDays, UserX, Stethoscope, Download, Loader2,
  FileBarChart2,
} from "lucide-react";
import { useSubmitAbsensi, useRiwayatAbsensi } from "@/modules/data_absensi/hooks";
import { useFileUpload } from "@/modules/media/hooks";
import { useMyStudentProfile } from "@/modules/data_mahasiswa/hooks";
import { SuccessToast } from "@/components/shared";
import { AttendanceLog } from "@/modules/data_absensi/types";
import { useDownloadRekapPDF } from "./useDownloadRekapPDF";



// ═══════════════════════════════════════════════════════════════════════
// HELPERS (absensi harian)
// ═══════════════════════════════════════════════════════════════════════

type IzinSakitStatus = "izin" | "sakit";

function localDateISO(d: Date = new Date()) {
  // Gunakan tanggal lokal browser (WIB / GMT+7) — bukan UTC
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayISO() { return localDateISO(); }

function formatDateShort(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

function generateDateRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const cur = new Date(from + "T00:00:00");
  const end = new Date(to   + "T00:00:00");
  while (cur <= end) { dates.push(localDateISO(cur)); cur.setDate(cur.getDate() + 1); }
  return dates;
}

// ═══════════════════════════════════════════════════════════════════════
// HELPERS (rekap)
// ═══════════════════════════════════════════════════════════════════════

function formatTanggalPanjang(iso?: string | null) {
  if (!iso) return "-";
  return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatPeriode(dari?: string | null, sampai?: string | null) {
  if (!dari || !sampai) return "-";
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  return `${new Date(dari   + "T00:00:00").toLocaleDateString("id-ID", opts)} – ${new Date(sampai + "T00:00:00").toLocaleDateString("id-ID", opts)}`;
}

function tanggalHariIni() {
  const now = new Date();
  return {
    hari:  now.toLocaleDateString("id-ID", { day: "numeric" }),
    bulan: now.toLocaleDateString("id-ID", { month: "long" }),
    tahun: now.getFullYear().toString(),
  };
}

const LABEL_STATUS: Record<AttendanceLog["type"], string> = {
  Hadir: "Hadir", Izin: "Izin", Sakit: "Sakit", Alpha: "Tidak Hadir",
};

function warnaTeks(s: AttendanceLog["type"]) {
  if (s === "Hadir") return "text-emerald-700 dark:text-emerald-300";
  if (s === "Izin")  return "text-blue-700 dark:text-blue-300";
  if (s === "Sakit") return "text-sky-700 dark:text-sky-300";
  return "text-rose-700 dark:text-rose-300";
}

function warnaDot(s: AttendanceLog["type"]) {
  if (s === "Hadir") return "bg-emerald-400";
  if (s === "Izin")  return "bg-blue-400";
  if (s === "Sakit") return "bg-sky-400";
  return "bg-rose-400";
}

function warnaBaris(s: AttendanceLog["type"], isEven: boolean) {
  if (s === "Alpha") return "bg-rose-50/60 dark:bg-rose-950/10";
  return isEven ? "bg-white dark:bg-[#0f1535]" : "bg-[#F8FAFC] dark:bg-[#121358]/40";
}

// ═══════════════════════════════════════════════════════════════════════
// STATUS BADGE (absensi harian)
// ═══════════════════════════════════════════════════════════════════════

function StatusBadge({ type }: { type: AttendanceLog["type"] }) {
  const cfg: Record<AttendanceLog["type"], { cls: string; label: string }> = {
    Hadir: { cls: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40", label: "Hadir" },
    Izin:  { cls: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/40", label: "Izin" },
    Sakit: { cls: "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200/50 dark:border-sky-900/40", label: "Sakit" },
    Alpha: { cls: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/40", label: "Tidak Hadir" },
  };
  const { cls, label } = cfg[type] ?? cfg.Alpha;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border-2 ${cls}`}>
      {label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// KOMPONEN UTAMA
// ═══════════════════════════════════════════════════════════════════════

export default function StudentAttendancePage() {
  // ── state absensi harian ───────────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState<"laporan" | "rekap">("laporan");
  const [status,       setStatus]       = useState<IzinSakitStatus>("izin");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [attachmentKey,setAttachmentKey]= useState<string | null>(null);
  const [dragActive,   setDragActive]   = useState(false);
  const [showToast,    setShowToast]    = useState(false);

  const { submit, isSubmitting }                                   = useSubmitAbsensi();
  const { riwayat, isLoading: isLoadingRiwayat, refreshRiwayat }  = useRiwayatAbsensi();
  const { profile }                                                = useMyStudentProfile();
  const { upload, isUploading, error: uploadError }                = useFileUpload({
    maxSizeMB: 10,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  });

  const today = todayISO();

  const todayRecord = useMemo(
    // Alpha = record sintetis dari SQL COALESCE (belum ada submit nyata)
    // Hanya Hadir/Izin/Sakit yang berarti mahasiswa sudah mengisi absensi
    () => riwayat.find(r => r.tanggalISO === today && r.type !== "Alpha"),
    [riwayat, today],
  );
  const sudahAbsen = !!todayRecord;

  const fullHistory = useMemo(() => {
    const start = profile?.tanggalMulai;
    if (!start) return [...riwayat].reverse();
    const allDates = generateDateRange(start, today);
    const byDate   = new Map(riwayat.map(r => [r.tanggalISO!, r]));
    const result: AttendanceLog[] = allDates.map(date => {
      const rec = byDate.get(date);
      if (rec) return rec;
      // Jika hari ini belum ada record → jangan tandai Alpha,
      // biarkan form submit tetap terbuka (tampilkan sebagai placeholder kosong di riwayat saja)
      if (date === today) {
        return {
          id: `pending-${date}`, date: formatDateShort(date),
          tanggalISO: date, type: "Alpha" as const,
          checkIn: "-- : --", checkOut: "-- : --",
          document: null, status: "Diverifikasi" as const,
          _isPendingToday: true, // flag internal, tidak dirender sebagai Alpha di stats
        } as AttendanceLog & { _isPendingToday?: boolean };
      }
      return {
        id: `alpha-${date}`, date: formatDateShort(date),
        tanggalISO: date, type: "Alpha" as const,
        checkIn: "-- : --", checkOut: "-- : --",
        document: null, status: "Diverifikasi" as const,
      };
    });
    return result.reverse();
  }, [profile, riwayat, today]);

  const stats = useMemo(() => {
    const total      = fullHistory.length;
    // Hari ini yang belum ada record (pending) tidak dihitung sebagai Alpha
    const todayPending = (fullHistory as any[]).some(r => r._isPendingToday);
    const hadir      = fullHistory.filter(r => r.type === "Hadir").length;
    const izin       = fullHistory.filter(r => r.type === "Izin").length;
    const sakit      = fullHistory.filter(r => r.type === "Sakit").length;
    const tidakHadir = fullHistory.filter(r => r.type === "Alpha" && !(r as any)._isPendingToday).length;
    const effectiveTotal = todayPending ? total - 1 : total;
    const pct        = effectiveTotal > 0 ? Math.round((hadir / effectiveTotal) * 100) : 0;
    const pctHadirTermasukIzin = effectiveTotal > 0 ? Math.round(((hadir + izin + sakit) / effectiveTotal) * 100) : 0;
    return { total: effectiveTotal, hadir, izin, sakit, tidakHadir, pct, pctHadirTermasukIzin };
  }, [fullHistory]);

  // ── state rekap PDF ────────────────────────────────────────────────
  const [ttdBase64, setTtdBase64] = useState<string | null>(null);
  useEffect(() => {
    const src = typeof ttdImage === "string" ? ttdImage : (ttdImage as any).src;
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      setTtdBase64(canvas.toDataURL("image/png"));
    };
  }, []);

  const chronologicalHistory = useMemo(() => [...fullHistory].reverse(), [fullHistory]);

  const { download: downloadPDF, isGenerating } = useDownloadRekapPDF(
    profile, chronologicalHistory, ttdBase64,
  );

  const { hari, bulan, tahun } = tanggalHariIni();

  // ── handlers file ──────────────────────────────────────────────────
  const handleFile = async (file: File) => {
    setUploadedFile(file); setAttachmentKey(null);
    try {
      const result = await upload(file);
      setAttachmentKey(result.key);
    } catch (err: any) {
      setUploadedFile(null);
      alert(err.message || "Gagal mengunggah berkas.");
    }
  };

  const handleExportCSV = () => {
    if (!profile) return;
    const csvRows = ["No;Tanggal;Status;Waktu Mulai;Waktu Selesai"];
    chronologicalHistory.forEach((log, index) => {
      csvRows.push(`${index + 1};${log.date};${log.type};${log.checkIn};${log.checkOut}`);
    });
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `rekap_absensi_${profile.name.replace(/\s+/g, '_')}_${today}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const removeFile = () => { setUploadedFile(null); setAttachmentKey(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachmentKey) { alert("Silakan unggah dokumen pendukung terlebih dahulu."); return; }
    try {
      await submit({ status, attachmentUrl: attachmentKey });
      refreshRiwayat();
      setShowToast(true);
      setUploadedFile(null); setAttachmentKey(null);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal mengirimkan laporan presensi.");
    }
  };

  // ══════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-6 relative pb-10">

      <SuccessToast
        variant="mahasiswa"
        show={showToast}
        message="Laporan presensi Anda hari ini telah tersimpan."
        title="Presensi Berhasil Dikirim"
        icon={<FileCheck className="w-5 h-5 text-white" />}
      />

      {/* ── TABS & TOMBOL DOWNLOAD ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-[#F8FAFC] dark:bg-[#121358]/60 p-1 rounded-2xl border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 w-max">
          <button
            onClick={() => setActiveTab("laporan")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "laporan"
                ? "bg-white dark:bg-[#232F72] text-[#232F72] dark:text-white shadow-sm"
                : "text-[#2F578A]/70 dark:text-[#F1F5F9]/60 hover:text-[#232F72] dark:hover:text-white"
            }`}
          >
            Laporan & Riwayat
          </button>
          <button
            onClick={() => setActiveTab("rekap")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "rekap"
                ? "bg-white dark:bg-[#232F72] text-[#232F72] dark:text-white shadow-sm"
                : "text-[#2F578A]/70 dark:text-[#F1F5F9]/60 hover:text-[#232F72] dark:hover:text-white"
            }`}
          >
            Preview Rekap
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-extrabold
                       bg-[#232F72] dark:bg-[#36ADA3] text-white
                       hover:bg-[#1a2256] dark:hover:bg-[#2eb1a6]
                       disabled:opacity-60 disabled:cursor-not-allowed
                       shadow-[0_0_14px_rgba(35,47,114,0.25)] dark:shadow-[0_0_14px_rgba(54,173,163,0.3)]
                       transition-all active:scale-95 cursor-pointer"
          >
            {isGenerating
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Membuat PDF...</>
              : <><Download className="w-4 h-4" /> Download Rekap Absensi</>
            }
          </button>
        </div>
      </div>

      {activeTab === "laporan" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* ── STATS ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Hadir",       value: stats.hadir,      icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40" },
              { label: "Izin",        value: stats.izin,       icon: FileText,     color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-900/40" },
              { label: "Sakit",       value: stats.sakit,      icon: Stethoscope,  color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border-sky-200/50 dark:border-sky-900/40" },
              { label: "Tidak Hadir", value: stats.tidakHadir, icon: UserX,        color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200/50 dark:border-rose-900/40" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className={`p-5 rounded-3xl border-2 ${color} flex items-center gap-4 shadow-sm`}>
                <div className={`p-3 rounded-2xl border-2 ${color}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-80">{label}</span>
                  <p className="text-xl font-black leading-none mt-1">{value} <span className="text-xs font-bold opacity-70">hari</span></p>
                </div>
              </div>
            ))}
          </div>

      {/* ── PERSENTASE KEHADIRAN ── */}
      <div className="border-2 border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 bg-white dark:bg-[#121358]/40 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#36ADA3]" />
            <span className="font-extrabold text-sm text-[#232F72] dark:text-white">Persentase Kehadiran</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-[#232F72] dark:text-white">{stats.pct}%</span>
            <span className="text-[10px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold block">dari {stats.total} hari</span>
          </div>
        </div>
        <div className="w-full h-3 bg-[#F1F5F9] dark:bg-[#232F72] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#232F72] to-[#36ADA3] rounded-full transition-all duration-700"
            style={{ width: `${stats.pct}%` }}
          />
        </div>
        <div className="flex items-center gap-4 text-[10px] font-semibold text-[#2F578A]/80 dark:text-[#F1F5F9]/50">
          <span>Termasuk izin & sakit: <strong className="text-[#232F72] dark:text-white">{stats.pctHadirTermasukIzin}%</strong></span>
          {profile?.tanggalMulai && (
            <span>Magang sejak: <strong className="text-[#232F72] dark:text-white">{formatDateShort(profile.tanggalMulai)}</strong></span>
          )}
        </div>
      </div>

      {/* ── TWO PANEL: FORM + RIWAYAT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT: FORM IZIN / SAKIT */}
        <div className="lg:col-span-7">
          <div className="border-2 border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#121358] space-y-6">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#2F578A]/20 dark:border-[#2F578A]/40">
              <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#36ADA3]" />
                Laporan Izin / Sakit
              </h4>
              <span className="text-[10px] font-extrabold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 uppercase tracking-wide">
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>

            {sudahAbsen ? (
              <div className="py-8 flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200/50 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-black text-sm text-[#232F72] dark:text-white">Absensi Hari Ini Sudah Tercatat</p>
                  <p className="text-xs text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold mt-1">
                    Status: <StatusBadge type={todayRecord!.type} />
                  </p>
                </div>
                <p className="text-[11px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 max-w-xs">
                  Laporan presensi Anda untuk hari ini sudah tersimpan. Kembali besok untuk melaporkan izin atau sakit.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs font-bold text-[#232F72] dark:text-[#F1F5F9]">
                {/* Pilih status */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-[#2F578A] dark:text-[#F1F5F9]/50 tracking-wider">
                    Jenis Laporan <span className="text-[#36ADA3]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { val: "izin",  label: "Izin",  icon: FileText,    desc: "Keperluan resmi / kegiatan kampus" },
                      { val: "sakit", label: "Sakit", icon: Stethoscope, desc: "Dengan surat keterangan dokter" },
                    ] as const).map(({ val, label, icon: Icon, desc }) => (
                      <button
                        key={val} type="button" onClick={() => setStatus(val)}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer text-center ${
                          status === val
                            ? "bg-[#36ADA3]/10 border-[#36ADA3] text-[#36ADA3] shadow-[0_0_15px_rgba(54,173,163,0.2)] scale-[1.02]"
                            : "bg-[#F8FAFC]/50 border-[#2F578A]/30 dark:bg-[#232F72]/30 dark:border-[#2F578A] text-[#2F578A] dark:text-[#F1F5F9]/70 hover:bg-[#F8FAFC] dark:hover:bg-[#232F72]"
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${status === val ? "text-[#36ADA3]" : "text-[#2F578A] dark:text-[#F1F5F9]/50"}`} />
                        <span className="text-xs font-black uppercase tracking-wider">{label}</span>
                        <span className="text-[9px] font-semibold opacity-70">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload dokumen */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-[#2F578A] dark:text-[#F1F5F9]/50 tracking-wider flex items-center gap-1">
                      Dokumen Pendukung ({status === "izin" ? "Surat Tugas/Izin" : "Surat Sakit Dokter"}) <span className="text-[#36ADA3]">*</span>
                    </label>
                    <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/40">PDF, JPG, PNG — maks 10MB</span>
                  </div>

                  {!uploadedFile ? (
                    <div
                      onDragEnter={handleDrag} onDragOver={handleDrag}
                      onDragLeave={handleDrag} onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all ${
                        dragActive
                          ? "border-[#36ADA3] bg-[#36ADA3]/5"
                          : "border-[#2F578A]/50 dark:border-[#2F578A] bg-[#F8FAFC]/40 dark:bg-[#232F72]/20 hover:border-[#36ADA3]"
                      }`}
                    >
                      <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="p-3 bg-[#36ADA3]/10 text-[#36ADA3] rounded-2xl border-2 border-[#36ADA3]/20 shadow-sm mb-3">
                        <UploadCloud className="w-6 h-6 animate-pulse" />
                      </div>
                      <p className="text-xs text-[#232F72] dark:text-[#F1F5F9] font-extrabold">
                        Tarik & Lepas, atau <span className="text-[#36ADA3] hover:underline">Pilih Berkas</span>
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-[#F8FAFC] dark:bg-[#232F72]/40 border-2 border-[#2F578A]/30 dark:border-[#2F578A] rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl border-2 border-[#36ADA3]/20">
                          <FileIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-[#232F72] dark:text-white truncate">{uploadedFile.name}</p>
                          <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/50 block mt-0.5">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB · {isUploading ? "Mengunggah..." : attachmentKey ? "Berhasil Diunggah ✓" : "Berkas Terpilih"}
                          </span>
                        </div>
                      </div>
                      <button type="button" onClick={removeFile} className="p-1.5 bg-[#2F578A]/10 hover:bg-rose-500 text-[#2F578A] dark:text-[#F1F5F9]/70 hover:text-white rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {uploadError && <p className="text-[10px] text-rose-500 font-bold">{uploadError}</p>}
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-[#2F578A]/20 dark:border-[#2F578A]/40 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading || !attachmentKey}
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#36ADA3] hover:bg-[#2eb1a6] disabled:bg-[#36ADA3]/50 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-[0_0_15px_rgba(54,173,163,0.3)] hover:shadow-[0_0_20px_rgba(54,173,163,0.5)] disabled:shadow-none transition-all text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    {isSubmitting
                      ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> Mengirim...</>
                      : !attachmentKey
                        ? <><UploadCloud className="w-4 h-4" /> Unggah Dokumen Dahulu</>
                        : <><FileCheck className="w-4 h-4" /> Kirim Laporan {status === "izin" ? "Izin" : "Sakit"}</>
                    }
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT: RIWAYAT */}
        <div className="lg:col-span-5 border-2 border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#121358] space-y-4">
          <div>
            <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white">Riwayat Absensi</h4>
            <p className="text-[11px] text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold mt-0.5">
              Sejak awal magang hingga hari ini · {stats.total} hari total
            </p>
          </div>
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
            {isLoadingRiwayat ? (
              <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/50 font-semibold text-center py-8">Memuat riwayat...</p>
            ) : fullHistory.length === 0 ? (
              <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/50 font-semibold text-center py-8">Belum ada riwayat absensi.</p>
            ) : fullHistory.map((item, idx) => (
              <div
                key={String(item.id) + idx}
                className="px-3.5 py-3 rounded-2xl border-2 flex items-center justify-between gap-3 bg-[#F8FAFC] dark:bg-[#232F72]/30 border-[#2F578A]/20 dark:border-[#2F578A]/40"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[9px] font-black flex-shrink-0 ${
                    item.type === "Hadir"  ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                    : item.type === "Izin"  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                    : item.type === "Sakit" ? "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400"
                    : "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400"
                  }`}>
                    {item.tanggalISO ? new Date(item.tanggalISO + "T00:00:00").getDate() : "–"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold text-[#232F72] dark:text-white leading-tight truncate">{item.date}</p>
                  </div>
                </div>
                <StatusBadge type={item.type} />
              </div>
            ))}
          </div>
        </div>

      </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          REKAP ABSENSI
      ══════════════════════════════════════════════════════════════ */}

      {activeTab === "rekap" && (
        <div className="bg-white dark:bg-[#0f1535] border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">

          <div className="p-8 md:p-12 space-y-8 text-[#1a1a2e] dark:text-[#e8eaf6]">

            {/* KOP */}
            <div className="text-center space-y-1 border-b-4 border-double border-[#232F72]/30 dark:border-[#36ADA3]/30 pb-6">
              <h2 className="font-black text-base md:text-lg uppercase tracking-widest text-[#232F72] dark:text-white">
                Rekapitulasi Absensi Magang
              </h2>
              <h3 className="font-bold text-sm uppercase tracking-widest text-[#232F72] dark:text-white opacity-80">
                Direktorat Wilayah 1
              </h3>
            </div>

            {/* INFO MAHASISWA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 text-[12px]">
              {([
                { label: "Nama",           nilai: profile?.name || "Budi Santoso" },
                { label: "NIM",            nilai: profile?.nim || "2021001234" },
                { label: "Universitas",    nilai: profile?.university || "Universitas Negeri Jakarta" },
                { label: "Periode Magang", nilai: formatPeriode(profile?.tanggalMulai, profile?.tanggalBerakhir) },
              ] as const).map(({ label, nilai }) => (
                <div key={label} className="flex gap-2">
                  <span className="font-bold text-[#2F578A] dark:text-[#36ADA3] w-36 flex-shrink-0">{label}</span>
                  <span className="font-semibold text-[#232F72] dark:text-white">:&nbsp;{nilai}</span>
                </div>
              ))}
            </div>

            {/* DIVIDER */}
            <div className="border-t border-dashed border-[#2F578A]/25 dark:border-[#2F578A]/40" />

            {/* TABEL */}
            <div className="overflow-x-auto rounded-2xl border-2 border-[#2F578A]/20 dark:border-[#2F578A]/30">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="bg-[#232F72] dark:bg-[#0d1a4a] text-white">
                    <th className="py-3 px-4 text-center font-extrabold uppercase tracking-wider border-r border-white/10 w-12">No.</th>
                    <th className="py-3 px-5 text-left font-extrabold uppercase tracking-wider border-r border-white/10">Tanggal</th>
                    <th className="py-3 px-5 text-center font-extrabold uppercase tracking-wider">Status Kehadiran</th>
                  </tr>
                </thead>
                <tbody>
                  {chronologicalHistory.map((row, idx) => (
                    <tr
                      key={row.tanggalISO}
                      className={`border-b border-[#2F578A]/10 dark:border-[#2F578A]/20 transition-colors ${warnaBaris(row.type, idx % 2 === 0)}`}
                    >
                      <td className="py-3 px-4 text-center font-bold text-[#2F578A]/50 dark:text-[#F1F5F9]/25 border-r border-[#2F578A]/10 dark:border-[#2F578A]/20">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-5 font-semibold text-[#232F72] dark:text-[#e8eaf6] border-r border-[#2F578A]/10 dark:border-[#2F578A]/20">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-3 h-3 text-[#36ADA3] flex-shrink-0 opacity-60" />
                          {row.tanggalISO ? formatTanggalPanjang(row.tanggalISO) : "-"}
                        </div>
                      </td>
                      <td className="py-3 px-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 font-extrabold ${warnaTeks(row.type)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${warnaDot(row.type)}`} />
                          {LABEL_STATUS[row.type as keyof typeof LABEL_STATUS] || row.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* RINGKASAN */}
            <div className="flex justify-end">
              <div className="min-w-[220px] border-t border-[#2F578A]/20 dark:border-[#2F578A]/30 pt-4 space-y-2 text-[11px]">
                {([
                  { label: "Total Hadir",        nilai: stats.hadir,      warna: "text-emerald-700 dark:text-emerald-300" },
                  { label: "Total Izin",         nilai: stats.izin,       warna: "text-blue-700 dark:text-blue-300" },
                  { label: "Total Sakit",        nilai: stats.sakit,      warna: "text-sky-700 dark:text-sky-300" },
                  { label: "Total Tidak Hadir",  nilai: stats.tidakHadir, warna: "text-rose-700 dark:text-rose-300" },
                ] as const).map(({ label, nilai, warna }) => (
                  <div key={label} className="flex items-center justify-between gap-10">
                    <span className="font-semibold text-[#2F578A]/80 dark:text-[#F1F5F9]/60">{label}</span>
                    <span className={`font-extrabold tabular-nums ${warna}`}>
                      {nilai}&nbsp;<span className="font-semibold text-[9px] opacity-70">hari</span>
                    </span>
                  </div>
                ))}
                <div className="border-t border-[#2F578A]/20 dark:border-[#2F578A]/30 pt-2 flex items-center justify-between gap-10">
                  <span className="font-extrabold text-[#232F72] dark:text-white">Total Hari</span>
                  <span className="font-black tabular-nums text-[#232F72] dark:text-white">
                    {stats.total}&nbsp;<span className="font-semibold text-[9px] opacity-70">hari</span>
                  </span>
                </div>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-dashed border-[#2F578A]/25 dark:border-[#2F578A]/40" />

            {/* TANDA TANGAN */}
            <div className="flex flex-col items-end gap-1 text-[11px]">
              <p className="font-semibold text-[#2F578A]/80 dark:text-[#F1F5F9]/60">
                Jakarta, {hari} {bulan} {tahun}
              </p>
              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="w-40 h-24 relative">
                  <Image
                    src={ttdImage}
                    alt="Tanda Tangan Direktur Wilayah 1"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="text-center">
                  <p className="font-extrabold text-[13px] text-[#232F72] dark:text-white underline underline-offset-4">
                    Agus Joko Saptono
                  </p>
                  <p className="font-semibold text-[10px] text-[#2F578A]/70 dark:text-[#F1F5F9]/50 mt-0.5">
                    (Direktur Wilayah 1)
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

