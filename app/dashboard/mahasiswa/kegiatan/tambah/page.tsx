"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, X, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useActivities } from "@/modules/data_kegiatan/hooks";
import { useFileUpload } from "@/modules/media/hooks";
import { notifier } from "@/modules/notifier";

export default function TambahKegiatanPage() {
  const router = useRouter();
  const { addActivity, uploadAttachment } = useActivities();
  const { upload } = useFileUpload();

  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  });
  const [newTime, setNewTime] = useState("08:00 - 17:00 WIB");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    setIsSubmitting(true);
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
          notifier.error("Kegiatan ditambahkan, tetapi gagal mengunggah berkas.");
        }
      }

      notifier.success("Kegiatan baru berhasil ditambahkan!");
      router.push("/dashboard/mahasiswa/kegiatan");
    } catch (err: any) {
      notifier.error(err.message || "Gagal menambahkan kegiatan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 relative pb-10 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/mahasiswa/kegiatan"
          className="p-2 bg-white dark:bg-[#121358] border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-xl text-[#2F578A] dark:text-[#F1F5F9]/70 hover:bg-[#F8FAFC] dark:hover:bg-[#232F72]/30 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h3 className="text-xl md:text-2xl font-black text-[#232F72] dark:text-white tracking-tight">Tambah Kegiatan Magang</h3>
          <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/70 mt-1">Catat aktivitas harian dan unggah berkas tugas Anda.</p>
        </div>
      </div>

      <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 md:p-8 bg-white dark:bg-[#121358] shadow-xl">
        <form onSubmit={handleAddActivity} className="space-y-6 text-xs font-bold text-[#232F72] dark:text-[#F1F5F9]">
          <div className="space-y-2.5">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-[10px] uppercase text-[#2F578A] dark:text-[#F1F5F9]/70">Tanggal Kegiatan <span className="text-[#36ADA3]">*</span></label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-2xl focus:outline-none focus:border-[#36ADA3] dark:text-white transition-colors"
              />
            </div>

            <div className="space-y-2.5">
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

          <div className="space-y-2.5">
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
                className="flex items-center gap-4 px-5 py-4 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-2xl cursor-pointer hover:border-[#36ADA3] dark:hover:border-[#36ADA3] transition-colors"
              >
                <div className="p-3 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  {newFile ? (
                    <>
                      <span className="text-[#232F72] dark:text-[#F1F5F9] font-bold text-sm truncate block">{newFile.name}</span>
                      <span className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/50 block mt-0.5">
                        Ukuran: {(newFile.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[#2F578A] dark:text-[#F1F5F9]/70 font-bold text-sm block">Pilih berkas untuk diunggah...</span>
                      <span className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/50 block mt-0.5">Maks. 10MB (PDF/JPG/PNG)</span>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#2F578A]/20 dark:border-[#2F578A]/40">
            <Link 
              href="/dashboard/mahasiswa/kegiatan"
              className="px-5 py-3 bg-[#F8FAFC] dark:bg-[#232F72]/30 hover:bg-[#2F578A]/10 border border-[#2F578A]/30 dark:border-[#2F578A]/50 text-[#232F72] dark:text-white rounded-xl shadow-sm font-black flex items-center justify-center cursor-pointer transition-all active:scale-95"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-[#36ADA3] hover:bg-[#2eb1a6] text-white rounded-xl shadow-[0_0_15px_rgba(54,173,163,0.3)] hover:shadow-[0_0_20px_rgba(54,173,163,0.5)] font-black flex items-center justify-center gap-2 transition-all active:scale-95 ${isSubmitting ? "opacity-75 cursor-not-allowed shadow-none" : ""}`}
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
              ) : (
                <><Plus className="w-4 h-4" /> Simpan Kegiatan</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
