"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search, Clock, Calendar, CalendarCheck, CalendarDays,
  XCircle, AlertCircle, Download,
  UserCheck, Coffee, Check, RefreshCw, Eye, Trash2,
  ClipboardList, Loader2, ChevronLeft, ChevronRight,
} from "lucide-react";
import {
  useAttendance,
  useAbsensiHarianMentor,
  useSubmitAbsensiMentor,
  useRekapAbsensi,
  useAbsensiHarianMentorStatistik,
} from "@/modules/data_absensi/hooks";
import Image from "next/image";
import Link from "next/link";
import ttdImage from "../../mahasiswa/absensi/assets/ttd-pak-agus.png";
import { useDownloadRekapMentorPDF } from "./useDownloadRekapMentorPDF";
import { useStudents } from "@/modules/data_mahasiswa/hooks";
import { AbsensiHarianMentorResponse } from "@/modules/data_absensi/types";
import { mediaAPI } from "@/modules/media/api";
import { SuccessToast, PageHeader, StatsGrid, StatItem } from "@/components/shared";

type AbsensiStatus = "hadir" | "izin" | "sakit";

const STATUS_OPTIONS: { value: AbsensiStatus; label: string; color: string }[] = [
  { value: "hadir", label: "Hadir", color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300/60 dark:border-emerald-900/50" },
  { value: "izin",  label: "Izin",  color: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-300/60 dark:border-blue-900/50" },
  { value: "sakit", label: "Sakit", color: "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-300/60 dark:border-sky-900/50" },
];

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateID(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function StatusBadgeAbsensi({ status }: { status: string }) {
  const map: Record<string, string> = {
    hadir: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40",
    izin:  "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/40",
    sakit: "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200/50 dark:border-sky-900/40",
    alpha: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/40",
  };
  const dot: Record<string, string> = {
    hadir: "bg-emerald-500", izin: "bg-blue-500", sakit: "bg-sky-500", alpha: "bg-rose-500",
  };
  const label: Record<string, string> = {
    hadir: "Hadir", izin: "Izin", sakit: "Sakit", alpha: "Tidak Hadir",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${map[status] ?? map.alpha}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status] ?? dot.alpha}`} />
      {label[status] ?? status}
    </span>
  );
}

export default function MentorAttendancePage() {
  const [activeTab, setActiveTab] = useState<"catat" | "rekap" | "ekspor">("catat");
  const [toastMsg,  setToastMsg]  = useState("");

  function toast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  }

  // ── CATAT ABSENSI ────────────────────────────────────────────────────
  const [selectedDate,  setSelectedDate]  = useState(todayISO);
  const [rowStatus,     setRowStatus]     = useState<Record<string, AbsensiStatus>>({});
  const [submittingIds, setSubmittingIds] = useState<Set<string>>(new Set());

  const {
    data: harianData, page, totalPages, total,
    isLoading: loadingHarian, goToPage, refresh: refreshHarian,
  } = useAbsensiHarianMentor(selectedDate);

  const { submit: submitMentor } = useSubmitAbsensiMentor();
  
  // live stats from backend harian data
  const { stats: harianStats, refreshStats: refreshHarianStats } = useAbsensiHarianMentorStatistik(selectedDate);

  const handleDateChange = useCallback((dir: "prev" | "next") => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + (dir === "next" ? 1 : -1));
    setSelectedDate(d.toISOString().split("T")[0]);
  }, [selectedDate]);

  // Initialise default "hadir" for any alfa row not yet picked
  useEffect(() => {
    setRowStatus(prev => {
      const next = { ...prev };
      harianData.forEach(m => {
        if (m.absensiStatus === "alpha" && !next[m.mahasiswaId]) {
          next[m.mahasiswaId] = "hadir";
        }
      });
      return next;
    });
  }, [harianData]);

  const handleCatat = useCallback(async (m: AbsensiHarianMentorResponse) => {
    const status = rowStatus[m.mahasiswaId] ?? "hadir";
    setSubmittingIds(prev => new Set(prev).add(m.mahasiswaId));
    try {
      await submitMentor({ mahasiswaId: m.mahasiswaId, status, tanggal: selectedDate });
      toast(`Absensi ${m.nama} (${status}) berhasil dicatat.`);
      refreshHarian();
    } catch (err: any) {
      toast(err.message || "Gagal mencatat absensi.");
    } finally {
      setSubmittingIds(prev => { const s = new Set(prev); s.delete(m.mahasiswaId); return s; });
      refreshHarianStats();
    }
  }, [rowStatus, selectedDate, submitMentor, refreshHarian, refreshHarianStats]);

  // ── EKSPOR REKAP ABSENSI BARU ─────────────────────────────────────────
  const [eksporFilter, setEksporFilter] = useState<"Hari ini" | "Minggu ini" | "Bulan ini" | "Tahun ini">("Bulan ini");
  
  const { tanggalAwal, tanggalAkhir } = useMemo(() => {
    const today = new Date();
    let start = new Date(today);
    
    if (eksporFilter === "Hari ini") {
      start = new Date(today);
    } else if (eksporFilter === "Minggu ini") {
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start = new Date(start.setDate(diff));
    } else if (eksporFilter === "Bulan ini") {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (eksporFilter === "Tahun ini") {
      start = new Date(today.getFullYear(), 0, 1);
    }
    
    const formatDate = (date: Date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
    
    return {
      tanggalAwal: formatDate(start),
      tanggalAkhir: formatDate(today)
    };
  }, [eksporFilter]);

  const { data: rekapData, isLoading: loadingRekapAbsensi } = useRekapAbsensi(tanggalAwal, tanggalAkhir);
  
  const rekapStats = useMemo(() => {
    let hadir = 0, izin = 0, sakit = 0, alpha = 0;
    rekapData.forEach(r => {
      const s = (r[2] || "").toLowerCase();
      if (s === "hadir") hadir++;
      else if (s === "izin") izin++;
      else if (s === "sakit") sakit++;
      else alpha++;
    });
    return { hadir, izin, sakit, alpha, total: rekapData.length };
  }, [rekapData]);

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

  const { download: handleExportPDF, isGenerating: isExportingPDF } = useDownloadRekapMentorPDF(
    rekapData, eksporFilter, ttdBase64, rekapStats
  );

  // ── REKAP & RIWAYAT ──────────────────────────────────────────────────
  const [searchQuery,  setSearchQuery]  = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selectedRekapDate, setSelectedRekapDate] = useState(todayISO);
  const [isExporting,  setIsExporting]  = useState(false);

  const todayStr = useMemo(() => new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }), []);

  const {
    history: attendanceLogs, page: pageRekap, totalPages: totalPagesRekap, total: totalRekap, goToPage: goToPageRekap, isLoading: loadingRekap,
    verify, deleteLog, exportCSV, refreshHistory, getSuratKeterangan,
  } = useAttendance();
  const { rawStudents } = useStudents();

  // API call sekarang menggunakan selectedRekapDate
  useEffect(() => { 
    refreshHistory(statusFilter, searchQuery, selectedRekapDate || undefined); 
  }, [statusFilter, searchQuery, selectedRekapDate, refreshHistory]);

  const enrichedLogs = useMemo(() => attendanceLogs?.map(log => {
    const student = rawStudents.find(s => String(s.id) === String(log.studentId));
    // type  = jenis absensi (Hadir/Izin/Sakit/Alpha)
    // verificationStatus = status verifikasi mentor (Diverifikasi/Menunggu/Ditolak)
    const verificationStatus = log.status; // dari AttendanceLog.status — derive dari mentorId di mapper
    let displayType: "Hadir" | "Sakit" | "Izin" | "Alfa" = "Hadir";
    if (log.type === "Izin")  displayType = "Izin";
    else if (log.type === "Sakit") displayType = "Sakit";
    else if (log.type === "Alpha") displayType = "Alfa";
    return {
      ...log,
      studentName:         log.studentName  || (student?.name      ?? "Mahasiswa Tidak Dikenal"),
      studentNim:          log.studentNim   || (student?.nim        ?? "-"),
      studentAvatar:       student?.avatarColor ?? "from-slate-400 to-slate-500",
      studentUniv:         student?.university  ?? "-",
      displayType,
      verificationStatus,
    };
  }), [attendanceLogs, rawStudents]);

  const filteredLogs = enrichedLogs.filter(log => {
    // Status and Search are handled in backend, but frontend filter for safety.
    // Date filter is now handled in backend.
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = q === "" || log.studentName.toLowerCase().includes(q) || log.studentNim.toLowerCase().includes(q);
    const matchStatus = statusFilter === "Semua" || log.displayType === statusFilter;
    return matchSearch && matchStatus;
  });

  const getDocumentUrl = async (logId: string | number, fallbackKey?: string | null): Promise<string | null> => {
    try {
      const key = await getSuratKeterangan(logId);
      return key ? mediaAPI.getFileUrl(key) : null;
    } catch {
      return fallbackKey ? mediaAPI.getFileUrl(fallbackKey) : null;
    }
  };

  const handleDeleteLog = async (logId: string | number, studentName: string) => {
    if (confirm(`Hapus catatan absensi ${studentName}?`)) {
      try { await deleteLog(logId); toast(`Absensi ${studentName} berhasil dihapus.`); }
      catch (err: any) { alert(err.message || "Gagal menghapus."); }
    }
  };

  const handleVerifyLog = async (logId: string | number, studentName: string) => {
    try {
      await verify(logId, "Diverifikasi");
      await refreshHistory(statusFilter, searchQuery, selectedRekapDate || undefined);
      toast(`Absensi ${studentName} disetujui!`);
    } catch (err: any) { alert(err.message || "Gagal menyetujui."); }
  };

  const handleTolakLog = async (logId: string | number, studentName: string) => {
    if (confirm(`Tolak absensi izin/sakit ${studentName}? Record absensi akan dihapus.`)) {
      try { await verify(logId, "Ditolak"); toast(`Absensi ${studentName} ditolak dan dihapus.`); }
      catch (err: any) { alert(err.message || "Gagal menolak absensi."); }
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try { await exportCSV(statusFilter, searchQuery); toast("Rekap absensi berhasil diekspor!"); }
    catch (err: any) { alert(err.message || "Gagal mengekspor."); }
    finally { setIsExporting(false); }
  };

  const { stats: rekapTabStats } = useAbsensiHarianMentorStatistik(selectedRekapDate || undefined);

  const displayStats = activeTab === "catat" 
    ? { hadir: harianStats.hadir, alfa: harianStats.alfa, off: harianStats.off, date: formatDateID(selectedDate).split(",")[0] }
    : { hadir: rekapTabStats.hadir, alfa: rekapTabStats.alfa, off: rekapTabStats.off, date: selectedRekapDate ? formatDateID(selectedRekapDate).split(",")[0] : "Semua Waktu" };

  const statsConfig: StatItem[] = [
    { label: "Hadir",          value: displayStats.hadir, desc: displayStats.date, colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40", icon: UserCheck },
    { label: "Belum Diabsensi",value: displayStats.alfa,  desc: "Perlu dicatat",  colorClass: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200/50 dark:border-rose-900/40", icon: Clock },
    { label: "Izin / Sakit",   value: displayStats.off,   desc: "Izin atau sakit",   colorClass: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-900/40", icon: Coffee },
  ];

  return (
    <div className="space-y-6 relative">


      <SuccessToast show={!!toastMsg} message={toastMsg} />



      {/* STATS — reactive dari data harian */}
      <StatsGrid stats={statsConfig} gridClass="grid-cols-2 lg:grid-cols-3" />

      {/* TABS */}
      <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] dark:bg-[#232F72]/60 border border-[#2F578A]/30 dark:border-[#2F578A]/60 rounded-2xl w-fit">
        {([
          { key: "catat", label: "Catat Absensi",   icon: CalendarCheck },
          { key: "rekap", label: "Rekap & Riwayat", icon: ClipboardList },
          { key: "ekspor", label: "Ekspor Rekap", icon: Download },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${activeTab === key ? "bg-[#232F72] text-white shadow-md shadow-[#232F72]/30" : "text-[#2F578A] dark:text-[#F1F5F9]/60 hover:text-[#232F72] dark:hover:text-white"}`}
          >
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* ═══════════════ TAB: CATAT ABSENSI ═══════════════ */}
      {activeTab === "catat" && (
        <div className="space-y-4">

          {/* Date Selector */}
          <div className="border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#121358] dark:bg-[#232F72] border border-[#2F578A]/40 text-[#36ADA3] flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 tracking-wide">Tanggal Absensi</p>
                  <p className="text-sm font-black text-[#232F72] dark:text-white leading-tight">{formatDateID(selectedDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDate(todayISO())}
                  disabled={selectedDate === todayISO()}
                  className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wide rounded-xl border border-[#2F578A]/50 dark:border-[#2F578A] text-[#232F72] dark:text-[#F1F5F9] hover:bg-[#232F72] hover:text-white hover:border-[#232F72] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Hari Ini
                </button>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    max={todayISO()}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white cursor-pointer"
                  />
                  <Calendar className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Absensi Harian Table */}
          <div className="border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm text-[#232F72] dark:text-white flex items-center gap-2">
                Daftar Absensi Mahasiswa
                {!loadingHarian && (
                  <span className="px-2 py-0.5 bg-[#F1F5F9] dark:bg-[#232F72] text-[#2F578A] dark:text-[#F1F5F9]/70 text-[10px] font-black rounded-lg border border-[#2F578A]/30 dark:border-[#2F578A]">
                    {total} mahasiswa
                  </span>
                )}
              </h4>
              <button onClick={() => refreshHarian()} className="p-1.5 rounded-xl border border-[#2F578A]/30 dark:border-[#2F578A] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 hover:bg-[#F1F5F9] dark:hover:bg-[#232F72] transition-all cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="border-b border-[#2F578A]/20 dark:border-[#2F578A]/50 text-[10px] font-bold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 uppercase tracking-widest text-left">
                    <th className="pb-3 pl-2">Mahasiswa</th>
                    <th className="pb-3">Periode Magang</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-2 text-right">Catat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2F578A]/10 dark:divide-[#2F578A]/30 text-xs">
                  {loadingHarian ? (
                    <tr><td colSpan={4} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-[#2F578A]/80 dark:text-[#F1F5F9]/50">
                        <RefreshCw className="w-7 h-7 animate-spin text-[#232F72] dark:text-white" />
                        <span className="font-bold">Memuat data...</span>
                      </div>
                    </td></tr>
                  ) : harianData.length === 0 ? (
                    <tr><td colSpan={4} className="py-16 text-center">
                      <div className="space-y-2">
                        <AlertCircle className="w-8 h-8 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 mx-auto" />
                        <p className="font-extrabold text-xs text-[#232F72] dark:text-white">Tidak ada mahasiswa aktif pada tanggal ini</p>
                        <p className="text-[10px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50">Tidak ada mahasiswa yang periode magangnya mencakup tanggal {formatDateID(selectedDate)}.</p>
                      </div>
                    </td></tr>
                  ) : harianData.map(m => {
                    const sudahDicatat = m.absensiStatus !== "alpha";
                    const isSubmitting = submittingIds.has(m.mahasiswaId);
                    const currentStatus = rowStatus[m.mahasiswaId] ?? "hadir";

                    return (
                      <tr key={m.mahasiswaId} className={`transition-colors ${sudahDicatat ? "opacity-75 hover:opacity-100" : "hover:bg-[#F8FAFC]/60 dark:hover:bg-[#121358]/40"}`}>

                        {/* Mahasiswa */}
                        <td className="py-3.5 pl-2">
                          <Link href={`/dashboard/mentor/absensi/${m.mahasiswaId}`} className="group flex items-center gap-2.5 cursor-pointer">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#232F72] to-[#2F578A] text-white font-extrabold flex items-center justify-center text-[10px] flex-shrink-0 group-hover:shadow-md transition-all">
                              {m.nama.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-extrabold text-[#232F72] dark:text-white leading-tight group-hover:text-[#36ADA3] transition-colors">{m.nama}</p>
                              <p className="text-[10px] font-semibold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 mt-0.5">{m.nim}</p>
                            </div>
                          </Link>
                        </td>

                        {/* Periode */}
                        <td className="py-3.5">
                          <p className="font-semibold text-[#232F72]/80 dark:text-[#F1F5F9]">
                            {new Date(m.tanggalMulai + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                          <p className="text-[10px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold">
                            s/d {new Date(m.tanggalBerakhir + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </td>

                        {/* Status — selalu tampil badge */}
                        <td className="py-3.5">
                          <StatusBadgeAbsensi status={m.absensiStatus} />
                        </td>

                        {/* Catat — picker + tombol jika belum, "Tercatat" jika sudah */}
                        <td className="py-3.5 pr-2">
                          {sudahDicatat ? (
                            <div className="flex justify-end">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                                <Check className="w-3.5 h-3.5" /> Tercatat
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2 flex-wrap">
                              <div className="flex items-center gap-1">
                                {STATUS_OPTIONS.map(opt => (
                                  <button
                                    key={opt.value}
                                    onClick={() => setRowStatus(prev => ({ ...prev, [m.mahasiswaId]: opt.value }))}
                                    disabled={isSubmitting}
                                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-extrabold uppercase tracking-wide transition-all cursor-pointer disabled:opacity-50 ${
                                      currentStatus === opt.value
                                        ? opt.color + " shadow-sm scale-105"
                                        : "bg-[#F8FAFC] dark:bg-[#232F72] border-[#2F578A]/30 dark:border-[#2F578A]/60 text-[#2F578A] dark:text-[#F1F5F9]/60 hover:border-[#2F578A]"
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={() => handleCatat(m)}
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#232F72] hover:brightness-110 disabled:opacity-60 text-white text-[10px] font-extrabold rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
                              >
                                {isSubmitting
                                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan...</>
                                  : <><Check className="w-3.5 h-3.5" /> Catat</>
                                }
                              </button>
                            </div>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2F578A]/20 dark:border-[#2F578A]/40 text-xs">
                <span className="text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold">Halaman {page} dari {totalPages}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="p-1.5 rounded-lg border border-[#2F578A]/30 dark:border-[#2F578A] text-[#2F578A] dark:text-[#F1F5F9]/60 hover:bg-[#F1F5F9] dark:hover:bg-[#232F72] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"><ChevronLeft className="w-3.5 h-3.5" /></button>
                  <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="p-1.5 rounded-lg border border-[#2F578A]/30 dark:border-[#2F578A] text-[#2F578A] dark:text-[#F1F5F9]/60 hover:bg-[#F1F5F9] dark:hover:bg-[#232F72] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"><ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════ TAB: REKAP & RIWAYAT ═══════════════ */}
      {activeTab === "rekap" && (
        <div className="space-y-4">
          {/* Filter Panel */}
          <div className="border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#121358] dark:bg-[#232F72] border border-[#2F578A]/40 text-[#36ADA3] flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 tracking-wide">Tanggal Rekap</p>
                  <p className="text-sm font-black text-[#232F72] dark:text-white leading-tight">
                    {selectedRekapDate ? formatDateID(selectedRekapDate) : "Semua Waktu"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Date Picker Actions */}
                <button
                  onClick={() => setSelectedRekapDate("")}
                  disabled={!selectedRekapDate}
                  className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wide rounded-xl border border-[#2F578A]/50 dark:border-[#2F578A] text-[#232F72] dark:text-[#F1F5F9] hover:bg-[#232F72] hover:text-white hover:border-[#232F72] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Semua
                </button>
                <button
                  onClick={() => setSelectedRekapDate(todayISO())}
                  disabled={selectedRekapDate === todayISO()}
                  className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wide rounded-xl border border-[#2F578A]/50 dark:border-[#2F578A] text-[#232F72] dark:text-[#F1F5F9] hover:bg-[#232F72] hover:text-white hover:border-[#232F72] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Hari Ini
                </button>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedRekapDate}
                    max={todayISO()}
                    onChange={e => setSelectedRekapDate(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white cursor-pointer"
                  />
                  <Calendar className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-3 top-2.5 pointer-events-none" />
                </div>
                
                {/* Status Filter */}
                <div className="flex items-center gap-2 ml-auto">
                  {["Semua", "Hadir", "Izin", "Sakit"].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`px-3 py-2 rounded-xl border text-[10px] uppercase tracking-wide font-extrabold transition-all cursor-pointer ${statusFilter === s ? "bg-[#232F72] border-[#232F72] text-white shadow-md" : "bg-[#F8FAFC] dark:bg-[#232F72] border-[#2F578A]/50 dark:border-[#2F578A] text-[#2F578A] dark:text-[#F1F5F9]/80 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                    >
                      {s === "Semua" ? "Semua Status" : s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative">
              <input type="text" placeholder="Cari nama mahasiswa atau NIM..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
              />
              <Search className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Rekap Table */}
          <div className="border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-[#2F578A] text-[10px] font-bold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 uppercase tracking-widest text-left">
                    <th className="pb-3.5 pl-4">Mahasiswa</th>
                    <th className="pb-3.5">NIM / Kampus</th>
                    <th className="pb-3.5">Status</th>
                    <th className="pb-3.5">Lampiran</th>
                    <th className="pb-3.5 pr-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2F578A]/30 dark:divide-[#2F578A]/50 text-xs">
                  {loadingRekap ? (
                    <tr><td colSpan={5} className="py-16 text-center"><div className="flex flex-col items-center gap-2 text-[#2F578A]/80 dark:text-[#F1F5F9]/50"><RefreshCw className="w-8 h-8 animate-spin text-[#232F72] dark:text-white" /><span className="font-bold">Memuat data...</span></div></td></tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr><td colSpan={5} className="py-16 text-center"><div className="space-y-2"><AlertCircle className="w-8 h-8 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 mx-auto" /><p className="font-extrabold text-xs text-[#2F578A] dark:text-[#F1F5F9]/70">Tidak ada data</p><button onClick={() => { setSearchQuery(""); setStatusFilter("Semua"); }} className="px-3 py-1.5 bg-[#F8FAFC] dark:bg-[#232F72] text-[#232F72] dark:text-white text-[10px] font-bold rounded-lg border border-[#2F578A]/30 cursor-pointer transition-all">Reset Filter</button></div></td></tr>
                  ) : filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-[#F8FAFC]/50 dark:hover:bg-[#121358]/50 transition-colors">
                      <td className="py-4 pl-4">
                        <Link href={`/dashboard/mentor/absensi/${log.studentId}`} className="group flex items-center gap-3 cursor-pointer">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${log.studentAvatar} text-white font-extrabold flex items-center justify-center text-xs shadow-inner group-hover:shadow-md transition-all`}>
                            {(log.studentName || "U").split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-extrabold text-[#232F72] dark:text-white leading-tight group-hover:text-[#36ADA3] transition-colors">{log.studentName}</p>
                            <span className="text-[10px] font-bold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mt-0.5">{log.date}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="py-4 font-bold text-[#232F72]/80 dark:text-[#F1F5F9]">
                        <p>{log.studentNim}</p>
                        <span className="text-[10px] font-semibold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mt-0.5 truncate max-w-[150px]">{log.studentUniv}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col gap-1">
                          <StatusBadgeAbsensi status={log.displayType.toLowerCase() === "alfa" ? "alpha" : log.displayType.toLowerCase()} />
                          {(log.displayType === "Izin" || log.displayType === "Sakit") && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold w-fit ${
                              log.verificationStatus === "Menunggu"
                                ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200/40"
                                : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40"
                            }`}>
                              {log.verificationStatus === "Menunggu" ? "Menunggu Verifikasi" : "Diverifikasi"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4" onClick={e => e.stopPropagation()}>
                        {(log.displayType === "Sakit" || log.displayType === "Izin") ? (
                          log.document ? (
                            <button
                              onClick={async () => {
                                const url = await getDocumentUrl(log.id, log.document);
                                if (url) window.open(url, "_blank");
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#2F578A]/30 rounded-xl text-[9px] font-black bg-[#F1F5F9] dark:bg-[#232F72] hover:bg-[#232F72] hover:text-white text-[#232F72] dark:text-white cursor-pointer active:scale-95 transition-all"
                            >
                              <Eye className="w-3.5 h-3.5" /> Unduh Surat
                            </button>
                          ) : (
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">Tidak ada</span>
                          )
                        ) : <span className="text-[#2F578A]/80 dark:text-[#F1F5F9]/50">-</span>}
                      </td>
                      <td className="py-4 pr-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {/* Setujui — hanya untuk izin/sakit yang BELUM diverifikasi */}
                          {(log.displayType === "Izin" || log.displayType === "Sakit") && log.verificationStatus === "Menunggu" && (
                            <button onClick={() => handleVerifyLog(log.id, log.studentName)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-600 dark:bg-emerald-950/30 hover:text-white text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 rounded-xl text-[10px] font-black transition-all cursor-pointer active:scale-95"
                            >
                              <Check className="w-3.5 h-3.5" /> Setujui
                            </button>
                          )}
                          {/* Tolak — untuk izin/sakit belum diverifikasi | Hapus — untuk hadir atau sudah diverifikasi */}
                          {(log.displayType === "Izin" || log.displayType === "Sakit") && log.verificationStatus === "Menunggu" ? (
                            <button onClick={() => handleTolakLog(log.id, log.studentName)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/30 hover:text-white text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/30 rounded-xl text-[10px] font-black transition-all cursor-pointer active:scale-95"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Tolak
                            </button>
                          ) : (
                            <button onClick={() => handleDeleteLog(log.id, log.studentName)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/30 hover:text-white text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/30 rounded-xl text-[10px] font-black transition-all cursor-pointer active:scale-95"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination for Rekap */}
            {totalPagesRekap > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2F578A]/20 dark:border-[#2F578A]/40 text-xs">
                <span className="text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold">Halaman {pageRekap} dari {totalPagesRekap}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => goToPageRekap(statusFilter, searchQuery, pageRekap - 1)} disabled={pageRekap <= 1} className="p-1.5 rounded-lg border border-[#2F578A]/30 dark:border-[#2F578A] text-[#2F578A] dark:text-[#F1F5F9]/60 hover:bg-[#F1F5F9] dark:hover:bg-[#232F72] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"><ChevronLeft className="w-3.5 h-3.5" /></button>
                  <button onClick={() => goToPageRekap(statusFilter, searchQuery, pageRekap + 1)} disabled={pageRekap >= totalPagesRekap} className="p-1.5 rounded-lg border border-[#2F578A]/30 dark:border-[#2F578A] text-[#2F578A] dark:text-[#F1F5F9]/60 hover:bg-[#F1F5F9] dark:hover:bg-[#232F72] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"><ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════ TAB: EKSPOR REKAP ABSENSI BARU ═══════════════ */}
      {activeTab === "ekspor" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex bg-[#F8FAFC] dark:bg-[#121358]/60 p-1 rounded-2xl border border-[#2F578A]/20 dark:border-[#2F578A]/40 w-max overflow-x-auto max-w-full">
              {(["Hari ini", "Minggu ini", "Bulan ini", "Tahun ini"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setEksporFilter(f)}
                  className={`whitespace-nowrap px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                    eksporFilter === f
                      ? "bg-white dark:bg-[#232F72] text-[#232F72] dark:text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-[#232F72] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#232F72]/50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportCSV(statusFilter === "Semua" ? undefined : statusFilter, searchQuery || undefined)}
                disabled={isExportingPDF || loadingRekapAbsensi || rekapData.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-extrabold
                           bg-emerald-600 dark:bg-emerald-500 text-white
                           hover:bg-emerald-700 dark:hover:bg-emerald-600
                           disabled:opacity-60 disabled:cursor-not-allowed
                           shadow-[0_0_14px_rgba(5,150,105,0.25)] dark:shadow-[0_0_14px_rgba(16,185,129,0.3)]
                           transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isExportingPDF || loadingRekapAbsensi || rekapData.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-extrabold
                           bg-[#232F72] dark:bg-[#36ADA3] text-white
                           hover:bg-[#1a2256] dark:hover:bg-[#2eb1a6]
                           disabled:opacity-60 disabled:cursor-not-allowed
                           shadow-[0_0_14px_rgba(35,47,114,0.25)] dark:shadow-[0_0_14px_rgba(54,173,163,0.3)]
                           transition-all active:scale-95 cursor-pointer"
              >
                {isExportingPDF
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Membuat PDF...</>
                  : <><Download className="w-4 h-4" /> Download Rekap Absensi</>
                }
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f1535] border border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-3xl shadow-xl overflow-hidden">
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

              {/* INFO FILTER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 text-[12px]">
                <div className="flex gap-2">
                  <span className="font-bold text-[#2F578A] dark:text-[#36ADA3] w-36 flex-shrink-0">Periode Laporan</span>
                  <span className="font-semibold text-[#232F72] dark:text-white">:&nbsp;{new Date(tanggalAwal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} - {new Date(tanggalAkhir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="border-t border-dashed border-[#2F578A]/25 dark:border-[#2F578A]/40" />

              {/* TABEL */}
              <div className="overflow-x-auto rounded-2xl border border-[#2F578A]/20 dark:border-[#2F578A]/30">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-[#232F72] dark:bg-[#0d1a4a] text-white">
                      <th className="py-3 px-4 text-center font-extrabold uppercase tracking-wider border-r border-white/10 w-12">No.</th>
                      <th className="py-3 px-5 text-left font-extrabold uppercase tracking-wider border-r border-white/10">Nama Mahasiswa</th>
                      <th className="py-3 px-5 text-left font-extrabold uppercase tracking-wider border-r border-white/10">Tanggal</th>
                      <th className="py-3 px-5 text-center font-extrabold uppercase tracking-wider">Status Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingRekapAbsensi ? (
                      <tr><td colSpan={4} className="py-12 text-center text-[#2F578A]/80"><RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />Memuat rekap...</td></tr>
                    ) : rekapData.length === 0 ? (
                      <tr><td colSpan={4} className="py-12 text-center text-[#2F578A]/80">Tidak ada data untuk rentang waktu ini.</td></tr>
                    ) : (
                      rekapData.map((row, idx) => {
                        const statusRaw = (row[2] || "").toLowerCase();
                        const statusType = statusRaw === "alfa" ? "alpha" : statusRaw;
                        return (
                          <tr
                            key={idx}
                            className={`border-b border-[#2F578A]/10 dark:border-[#2F578A]/20 transition-colors ${
                              statusType === "alpha" ? "bg-rose-50/60 dark:bg-rose-950/10"
                              : idx % 2 === 0 ? "bg-white dark:bg-[#0f1535]" : "bg-[#F8FAFC] dark:bg-[#121358]/40"
                            }`}
                          >
                            <td className="py-3 px-4 text-center font-bold text-[#2F578A]/50 dark:text-[#F1F5F9]/25 border-r border-[#2F578A]/10 dark:border-[#2F578A]/20">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-5 font-semibold text-[#232F72] dark:text-[#e8eaf6] border-r border-[#2F578A]/10 dark:border-[#2F578A]/20">
                              {row[0]}
                            </td>
                            <td className="py-3 px-5 font-semibold text-[#232F72] dark:text-[#e8eaf6] border-r border-[#2F578A]/10 dark:border-[#2F578A]/20">
                              <div className="flex items-center gap-2">
                                <CalendarDays className="w-3 h-3 text-[#36ADA3] flex-shrink-0 opacity-60" />
                                {row[1] ? formatDateID(row[1]) : "-"}
                              </div>
                            </td>
                            <td className="py-3 px-5 text-center">
                              <StatusBadgeAbsensi status={statusType} />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* RINGKASAN */}
              <div className="flex justify-end">
                <div className="min-w-[220px] border-t border-[#2F578A]/20 dark:border-[#2F578A]/30 pt-4 space-y-2 text-[11px]">
                  {([
                    { label: "Total Hadir",        nilai: rekapStats.hadir, warna: "text-emerald-700 dark:text-emerald-300" },
                    { label: "Total Izin",         nilai: rekapStats.izin,  warna: "text-blue-700 dark:text-blue-300" },
                    { label: "Total Sakit",        nilai: rekapStats.sakit, warna: "text-sky-700 dark:text-sky-300" },
                    { label: "Total Tidak Hadir",  nilai: rekapStats.alpha, warna: "text-rose-700 dark:text-rose-300" },
                  ] as const).map(({ label, nilai, warna }) => (
                    <div key={label} className="flex items-center justify-between gap-10">
                      <span className="font-semibold text-[#2F578A]/80 dark:text-[#F1F5F9]/60">{label}</span>
                      <span className={`font-extrabold tabular-nums ${warna}`}>
                        {nilai}&nbsp;<span className="font-semibold text-[9px] opacity-70">hari</span>
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-[#2F578A]/20 dark:border-[#2F578A]/30 pt-2 flex items-center justify-between gap-10">
                    <span className="font-extrabold text-[#232F72] dark:text-white">Total Catatan</span>
                    <span className="font-black tabular-nums text-[#232F72] dark:text-white">
                      {rekapStats.total}&nbsp;<span className="font-semibold text-[9px] opacity-70">record</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="border-t border-dashed border-[#2F578A]/25 dark:border-[#2F578A]/40" />

              {/* TANDA TANGAN */}
              <div className="flex flex-col items-end gap-1 text-[11px]">
                <p className="font-semibold text-[#2F578A]/80 dark:text-[#F1F5F9]/60">
                  Jakarta, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
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
        </div>
      )}
    </div>
  );
}
