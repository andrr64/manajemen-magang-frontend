"use client";

import { useState } from "react";
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Loader2,
  X,
  Sparkles,
  Building
} from "lucide-react";

export default function StudentSuratKeteranganPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Statement letter details based on Budi Santoso's internship
  const letterInfo = {
    number: "GTN/HRD-INTERN/V/2026/0892",
    issueDate: "29 Mei 2026",
    recipient: "Budi Santoso",
    company: "PT. Global Teknologi Nusantara",
    role: "Software Engineering Intern",
    fileSize: "1.4 MB",
    fileFormat: "PDF Document"
  };

  const handleDownload = () => {
    setIsDownloading(true);
    
    // Simulate file downloading progress loader
    setTimeout(() => {
      setIsDownloading(false);
      setShowToast(true);
      
      // Simulate file download trigger
      const link = document.createElement("a");
      link.href = "#";
      link.setAttribute("download", `Surat_Keterangan_Magang_${letterInfo.recipient.replace(" ", "_")}.pdf`);
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
            <span className="text-[10px] opacity-90 font-bold block mt-0.5">Surat Keterangan Magang PDF telah berhasil diunduh ke perangkat Anda!</span>
          </div>
        </div>
      )}

      {/* HEADER PAGE */}
      <div>
        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Surat Keterangan Magang</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Unduh atau tinjau surat keterangan resmi penyelesaian praktikum kerja magang dari mitra industri.</p>
      </div>

      {/* MAIN TWO-COLUMN SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: LETTER MOCKUP & ACTIONS (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#070e24]/40 flex flex-col justify-between space-y-6 h-full relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Visual Letter Mockup Container */}
            <div className="relative border-2 border-slate-200 dark:border-slate-850 bg-gradient-to-tr from-slate-50 to-white dark:from-[#080f28] dark:to-[#040817] p-8 rounded-2xl shadow-inner text-left select-none overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="space-y-6 text-xs text-slate-700 dark:text-slate-350">
                {/* Letter Header / Kop Surat */}
                <div className="pb-4 border-b-2 border-slate-300 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-650 text-white rounded-xl">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white uppercase leading-none">{letterInfo.company}</h4>
                      <span className="text-[7.5px] text-slate-400 block mt-0.5">Corporate HRD Department • Jakarta, Indonesia</span>
                    </div>
                  </div>
                  <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest">Digital Copy</span>
                </div>

                {/* Letter Title */}
                <div className="text-center space-y-1 py-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider underline">SURAT KETERANGAN MAGANG</h3>
                  <p className="text-[9px] text-slate-400 leading-none">Nomor: {letterInfo.number}</p>
                </div>

                {/* Letter Body */}
                <div className="space-y-3 font-semibold leading-relaxed text-[11px] text-slate-600 dark:text-slate-400 text-justify">
                  <p>
                    Yang bertanda tangan di bawah ini menerangkan bahwa Mahasiswa berikut:
                  </p>
                  
                  <div className="pl-4 space-y-1 text-slate-850 dark:text-slate-200 font-extrabold text-[10.5px]">
                    <div className="grid grid-cols-3">
                      <span>Nama Lengkap</span>
                      <span className="col-span-2">: {letterInfo.recipient}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span>NIM</span>
                      <span className="col-span-2">: 2201012001</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span>Instansi</span>
                      <span className="col-span-2">: Universitas Indonesia</span>
                    </div>
                  </div>

                  <p>
                    Telah melaksanakan kegiatan Praktek Kerja Lapangan (Magang) Industri pada divisi <strong className="text-slate-800 dark:text-slate-200">{letterInfo.role}</strong> terhitung sejak tanggal 1 Februari 2026 sampai dengan 31 Juli 2026. Selama magang yang bersangkutan menunjukkan kinerja yang memuaskan dan berdedikasi tinggi.
                  </p>
                </div>

                {/* Signature Block */}
                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/40 flex justify-end text-[9.5px] font-bold">
                  <div className="text-right">
                    <span className="text-slate-400 block font-normal">Jakarta, {letterInfo.issueDate}</span>
                    <span className="text-slate-400 block font-normal mt-0.5">Human Resources Director</span>
                    <span className="text-slate-850 dark:text-slate-200 block mt-8 font-black italic">Ir. Bambang Wijaya</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS: MELIHAT/REVIEW & DOWNLOAD */}
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
                    Unduh Berkas PDF
                  </>
                )}
              </button>

            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: DOCUMENT DETAILS (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#070e24]/40 space-y-6 h-full flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-violet-500" />
                  Spesifikasi Surat Keterangan
                </span>
              </div>

              <div className="space-y-3.5">
                {[
                  { label: "Tanggal Diterbitkan", value: letterInfo.issueDate, icon: Calendar },
                  { label: "Ukuran & Format", value: `${letterInfo.fileFormat} (${letterInfo.fileSize})`, icon: Download }
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
                <Sparkles className="w-5 h-5 text-indigo-500 animate-spin" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Pratinjau Surat Keterangan Magang</h4>
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
                <FileText className="w-16 h-16 text-indigo-650 mx-auto animate-bounce" />
                <h3 className="text-base font-black text-slate-800 dark:text-white">REVIEW DOKUMEN DIGITAL</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  Tampilan di atas mensimulasikan file surat keterangan magang. Berkas Anda sah dan diterbitkan dengan kode unik GTN-0892.
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
              <span>Verifikasi Keabsahan: Dokumen ini telah diverifikasi secara digital oleh Divisi HRD PT. Global Teknologi Nusantara.</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
