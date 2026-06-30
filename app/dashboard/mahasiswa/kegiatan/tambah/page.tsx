"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, X, Loader2, ArrowLeft, FileIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useActivities } from "@/modules/data_kegiatan/hooks";
import { useFileUpload } from "@/modules/media/hooks";
import { notifier } from "@/modules/notifier";

export default function TambahKegiatanPage() {
  const router = useRouter();
  const { addActivity } = useActivities();
  const { upload, isUploading } = useFileUpload({ maxSizeMB: 10, allowedTypes: ["application/pdf", "image/jpeg", "image/png"] });

  const [newTitle,      setNewTitle]      = useState("");
  const [newKeterangan, setNewKeterangan] = useState("");
  const [newDate,  setNewDate]  = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting,  setIsSubmitting]  = useState(false);

  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setSelectedFiles(prev => {
      const existing = new Set(prev.map(f => f.name + f.size));
      return [...prev, ...files.filter(f => !existing.has(f.name + f.size))];
    });
    e.target.value = "";
  };

  const removeFile = (idx: number) => setSelectedFiles(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;
    setIsSubmitting(true);
    try {
      let fileKeys: string[] = [];
      if (selectedFiles.length > 0) {
        const results = await Promise.all(selectedFiles.map(f => upload(f)));
        fileKeys = results.map(r => r.key);
      }
      await addActivity({ title: newTitle, keterangan: newKeterangan, date: newDate, fileKeys });
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
          <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/70 mt-1">Catat aktivitas harian dan unggah berkas pendukung.</p>
        </div>
      </div>

      <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 md:p-8 bg-white dark:bg-[#121358] shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-bold text-[#232F72] dark:text-[#F1F5F9]">

          {/* Judul */}
          <div className="space-y-2.5">
            <label className="text-[10px] uppercase text-[#2F578A] dark:text-[#F1F5F9]/70">Nama / Judul Kegiatan <span className="text-[#36ADA3]">*</span></label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Contoh: Membuat API Endpoint Get data-mahasiswa..."
              className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-2xl focus:outline-none focus:border-[#36ADA3] dark:text-white transition-colors"
            />
          </div>

          {/* Keterangan */}
          <div className="space-y-2.5">
            <label className="text-[10px] uppercase text-[#2F578A] dark:text-[#F1F5F9]/70">Keterangan / Deskripsi Kegiatan</label>
            <textarea
              rows={3}
              value={newKeterangan}
              onChange={e => setNewKeterangan(e.target.value)}
              placeholder="Jelaskan apa yang dikerjakan pada kegiatan ini..."
              className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-2xl focus:outline-none focus:border-[#36ADA3] dark:text-white transition-colors resize-none text-xs font-semibold"
            />
          </div>

          {/* Tanggal */}
          <div className="space-y-2.5">
            <label className="text-[10px] uppercase text-[#2F578A] dark:text-[#F1F5F9]/70">Tanggal Kegiatan <span className="text-[#36ADA3]">*</span></label>
            <input
              type="date"
              required
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="w-full md:w-1/2 px-4 py-3 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-2xl focus:outline-none focus:border-[#36ADA3] dark:text-white transition-colors"
            />
          </div>

          {/* Multi-file upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase text-[#2F578A] dark:text-[#F1F5F9]/70">Lampiran / Berkas Pendukung (Opsional — bisa lebih dari satu)</label>
              <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/40">PDF, JPG, PNG — maks 10MB per file</span>
            </div>

            {/* Daftar file terpilih */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                {selectedFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 px-4 py-3 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-2xl">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl flex-shrink-0">
                        <FileIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#232F72] dark:text-white truncate">{f.name}</p>
                        <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/50">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="p-1.5 text-[#2F578A]/60 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tombol tambah file */}
            <label className="flex items-center gap-3 px-5 py-4 bg-[#F8FAFC] dark:bg-[#232F72]/20 border-2 border-dashed border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-2xl cursor-pointer hover:border-[#36ADA3] dark:hover:border-[#36ADA3] transition-colors">
              <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg" onChange={handleAddFile} className="hidden" />
              <div className="p-2.5 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl flex-shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#232F72] dark:text-white">
                  {selectedFiles.length > 0 ? "Tambah berkas lagi..." : "Pilih berkas untuk diunggah..."}
                </p>
                {selectedFiles.length > 0 && (
                  <span className="text-[9px] text-[#36ADA3] font-bold">{selectedFiles.length} berkas dipilih</span>
                )}
              </div>
            </label>
          </div>

          {/* Tombol aksi */}
          <div className="pt-4 flex justify-end gap-3 border-t border-[#2F578A]/20 dark:border-[#2F578A]/40">
            <Link
              href="/dashboard/mahasiswa/kegiatan"
              className="px-5 py-3 bg-[#F8FAFC] dark:bg-[#232F72]/30 hover:bg-[#2F578A]/10 border border-[#2F578A]/30 dark:border-[#2F578A]/50 text-[#232F72] dark:text-white rounded-xl font-black flex items-center justify-center cursor-pointer transition-all active:scale-95"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-6 py-3 bg-[#36ADA3] hover:bg-[#2eb1a6] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl shadow-[0_0_15px_rgba(54,173,163,0.3)] font-black flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isSubmitting || isUploading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> {isUploading ? "Mengunggah..." : "Menyimpan..."}</>
                : <><Plus className="w-4 h-4" /> Simpan Kegiatan</>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
