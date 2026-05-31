"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Clock, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Upload, 
  Plus, 
  Check, 
  RefreshCw,
  Eye,
  Sparkles,
  Paperclip,
  Activity,
  Award,
  Loader2,
  Trash2,
  CheckSquare,
  ChevronRight,
  XCircle
} from "lucide-react";
import { studentsData } from "../data-mahasiswa/studentsData";
import { useMentorActivities } from "../../../../modules/kegiatan/hooks";

export interface ActivityLog {
  id: number;
  studentId: number;
  activityName: string;
  category: "Software Engineering" | "UI/UX Design" | "Data Analytics" | "Business Development" | "Administration";
  year: string;
  month: string;
  day: string;
  status: "Disetujui" | "Dalam Review";
  attachment: string | null;
}

export default function MentorActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  
  // States for live uploads
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showToast, setShowToast] = useState("");

  // States for viewing activity task file modal
  const [viewingActivityFile, setViewingActivityFile] = useState<{ studentName: string; activityName: string; attachmentName: string } | null>(null);

  const handleViewActivityFile = (studentName: string, activityName: string, attachmentName: string) => {
    setViewingActivityFile({ studentName, activityName, attachmentName });
  };

  // Real backend activities hook
  const { activities, isLoading, approveActivity, rejectActivity } = useMentorActivities();

  // Map activities to actual student profile info
  const enrichedActivities = useMemo(() => {
    return activities.map(act => {
      const student = studentsData.find(s => String(s.id) === String(act.studentId));
      return {
        ...act,
        studentName: student ? student.name : "Mahasiswa Tidak Dikenal",
        studentNim: student ? student.nim : "-",
        studentAvatar: student ? student.avatarColor : "from-slate-400 to-slate-500",
        studentUniv: student ? student.university : "-"
      };
    });
  }, [activities]);

  // Filter logs based on search and status select
  const filteredActivities = useMemo(() => {
    return enrichedActivities.filter(act => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        q === "" ||
        act.studentName.toLowerCase().includes(q) ||
        act.studentNim.includes(q) ||
        act.activityName.toLowerCase().includes(q) ||
        act.studentUniv.toLowerCase().includes(q) ||
        act.category.toLowerCase().includes(q);

      const matchesCategory = categoryFilter === "Semua" || act.category === categoryFilter;
      const matchesStatus = statusFilter === "Semua" || act.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [enrichedActivities, searchQuery, categoryFilter, statusFilter]);

  // Calculate live stats
  const stats = useMemo(() => {
    const total = enrichedActivities.length;
    const approved = enrichedActivities.filter(a => a.status === "Disetujui").length;
    const pending = enrichedActivities.filter(a => a.status === "Dalam Review").length;
    const ratio = total > 0 ? ((approved / total) * 100).toFixed(1) : "0.0";
    return { total, approved, pending, ratio };
  }, [enrichedActivities]);

  // Real Edit: Ceklis (Verify/Approve Activity)
  const handleCeklisActivity = async (actId: any, studentName: string) => {
    try {
      await approveActivity(Number(actId));
      setShowToast(`Kegiatan mahasiswa ${studentName} berhasil disetujui (ceklis)!`);
      setTimeout(() => setShowToast(""), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal menyetujui kegiatan.");
    }
  };

  // Real Edit: Hapus (Delete Activity row)
  const handleHapusActivity = async (actId: any, studentName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus log kegiatan dari ${studentName}?`)) {
      try {
        await rejectActivity(Number(actId));
        setShowToast(`Log kegiatan ${studentName} berhasil dihapus dari sistem.`);
        setTimeout(() => setShowToast(""), 4000);
      } catch (err: any) {
        alert(err.message || "Gagal menghapus kegiatan.");
      }
    }
  };

  return (
    <div className="space-y-6 relative">

      {/* PREVIEW ACTIVITY TASK MODAL */}
      {viewingActivityFile !== null && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-55 flex items-center justify-center p-4" onClick={() => setViewingActivityFile(null)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#070e24] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-float relative overflow-hidden"
          >
            {/* Background design elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/30 text-indigo-600 rounded-xl">
                  <Activity className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    Berkas Tugas Kegiatan
                  </h4>
                  <p className="text-[10px] text-slate-455 dark:text-slate-500 font-semibold mt-0.5">
                    Mahasiswa: {viewingActivityFile.studentName}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setViewingActivityFile(null)}
                className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
              >
                <XCircle className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Task Document Preview Frame Mock */}
            <div className="border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-6 shadow-sm font-sans text-slate-800 dark:text-slate-200 relative min-h-[220px] flex flex-col justify-between">
              
              {/* Document Header */}
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-md">
                      Laporan Pekerjaan
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold font-mono">
                      {viewingActivityFile.attachmentName}
                    </span>
                  </div>
                  <h5 className="font-extrabold text-xs text-slate-900 dark:text-white mt-2 leading-snug">
                    {viewingActivityFile.activityName}
                  </h5>
                </div>

                {/* Simulated Document content */}
                <div className="text-[10px] space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  <p>
                    Berikut merupakan hasil rangkuman, implementasi, dan pengujian teknis yang telah dikerjakan untuk target minggu ini. Pekerjaan mencakup konfigurasi lingkungan kerja, analisis dependensi, penyusunan rancangan logika program, penanganan kasus kegagalan transaksi, hingga integrasi backend dengan antarmuka klien.
                  </p>
                  <p className="bg-slate-50 dark:bg-slate-950/40 p-3 border border-slate-150/45 dark:border-slate-850 rounded-xl font-mono text-[9px] text-slate-500 dark:text-slate-450 whitespace-pre-wrap leading-normal">
                    {"// Hasil Pengujian Log & Verifikasi Berkas"}
                    Status: Sukses Kompilasi
                    Checksum MD5: 9a8f7b6c5d4e3f2a1b0c9d8e7f6a5b4c
                    Uji Beban (Stres-Test): 150 requests/sec, latency &lt; 85ms
                  </p>
                  <p>
                    Lampiran berkas digital lengkap berupa dokumentasi PDF, diagram relasional, atau arsip kode sumber (`zip/tf/docx`) telah terenkripsi dan disimpan di server repositori kampus manajemen magang utama.
                  </p>
                </div>
              </div>

              {/* Document Sign and Stamp */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800 mt-2 text-[9px]">
                <div className="text-slate-400 dark:text-slate-500">
                  ID Kegiatan Ref: ACT-00{activities.findIndex(a => a.activityName === viewingActivityFile.activityName) + 1}
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-slate-800 dark:text-slate-200">{viewingActivityFile.studentName}</p>
                  <p className="text-[8px] text-slate-400 dark:text-slate-500">Pelaksana Program Magang</p>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 text-xs">
              <button
                onClick={() => setViewingActivityFile(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Selesai Membaca
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
            Log Kegiatan & Laporan Mahasiswa
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Validasi pekerjaan harian mahasiswa bimbingan Anda, kelola lampiran file, dan lakukan tindakan persetujuan atau penghapusan log.
          </p>
        </div>
        
        {/* Reset stats button */}
        <button 
          onClick={() => {
            setSearchQuery("");
            setCategoryFilter("Semua");
            setStatusFilter("Semua");
          }}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#070e24]/40 transition-all cursor-pointer active:scale-95 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Filter
        </button>
      </div>

      {/* ACTIVITY STATISTICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Kegiatan", value: stats.total, desc: "Tercatat Minggu Ini", icon: Activity, color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/50 dark:border-indigo-900/40" },
          { label: "Disetujui Mentor", value: stats.approved, desc: "Ceklis Validasi", icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40" },
          { label: "Perlu Tinjauan", value: stats.pending, desc: "Menunggu Approval", icon: Clock, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-900/40" },
          { label: "Rasio Validasi", value: `${stats.ratio}%`, desc: "Persetujuan Log", icon: Award, color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border-sky-200/50 dark:border-sky-900/40" }
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className={`p-4 rounded-2xl border ${item.color} flex justify-between items-start shadow-sm`}>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-85 block">{item.label}</span>
                <div className="flex items-baseline mt-2">
                  <span className="text-2xl font-black tracking-tight">{item.value}</span>
                </div>
                <span className="text-[10px] font-semibold opacity-75 block pt-1.5">{item.desc}</span>
              </div>
              <div className="p-2 bg-white/40 dark:bg-black/20 rounded-xl">
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTER & SEARCH PANEL */}
      <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Panel Penyaringan Laporan Kegiatan</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Keyword Search */}
          <div className="md:col-span-6">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block mb-1.5">
              Cari Berdasarkan Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama mahasiswa, NIM, nama kegiatan, atau universitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block mb-1.5">
              Kategori Kegiatan
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Data Analytics">Data Analytics</option>
              <option value="Business Development">Business Development</option>
              <option value="Administration">Administration</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block mb-1.5">
              Status Validasi
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300"
            >
              <option value="Semua">Semua Status</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Dalam Review">Dalam Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* MAIN DATA TABLE */}
      <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#070e24]/40 flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">
                <th className="pb-3.5 pl-4 font-bold">No.</th>
                <th className="pb-3.5 font-bold">Nama</th>
                <th className="pb-3.5 font-bold">ID Mahasiswa</th>
                <th className="pb-3.5 font-bold">Nama Kegiatan</th>
                <th className="pb-3.5 font-bold">Waktu</th>
                <th className="pb-3.5 font-bold text-center">File Kegiatan</th>
                <th className="pb-3.5 font-bold text-center">AKSI</th>
                <th className="pb-3.5 pr-4 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="max-w-md mx-auto space-y-2">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
                      <p className="text-slate-400 dark:text-slate-550 font-extrabold text-xs">
                        Memuat Laporan Kegiatan...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredActivities.map((act, index) => (
                <tr key={act.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors group">
                  
                  {/* Column 1: No. */}
                  <td className="py-4 pl-4 font-bold text-slate-550 dark:text-slate-450">
                    {index + 1}
                  </td>

                  {/* Column 2: Nama (Interactive click to detail) */}
                  <td className="py-4">
                    <Link href={`/dashboard/mentor/data-kegiatan/${act.id}`} className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${act.studentAvatar} text-white font-extrabold flex items-center justify-center text-xs shadow-inner shadow-indigo-500/10 group-hover:scale-105 transition-transform`}>
                        {act.studentName.split(" ").map(n=>n[0]).join("").substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                          {act.studentName}
                        </p>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mt-0.5">
                          {act.studentUniv}
                        </span>
                      </div>
                    </Link>
                  </td>
 
                  {/* Column 3: ID Mahasiswa (NIM) */}
                  <td className="py-4 font-bold text-slate-700 dark:text-slate-300">
                    <Link href={`/dashboard/mentor/data-kegiatan/${act.id}`} className="block w-full py-1">
                      {act.studentNim}
                    </Link>
                  </td>
 
                  {/* Column 4: Nama Kegiatan */}
                  <td className="py-4 max-w-[240px]">
                    <Link href={`/dashboard/mentor/data-kegiatan/${act.id}`} className="block space-y-1">
                      <p className="font-bold text-slate-800 dark:text-slate-200 leading-normal hover:text-indigo-600 dark:hover:text-indigo-400">
                        {act.activityName}
                      </p>
                      <span className="inline-block text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {act.category}
                      </span >
                    </Link>
                  </td>
 
                  {/* Column 5: Waktu */}
                  <td className="py-4 text-slate-600 dark:text-slate-400 font-bold">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Thn: {act.year}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold pl-5">
                        Bln: {act.month} • Hari: {act.day}
                      </p>
                    </div>
                  </td>                  {/* Column 6: File Kegiatan (melihat tugas yang di upload mahasiswa) */}
                  <td className="py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center">
                      {act.attachment ? (
                        <button
                          onClick={() => handleViewActivityFile(act.studentName, act.activityName, act.attachment || "tugas_kegiatan.pdf")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 dark:bg-indigo-950/40 hover:text-white dark:hover:bg-indigo-950 text-indigo-650 dark:text-indigo-400 border border-indigo-200/30 dark:border-indigo-900/30 rounded-xl font-bold transition-all text-[10px] hover:scale-[1.02] active:scale-95 shadow-sm cursor-pointer"
                          title="Lihat Tugas Mahasiswa"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="max-w-[110px] truncate">{act.attachment}</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-500 px-2 py-1 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/20 rounded-lg">
                          <AlertCircle className="w-3 h-3" />
                          Belum Diunggah
                        </span>
                      )}
                    </div>
                  </td>
 
                  {/* Column 7: AKSI */}
                  <td className="py-4 text-center">
                    <div className="inline-flex items-center justify-center gap-1.5">
                      {/* Check / Approve Button */}
                      <button
                        onClick={() => handleCeklisActivity(act.id, act.studentName)}
                        disabled={act.status === "Disetujui"}
                        className={`p-1.5 border rounded-xl transition-all cursor-pointer ${
                          act.status === "Disetujui"
                            ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-500 border-emerald-200/40 dark:border-emerald-900/40 opacity-70 cursor-not-allowed"
                            : "bg-white hover:bg-emerald-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 hover:scale-105 active:scale-95 shadow-sm"
                        }`}
                        title={act.status === "Disetujui" ? "Sudah disetujui" : "Setujui Kegiatan (Ceklis)"}
                      >
                        <Check className="w-4 h-4 font-bold" />
                      </button>
 
                      {/* Trash / Delete Button */}
                      <button
                        onClick={() => handleHapusActivity(act.id, act.studentName)}
                        className="p-1.5 bg-white hover:bg-rose-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                        title="Hapus Log Kegiatan (Hapus)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
 
                  {/* Column 8: Status */}
                  <td className="py-4 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${
                        act.status === "Disetujui"
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40"
                          : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/40 animate-pulse"
                      }`}>
                        {act.status}
                      </span>
                      
                      {/* Arrow link indicator */}
                      <Link href={`/dashboard/mentor/data-kegiatan/${act.id}`} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors ml-1">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
 
                </tr>
              ))}
 
              {filteredActivities.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="max-w-md mx-auto space-y-2">
                      <AlertCircle className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
                      <p className="text-slate-400 dark:text-slate-500 font-extrabold text-xs">
                        Tidak ada log kegiatan yang cocok
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] leading-relaxed">
                        Coba sesuaikan pencarian Anda atau reset filter untuk kembali menampilkan seluruh data log.
                      </p>
                      <button 
                        onClick={() => { setSearchQuery(""); setCategoryFilter("Semua"); setStatusFilter("Semua"); }}
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
          <strong>Petunjuk Penggunaan Verifikasi Kegiatan:</strong> Gunakan tombol tindakan pada kolom <strong>AKSI</strong> untuk memverifikasi kesesuaian tugas mahasiswa bimbingan secara cepat tanpa membuka detail, atau menolak log kegiatan yang tidak sesuai dengan kurikulum magang akademik.
        </div>
      </div>

    </div>
  );
}
