"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Check,
  RefreshCw,
  Eye,
  Sparkles,
  Activity,
  Trash2,
  ChevronRight,
  XCircle
} from "lucide-react";
import { useMentorActivities } from "../../../../modules/data_kegiatan/hooks";
import { useStudents } from "../../../../modules/data_mahasiswa/hooks";
import { DataTable } from "@/components/ui/data-table";

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
  const [statusFilter, setStatusFilter] = useState("Semua");

  const [showToast, setShowToast] = useState("");
  const [viewingActivityFile, setViewingActivityFile] = useState<{ studentName: string; activityName: string; attachmentName: string } | null>(null);

  const handleViewActivityFile = (studentName: string, activityName: string, attachmentName: string) => {
    setViewingActivityFile({ studentName, activityName, attachmentName });
  };

  const { activities, isLoading, approveActivity, rejectActivity } = useMentorActivities();
  const { rawStudents } = useStudents();
  const studentsList = rawStudents;

  const enrichedActivities = useMemo(() => {
    return activities?.map(act => {
      const student = studentsList.find(s => String(s.id) === String(act.studentId));
      return {
        ...act,
        studentName: student ? student.name : "Mahasiswa Tidak Dikenal",
        studentNim: student ? student.nim : "-",
        studentAvatar: student ? student.avatarColor : "from-slate-400 to-slate-500",
        studentUniv: student ? student.university : "-"
      };
    });
  }, [activities, studentsList]);

  const filteredActivities = useMemo(() => {
    return enrichedActivities.filter(act => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        act.studentName.toLowerCase().includes(q) ||
        act.studentNim.includes(q) ||
        act.activityName.toLowerCase().includes(q) ||
        act.studentUniv.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "Semua" || act.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enrichedActivities, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = enrichedActivities.length;
    const approved = enrichedActivities.filter(a => a.status === "Disetujui").length;
    const pending = enrichedActivities.filter(a => a.status === "Dalam Review").length;
    const ratio = total > 0 ? ((approved / total) * 100).toFixed(1) : "0.0";
    return { total, approved, pending, ratio };
  }, [enrichedActivities]);

  const handleCeklisActivity = async (actId: any, studentName: string) => {
    try {
      await approveActivity(Number(actId));
      setShowToast(`Kegiatan mahasiswa ${studentName} berhasil disetujui (ceklis)!`);
      setTimeout(() => setShowToast(""), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal menyetujui kegiatan.");
    }
  };

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
            className="bg-white dark:bg-[#121358] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-float relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#F1F5F9]0/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#2F578A]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#F8FAFC] dark:bg-[#232F72] border border-[#2F578A]/30 text-[#232F72] dark:text-[#FFFFFF] rounded-xl">
                  <Activity className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#232F72] dark:text-[#FFFFFF] leading-tight">
                    Berkas Tugas Kegiatan
                  </h4>
                  <p className="text-[10px] text-slate-455 dark:text-slate-500 font-semibold mt-0.5">
                    Mahasiswa: {viewingActivityFile.studentName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingActivityFile(null)}
                className="p-1.5 hover:bg-[#F8FAFC] dark:hover:bg-[#121358] rounded-xl text-[#2F578A]/80 dark:text-[#F1F5F9]/50 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
              >
                <XCircle className="w-5.5 h-5.5" />
              </button>
            </div>

            <div className="border border-[#2F578A]/30 dark:border-[#2F578A] bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-6 shadow-sm font-sans text-[#232F72] dark:text-[#F1F5F9] relative min-h-[220px] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-[#2F578A]">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-[#F8FAFC] dark:bg-[#232F72] text-[#232F72] dark:text-[#FFFFFF] rounded-md">
                      Laporan Pekerjaan
                    </span>
                    <span className="text-[9px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-bold font-mono">
                      {viewingActivityFile.attachmentName}
                    </span>
                  </div>
                  <h5 className="font-extrabold text-xs text-[#232F72] dark:text-[#FFFFFF] mt-2 leading-snug">
                    {viewingActivityFile.activityName}
                  </h5>
                </div>

                <div className="text-[10px] space-y-3 text-[#2F578A] dark:text-[#F1F5F9]/80 leading-relaxed font-normal">
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

              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-[#2F578A] mt-2 text-[9px]">
                <div className="text-[#2F578A]/80 dark:text-[#F1F5F9]/50">
                  ID Kegiatan Ref: ACT-00{activities.findIndex(a => a.activityName === viewingActivityFile.activityName) + 1}
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-[#232F72] dark:text-[#F1F5F9]">{viewingActivityFile.studentName}</p>
                  <p className="text-[8px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50">Pelaksana Program Magang</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 text-xs">
              <button
                onClick={() => setViewingActivityFile(null)}
                className="px-5 py-2 bg-[#232F72] dark:bg-[#232F72] hover:brightness-110 shadow-md text-white font-extrabold rounded-xl active:scale-95 transition-all cursor-pointer"
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
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#232F72] dark:text-[#FFFFFF]">
            Log Kegiatan & Laporan Mahasiswa
          </h3>
          <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold mt-1">
            Validasi pekerjaan harian mahasiswa bimbingan Anda, kelola lampiran file, dan lakukan tindakan persetujuan atau penghapusan log.
          </p>
        </div>
        <button
          onClick={() => { setSearchQuery(""); setStatusFilter("Semua"); }}
          className="flex items-center gap-1.5 px-4 py-2 border border-[#2F578A]/50 dark:border-[#2F578A] hover:border-[#232F72] rounded-xl text-xs font-bold text-[#232F72]/80 dark:text-[#F1F5F9] bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md transition-all cursor-pointer active:scale-95 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Filter
        </button>
      </div>

      {/* ACTIVITY STATISTICS */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Kegiatan", value: stats.total, desc: "Tercatat Minggu Ini", icon: Activity, color: "text-[#232F72] dark:text-[#FFFFFF] bg-[#F8FAFC] dark:bg-[#232F72] border-[#2F578A]/30" },
          { label: "Disetujui Mentor", value: stats.approved, desc: "Ceklis Validasi", icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40" },
          { label: "Perlu Tinjauan", value: stats.pending, desc: "Menunggu Approval", icon: Clock, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-900/40" }
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
      <div className="glass-card border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#232F72] dark:text-[#FFFFFF]" />
          <h4 className="font-extrabold text-sm text-[#232F72] dark:text-[#FFFFFF]">Panel Penyaringan Laporan Kegiatan</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-9">
            <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mb-1.5">
              Cari Berdasarkan Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama mahasiswa, NIM, nama kegiatan, atau universitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
              />
              <Search className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-3.5 top-3" />
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mb-1.5">
              Status Validasi
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#232F72] text-[#232F72]/80 dark:text-[#F1F5F9]"
            >
              <option value="Semua">Semua Status</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Dalam Review">Dalam Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* MAIN DATA TABLE */}
      <DataTable
        data={filteredActivities ?? []}
        loading={isLoading}
        emptyMessage="Tidak ada log kegiatan yang cocok. Coba reset filter."
        className="rounded-3xl"
        columns={[
          {
            key: "no",
            label: "No.",
            render: (_, idx) => (
              <span className="font-bold text-slate-500 dark:text-slate-400">{idx + 1}</span>
            ),
          },
          {
            key: "nama",
            label: "Nama",
            render: (act) => (
              <Link href={`/dashboard/mentor/data-kegiatan/${act.id}`} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${act.studentAvatar} text-white font-extrabold flex items-center justify-center text-xs shadow-inner shadow-[#232F72]/10 group-hover:scale-105 transition-transform`}>
                  {(act?.studentName || "U").split(" ").map(n => n[0]).join("").substring(0, 2)}
                </div>
                <div>
                  <p className="font-extrabold text-[#232F72] dark:text-[#FFFFFF] leading-tight">
                    {act.studentName}
                  </p>
                  <span className="text-[10px] font-bold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mt-0.5">
                    {act.studentUniv}
                  </span>
                </div>
              </Link>
            ),
          },
          {
            key: "nim",
            label: "ID Mahasiswa",
            render: (act) => (
              <Link href={`/dashboard/mentor/data-kegiatan/${act.id}`} className="font-bold text-[#232F72]/80 dark:text-[#F1F5F9] block py-1">
                {act.studentNim}
              </Link>
            ),
          },
          {
            key: "activityName",
            label: "Nama Kegiatan",
            render: (act) => (
              <Link href={`/dashboard/mentor/data-kegiatan/${act.id}`} className="font-bold text-[#232F72] dark:text-[#F1F5F9] block max-w-[240px]">
                {act.activityName}
              </Link>
            ),
          },
          {
            key: "waktu",
            label: "Waktu",
            render: (act) => (
              <div className="space-y-0.5 text-[#2F578A] dark:text-[#F1F5F9]/80 font-bold">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#232F72] dark:text-[#FFFFFF]" />
                  <span>Thn: {act.year}</span>
                </div>
                <p className="text-[10px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold pl-5">
                  Bln: {act.month} • Hari: {act.day}
                </p>
              </div>
            ),
          },
          {
            key: "attachment",
            label: "File Kegiatan",
            align: "center",
            render: (act) => (
              <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                {act.attachment ? (
                  <button
                    onClick={() => handleViewActivityFile(act.studentName, act.activityName, act.attachment || "tugas_kegiatan.pdf")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#232F72] dark:bg-[#232F72]/40 hover:text-white dark:hover:bg-[#121358] text-[#232F72] dark:text-[#FFFFFF] border border-[#2F578A]/30 rounded-xl font-bold transition-all text-[10px] hover:scale-[1.02] active:scale-95 shadow-sm cursor-pointer"
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
            ),
          },
          {
            key: "aksi",
            label: "AKSI",
            align: "center",
            render: (act) => (
              <div className="inline-flex items-center justify-center gap-1.5">
                <button
                  onClick={() => handleCeklisActivity(act.id, act.studentName)}
                  disabled={act.status === "Disetujui"}
                  className={`p-1.5 border rounded-xl transition-all cursor-pointer ${
                    act.status === "Disetujui"
                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-500 border-emerald-200/40 dark:border-emerald-900/40 opacity-70 cursor-not-allowed"
                      : "bg-white hover:bg-emerald-50 border-[#2F578A]/50 dark:bg-slate-900 dark:border-[#2F578A] text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 hover:scale-105 active:scale-95 shadow-sm"
                  }`}
                  title={act.status === "Disetujui" ? "Sudah disetujui" : "Setujui Kegiatan"}
                >
                  <Check className="w-4 h-4 font-bold" />
                </button>
                <button
                  onClick={() => handleHapusActivity(act.id, act.studentName)}
                  className="p-1.5 bg-white hover:bg-rose-50 border border-[#2F578A]/50 dark:bg-slate-900 dark:border-[#2F578A] text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                  title="Hapus Log Kegiatan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ),
          },
          {
            key: "status",
            label: "Status",
            align: "right",
            render: (act) => (
              <div className="flex items-center justify-end gap-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${
                  act.status === "Disetujui"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40"
                    : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/40 animate-pulse"
                }`}>
                  {act.status}
                </span>
                <Link href={`/dashboard/mentor/data-kegiatan/${act.id}`} className="p-1 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 hover:text-[#232F72] dark:hover:text-[#FFFFFF] transition-colors ml-1">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ),
          },
        ]}
      />

      {/* GEOLOCATION NOTES */}
      <div className="p-4 bg-slate-50 dark:bg-[#121358]/40 dark:backdrop-blur-md border border-[#2F578A]/50/40 dark:border-[#2F578A] rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#232F72] dark:text-[#FFFFFF] flex-shrink-0 mt-0.5" />
        <div className="text-[10px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold leading-relaxed">
          <strong>Petunjuk Penggunaan Verifikasi Kegiatan:</strong> Gunakan tombol tindakan pada kolom <strong>AKSI</strong> untuk memverifikasi kesesuaian tugas mahasiswa bimbingan secara cepat tanpa membuka detail, atau menolak log kegiatan yang tidak sesuai dengan kurikulum magang akademik.
        </div>
      </div>

    </div>
  );
}
