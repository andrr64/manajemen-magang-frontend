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
import { useSubmitAbsensi, useRiwayatAbsensi, useStatistikKehadiran } from "@/modules/absensi/hooks";
import { useFileUpload } from "@/modules/media/hooks";

export default function StudentAttendancePage() {
  const [status, setStatus] = useState<"hadir" | "izin" | "sakit">("hadir");
  const [notes, setNotes] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [attachmentKey, setAttachmentKey] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const { submit, isSubmitting } = useSubmitAbsensi();
  const { riwayat: attendanceHistory, isLoading: isLoadingRiwayat, refreshRiwayat } = useRiwayatAbsensi();
  const { stat, refreshStat } = useStatistikKehadiran();
  const { upload, isUploading, error: uploadError } = useFileUpload({
    maxSizeMB: 10,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  });

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

  const handleFile = async (file: File) => {
    setUploadedFile(file);
    setAttachmentKey(null);
    try {
      const result = await upload(file);
      setAttachmentKey(result.key);
    } catch (err: any) {
      setUploadedFile(null);
      alert(err.message || "Gagal mengunggah berkas.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setAttachmentKey(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if ((status === "izin" || status === "sakit") && !attachmentKey) {
      alert("Silakan unggah dokumen pendukung (Surat Dokter/Izin) terlebih dahulu.");
      return;
    }

    try {
      await submit({
        status,
        keterangan: status === "hadir" ? undefined : notes,
        attachmentUrl: attachmentKey,
      });

      // Refetch data on success
      refreshRiwayat();
      refreshStat();

      setShowToast(true);
      setNotes("");
      setUploadedFile(null);
      setAttachmentKey(null);
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
        
        <div className="p-5 rounded-3xl border border-[#2F578A]/30 dark:border-[#2F578A]/50 bg-white dark:bg-[#121358] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-gradient-to-tr from-[#2F578A]/20 to-[#36ADA3]/20 text-[#36ADA3] rounded-2xl border border-[#36ADA3]/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/70 font-extrabold uppercase tracking-wider block">Hadir</span>
            <p className="text-xl font-black text-[#232F72] dark:text-white leading-none mt-1">{stat?.totalHadir ?? 0} Hari</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-[#2F578A]/30 dark:border-[#2F578A]/50 bg-white dark:bg-[#121358] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-gradient-to-tr from-[#2F578A]/20 to-[#36ADA3]/20 text-[#36ADA3] rounded-2xl border border-[#36ADA3]/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/70 font-extrabold uppercase tracking-wider block">Izin Masuk</span>
            <p className="text-xl font-black text-[#232F72] dark:text-white leading-none mt-1">{stat?.totalIzin ?? 0} Hari</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-[#2F578A]/30 dark:border-[#2F578A]/50 bg-white dark:bg-[#121358] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-gradient-to-tr from-[#2F578A]/20 to-[#36ADA3]/20 text-[#36ADA3] rounded-2xl border border-[#36ADA3]/30">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/70 font-extrabold uppercase tracking-wider block">Sakit</span>
            <p className="text-xl font-black text-[#232F72] dark:text-white leading-none mt-1">{stat?.totalSakit ?? 0} Hari</p>
          </div>
        </div>

      </div>

      {/* TWO PANEL CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: INTERACTIVE SUBMISSION FORM (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#121358] space-y-6">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-[#2F578A]/20 dark:border-[#2F578A]/40">
              <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#36ADA3]" />
                Formulir Presensi Harian Magang
              </h4>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs font-bold text-[#232F72] dark:text-[#F1F5F9]">
              
              {/* STATUS ATTENDANCE ATTACHMENTS (Hadir, Izin, Sakit) */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase text-[#2F578A] dark:text-[#F1F5F9]/50 tracking-wider">
                  Pilih Parameter Kehadiran Hari Ini <span className="text-[#36ADA3]">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Hadir */}
                  <button
                    type="button"
                    onClick={() => { setStatus("hadir"); setUploadedFile(null); }}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      status === "hadir"
                        ? "bg-[#36ADA3]/10 border-[#36ADA3] text-[#36ADA3] shadow-[0_0_15px_rgba(54,173,163,0.2)] scale-[1.02]"
                        : "bg-[#F8FAFC]/50 border-[#2F578A]/30 dark:bg-[#232F72]/30 dark:border-[#2F578A] text-[#2F578A] dark:text-[#F1F5F9]/70 hover:bg-[#F8FAFC] dark:hover:bg-[#232F72]"
                    }`}
                  >
                    <Clock className={`w-6 h-6 ${status === "hadir" ? "text-[#36ADA3]" : "text-[#2F578A] dark:text-[#F1F5F9]/50"}`} />
                    <span className="text-xs font-black uppercase tracking-wider">Hadir</span>
                  </button>

                  {/* Izin */}
                  <button
                    type="button"
                    onClick={() => setStatus("izin")}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      status === "izin"
                        ? "bg-[#36ADA3]/10 border-[#36ADA3] text-[#36ADA3] shadow-[0_0_15px_rgba(54,173,163,0.2)] scale-[1.02]"
                        : "bg-[#F8FAFC]/50 border-[#2F578A]/30 dark:bg-[#232F72]/30 dark:border-[#2F578A] text-[#2F578A] dark:text-[#F1F5F9]/70 hover:bg-[#F8FAFC] dark:hover:bg-[#232F72]"
                    }`}
                  >
                    <FileText className={`w-6 h-6 ${status === "izin" ? "text-[#36ADA3]" : "text-[#2F578A] dark:text-[#F1F5F9]/50"}`} />
                    <span className="text-xs font-black uppercase tracking-wider">Izin</span>
                  </button>

                  {/* Sakit */}
                  <button
                    type="button"
                    onClick={() => setStatus("sakit")}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      status === "sakit"
                        ? "bg-[#36ADA3]/10 border-[#36ADA3] text-[#36ADA3] shadow-[0_0_15px_rgba(54,173,163,0.2)] scale-[1.02]"
                        : "bg-[#F8FAFC]/50 border-[#2F578A]/30 dark:bg-[#232F72]/30 dark:border-[#2F578A] text-[#2F578A] dark:text-[#F1F5F9]/70 hover:bg-[#F8FAFC] dark:hover:bg-[#232F72]"
                    }`}
                  >
                    <AlertCircle className={`w-6 h-6 ${status === "sakit" ? "text-[#36ADA3]" : "text-[#2F578A] dark:text-[#F1F5F9]/50"}`} />
                    <span className="text-xs font-black uppercase tracking-wider">Sakit</span>
                  </button>

                </div>
              </div>

              {/* DYNAMIC VIEW FOR IZIN & SAKIT: DYNAMIC FILE UPLOAD ATTACHMENT */}
              {(status === "izin" || status === "sakit") && (
                <div className="space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-[#2F578A] dark:text-[#F1F5F9]/50 tracking-wider flex items-center gap-1">
                      Unggah Dokumen Pendukung ({status === "izin" ? "Surat Tugas/Izin" : "Surat Sakit Dokter"}) <span className="text-[#36ADA3]">*</span>
                    </label>
                    <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/40">PDF, JPG, PNG (Max 5MB)</span>
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
                          ? "border-[#36ADA3] bg-[#36ADA3]/5"
                          : "border-[#2F578A]/50 dark:border-[#2F578A] bg-[#F8FAFC]/40 dark:bg-[#232F72]/20 hover:border-[#36ADA3] dark:hover:border-[#36ADA3]"
                      }`}
                    >
                      <input
                        type="file"
                        accept=".pdf, .png, .jpg, .jpeg"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      
                      <div className="p-3 bg-[#36ADA3]/10 text-[#36ADA3] rounded-2xl border border-[#36ADA3]/20 shadow-sm mb-3">
                        <UploadCloud className="w-6 h-6 animate-pulse" />
                      </div>
                      
                      <p className="text-xs text-[#232F72] dark:text-[#F1F5F9] font-extrabold">
                        Tarik & Lepas berkas Anda di sini, atau <span className="text-[#36ADA3] hover:underline">Pilih Berkas</span>
                      </p>
                      <p className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/50 mt-1 font-semibold">Mendukung format dokumen scan resmi kampus / dokter</p>
                    </div>
                  ) : (
                    /* UPLOADED FILE PREVIEW */
                    <div className="p-4 bg-[#F8FAFC] dark:bg-[#232F72]/40 border border-[#2F578A]/30 dark:border-[#2F578A] rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl border border-[#36ADA3]/20">
                          <FileIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-[#232F72] dark:text-white truncate">{uploadedFile.name}</p>
                          <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/50 block mt-0.5">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                            {isUploading ? "Mengunggah..." : attachmentKey ? "Berhasil Diunggah" : "Berkas Terpilih"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1.5 bg-[#2F578A]/10 hover:bg-rose-500 dark:hover:bg-rose-500 text-[#2F578A] dark:text-[#F1F5F9]/70 hover:text-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {uploadError && (
                    <p className="text-[10px] text-rose-500 font-bold">{uploadError}</p>
                  )}
                </div>
              )}

              {/* REMARKS TEXTAREA (Conditionally hidden for Hadir) */}
              {(status === "izin" || status === "sakit") && (
                <div className="space-y-2 animate-fadeIn">
                  <label className="text-[10px] font-black uppercase text-[#2F578A] dark:text-[#F1F5F9]/50 tracking-wider">
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
                    className="w-full px-4 py-3.5 bg-[#F8FAFC] focus:bg-white dark:bg-[#232F72]/30 border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#36ADA3] focus:ring-1 focus:ring-[#36ADA3] rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner resize-none"
                  />
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="pt-4 border-t border-[#2F578A]/20 dark:border-[#2F578A]/40 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#36ADA3] hover:bg-[#2eb1a6] disabled:bg-[#36ADA3]/70 text-white font-black rounded-2xl shadow-[0_0_15px_rgba(54,173,163,0.3)] hover:shadow-[0_0_20px_rgba(54,173,163,0.5)] transition-all text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:scale-[1.01]"
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
        <div className="lg:col-span-5 border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-5 md:p-6 shadow-sm overflow-hidden flex flex-col bg-white dark:bg-[#121358] space-y-4">
          <div>
            <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white">Riwayat Seluruh Absensi</h4>
            <p className="text-[11px] text-[#2F578A] dark:text-[#F1F5F9]/70 leading-normal mt-0.5">Catatan pelaporan masuk dan persetujuan absensi seminggu terakhir.</p>
          </div>

          <div className="space-y-3.5">
            {isLoadingRiwayat ? (
              <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/50 font-semibold text-center py-6">Memuat riwayat kehadiran...</p>
            ) : attendanceHistory.length === 0 ? (
              <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/50 font-semibold text-center py-6">Belum ada riwayat absensi.</p>
            ) : (
              attendanceHistory.map((item, index) => (
                <div key={index} className="p-3.5 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-2xl flex items-center justify-between gap-3 hover:scale-[1.01] transition-transform shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                      item.type === "Hadir"
                        ? "bg-[#36ADA3]/10 border border-[#36ADA3]/20 text-[#36ADA3]"
                        : item.type === "Izin"
                        ? "bg-blue-50/50 dark:bg-blue-900/20 border border-blue-500/20 text-blue-500"
                        : item.type === "Alpha"
                        ? "bg-rose-50/50 dark:bg-rose-900/20 border border-rose-500/20 text-rose-500"
                        : "bg-amber-50/50 dark:bg-amber-900/20 border border-amber-500/20 text-amber-500"
                    }`}>
                      {item.type.substring(0, 3)}
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#232F72] dark:text-white">{item.date}</p>
                      <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/60 block mt-0.5">
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
                        ? "bg-[#36ADA3]/10 text-[#36ADA3] border border-[#36ADA3]/30"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
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
