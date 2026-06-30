"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Trash2,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  X,
  FileCheck,
  Loader2
} from "lucide-react";
import { useActivities } from "@/modules/data_kegiatan/hooks";
import { kegiatanAPI } from "@/modules/data_kegiatan/api";
import { useFileUpload } from "@/modules/media/hooks";
import Link from "next/link";
import { SuccessToast, DashboardPagination } from "@/components/shared";

export default function StudentActivitiesPage() {
  const router = useRouter();
  const {
    activities,
    isLoading,
    isSubmitting,
    addActivity,
    deleteActivity,
    refreshActivities
  } = useActivities();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Belum Unggah" | "Sudah Diunggah">("Semua");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Show Toast
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const { upload } = useFileUpload();

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Upload file assignment for a specific activity
  const handleUploadFile = async (activityId: number | string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);

      try {
        const { key } = await upload(file);
        await kegiatanAPI.addFilesToActivity(activityId, [key]);
        triggerToast(`Berkas "${file.name}" berhasil diunggah!`);
        refreshActivities(); // Reload to show the new attachment
      } catch (err: any) {
        triggerToast(err.message || "Gagal mengunggah berkas.");
      }
    }
  };

  // Delete activity and its attachment
  const handleDeleteActivity = async (activityId: number | string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kegiatan ini beserta lampirannya?")) {
      try {
        await deleteActivity(activityId);
        triggerToast("Kegiatan berhasil dihapus.");
      } catch (err: any) {
        triggerToast(err.message || "Gagal menghapus kegiatan.");
      }
    }
  };

  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            act.date.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesStatus = true;
      if (statusFilter === "Sudah Diunggah") {
        matchesStatus = act.fileUrls && act.fileUrls.length > 0;
      } else if (statusFilter === "Belum Unggah") {
        matchesStatus = !act.fileUrls || act.fileUrls.length === 0;
      }
      return matchesSearch && matchesStatus;
    });
  }, [activities, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / perPage));
  const pagedActivities = useMemo(() => {
    const adjustedPage = page > totalPages ? totalPages : page;
    const start = (adjustedPage - 1) * perPage;
    return filteredActivities.slice(start, start + perPage);
  }, [filteredActivities, page, totalPages, perPage]);

  return (
    <div className="space-y-6 relative pb-10">
      
      {/* FLOATING SUCCESS TOAST */}
      <SuccessToast variant="mahasiswa" show={showToast} message={toastMessage} title="Aksi Sukses" icon={<FileCheck className="w-5 h-5 text-white" />} />

      {/* TOP HEADER & ACTION BANNER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link
          href="/dashboard/mahasiswa/kegiatan/tambah"
          className="px-4 py-2.5 rounded-xl bg-[#36ADA3] hover:bg-[#2eb1a6] text-white text-xs font-black shadow-[0_0_15px_rgba(54,173,163,0.3)] hover:shadow-[0_0_20px_rgba(54,173,163,0.5)] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Catat Kegiatan Baru
        </Link>
      </div>

      {/* FILTER PANEL */}
      <div className="border-2 border-[#2F578A]/30 dark:border-[#2F578A]/50 p-4 rounded-3xl bg-white dark:bg-[#121358] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Cari kegiatan, tanggal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] dark:bg-[#232F72]/30 border-2 border-transparent focus:border-[#36ADA3] rounded-2xl text-xs font-semibold focus:outline-none transition-all dark:text-white shadow-inner"
          />
          <Search className="w-4 h-4 text-[#2F578A] dark:text-[#F1F5F9]/50 absolute left-3.5 top-3" />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter("Semua")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "Semua"
                ? "bg-[#36ADA3] text-white shadow-sm"
                : "bg-[#F8FAFC] dark:bg-[#232F72]/30 text-[#2F578A] dark:text-[#F1F5F9]/60 hover:bg-[#2F578A]/10 dark:hover:bg-[#232F72]/60"
            }`}
          >
            Semua ({activities.length})
          </button>
          
          <button
            onClick={() => setStatusFilter("Sudah Diunggah")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "Sudah Diunggah"
                ? "bg-[#36ADA3] text-white shadow-sm"
                : "bg-[#F8FAFC] dark:bg-[#232F72]/30 text-[#2F578A] dark:text-[#F1F5F9]/60 hover:bg-[#2F578A]/10 dark:hover:bg-[#232F72]/60"
            }`}
          >
            Sudah Diunggah ({activities.filter(a => a.fileUrls && a.fileUrls.length > 0).length})
          </button>

          <button
            onClick={() => setStatusFilter("Belum Unggah")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "Belum Unggah"
                ? "bg-[#36ADA3] text-white shadow-sm"
                : "bg-[#F8FAFC] dark:bg-[#232F72]/30 text-[#2F578A] dark:text-[#F1F5F9]/60 hover:bg-[#2F578A]/10 dark:hover:bg-[#232F72]/60"
            }`}
          >
            Belum Diunggah ({activities.filter(a => !a.fileUrls || a.fileUrls.length === 0).length})
          </button>
        </div>

      </div>

      {/* CORE DATA TABLE */}
      <div className="border-2 border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#121358] overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[960px] border-collapse">
            <thead>
              <tr className="divide-x-2 divide-[#2F578A]/20 dark:divide-[#2F578A]/40 border-b-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 text-[10px] font-bold text-[#2F578A] dark:text-[#F1F5F9]/60 uppercase tracking-widest text-left">
                <th className="pb-3.5 px-4 font-bold w-14">NO</th>
                <th className="pb-3.5 px-4 font-bold">Nama Kegiatan</th>
                <th className="pb-3.5 px-4 font-bold w-48">Keterangan</th>
                <th className="pb-3.5 px-4 font-bold text-center w-44">Lampiran</th>
                <th className="pb-3.5 px-4 font-bold text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#2F578A]/10 dark:divide-[#2F578A]/30 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-[#2F578A] dark:text-[#F1F5F9]/50 font-extrabold">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-[#36ADA3]" />
                      Memuat daftar kegiatan...
                    </div>
                  </td>
                </tr>
              ) : filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-[#2F578A] dark:text-[#F1F5F9]/50 font-extrabold">
                    Tidak ada jurnal kegiatan magang yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                pagedActivities.map((act, index) => (
                  <tr
                    key={act.id}
                    onClick={() => router.push(`/dashboard/mahasiswa/kegiatan/${act.id}`)}
                    className={`transition-colors group cursor-pointer divide-x-2 divide-[#2F578A]/10 dark:divide-[#2F578A]/30 ${
                      index % 2 === 0
                        ? "bg-white hover:bg-slate-50 dark:bg-transparent dark:hover:bg-[#232F72]/20"
                        : "bg-[#F8FAFC] hover:bg-[#F1F5F9] dark:bg-[#232F72]/10 dark:hover:bg-[#232F72]/30"
                    }`}
                  >
                  
                  {/* Column 1: Nomor */}
                  <td className="py-4 px-4 font-extrabold text-[#2F578A] dark:text-[#F1F5F9]/60">
                    {(page - 1) * perPage + index + 1}
                  </td>

                  {/* Column 2: Nama Kegiatan */}
                  <td className="py-4 px-4 max-w-[320px]">
                    <div>
                      <Link href={`/dashboard/mahasiswa/kegiatan/${act.id}`} className="font-extrabold text-[#232F72] dark:text-white leading-normal hover:text-[#36ADA3] dark:hover:text-[#36ADA3] transition-colors block">
                        {act.title}
                      </Link>
                      <div className="flex items-center gap-1 text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/60 mt-1">
                        <Calendar className="w-3 h-3 flex-shrink-0 text-[#36ADA3]" />
                        <span>{act.date}</span>
                      </div>
                      <span className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border-2 ${
                        act.status === "Disetujui" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/30" :
                        act.status === "Ditolak"   ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200/30" :
                        "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200/30"
                      }`}>
                        {act.status === "Belum Disetujui" ? "Menunggu" : act.status}
                      </span>
                    </div>
                  </td>

                  {/* Column 3: Keterangan */}
                  <td className="py-4 px-4">
                    <p className="text-[11px] font-semibold text-[#232F72]/70 dark:text-[#F1F5F9]/60 line-clamp-2 leading-relaxed">
                      {act.deskripsi || <span className="italic text-[#2F578A]/40">—</span>}
                    </p>
                  </td>

                  {/* Column 4: Lampiran */}
                  <td className="py-4 px-4 text-center" onClick={e => e.stopPropagation()}>
                    {act.fileUrls && act.fileUrls.length > 0 ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#36ADA3]/10 dark:bg-[#36ADA3]/20 border-2 border-[#36ADA3]/30 rounded-xl">
                        <FileText className="w-3.5 h-3.5 text-[#36ADA3]" />
                        <span className="text-[10px] font-black text-[#36ADA3]">
                          {act.fileUrls.length > 2
                            ? `(${act.fileUrls.length} file)`
                            : `${act.fileUrls.length} berkas`}
                        </span>
                      </div>
                    ) : (
                      <div className="relative inline-block">
                        <input
                          type="file"
                          onChange={e => handleUploadFile(act.id, e)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <button className="px-3 py-2 bg-[#F8FAFC] hover:bg-[#36ADA3] hover:text-white dark:bg-[#232F72]/30 border-2 border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-xl text-[10px] font-black text-[#2F578A] dark:text-[#F1F5F9]/80 flex items-center gap-1.5 transition-all whitespace-nowrap">
                          <Upload className="w-3 h-3" />
                          Unggah
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Column 6: Hapus */}
                  <td className="py-4 px-4 text-center" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleDeleteActivity(act.id)}
                      disabled={isSubmitting}
                      className={`p-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 rounded-xl border-2 border-rose-100 dark:border-rose-900/30 transition-all cursor-pointer ${isSubmitting ? "opacity-50 cursor-wait" : "hover:scale-[1.03]"}`}
                      title="Hapus kegiatan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <DashboardPagination page={page} totalPages={totalPages} pageSize={perPage} onPageChange={setPage} onPageSizeChange={(s) => { setPerPage(s); setPage(1); }} variant="mahasiswa" />
      )}

    </div>
  );
}

