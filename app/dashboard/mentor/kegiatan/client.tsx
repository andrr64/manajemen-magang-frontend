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
  XCircle,
  RotateCcw,
} from "lucide-react";
import { useMentorActivities } from "../../../../modules/data_kegiatan/hooks";
import { useStudents } from "../../../../modules/data_mahasiswa/hooks";
import { DataTable } from "@/components/ui/data-table";
import { SuccessToast, PageHeader, StatsGrid, StatItem } from "@/components/shared";

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
  const [viewingActivityFile, setViewingActivityFile] = useState<{ studentName: string; activityName: string; fileUrls: string[] } | null>(null);

  const { activities, isLoading, approveActivity, revokeActivity, rejectActivity, getFileUrls } = useMentorActivities();
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
      await approveActivity(actId);
      setShowToast(`Kegiatan mahasiswa ${studentName} berhasil disetujui (ceklis)!`);
      setTimeout(() => setShowToast(""), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal menyetujui kegiatan.");
    }
  };

  const handleRevokeActivity = async (actId: any, studentName: string) => {
    if (confirm(`Cabut persetujuan kegiatan ${studentName}? Status akan kembali ke "Menunggu".`)) {
      try {
        await revokeActivity(actId);
        setShowToast(`Persetujuan kegiatan ${studentName} berhasil dicabut.`);
        setTimeout(() => setShowToast(""), 4000);
      } catch (err: any) {
        alert(err.message || "Gagal mencabut persetujuan.");
      }
    }
  };

  const handleHapusActivity = async (actId: any, studentName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus log kegiatan dari ${studentName}?`)) {
      try {
        await rejectActivity(actId);
        setShowToast(`Log kegiatan ${studentName} berhasil dihapus dari sistem.`);
        setTimeout(() => setShowToast(""), 4000);
      } catch (err: any) {
        alert(err.message || "Gagal menghapus kegiatan.");
      }
    }
  };

  return (
    <div className="space-y-6 relative">

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
                  <p className="text-[10px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold mt-0.5">{viewingActivityFile.studentName} · {viewingActivityFile.activityName}</p>
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

      {/* FLOAT SUCCESS TOAST */}
      <SuccessToast show={!!showToast} message={showToast} />



      {/* ACTIVITY STATISTICS */}
      {(() => {
        const statsConfig: StatItem[] = [
          { label: "Total Kegiatan", value: stats.total, desc: "Tercatat Minggu Ini", colorClass: "text-[#232F72] dark:text-[#FFFFFF] bg-[#F8FAFC] dark:bg-[#232F72] border-[#2F578A]/30", icon: Activity },
          { label: "Disetujui Mentor", value: stats.approved, desc: "Ceklis Validasi", colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40", icon: CheckCircle },
          { label: "Perlu Tinjauan", value: stats.pending, desc: "Menunggu Approval", colorClass: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-900/40", icon: Clock },
        ];
        return <StatsGrid stats={statsConfig} gridClass="grid-cols-2 lg:grid-cols-3" />;
      })()}

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
              <Link href={`/dashboard/mentor/kegiatan/${act.id}`} className="flex items-center gap-3">
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
              <Link href={`/dashboard/mentor/kegiatan/${act.id}`} className="font-bold text-[#232F72]/80 dark:text-[#F1F5F9] block py-1">
                {act.studentNim}
              </Link>
            ),
          },
          {
            key: "activityName",
            label: "Nama Kegiatan",
            render: (act) => (
              <Link href={`/dashboard/mentor/kegiatan/${act.id}`} className="font-bold text-[#232F72] dark:text-[#F1F5F9] block max-w-[240px]">
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
            render: (act) => {
              const fileUrls = getFileUrls(act);
              return (
                <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
                  {fileUrls.length > 0 ? (
                    <button
                      onClick={() => setViewingActivityFile({ studentName: act.studentName, activityName: act.activityName, fileUrls })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#232F72] dark:bg-[#232F72]/40 hover:text-white dark:hover:bg-[#121358] text-[#232F72] dark:text-white border border-[#2F578A]/30 rounded-xl font-bold transition-all text-[10px] hover:scale-[1.02] active:scale-95 shadow-sm cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{fileUrls.length} berkas</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-500 px-2 py-1 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/20 rounded-lg">
                      <AlertCircle className="w-3 h-3" />
                      Belum Diunggah
                    </span>
                  )}
                </div>
              );
            },
          },
          {
            key: "aksi",
            label: "AKSI",
            align: "center",
            render: (act) => (
              <div className="inline-flex items-center justify-center gap-1.5">
                {act.status === "Dalam Review" ? (
                  <button
                    onClick={() => handleCeklisActivity(act.id, act.studentName)}
                    className="p-1.5 bg-white hover:bg-emerald-50 border border-[#2F578A]/50 dark:bg-slate-900 dark:border-[#2F578A] text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                    title="Setujui Kegiatan"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleRevokeActivity(act.id, act.studentName)}
                    className="p-1.5 bg-amber-50 hover:bg-amber-500 dark:bg-amber-950/20 hover:text-white border border-amber-200/50 dark:border-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                    title="Cabut Persetujuan"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
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
                <Link href={`/dashboard/mentor/kegiatan/${act.id}`} className="p-1 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 hover:text-[#232F72] dark:hover:text-[#FFFFFF] transition-colors ml-1">
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
