"use client";

import { useState } from "react";
import { 
  Clock, 
  Check, 
  FileText, 
  UploadCloud, 
  Calendar, 
  Sparkles, 
  CheckCircle,
  AlertCircle,
  FileCheck,
  X,
  UserX,
  File as FileIcon
} from "lucide-react";
import { useSubmitAbsensi, useRiwayatAbsensi, useAbsensiMahasiswaStat } from "@/modules/absensi/hooks";

export default function StudentAttendancePage() {
  const [status, setStatus] = useState<"hadir" | "izin" | "sakit">("hadir");
  const [notes, setNotes] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const { submit, isSubmitting } = useSubmitAbsensi();
  const { riwayat: attendanceHistory, isLoading: isLoadingRiwayat, refreshRiwayat } = useRiwayatAbsensi();
  const { stat, refreshStat } = useAbsensiMahasiswaStat();

  // File Upload Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if ((status === "izin" || status === "sakit") && !uploadedFile) {
      alert("Silakan unggah dokumen pendukung (Surat Dokter/Izin) terlebih dahulu.");
      return;
    }

    try {
      await submit({
        status,
        keterangan: status === "hadir" ? undefined : notes,
        file: uploadedFile,
      });

      // Refetch data on success
      refreshRiwayat();
      refreshStat();

      setShowToast(true);
      setNotes("");
      setUploadedFile(null);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal mengirimkan laporan presensi.");
    }
  };

  return (
    <div className="space-y-6 relative pb-10">
      
      {/* SUCCESS TOAST */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-50 p-4 bg-emerald-550 dark:bg-[#062419] border border-emerald-450 dark:border-emerald-850 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-float max-w-sm">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xs font-black block">Presensi Berhasil Dikirim</span>
            <span className="text-[10px] opacity-90 font-bold block mt-0.5">Laporan presensi Anda hari ini telah disimpan di sistem!</span>
          </div>
        </div>
      )}

      {/* TOP STATS DISPLAY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Hadir</span>
            <p className="text-xl font-black text-slate-900 dark:text-white leading-none mt-1">{stat?.totalHadir ?? 0} Hari</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-100 dark:border-blue-900/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Izin Masuk</span>
            <p className="text-xl font-black text-slate-900 dark:text-white leading-none mt-1">{stat?.totalIzin ?? 0} Hari</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-100 dark:border-amber-900/30">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Sakit</span>
            <p className="text-xl font-black text-slate-900 dark:text-white leading-none mt-1">{stat?.totalSakit ?? 0} Hari</p>
          </div>
        </div>

      </div>

      {/* TWO PANEL CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: INTERACTIVE SUBMISSION FORM (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#070e24]/40 space-y-6">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                Formulir Presensi Harian Magang
              </h4>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs font-bold text-slate-600 dark:text-slate-400">
              
              {/* STATUS ATTENDANCE ATTACHMENTS (Hadir, Izin, Sakit) */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500 tracking-wider">
                  Pilih Parameter Kehadiran Hari Ini <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Hadir */}
                  <button
                    type="button"
                    onClick={() => { setStatus("hadir"); setUploadedFile(null); }}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      status === "hadir"
                        ? "bg-emerald-50/50 border-emerald-500 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/5 scale-[1.02]"
                        : "bg-slate-50/50 border-slate-200 dark:bg-slate-900/30 dark:border-slate-850 text-slate-500 hover:bg-slate-50 hover:border-slate-350 dark:hover:bg-slate-900/60"
                    }`}
                  >
                    <Clock className={`w-6 h-6 ${status === "hadir" ? "text-emerald-500" : "text-slate-400"}`} />
                    <span className="text-xs font-black uppercase tracking-wider">Hadir</span>
                  </button>

                  {/* Izin */}
                  <button
                    type="button"
                    onClick={() => setStatus("izin")}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      status === "izin"
                        ? "bg-blue-50/50 border-blue-500 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 shadow-md shadow-blue-500/5 scale-[1.02]"
                        : "bg-slate-50/50 border-slate-200 dark:bg-slate-900/30 dark:border-slate-850 text-slate-500 hover:bg-slate-50 hover:border-slate-350 dark:hover:bg-slate-900/60"
                    }`}
                  >
                    <FileText className={`w-6 h-6 ${status === "izin" ? "text-blue-500" : "text-slate-400"}`} />
                    <span className="text-xs font-black uppercase tracking-wider">Izin</span>
                  </button>

                  {/* Sakit */}
                  <button
                    type="button"
                    onClick={() => setStatus("sakit")}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      status === "sakit"
                        ? "bg-amber-50/50 border-amber-500 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 shadow-md shadow-amber-500/5 scale-[1.02]"
                        : "bg-slate-50/50 border-slate-200 dark:bg-slate-900/30 dark:border-slate-850 text-slate-500 hover:bg-slate-50 hover:border-slate-350 dark:hover:bg-slate-900/60"
                    }`}
                  >
                    <AlertCircle className={`w-6 h-6 ${status === "sakit" ? "text-amber-500" : "text-slate-400"}`} />
                    <span className="text-xs font-black uppercase tracking-wider">Sakit</span>
                  </button>



                </div>
              </div>



              {/* DYNAMIC VIEW FOR IZIN & SAKIT: DYNAMIC FILE UPLOAD ATTACHMENT */}
              {(status === "izin" || status === "sakit") && (
                <div className="space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500 tracking-wider flex items-center gap-1">
                      Unggah Dokumen Pendukung ({status === "izin" ? "Surat Tugas/Izin" : "Surat Sakit Dokter"}) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[9px] text-slate-400">PDF, JPG, PNG (Max 5MB)</span>
                  </div>

                  {/* DROPZONE INTERFACE */}
                  {!uploadedFile ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all ${
                        dragActive
                          ? "border-violet-500 bg-violet-500/5"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 hover:border-slate-350 dark:hover:border-slate-750"
                      }`}
                    >
                      <input
                        type="file"
                        accept=".pdf, .png, .jpg, .jpeg"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      
                      <div className="p-3 bg-violet-50 dark:bg-violet-950/40 text-violet-500 rounded-2xl border border-violet-100 dark:border-violet-900/30 shadow-sm mb-3">
                        <UploadCloud className="w-6 h-6 animate-pulse" />
                      </div>
                      
                      <p className="text-xs text-slate-750 dark:text-slate-300 font-extrabold">
                        Tarik & Lepas berkas Anda di sini, atau <span className="text-violet-600 dark:text-violet-400 hover:underline">Pilih Berkas</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">Mendukung format dokumen scan resmi kampus / dokter</p>
                    </div>
                  ) : (
                    /* UPLOADED FILE PREVIEW */
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 bg-violet-50 dark:bg-violet-950/50 text-violet-500 rounded-xl">
                          <FileIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 dark:text-white truncate">{uploadedFile.name}</p>
                          <span className="text-[9px] text-slate-400 block mt-0.5">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Berkas Terpilih</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1.5 bg-slate-200 hover:bg-rose-500 dark:bg-slate-800 dark:hover:bg-rose-950/40 hover:text-white rounded-lg text-slate-450 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* REMARKS TEXTAREA (Conditionally hidden for Hadir) */}
              {(status === "izin" || status === "sakit") && (
                <div className="space-y-2 animate-fadeIn">
                  <label className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500 tracking-wider">
                    Keterangan / Alasan (Wajib Diisi)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    required
                    placeholder={
                      status === "izin"
                        ? "Jelaskan keperluan izin operasional atau kegiatan resmi Anda..."
                        : "Jelaskan kondisi sakit / surat rujukan dokter singkat..."
                    }
                    className="w-full px-4 py-3.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner resize-none"
                  />
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-500/70 text-white font-black rounded-2xl shadow-lg shadow-violet-650/15 hover:shadow-violet-650/25 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Mengirim Laporan...
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4 font-black" />
                      Kirim Presensi Harian
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>

        {/* RIGHT PANEL: RECENT ATTENDANCE HISTORY TABLE (5 Cols) */}
        <div className="lg:col-span-5 glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm overflow-hidden flex flex-col bg-white dark:bg-[#070e24]/40 space-y-4">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Riwayat Seluruh Absensi</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Catatan pelaporan masuk dan persetujuan absensi seminggu terakhir.</p>
          </div>

          <div className="space-y-3.5">
            {isLoadingRiwayat ? (
              <p className="text-xs text-slate-450 dark:text-slate-500 font-semibold text-center py-6">Memuat riwayat kehadiran...</p>
            ) : attendanceHistory.length === 0 ? (
              <p className="text-xs text-slate-450 dark:text-slate-500 font-semibold text-center py-6">Belum ada riwayat absensi.</p>
            ) : (
              attendanceHistory.map((item, index) => (
                <div key={index} className="p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-850 rounded-2xl flex items-center justify-between gap-3 hover:scale-[1.01] transition-transform">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                      item.type === "Hadir"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                        : item.type === "Izin"
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600"
                        : item.type === "Alpha"
                        ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-600"
                    }`}>
                      {item.type.substring(0, 3)}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{item.date}</p>
                      <span className="text-[9px] text-slate-400 block mt-0.5">
                        {item.type === "Hadir"
                          ? `Masuk: ${item.checkIn} • Keluar: ${item.checkOut}`
                          : item.type === "Alpha"
                          ? "Tidak hadir tanpa keterangan"
                          : item.document ? `Dokumen: ${item.document.split("/").pop()}` : `Mengajukan ket. ${item.type.toLowerCase()}`}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      item.status === "Diverifikasi"
                        ? "bg-emerald-950/20 text-emerald-400 border border-emerald-900/30"
                        : "bg-amber-950/20 text-amber-400 border border-amber-900/30"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
