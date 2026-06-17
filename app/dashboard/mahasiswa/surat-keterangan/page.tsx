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
import { useReferenceLetter } from "@/modules/surat_keterangan/hooks";
import { PageLoader, SuccessToast } from "@/components/shared";

export default function StudentSuratKeteranganPage() {
  const { letter: letterInfo, isLoading } = useReferenceLetter();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDownload = () => {
    if (!letterInfo) return;
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setShowToast(true);

      if (letterInfo.downloadUrl) {
        const link = document.createElement("a");
        link.href = letterInfo.downloadUrl;
        link.setAttribute("download", `Surat_Keterangan_Magang_${letterInfo.recipient.replace(" ", "_")}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setTimeout(() => setShowToast(false), 4000);
    }, 1500);
  };

  if (isLoading) {
    return <PageLoader text="Memuat berkas surat keterangan magang..." spinnerColor="text-[#36ADA3]" />;
  }

  if (!letterInfo || letterInfo.status !== "Issued") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-[#232F72] dark:text-white tracking-tight">Surat Keterangan Magang</h3>
          <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/70">Unduh atau tinjau surat keterangan resmi penyelesaian praktikum kerja magang dari mitra industri.</p>
        </div>
        <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-8 md:p-12 shadow-xl bg-white dark:bg-[#121358] text-center max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200/40 dark:border-amber-900/40 flex items-center justify-center mx-auto shadow-md">
            <FileText className="w-10 h-10 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h4 className="font-black text-lg text-[#232F72] dark:text-white">Surat Keterangan Belum Diterbitkan</h4>
            <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold leading-relaxed max-w-md mx-auto">
              Dokumen formal surat keterangan magang Anda saat ini sedang diproses oleh Mentor atau HRD mitra industri Anda.
            </p>
            <p className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/50 max-w-sm mx-auto pt-2">
              Segera setelah berkas ditandatangani dan diunggah, dokumen PDF resmi Anda akan langsung tersedia di halaman ini.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative pb-10">

      {/* FLOATING SUCCESS TOAST */}
      <SuccessToast variant="mahasiswa" show={showToast} message="Surat Keterangan Magang PDF telah berhasil diunduh ke perangkat Anda!" title="Unduhan Berhasil" icon={<CheckCircle2 className="w-5 h-5 text-white" />} />

      {/* HEADER PAGE */}
      <div>
        <h3 className="text-xl md:text-2xl font-black text-[#232F72] dark:text-white tracking-tight">Surat Keterangan Magang</h3>
        <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/70">Unduh atau tinjau surat keterangan resmi penyelesaian praktikum kerja magang dari mitra industri.</p>
      </div>

      {/* MAIN TWO-COLUMN SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: LETTER MOCKUP & ACTIONS (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#121358] flex flex-col justify-between space-y-6 h-full relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#36ADA3]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#2F578A]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Visual Letter Mockup Container */}
            <div className="relative border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 bg-gradient-to-tr from-[#F8FAFC] to-white dark:from-[#232F72] dark:to-[#121358] p-8 rounded-2xl shadow-inner text-left select-none overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#36ADA3]/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="space-y-6 text-xs text-[#232F72] dark:text-[#F1F5F9]/90">
                {/* Letter Header / Kop Surat */}
                <div className="pb-4 border-b-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#36ADA3] text-white rounded-xl shadow-md">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-[#232F72] dark:text-white uppercase leading-none">{letterInfo.company}</h4>
                      <span className="text-[7.5px] text-[#2F578A] dark:text-[#F1F5F9]/60 block mt-0.5">Corporate HRD Department • Jakarta, Indonesia</span>
                    </div>
                  </div>
                  <span className="text-[8px] text-[#36ADA3] font-extrabold uppercase tracking-widest">Digital Copy</span>
                </div>

                {/* Letter Title */}
                <div className="text-center space-y-1 py-1">
                  <h3 className="text-sm font-black text-[#232F72] dark:text-white uppercase tracking-wider underline">SURAT KETERANGAN MAGANG</h3>
                  <p className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/60 leading-none">Nomor: {letterInfo.number}</p>
                </div>

                {/* Letter Body */}
                <div className="space-y-3 font-semibold leading-relaxed text-[11px] text-[#2F578A] dark:text-[#F1F5F9]/80 text-justify">
                  <p>
                    Yang bertanda tangan di bawah ini menerangkan bahwa Mahasiswa berikut:
                  </p>
                  
                  <div className="pl-4 space-y-1 text-[#232F72] dark:text-white font-extrabold text-[10.5px]">
                    <div className="grid grid-cols-3">
                      <span>Nama Lengkap</span>
                      <span className="col-span-2">: {letterInfo.recipient}</span>
                    </div>
                  </div>

                  <p>
                    Telah melaksanakan kegiatan Praktek Kerja Lapangan (Magang) Industri pada divisi <strong className="text-[#232F72] dark:text-white">{letterInfo.role}</strong> terhitung sejak tanggal 1 Februari 2026 sampai dengan 31 Juli 2026. Selama magang yang bersangkutan menunjukkan kinerja yang memuaskan dan berdedikasi tinggi.
                  </p>
                </div>

                {/* Signature Block */}
                <div className="pt-4 border-t border-[#2F578A]/20 dark:border-[#2F578A]/40 flex justify-end text-[9.5px] font-bold">
                  <div className="text-right">
                    <span className="text-[#2F578A] dark:text-[#F1F5F9]/60 block font-normal">Jakarta, {letterInfo.issueDate}</span>
                    <span className="text-[#2F578A] dark:text-[#F1F5F9]/60 block font-normal mt-0.5">Human Resources Director</span>
                    <span className="text-[#232F72] dark:text-white block mt-8 font-black italic">{letterInfo.hrName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS: MELIHAT/REVIEW & DOWNLOAD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              
              {/* Action 1: Melihat / Review */}
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="px-5 py-3.5 bg-[#F8FAFC] hover:bg-[#2F578A]/10 dark:bg-[#232F72]/30 dark:hover:bg-[#232F72]/60 text-[#232F72] dark:text-white rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm active:scale-95 border border-[#2F578A]/30 dark:border-[#2F578A]/50"
              >
                <Eye className="w-4 h-4 text-[#36ADA3]" />
                Melihat / Review
              </button>

              {/* Action 2: Download */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-5 py-3.5 bg-[#36ADA3] hover:bg-[#2eb1a6] disabled:bg-[#36ADA3]/70 text-white rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(54,173,163,0.3)] hover:shadow-[0_0_20px_rgba(54,173,163,0.5)] active:scale-95"
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
          <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#121358] space-y-6 h-full flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="pb-3.5 border-b border-[#2F578A]/20 dark:border-[#2F578A]/40">
                <span className="text-xs font-black text-[#232F72] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#36ADA3]" />
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
                    <div key={index} className="p-3.5 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl border border-[#36ADA3]/20">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/60 font-black uppercase tracking-wider">{item.label}</span>
                      </div>
                      <span className="text-xs font-black text-[#232F72] dark:text-white text-right truncate max-w-[180px]">{item.value}</span>
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
        <div className="fixed inset-0 z-50 bg-[#121358]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121358] border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 md:p-8 w-full max-w-4xl shadow-2xl relative animate-fadeIn scale-[1.01] flex flex-col justify-between max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#2F578A]/20 dark:border-[#2F578A]/40 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#36ADA3] animate-spin" />
                <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white uppercase tracking-wider">Pratinjau Surat Keterangan Magang</h4>
              </div>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 hover:bg-rose-500 hover:text-white text-[#2F578A] dark:text-[#F1F5F9]/60 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Live preview iframe area */}
            <div className="my-6 border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-2xl bg-[#F8FAFC] dark:bg-[#232F72]/30 flex-1 overflow-y-auto min-h-[300px] flex flex-col items-center justify-center p-6 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#36ADA3]/5 via-transparent to-[#2F578A]/5 pointer-events-none" />
              
              <div className="max-w-md space-y-4">
                <FileText className="w-16 h-16 text-[#36ADA3] mx-auto animate-bounce" />
                <h3 className="text-base font-black text-[#232F72] dark:text-white">REVIEW DOKUMEN DIGITAL</h3>
                <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/70 leading-relaxed font-semibold">
                  Tampilan di atas mensimulasikan file surat keterangan magang. Berkas Anda sah dan diterbitkan dengan kode unik GTN-0892.
                </p>
                
                <div className="pt-2 flex justify-center gap-2">
                  <button 
                    onClick={handleDownload}
                    className="px-4 py-2.5 bg-[#36ADA3] hover:bg-[#2eb1a6] text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(54,173,163,0.3)]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh Sekarang
                  </button>
                  <button 
                    onClick={() => setIsPreviewOpen(false)}
                    className="px-4 py-2.5 bg-[#F8FAFC] hover:bg-[#2F578A]/10 dark:bg-[#232F72]/50 dark:hover:bg-[#232F72] text-[#232F72] dark:text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer border border-[#2F578A]/30"
                  >
                    Tutup Review
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-[#2F578A]/20 dark:border-[#2F578A]/40 text-[10.5px] text-[#2F578A] dark:text-[#F1F5F9]/60 font-bold flex-shrink-0 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verifikasi Keabsahan: Dokumen ini telah diverifikasi secara digital oleh Divisi HRD PT. Global Teknologi Nusantara.</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
