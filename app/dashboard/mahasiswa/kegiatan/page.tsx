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
  FileCheck
} from "lucide-react";

interface Activity {
  id: number;
  title: string;
  date: string;
  time: string;
  fileName: string | null;
  fileSize: string | null;
  status: "Belum Unggah" | "Sudah Diunggah";
}

export default function StudentActivitiesPage() {
  // Simulated initial activities list
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, title: "Slicing Figma UI Dashboard Mahasiswa & Mentor", date: "29 Mei 2026", time: "08:00 - 17:00 WIB", fileName: "dashboard_slicing_v1.zip", fileSize: "12.4 MB", status: "Sudah Diunggah" },
    { id: 2, title: "Integrasi API Absensi Harian dengan Geofence", date: "28 Mei 2026", time: "08:00 - 17:00 WIB", fileName: "api_integration_docs.pdf", fileSize: "2.1 MB", status: "Sudah Diunggah" },
    { id: 3, title: "Unit Testing & Security Audit Modul Auth", date: "27 Mei 2026", time: "08:00 - 17:00 WIB", fileName: null, fileSize: null, status: "Belum Unggah" },
    { id: 4, title: "Refactoring Database Schema & Indexing", date: "26 Mei 2026", time: "08:00 - 17:00 WIB", fileName: "db_refactor_script.sql", fileSize: "450 KB", status: "Sudah Diunggah" },
    { id: 5, title: "Penyusunan Dokumentasi Laporan Bab 3 Magang", date: "25 Mei 2026", time: "08:00 - 16:30 WIB", fileName: null, fileSize: null, status: "Belum Unggah" }
  ]);

  // Form states for adding new activity
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("08:00 - 17:00 WIB");
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Belum Unggah" | "Sudah Diunggah">("Semua");

  // Show Toast
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Add new activity
  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    // Formatting date
    const formattedDate = new Date(newDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const newAct: Activity = {
      id: Date.now(),
      title: newTitle,
      date: formattedDate,
      time: newTime,
      fileName: null,
      fileSize: null,
      status: "Belum Unggah"
    };

    setActivities([newAct, ...activities]);
    setNewTitle("");
    setNewDate("");
    setShowAddForm(false);
    triggerToast("Kegiatan baru berhasil ditambahkan!");
  };

  // Upload file assignment for a specific activity
  const handleUploadFile = (activityId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      
      setActivities(prev => prev.map(act => {
        if (act.id === activityId) {
          return {
            ...act,
            fileName: file.name,
            fileSize: `${sizeMB} MB`,
            status: "Sudah Diunggah"
          };
        }
        return act;
      }));

      triggerToast(`Berkas "${file.name}" berhasil diunggah!`);
    }
  };

  // Delete file attachment
  const handleDeleteAttachment = (activityId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus berkas lampiran tugas ini?")) {
      setActivities(prev => prev.map(act => {
        if (act.id === activityId) {
          return {
            ...act,
            fileName: null,
            fileSize: null,
            status: "Belum Unggah"
          };
        }
        return act;
      }));
      triggerToast("Lampiran tugas berhasil dihapus.");
    }
  };

  // Filtered Activities List
  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            act.date.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "Semua" || act.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [activities, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 relative pb-10">
      
      {/* FLOATING SUCCESS TOAST */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-50 p-4 bg-emerald-550 dark:bg-[#062419] border border-emerald-450 dark:border-emerald-850 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-float max-w-sm">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <FileCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xs font-black block">Aksi Sukses</span>
            <span className="text-[10px] opacity-90 font-bold block mt-0.5">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* TOP HEADER & ACTION BANNER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Kegiatan Harian Dan Lampiran Tugas</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-black shadow-md shadow-violet-650/10 hover:shadow-violet-650/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Catat Kegiatan Baru
        </button>
      </div>

      {/* CONDITIONAL ADD ACTIVITY CARD */}
      {showAddForm && (
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070e24]/60 shadow-xl max-w-xl animate-fadeIn space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200">Form Catat Kegiatan Harian Baru</h4>
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-650 dark:hover:text-white">
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <form onSubmit={handleAddActivity} className="space-y-4 text-xs font-bold text-slate-600 dark:text-slate-400">
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-slate-400">Nama / Judul Kegiatan <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Membuat API Endpoint Get data-mahasiswa..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl focus:outline-none focus:border-violet-500 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-slate-400">Tanggal Kegiatan <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl focus:outline-none focus:border-violet-500 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-slate-400">Durasi / Waktu <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="Contoh: 08:00 - 17:00 WIB"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl focus:outline-none focus:border-violet-500 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-md font-black"
              >
                Simpan Kegiatan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER PANEL */}
      <div className="glass-card p-4 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Cari kegiatan, tanggal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-violet-500 rounded-2xl text-xs font-semibold focus:outline-none transition-all dark:text-white shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter("Semua")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "Semua"
                ? "bg-violet-650 text-white shadow-sm"
                : "bg-slate-50 dark:bg-slate-900/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            Semua ({activities.length})
          </button>
          
          <button
            onClick={() => setStatusFilter("Sudah Diunggah")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "Sudah Diunggah"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-50 dark:bg-slate-900/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            Sudah Diunggah ({activities.filter(a => a.status === "Sudah Diunggah").length})
          </button>

          <button
            onClick={() => setStatusFilter("Belum Unggah")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "Belum Unggah"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-slate-50 dark:bg-slate-900/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            Belum Diunggah ({activities.filter(a => a.status === "Belum Unggah").length})
          </button>
        </div>

      </div>

      {/* CORE DATA TABLE */}
      <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#070e24]/40 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest text-left">
                <th className="pb-3.5 pl-4 font-bold w-16">NO</th>
                <th className="pb-3.5 font-bold">Nama Kegiatan</th>
                <th className="pb-3.5 font-bold">Waktu</th>
                <th className="pb-3.5 font-bold text-center w-80">upload file</th>
                <th className="pb-3.5 pr-4 font-bold text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredActivities.map((act, index) => (
                <tr key={act.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors group">
                  
                  {/* Column 1: Nomor */}
                  <td className="py-4 pl-4 font-extrabold text-slate-400 dark:text-slate-550">
                    {index + 1}
                  </td>

                  {/* Column 2: Nama Kegiatan */}
                  <td className="py-4 max-w-[320px]">
                    <div className="pr-4">
                      <p className="font-extrabold text-slate-900 dark:text-white leading-normal">
                        {act.title}
                      </p>
                    </div>
                  </td>

                  {/* Column 3: Waktu */}
                  <td className="py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-slate-750 dark:text-slate-350 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-violet-500" />
                        <span>{act.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{act.time}</span>
                      </div>
                    </div>
                  </td>

                  {/* Column 4: Upload File Tugas (Attachment) */}
                  <td className="py-4 text-center">
                    {act.fileName ? (
                      /* File already uploaded block */
                      <div className="inline-flex items-center gap-2.5 p-2 bg-emerald-50 dark:bg-[#062419] border border-emerald-250 dark:border-emerald-900/40 rounded-2xl max-w-xs text-left">
                        <div className="p-2 bg-emerald-500 text-white rounded-xl">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 pr-1">
                          <p className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 truncate max-w-[150px]">{act.fileName}</p>
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-500 block">{act.fileSize} • Terlampir</span>
                        </div>
                        <div className="p-1 bg-white/40 dark:bg-emerald-950 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
                        <button className="px-4 py-2.5 bg-slate-100 hover:bg-violet-650 hover:text-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          Unggah File Tugas
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Column 5: Attachment Hapus */}
                  <td className="py-4 pr-4 text-center">
                    {act.fileName ? (
                      <button
                        onClick={() => handleDeleteAttachment(act.id)}
                        className="p-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-900/30 transition-all cursor-pointer hover:scale-[1.03]"
                        title="Hapus lampiran berkas"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold tracking-wide italic">
                        Tidak ada berkas
                      </span>
                    )}
                  </td>

                </tr>
              ))}

              {filteredActivities.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-slate-400 font-extrabold">
                    Tidak ada jurnal kegiatan magang yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
