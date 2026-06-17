"use client";

import { FileText, Download, Loader2, CheckCircle2, ShieldCheck, Sparkles, ArrowLeft, Building } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useReferenceLetter } from "@/modules/surat_keterangan/hooks";
import { PageLoader, SuccessToast } from "@/components/shared";

export default function SuratKeteranganPratinjauPage() {
  const { letter: letterInfo, isLoading } = useReferenceLetter();
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

  if (isLoading) return <PageLoader text="Memuat pratinjau surat keterangan..." spinnerColor="text-[#36ADA3]" />;

  if (!letterInfo || letterInfo.status !== "Issued") {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/mahasiswa/surat-keterangan" className="inline-flex items-center gap-2 text-xs font-bold text-[#2F578A] dark:text-[#F1F5F9]/70 hover:text-[#232F72] dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Surat Keterangan
        </Link>
        <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-12 text-center bg-white dark:bg-[#121358] space-y-4 max-w-md mx-auto">
          <FileText className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
          <p className="font-black text-sm text-[#232F72] dark:text-white">Surat keterangan belum diterbitkan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative pb-10">
      <SuccessToast variant="mahasiswa" show={showToast} message="Surat Keterangan Magang PDF telah berhasil diunduh!" title="Unduhan Berhasil" icon={<CheckCircle2 className="w-5 h-5 text-white" />} />

      {/* Nav */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/mahasiswa/surat-keterangan" className="inline-flex items-center gap-2 text-xs font-bold text-[#2F578A] dark:text-[#F1F5F9]/70 hover:text-[#232F72] dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Surat Keterangan
        </Link>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#2F578A] dark:text-[#F1F5F9]/60">
          <Sparkles className="w-3.5 h-3.5 text-[#36ADA3]" />
          Pratinjau Surat Keterangan Magang
        </div>
      </div>

      <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 md:p-10 bg-white dark:bg-[#121358] shadow-xl space-y-6 max-w-3xl mx-auto">

        {/* Preview area */}
        <div className="border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-2xl bg-gradient-to-tr from-[#F8FAFC] to-white dark:from-[#232F72] dark:to-[#121358] p-8 relative overflow-hidden">
          <div className="absolute left-6 top-6 opacity-[0.03] pointer-events-none">
            <FileText className="w-56 h-56" />
          </div>

          <div className="space-y-6 text-xs text-[#232F72] dark:text-[#F1F5F9]/90">
            {/* Kop surat */}
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

            {/* Title */}
            <div className="text-center space-y-1 py-1">
              <h3 className="text-sm font-black text-[#232F72] dark:text-white uppercase tracking-wider underline">SURAT KETERANGAN MAGANG</h3>
              <p className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/60 leading-none">Nomor: {letterInfo.number}</p>
            </div>

            {/* Body */}
            <div className="space-y-3 font-semibold leading-relaxed text-[11px] text-[#2F578A] dark:text-[#F1F5F9]/80 text-justify">
              <p>Yang bertanda tangan di bawah ini menerangkan bahwa Mahasiswa berikut:</p>
              <div className="pl-4 space-y-1 text-[#232F72] dark:text-white font-extrabold text-[10.5px]">
                <div className="grid grid-cols-3">
                  <span>Nama Lengkap</span>
                  <span className="col-span-2">: {letterInfo.recipient}</span>
                </div>
              </div>
              <p>
                Telah melaksanakan kegiatan Praktek Kerja Lapangan (Magang) Industri pada divisi{" "}
                <strong className="text-[#232F72] dark:text-white">{letterInfo.role}</strong> terhitung sejak tanggal 1 Februari 2026 sampai dengan 31 Juli 2026. Selama magang yang bersangkutan menunjukkan kinerja yang memuaskan dan berdedikasi tinggi.
              </p>
            </div>

            {/* Signature */}
            <div className="pt-4 border-t border-[#2F578A]/20 dark:border-[#2F578A]/40 flex justify-end text-[9.5px] font-bold">
              <div className="text-right">
                <span className="text-[#2F578A] dark:text-[#F1F5F9]/60 block font-normal">Jakarta, {letterInfo.issueDate}</span>
                <span className="text-[#2F578A] dark:text-[#F1F5F9]/60 block font-normal mt-0.5">Human Resources Director</span>
                <span className="text-[#232F72] dark:text-white block mt-8 font-black italic">{letterInfo.hrName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/mahasiswa/surat-keterangan"
            className="flex-1 px-5 py-3.5 bg-[#F8FAFC] hover:bg-[#2F578A]/10 dark:bg-[#232F72]/30 dark:hover:bg-[#232F72]/60 text-[#232F72] dark:text-white rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 transition-all border border-[#2F578A]/30 dark:border-[#2F578A]/50"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 px-5 py-3.5 bg-[#36ADA3] hover:bg-[#2eb1a6] disabled:bg-[#36ADA3]/70 text-white rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(54,173,163,0.3)] active:scale-95"
          >
            {isDownloading ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengunduh...</> : <><Download className="w-4 h-4" /> Unduh Surat Keterangan</>}
          </button>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#2F578A]/20 dark:border-[#2F578A]/40 text-[10.5px] text-[#2F578A] dark:text-[#F1F5F9]/60 font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Verifikasi Keabsahan: Dokumen ini telah diverifikasi secara digital oleh Divisi HRD PT. Global Teknologi Nusantara.</span>
        </div>

      </div>
    </div>
  );
}
