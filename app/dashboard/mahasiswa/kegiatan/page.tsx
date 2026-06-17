"use client";

import { useState, useMemo } from "react";
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
  Download,
  Filter,
  X,
  FileCheck,
  Loader2
} from "lucide-react";
import { useActivities } from "@/modules/data_kegiatan/hooks";
import { useFileUpload } from "@/modules/media/hooks";
import { SuccessToast, DashboardPagination } from "@/components/shared";

export default function StudentActivitiesPage() {
  const {
    activities,
    isLoading,
    isSubmitting,
    addActivity,
    uploadAttachment,
    deleteActivity
  } = useActivities();

  // Form states for adding new activity
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("08:00 - 17:00 WIB");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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

  // Add new activity
  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    try {
      const newActivity = await addActivity({
        title: newTitle,
        date: newDate,
        time: newTime
      });

      if (newFile && newActivity && newActivity.id) {
        try {
          const sizeMB = (newFile.size / 1024 / 1024).toFixed(1);
          const { key } = await upload(newFile);
          await uploadAttachment(newActivity.id, key, newFile.name, `${sizeMB} MB`);
        } catch (uploadErr: any) {
          triggerToast("Kegiatan ditambahkan, tetapi gagal mengunggah berkas.");
          return; // Stop here if upload fails, though activity is added
        }
      }

      setNewTitle("");
      setNewDate("");
      setNewTime("08:00 - 17:00 WIB");
      setNewFile(null);
      setShowAddForm(false);
      triggerToast("Kegiatan baru berhasil ditambahkan!");
    } catch (err: any) {
      triggerToast(err.message || "Gagal menambahkan kegiatan.");
    }
  };

  // Upload file assignment for a specific activity
  const handleUploadFile = async (activityId: number | string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);

      try {
        const { key } = await upload(file);
        await uploadAttachment(activityId, key, file.name, `${sizeMB} MB`);
        triggerToast(`Berkas "${file.name}" berhasil diunggah!`);
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
      const matchesStatus = statusFilter === "Semua" || act.status === statusFilter;
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
        <div>
          <h3 className="text-xl md:text-2xl font-black text-[#232F72] dark:text-white tracking-tight">Kegiatan Harian Dan Lampiran Tugas</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-xl bg-[#36ADA3] hover:bg-[#2eb1a6] text-white text-xs font-black shadow-[0_0_15px_rgba(54,173,163,0.3)] hover:shadow-[0_0_20px_rgba(54,173,163,0.5)] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Catat Kegiatan Baru
        </button>
      </div>

      {/* CONDITIONAL ADD ACTIVITY CARD */}
      {showAddForm && (
        <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 bg-white dark:bg-[#121358] shadow-xl max-w-xl animate-fadeIn space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2F578A]/20 dark:border-[#2F578A]/40">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#232F72] dark:text-[#F1F5F9]">Form Catat Kegiatan Harian Baru</h4>
            <button onClick={() => {
              setShowAddForm(false);
              setNewFile(null);
            }} className="text-[#2F578A] dark:text-[#F1F5F9]/50 hover:text-[#36ADA3] dark:hover:text-[#36ADA3]">
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <form onSubmit={handleAddActivity} className="space-y-4 text-xs font-bold text-[#232F72] dark:text-[#F1F5F9]">
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-[#2F578A] dark:text-[#F1F5F9]/70">Nama / Judul Kegiatan <span className="text-[#36ADA3]">*</span></label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Membuat API Endpoint Get data-mahasiswa..."
                className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-2xl focus:outline-none focus:border-[#36ADA3] dark:text-white transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-[#2F578A] dark:text-[#F1F5F9]/70">Tanggal Kegiatan <span className="text-[#36ADA3]">*</span></label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-2xl focus:outline-none focus:border-[#36ADA3] dark:text-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-[#2F578A] dark:text-[#F1F5F9]/70">Durasi / Waktu <span className="text-[#36ADA3]">*</span></label>
                <input
                  type="text"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="Contoh: 08:00 - 17:00 WIB"
                  className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-2xl focus:outline-none focus:border-[#36ADA3] dark:text-white transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase text-[#2F578A] dark:text-[#F1F5F9]/70">Lampiran / Berkas Pendukung (Opsional)</label>
              <div className="relative">
                <input
                  type="file"
                  id="new-activity-file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewFile(e.target.files[0]);
                    } else {
                      setNewFile(null);
                    }
                  }}
                  className="hidden"
                />
                <label 
                  htmlFor="new-activity-file"
                  className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-2xl cursor-pointer hover:border-[#36ADA3] dark:hover:border-[#36ADA3] transition-colors"
                >
                  <div className="p-2 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="flex-1 truncate">
                    {newFile ? (
                      <span className="text-[#232F72] dark:text-[#F1F5F9] font-semibold">{newFile.name}</span>
                    ) : (
                      <span className="text-[#2F578A] dark:text-[#F1F5F9]/50 font-medium">Pilih berkas untuk diunggah...</span>
                    )}
                  </div>
                  {newFile && (
                    <span className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/50">
                      {(newFile.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  )}
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-5 py-2.5 bg-[#36ADA3] hover:bg-[#2eb1a6] text-white rounded-xl shadow-[0_0_10px_rgba(54,173,163,0.3)] font-black flex items-center justify-center gap-2 ${isSubmitting ? "opacity-75 cursor-wait" : ""}`}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Simpan Kegiatan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER PANEL */}
      <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 p-4 rounded-3xl bg-white dark:bg-[#121358] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Cari kegiatan, tanggal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-transparent focus:border-[#36ADA3] rounded-2xl text-xs font-semibold focus:outline-none transition-all dark:text-white shadow-inner"
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
            Sudah Diunggah ({activities.filter(a => a.status === "Sudah Diunggah").length})
          </button>

          <button
            onClick={() => setStatusFilter("Belum Unggah")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "Belum Unggah"
                ? "bg-[#36ADA3] text-white shadow-sm"
                : "bg-[#F8FAFC] dark:bg-[#232F72]/30 text-[#2F578A] dark:text-[#F1F5F9]/60 hover:bg-[#2F578A]/10 dark:hover:bg-[#232F72]/60"
            }`}
          >
            Belum Diunggah ({activities.filter(a => a.status === "Belum Unggah").length})
          </button>
        </div>

      </div>

      {/* CORE DATA TABLE */}
      <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#121358] overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b border-[#2F578A]/20 dark:border-[#2F578A]/40 text-[10px] font-bold text-[#2F578A] dark:text-[#F1F5F9]/60 uppercase tracking-widest text-left">
                <th className="pb-3.5 pl-4 font-bold w-16">NO</th>
                <th className="pb-3.5 font-bold">Nama Kegiatan</th>
                <th className="pb-3.5 font-bold">Waktu</th>
                <th className="pb-3.5 font-bold text-center w-80">upload file</th>
                <th className="pb-3.5 pr-4 font-bold text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2F578A]/10 dark:divide-[#2F578A]/30 text-xs">
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
                  <tr key={act.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#232F72]/30 transition-colors group">
                  
                  {/* Column 1: Nomor */}
                  <td className="py-4 pl-4 font-extrabold text-[#2F578A] dark:text-[#F1F5F9]/60">
                    {(page - 1) * perPage + index + 1}
                  </td>

                  {/* Column 2: Nama Kegiatan */}
                  <td className="py-4 max-w-[320px]">
                    <div className="pr-4">
                      <p className="font-extrabold text-[#232F72] dark:text-white leading-normal">
                        {act.title}
                      </p>
                    </div>
                  </td>

                  {/* Column 3: Waktu */}
                  <td className="py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[#232F72] dark:text-[#F1F5F9] font-bold">
                        <Calendar className="w-3.5 h-3.5 text-[#36ADA3]" />
                        <span>{act.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/60">
                        <Clock className="w-3 h-3" />
                        <span>{act.time}</span>
                      </div>
                    </div>
                  </td>

                  {/* Column 4: Upload File Tugas (Attachment) */}
                  <td className="py-4 text-center">
                    {act.fileName ? (
                      /* File already uploaded block */
                      <div className="inline-flex items-center gap-2.5 p-2 bg-[#36ADA3]/10 dark:bg-[#36ADA3]/20 border border-[#36ADA3]/30 rounded-2xl max-w-xs text-left">
                        <div className="p-2 bg-[#36ADA3] text-white rounded-xl">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 pr-1">
                          <p className="text-[11px] font-extrabold text-[#36ADA3] dark:text-[#36ADA3] truncate max-w-[150px]">{act.fileName}</p>
                          <span className="text-[9px] text-[#36ADA3]/80 block">{act.fileSize} • Terlampir</span>
                        </div>
                        <div className="p-1 bg-white/40 dark:bg-[#36ADA3]/30 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-[#36ADA3]" />
                        </div>
                      </div>
                    ) : (
                      /* Upload trigger block */
                      <div className="relative inline-block">
                        <input
                          type="file"
                          onChange={(e) => handleUploadFile(act.id, e)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <button className="px-4 py-2.5 bg-[#F8FAFC] hover:bg-[#36ADA3] hover:border-[#36ADA3] hover:text-white dark:bg-[#232F72]/30 border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-2xl text-[10px] font-black uppercase text-[#2F578A] dark:text-[#F1F5F9]/80 flex items-center gap-1.5 transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          Unggah File Tugas
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Column 5: Hapus Kegiatan */}
                  <td className="py-4 pr-4 text-center">
                    <button
                      onClick={() => handleDeleteActivity(act.id)}
                      disabled={isSubmitting}
                      className={`p-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-900/30 transition-all cursor-pointer ${isSubmitting ? "opacity-50 cursor-wait" : "hover:scale-[1.03]"}`}
                      title="Hapus kegiatan"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
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
