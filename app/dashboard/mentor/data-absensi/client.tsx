"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search, Clock, Calendar, CalendarCheck, CalendarDays,
  XCircle, AlertCircle, Download, FileSpreadsheet,
  UserCheck, Coffee, Check, RefreshCw, Eye, Trash2,
  ClipboardList, Loader2, ChevronLeft, ChevronRight,
} from "lucide-react";
import {
  useAttendance,
  useAbsensiHarianMentor,
  useSubmitAbsensiMentor,
} from "@/modules/data_absensi/hooks";
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
  const [activeTab, setActiveTab] = useState<"catat" | "rekap">("catat");
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
    }
  }, [rowStatus, selectedDate, submitMentor, refreshHarian]);

  // live stats from harian data
  const harianStats = useMemo(() => ({
    hadir:  harianData.filter(m => m.absensiStatus === "hadir").length,
    alfa:   harianData.filter(m => m.absensiStatus === "alpha").length,
    off:    harianData.filter(m => m.absensiStatus === "izin" || m.absensiStatus === "sakit").length,
  }), [harianData]);

  // ── REKAP & RIWAYAT ──────────────────────────────────────────────────
  const [searchQuery,  setSearchQuery]  = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isExporting,  setIsExporting]  = useState(false);
  const [viewingLeaveDoc, setViewingLeaveDoc] = useState<{
    studentName: string; type: "Sakit" | "Izin"; notes: string; documentUrl?: string | null
  } | null>(null);

  const todayStr = useMemo(() => new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }), []);

  const {
    history: attendanceLogs, isLoading: loadingRekap,
    verify, deleteLog, exportCSV, refreshHistory, getSuratKeterangan,
  } = useAttendance();
  const { rawStudents } = useStudents();

  useEffect(() => { refreshHistory(statusFilter, searchQuery); }, [statusFilter, searchQuery, refreshHistory]);

  const enrichedLogs = useMemo(() => attendanceLogs?.map(log => {
    const student = rawStudents.find(s => String(s.id) === String(log.studentId));
    let status: "Hadir" | "Sakit" | "Izin" | "Alfa" = "Hadir";
    if (log.type === "Izin")  status = "Izin";
    else if (log.type === "Sakit") status = "Sakit";
    else if (log.type === "Alpha") status = "Alfa";
    return {
      ...log,
      studentName:   log.studentName  || (student?.name      ?? "Mahasiswa Tidak Dikenal"),
      studentNim:    log.studentNim   || (student?.nim        ?? "-"),
      studentAvatar: student?.avatarColor ?? "from-slate-400 to-slate-500",
      studentUniv:   student?.university  ?? "-",
      status,
    };
  }), [attendanceLogs, rawStudents]);

  const filteredLogs = enrichedLogs.filter(log => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = q === "" || log.studentName.toLowerCase().includes(q) || log.studentNim.toLowerCase().includes(q);
    const matchStatus = statusFilter === "Semua" || log.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleViewDocument = async (logId: string | number, studentName: string, type: "Sakit" | "Izin", notes: string, initialUrl?: string | null) => {
    try {
      const key = await getSuratKeterangan(logId);
      setViewingLeaveDoc({ studentName, type, notes, documentUrl: key ? mediaAPI.getFileUrl(key) : null });
    } catch {
      setViewingLeaveDoc({ studentName, type, notes, documentUrl: initialUrl ? mediaAPI.getFileUrl(initialUrl) : null });
    }
  };

  const handleDeleteLog = async (logId: string | number, studentName: string) => {
    if (confirm(`Hapus catatan absensi ${studentName}?`)) {
      try { await deleteLog(logId); toast(`Absensi ${studentName} berhasil dihapus.`); }
      catch (err: any) { alert(err.message || "Gagal menghapus."); }
    }
  };

  const handleVerifyLog = async (logId: string | number, studentName: string) => {
    try { await verify(logId, "Diverifikasi"); toast(`Absensi ${studentName} disetujui!`); }
    catch (err: any) { alert(err.message || "Gagal menyetujui."); }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try { await exportCSV(statusFilter, searchQuery); toast("Rekap absensi berhasil diekspor!"); }
    catch (err: any) { alert(err.message || "Gagal mengekspor."); }
    finally { setIsExporting(false); }
  };

  const statsConfig: StatItem[] = [
    { label: "Hadir",          value: harianStats.hadir, desc: formatDateID(selectedDate).split(",")[0], colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40", icon: UserCheck },
    { label: "Belum Diabsensi",value: harianStats.alfa,  desc: "Perlu dicatat",  colorClass: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200/50 dark:border-rose-900/40", icon: Clock },
    { label: "Izin / Sakit",   value: harianStats.off,   desc: "Dengan keterangan", colorClass: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-900/40", icon: Coffee },
  ];

  return (
    <div className="space-y-6 relative">

      {/* LEAVE DOCUMENT MODAL */}
      {viewingLeaveDoc && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setViewingLeaveDoc(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-[#121358] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-float">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#2F578A]">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${viewingLeaveDoc.type === "Sakit" ? "bg-sky-50 dark:bg-sky-950/40 border border-sky-200/30 text-sky-600" : "bg-blue-50 dark:bg-blue-950/40 border border-blue-200/30 text-blue-600"}`}>
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white">Surat Keterangan {viewingLeaveDoc.type}</h4>
                  <p className="text-[10px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold mt-0.5">{viewingLeaveDoc.studentName}</p>
                </div>
              </div>
              <button onClick={() => setViewingLeaveDoc(null)} className="p-1.5 hover:bg-[#F8FAFC] dark:hover:bg-[#232F72] rounded-xl text-[#2F578A]/80 cursor-pointer transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="border border-[#2F578A]/30 dark:border-[#2F578A] bg-[#F1F5F9] dark:bg-[#232F72] rounded-2xl p-4 min-h-[180px] flex flex-col items-center justify-center">
              {viewingLeaveDoc.documentUrl
                ? <img src={viewingLeaveDoc.documentUrl} alt="Lampiran" className="max-w-full max-h-[260px] object-contain rounded-xl" />
                : <div className="text-center space-y-2"><AlertCircle className="w-8 h-8 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 mx-auto" /><p className="text-xs font-bold text-[#232F72]/80 dark:text-[#F1F5F9]">Tidak ada lampiran</p></div>
              }
              <div className="w-full mt-4 p-3 bg-white dark:bg-[#121358] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-xl">
                <p className="text-[10px] font-bold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 mb-1">Catatan:</p>
                <p className="text-xs font-medium text-[#232F72]/80 dark:text-[#F1F5F9]">{viewingLeaveDoc.notes || "Tidak ada catatan."}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 text-xs">
              {viewingLeaveDoc.documentUrl && (
                <a href={viewingLeaveDoc.documentUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-[#2F578A]/50 dark:border-[#2F578A] text-[#232F72] dark:text-[#F1F5F9] font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-[#232F72] transition-all inline-flex items-center gap-1 cursor-pointer">
                  <Eye className="w-3.5 h-3.5" /> Buka Asli
                </a>
              )}
              <button onClick={() => setViewingLeaveDoc(null)} className="px-5 py-2 bg-[#232F72] hover:brightness-110 text-white font-extrabold rounded-xl shadow-md active:scale-95 transition-all cursor-pointer">Selesai</button>
            </div>
          </div>
        </div>
      )}

      <SuccessToast show={!!toastMsg} message={toastMsg} />

      {/* HEADER */}
      <PageHeader
        title="Monitoring Absensi Harian Mahasiswa"
        subtitle="Catat kehadiran mahasiswa bimbingan dan pantau rekap absensi secara real-time."
        action={
          <button onClick={handleExport} disabled={isExporting} className="flex items-center gap-1.5 px-4 py-2.5 bg-[#232F72] hover:brightness-110 disabled:opacity-60 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer active:scale-95 shadow-md shadow-[#232F72]/20">
            {isExporting ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Mengekspor...</> : <><Download className="w-3.5 h-3.5" /> Ekspor Rekap</>}
          </button>
        }
      />

      {/* STATS — reactive dari data harian */}
      <StatsGrid stats={statsConfig} gridClass="grid-cols-2 lg:grid-cols-3" />

      {/* TABS */}
      <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] dark:bg-[#232F72]/60 border border-[#2F578A]/30 dark:border-[#2F578A]/60 rounded-2xl w-fit">
        {([
          { key: "catat", label: "Catat Absensi",   icon: CalendarCheck },
          { key: "rekap", label: "Rekap & Riwayat", icon: ClipboardList },
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
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#232F72] to-[#2F578A] text-white font-extrabold flex items-center justify-center text-[10px] flex-shrink-0">
                              {m.nama.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-extrabold text-[#232F72] dark:text-white leading-tight">{m.nama}</p>
                              <p className="text-[10px] font-semibold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 mt-0.5">{m.nim}</p>
                            </div>
                          </div>
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
              <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Hari Ini: <span className="font-black">{todayStr}</span>
              </h4>
              <div className="flex items-center gap-2 text-xs flex-wrap">
                {["Semua", "Hadir", "Sakit", "Izin", "Alfa"].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded-lg border text-[10px] uppercase tracking-wide transition-all cursor-pointer ${statusFilter === s ? "bg-[#232F72] border-[#232F72] text-white shadow-md" : "bg-[#F8FAFC] dark:bg-[#232F72] border-[#2F578A]/50 dark:border-[#2F578A] text-[#2F578A] dark:text-[#F1F5F9]/80 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  >
                    {s === "Semua" ? "Semua Status" : s}
                  </button>
                ))}
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
                    <th className="pb-3.5">Keterangan Surat</th>
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
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${log.studentAvatar} text-white font-extrabold flex items-center justify-center text-xs shadow-inner`}>
                            {(log.studentName || "U").split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-extrabold text-[#232F72] dark:text-white leading-tight">{log.studentName}</p>
                            <span className="text-[10px] font-bold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mt-0.5">{log.date}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-bold text-[#232F72]/80 dark:text-[#F1F5F9]">
                        <p>{log.studentNim}</p>
                        <span className="text-[10px] font-semibold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mt-0.5 truncate max-w-[150px]">{log.studentUniv}</span>
                      </td>
                      <td className="py-4"><StatusBadgeAbsensi status={log.status.toLowerCase()} /></td>
                      <td className="py-4" onClick={e => e.stopPropagation()}>
                        {(log.status === "Sakit" || log.status === "Izin") ? (
                          <div className="flex flex-col gap-1.5 max-w-[180px]">
                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate">{log.notes || "Tidak ada keterangan."}</span>
                            <button onClick={() => handleViewDocument(log.id, log.studentName, log.status as "Sakit" | "Izin", log.notes || "", log.document)} className="inline-flex items-center gap-1 w-max px-2.5 py-1.5 bg-[#F1F5F9] dark:bg-[#232F72] hover:bg-[#232F72] hover:text-white text-[#232F72] dark:text-white border border-[#2F578A]/30 rounded-xl text-[9px] font-black cursor-pointer transition-all active:scale-95">
                              <Eye className="w-3.5 h-3.5" /> Lihat Surat
                            </button>
                          </div>
                        ) : <span className="text-[#2F578A]/80 dark:text-[#F1F5F9]/50">-</span>}
                      </td>
                      <td className="py-4 pr-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleVerifyLog(log.id, log.studentName)} disabled={log.status === "Hadir"}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 border text-[10px] font-black rounded-xl transition-all cursor-pointer active:scale-95 ${log.status === "Hadir" ? "bg-emerald-50/55 dark:bg-emerald-950/20 text-emerald-500 border-emerald-100/20 cursor-not-allowed opacity-70" : "bg-emerald-50 hover:bg-emerald-600 dark:bg-emerald-950/30 hover:text-white text-emerald-600 dark:text-emerald-400 border-emerald-200/40"}`}
                          >
                            <Check className="w-3.5 h-3.5" /> Setujui
                          </button>
                          <button onClick={() => handleDeleteLog(log.id, log.studentName)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/30 hover:text-white text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/30 rounded-xl text-[10px] font-black transition-all cursor-pointer active:scale-95"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
