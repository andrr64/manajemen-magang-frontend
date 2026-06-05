"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download, 
  FileSpreadsheet, 
  UserCheck, 
  Coffee,
  Check,
  RefreshCw,
  Eye,
  Trash2
} from "lucide-react";
import { studentsData } from "../data-mahasiswa/studentsData";
import { useAttendance } from "@/modules/absensi/hooks";
import { absensiAPI } from "@/modules/absensi/api";

interface AttendanceLog {
  id: string | number;
  studentId?: string | number;
  date: string;
  checkIn: string;
  checkOut: string;
  duration?: string;
  location?: string;
  type: "Hadir" | "Izin" | "Sakit" | "Alpha";
  status: "Diverifikasi" | "Menunggu" | "Ditolak";
  notes?: string;
}

export default function MentorAttendancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [showToast, setShowToast] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // States for viewing leave document modal
  const [viewingLeaveDoc, setViewingLeaveDoc] = useState<{ studentName: string; type: "Sakit" | "Izin"; notes: string; documentUrl?: string | null } | null>(null);

  const handleViewDocument = (studentName: string, type: "Sakit" | "Izin", notes: string, documentUrl?: string | null) => {
    setViewingLeaveDoc({ studentName, type, notes, documentUrl });
  };

  // Real React Hook Integration
  const { history: attendanceLogs, isLoading, verify, deleteLog, refreshHistory } = useAttendance();

  // Reactive Effect to fetch logs from API whenever filters change
  useEffect(() => {
    refreshHistory(statusFilter, searchQuery);
  }, [statusFilter, searchQuery, refreshHistory]);

  // Map attendance logs to actual student profile info
  const enrichedLogs = useMemo(() => {
    return attendanceLogs.map(log => {
      const studentIdNum = log.studentId ? parseInt(log.studentId.toString(), 10) : 0;
      const student = studentsData.find(s => s.id === studentIdNum || s.id === log.studentId);
      
      // Calculate presence status matching rendering expectations ("Hadir" | "Belum Check-Out" | "Sakit" | "Izin" | "Alfa")
      let status: "Hadir" | "Belum Check-Out" | "Sakit" | "Izin" | "Alfa" = "Hadir";
      if (log.type === "Hadir") {
        status = log.checkOut === "Pending" ? "Belum Check-Out" : "Hadir";
      } else if (log.type === "Izin") {
        status = "Izin";
      } else if (log.type === "Sakit") {
        status = "Sakit";
      } else if (log.type === "Alpha") {
        status = "Alfa";
      }

      return {
        ...log,
        studentName: log.studentName || (student ? student.name : "Mahasiswa Tidak Dikenal"),
        studentNim: log.studentNim || (student ? student.nim : "-"),
        studentAvatar: student ? student.avatarColor : "from-slate-400 to-slate-500",
        studentUniv: student ? student.university : "-",
        location: student ? `${student.company} (On-site)` : "Kantor Mitra",
        status
      };
    });
  }, [attendanceLogs]);

  // Filter logs based on search and status select
  const filteredLogs = enrichedLogs.filter(log => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      q === "" ||
      log.studentName.toLowerCase().includes(q) ||
      log.studentNim.toLowerCase().includes(q) ||
      log.studentUniv.toLowerCase().includes(q) ||
      log.location.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "Semua" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate live stats reactively
  const stats = useMemo(() => {
    const total = enrichedLogs.length;
    const present = enrichedLogs.filter(l => l.status === "Hadir").length;
    const pendingCheckout = enrichedLogs.filter(l => l.status === "Belum Check-Out").length;
    const off = enrichedLogs.filter(l => l.status === "Sakit" || l.status === "Izin").length;
    const rate = total > 0 ? ((present + off) / total) * 100 : 0;
    return { total, present, pendingCheckout, off, rate: rate.toFixed(1) };
  }, [enrichedLogs]);

  // Real action handlers delegating to the custom hook
  const handleDeleteLog = async (logId: string | number, studentName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus catatan absensi untuk ${studentName}?`)) {
      try {
        await deleteLog(logId);
        setShowToast(`Absensi ${studentName} berhasil dihapus.`);
        setTimeout(() => setShowToast(""), 4000);
      } catch (err: any) {
        alert(err.message || "Gagal menghapus catatan absensi.");
      }
    }
  };

  const handleVerifyLog = async (logId: string | number, studentName: string) => {
    try {
      await verify(logId, "Diverifikasi");
      setShowToast(`Status absensi ${studentName} berhasil disetujui!`);
      setTimeout(() => setShowToast(""), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal menyetujui absensi.");
    }
  };

  // Real CSV spreadsheet export handler with dynamic download triggers
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await absensiAPI.exportAbsensi(statusFilter, searchQuery);
      const csvContent = response.data;
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;\ufeff" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rekap-absensi.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setShowToast("Laporan absensi bulanan berhasil diekspor ke Excel!");
      setTimeout(() => setShowToast(""), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal mengekspor laporan absensi.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 relative">

      {/* PREVIEW LEAVE DOCUMENT MODAL */}
      {viewingLeaveDoc !== null && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-55 flex items-center justify-center p-4" onClick={() => setViewingLeaveDoc(null)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#070e24] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-float relative overflow-hidden"
          >
            {/* Background design elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${
                  viewingLeaveDoc.type === "Sakit" 
                    ? "bg-sky-50 dark:bg-sky-950/40 border border-sky-200/30 text-sky-600"
                    : "bg-blue-50 dark:bg-blue-950/40 border border-blue-200/30 text-blue-600"
                }`}>
                  <FileSpreadsheet className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    Surat Keterangan {viewingLeaveDoc.type}
                  </h4>
                  <p className="text-[10px] text-slate-455 dark:text-slate-500 font-semibold mt-0.5">
                    Mahasiswa: {viewingLeaveDoc.studentName}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setViewingLeaveDoc(null)}
                className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
              >
                <XCircle className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Document Preview Frame Mock */}
            <div className="border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 md:p-6 shadow-inner font-serif text-slate-800 dark:text-slate-200 relative min-h-[220px] flex flex-col justify-between">
              
              {/* Seal/Stamp design */}
              <div className="absolute top-4 right-4 opacity-10 dark:opacity-5 flex flex-col items-center select-none pointer-events-none">
                <div className="w-20 h-20 rounded-full border-4 border-indigo-500 flex items-center justify-center font-bold text-[8px] uppercase tracking-widest text-center rotate-12">
                  Klinik Medis Pratama
                </div>
              </div>

              {/* Document Header Info */}
              <div className="space-y-4">
                <div className="text-center pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h5 className="font-black text-xs uppercase tracking-wide">
                    {viewingLeaveDoc.type === "Sakit" ? "SURAT KETERANGAN DOKTER" : "SURAT PERNYATAAN IZIN MAHASISWA"}
                  </h5>
                  <p className="text-[8px] font-sans text-slate-450 dark:text-slate-500 font-bold mt-0.5">
                    No. Ref: {viewingLeaveDoc.type === "Sakit" ? "SKD/2026/05/9821" : "SPM/2026/05/4402"}
                  </p>
                </div>

                <div className="text-[10px] space-y-2 leading-relaxed">
                  <p>Yang bertanda tangan di bawah ini menerangkan bahwa:</p>
                  <div className="grid grid-cols-3 gap-1 font-sans text-[9px] font-semibold bg-slate-100/50 dark:bg-slate-900/35 p-2 rounded-lg">
                    <span className="text-slate-400 dark:text-slate-500">Nama Mahasiswa</span>
                    <span className="col-span-2">: {viewingLeaveDoc.studentName}</span>
                    <span className="text-slate-400 dark:text-slate-500">Keterangan</span>
                    <span className="col-span-2">: {viewingLeaveDoc.type === "Sakit" ? "Sakit / Tidak Fit" : "Izin Keperluan Keadaan Darurat"}</span>
                    <span className="text-slate-400 dark:text-slate-500">Alasan Tertulis</span>
                    <span className="col-span-2 text-indigo-600 dark:text-indigo-400 font-bold">: &quot;{viewingLeaveDoc.notes}&quot;</span>
                  </div>
                  <p>
                    Diberikan surat keterangan ini untuk dapat dipergunakan sebagaimana mestinya guna pemenuhan perizinan kegiatan program magang industri (MBKM).
                  </p>
                </div>
              </div>

              {/* Document Footer Signature */}
              <div className="flex justify-end pt-4 font-sans text-[9px] border-t border-slate-200/55 dark:border-slate-800/40">
                <div className="text-right space-y-7">
                  <p className="text-[8px] text-slate-450 dark:text-slate-500 font-bold">Jakarta, 28 Mei 2026</p>
                  <div>
                    <p className="font-extrabold text-slate-850 dark:text-slate-100">
                      {viewingLeaveDoc.type === "Sakit" ? "Dr. H. Hermawan, Sp.PD" : viewingLeaveDoc.studentName}
                    </p>
                    <p className="text-[8px] text-slate-400 dark:text-slate-500">
                      {viewingLeaveDoc.type === "Sakit" ? "NIP. 19820412 201012 1 002" : "Mahasiswa Bersangkutan"}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 text-xs">
              {viewingLeaveDoc.documentUrl && (
                <a
                  href={viewingLeaveDoc.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-extrabold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Buka Lampiran Asli
                </a>
              )}
              <button
                onClick={() => setViewingLeaveDoc(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Selesai Meninjau
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FLOAT SUCCESS TOAST */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-2xl shadow-xl flex items-center gap-3 animate-float max-w-sm">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs font-bold leading-normal">{showToast}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Monitoring Absensi Harian Mahasiswa
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Pantau kehadiran real-time, waktu check-in/out, durasi kerja, dan koordinat GPS penempatan magang mahasiswa.
          </p>
        </div>

        {/* Export Button */}
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-500/70 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer active:scale-95 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20"
        >
          {isExporting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Mengekspor Laporan...
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              Ekspor Rekap Absensi
            </>
          )}
        </button>
      </div>

      {/* ATTENDANCE ANALYTICS METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Hadir Hari Ini", value: stats.present, suffix: `/${stats.total}`, desc: "Mahasiswa On-Duty", icon: UserCheck, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40" },
          { label: "Belum Check-Out", value: stats.pendingCheckout, suffix: `/${stats.total}`, desc: "Batas Waktu: 17:00", icon: Clock, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-900/40" },
          { label: "Sakit / Izin", value: stats.off, suffix: `/${stats.total}`, desc: "Dengan Dokumen Sah", icon: Coffee, color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-900/40" }
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className={`p-4 rounded-2xl border ${item.color} flex justify-between items-start shadow-sm`}>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-85 block">{item.label}</span>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-2xl font-black tracking-tight">{item.value}</span>
                  <span className="text-xs font-bold opacity-75">{item.suffix}</span>
                </div>
                <span className="text-[10px] font-semibold opacity-75 block pt-1">{item.desc}</span>
              </div>
              <div className="p-2 bg-white/40 dark:bg-black/20 rounded-xl">
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTER PANEL */}
      <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Kehadiran Hari Ini: <span className="text-indigo-600 dark:text-indigo-400 font-black">Kamis, 28 Mei 2026</span>
          </h4>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
            <span>Filter Presensi:</span>
            <div className="flex gap-1">
              {["Semua", "Hadir", "Sakit", "Izin", "Alfa"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg border text-[10px] uppercase tracking-wide transition-all cursor-pointer ${
                    statusFilter === status
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {status === "Semua" ? "Semua Status" : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama mahasiswa, NIM, universitas, atau lokasi penempatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* ATTENDANCE DATA TABLE */}
      <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#070e24]/40 flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">
                <th className="pb-3.5 pl-4 font-bold">Mahasiswa</th>
                <th className="pb-3.5 font-bold">NIM / Kampus</th>
                <th className="pb-3.5 font-bold">Status Absen</th>
                <th className="pb-3.5 font-bold">Keterangan Surat</th>
                <th className="pb-3.5 pr-4 font-bold text-right">Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
                      <span className="text-xs font-bold">Memuat data absensi harian...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors group">
                  
                  {/* Student Name */}
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${log.studentAvatar} text-white font-extrabold flex items-center justify-center text-xs shadow-inner shadow-indigo-500/10`}>
                        {log.studentName.split(" ").map(n=>n[0]).join("").substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white leading-tight">
                          {log.studentName}
                        </p>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mt-0.5">
                          {log.date}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* NIM / University */}
                  <td className="py-4 font-bold text-slate-700 dark:text-slate-300">
                    <p>{log.studentNim}</p>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block mt-0.5 truncate max-w-[150px]">
                      {log.studentUniv}
                    </span>
                  </td>





                  {/* Status Badge */}
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${
                      log.status === "Hadir"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40"
                        : log.status === "Belum Check-Out"
                          ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/40"
                          : log.status === "Izin"
                            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/40"
                            : log.status === "Sakit"
                              ? "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200/50 dark:border-sky-900/40"
                              : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/40"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        log.status === "Hadir" 
                          ? "bg-emerald-500" 
                          : log.status === "Belum Check-Out"
                            ? "bg-amber-500"
                            : log.status === "Izin"
                              ? "bg-blue-500"
                              : log.status === "Sakit"
                                ? "bg-sky-500"
                                : "bg-rose-500"
                      }`} />
                      {log.status}
                    </span>
                  </td>

                  {/* Column: Keterangan Surat Izin/Sakit */}
                  <td className="py-4 text-slate-650 dark:text-slate-400 font-semibold" onClick={(e) => e.stopPropagation()}>
                    {(log.status === "Sakit" || log.status === "Izin") ? (
                      <div className="flex flex-col gap-1.5 max-w-[200px]">
                        <span className="text-[10px] leading-tight text-slate-600 dark:text-slate-450 truncate font-bold" title={log.notes}>
                          {log.notes || "Tidak ada keterangan tambahan."}
                        </span>
                        <button
                          onClick={() => handleViewDocument(log.studentName, log.status as "Sakit" | "Izin", log.notes || "", log.document || null)}
                          className="inline-flex items-center gap-1 w-max px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 dark:bg-indigo-950/40 hover:text-white dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/30 dark:border-indigo-900/30 rounded-xl text-[9px] font-black cursor-pointer transition-all active:scale-95 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Lihat Surat
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-normal">-</span>
                    )}
                  </td>

                  {/* Aksi Verifikasi Absensi Manual (Attachment Setujui & Hapus) */}
                  <td className="py-4 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleVerifyLog(log.id, log.studentName)}
                        disabled={log.status === "Hadir"}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 border text-[10px] font-black rounded-xl transition-all cursor-pointer hover:scale-[1.02] active:scale-95 shadow-sm ${
                          log.status === "Hadir"
                            ? "bg-emerald-50/55 dark:bg-emerald-950/20 text-emerald-500 border-emerald-100/20 cursor-not-allowed opacity-80"
                            : "bg-emerald-50 hover:bg-emerald-600 dark:bg-emerald-950/30 hover:text-white text-emerald-600 dark:text-emerald-400 border-emerald-200/40 dark:border-emerald-900/30"
                        }`}
                        title="Setujui Absensi"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Setujui</span>
                      </button>

                      <button
                        onClick={() => handleDeleteLog(log.id, log.studentName)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/30 hover:text-white text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/30 rounded-xl text-[10px] font-black transition-all cursor-pointer hover:scale-[1.02] active:scale-95 shadow-sm"
                        title="Hapus Catatan Absensi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <div className="max-w-md mx-auto space-y-2">
                      <AlertCircle className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
                      <p className="text-slate-400 dark:text-slate-500 font-extrabold text-xs">
                        Tidak ada log absensi hari ini yang cocok
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] leading-relaxed">
                        Coba sesuaikan pencarian Anda atau kembalikan filter status ke &quot;Semua Status&quot;.
                      </p>
                      <button 
                        onClick={() => { setSearchQuery(""); setStatusFilter("Semua"); }}
                        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg border border-indigo-200/40 dark:border-indigo-900/40 hover:bg-indigo-100 transition-all cursor-pointer mt-1"
                      >
                        Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* GEOLOCATION NOTES */}
      <div className="p-4 bg-slate-50 dark:bg-[#070e24]/40 border border-slate-200/40 dark:border-slate-800/80 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
          <strong>Catatan Sistem Geolocation:</strong> Setiap check-in absensi divalidasi silang menggunakan koordinat GPS (batas toleransi 100m dari kantor koordinat mitra magang) dan otentikasi wajah biometrik. Ketidakhadiran di luar area resmi magang ditandai sebagai Alfa secara otomatis oleh sistem pada pukul 09:00 WIB kecuali melampirkan izin surat resmi yang disetujui Dosen Pembimbing.
        </div>
      </div>

    </div>
  );
}
