"use client";

import { useState } from "react";
import { 
  Award, 
  Download, 
  Eye, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  Loader2,
  X,
  Sparkles
} from "lucide-react";

export default function StudentSertifikatPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Certificate details based on Budi Santoso (uploaded by Mentor Dr. Ahmad Hidayat)
  const certificateInfo = {
    number: "CERT/IF/UI-GTN/2026/05/0021",
    issueDate: "29 Mei 2026",
    grade: "A (Sangat Memuaskan)",
    recipient: "Budi Santoso",
    company: "PT. Global Teknologi Nusantara",
    role: "Software Engineering Intern",
    fileSize: "2.8 MB",
    fileFormat: "PDF Document"
  };

  const handleDownload = () => {
    setIsDownloading(true);
    
    // Simulate premium download loader
    setTimeout(() => {
      setIsDownloading(false);
      setShowToast(true);
      
      // Simulate file download trigger
      const link = document.createElement("a");
      link.href = "#";
      link.setAttribute("download", `Sertifikat_Magang_${certificateInfo.recipient.replace(" ", "_")}.pdf`);
      document.body.appendChild(link);
      document.body.removeChild(link);

      setTimeout(() => setShowToast(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6 relative pb-10">
      
      {/* FLOATING SUCCESS TOAST */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-50 p-4 bg-emerald-550 dark:bg-[#062419] border border-emerald-450 dark:border-emerald-850 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-float max-w-sm">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xs font-black block">Unduhan Berhasil</span>
            <span className="text-[10px] opacity-90 font-bold block mt-0.5">Sertifikat Magang PDF telah berhasil diunduh ke perangkat Anda!</span>
          </div>
        </div>
      )}

      {/* HEADER PAGE */}
      <div>
        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Sertifikat Kelulusan</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Unduh atau tinjau berkas sertifikat resmi yang telah diunggah oleh mentor bimbingan Anda.</p>
      </div>

      {/* MAIN TWO-COLUMN SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: CERTIFICATE MOCKUP & ACTIONS (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#070e24]/40 flex flex-col justify-between space-y-6 h-full relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Visual Certificate Mockup Container */}
            <div className="relative border-4 border-double border-amber-500/30 bg-gradient-to-tr from-slate-50 to-white dark:from-[#080f28] dark:to-[#040817] p-6 rounded-2xl text-center shadow-inner overflow-hidden select-none group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="space-y-4">
                {/* Logo & Emblem */}
                <div className="flex justify-center">
                  <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/20 shadow-md">
                    <Award className="w-8 h-8" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Sertifikat Penghargaan Resmi</span>
                  <h4 className="text-lg md:text-xl font-black text-amber-600 dark:text-amber-500 tracking-tight">CERTIFICATE OF COMPLETION</h4>
                  <p className="text-[8px] text-slate-400 mt-0.5">Diberikan Kepada Mahasiswa:</p>
                </div>

                <div className="py-2.5">
                  <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-wide border-b border-slate-200 dark:border-slate-800 pb-2 inline-block px-8 max-w-full truncate">
                    {certificateInfo.recipient}
                  </h2>
                  <p className="text-[9px] text-slate-450 mt-2 font-semibold">NIM. 2201012001 • UI S1 Teknik Informatika</p>
                </div>

                <div className="max-w-md mx-auto">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    Telah menyelesaikan program magang industri sebagai <strong className="text-slate-800 dark:text-slate-200">{certificateInfo.role}</strong> di mitra kerja <strong className="text-slate-800 dark:text-slate-200">{certificateInfo.company}</strong> yang diunggah oleh Dosen Pembimbing Akademik.
                  </p>
                </div>

                {/* Decorative signatures placeholder */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/40 text-[9px] font-bold">
                  <div>
                    <span className="text-slate-400 block font-normal">Dosen Pembimbing</span>
                    <span className="text-slate-850 dark:text-slate-200 block mt-2 font-black italic">Dr. Ahmad Hidayat, M.T.</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Industry Advisor</span>
                    <span className="text-slate-850 dark:text-slate-200 block mt-2 font-black italic">Ir. Bambang Wijaya</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TWO MAIN ACTIONS (Melihat/Review & Download) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              
              {/* Action 1: Melihat / Review */}
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-800 dark:text-white rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm active:scale-95 border border-slate-200/40 dark:border-slate-800/60"
              >
                <Eye className="w-4 h-4 text-violet-500" />
                Melihat / Review
              </button>

              {/* Action 2: Download */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-5 py-3.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-500/70 text-white rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-violet-650/15 hover:shadow-violet-650/25 active:scale-95"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Mengunduh...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-white" />
                    Unduh Sertifikat
                  </>
                )}
              </button>

            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: CERTIFICATE SPECIFICATIONS (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#070e24]/40 space-y-6 h-full flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-violet-500" />
                  Spesifikasi & Keabsahan Dokumen
                </span>
              </div>

              <div className="space-y-3.5">
                {[
                  { label: "Tanggal Diterbitkan", value: certificateInfo.issueDate, icon: Calendar },
                  { label: "Format & Ukuran Berkas", value: `${certificateInfo.fileFormat} (${certificateInfo.fileSize})`, icon: Download }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-850 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 bg-violet-50 dark:bg-violet-950/60 text-violet-500 rounded-xl">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-550 font-black uppercase tracking-wider">{item.label}</span>
                      </div>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-100 text-right truncate max-w-[180px]">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>



          </div>
        </div>

      </div>

      {/* FULLSCREEN REVIEW / PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#070e24] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-4xl shadow-2xl relative animate-fadeIn scale-[1.01] flex flex-col justify-between max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Pratinjau Sertifikat Magang Pilihan</h4>
              </div>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 hover:bg-rose-500 hover:text-white text-slate-400 dark:text-slate-550 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Live preview iframe area */}
            <div className="my-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-100 dark:bg-slate-950 flex-1 overflow-y-auto min-h-[300px] flex flex-col items-center justify-center p-6 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
              
              <div className="max-w-md space-y-4">
                <Award className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
                <h3 className="text-base font-black text-slate-800 dark:text-white">REVIEW DOKUMEN SERTIFIKAT</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  Tampilan di atas mensimulasikan dokumen yang telah diunggah mentor Anda. Dokumen ini sah dan terdaftar dengan ID UI-GTN-0021.
                </p>
                
                <div className="pt-2 flex justify-center gap-2">
                  <button 
                    onClick={handleDownload}
                    className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh Sekarang
                  </button>
                  <button 
                    onClick={() => setIsPreviewOpen(false)}
                    className="px-4 py-2.5 bg-slate-250 hover:bg-slate-350 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer"
                  >
                    Tutup Review
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[10.5px] text-slate-400 dark:text-slate-550 font-bold flex-shrink-0 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verifikasi Keabsahan: Dokumen ini telah ditandatangani secara digital oleh Otoritas Akademik Universitas Indonesia.</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
