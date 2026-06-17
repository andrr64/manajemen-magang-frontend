"use client";

import { Award, Download, Loader2, CheckCircle2, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useCertificate } from "@/modules/sertifikat/hooks";
import { useIamStore } from "@/modules/iam/store";
import { PageLoader, SuccessToast } from "@/components/shared";

export default function SertifikatPratinjauPage() {
  const { certificate, isLoading } = useCertificate();
  const { user } = useIamStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDownload = () => {
    if (!certificate) return;
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setShowToast(true);
      const link = document.createElement("a");
      link.href = certificate.downloadUrl || "#";
      link.setAttribute("download", `Sertifikat_Magang_${certificate.recipient.replace(" ", "_")}.pdf`);
      document.body.appendChild(link);
      document.body.removeChild(link);
      setTimeout(() => setShowToast(false), 4000);
    }, 1500);
  };

  if (isLoading) return <PageLoader text="Memuat pratinjau sertifikat..." spinnerColor="text-[#36ADA3]" />;

  if (!certificate || certificate.status !== "Issued") {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/mahasiswa/sertifikat" className="inline-flex items-center gap-2 text-xs font-bold text-[#2F578A] dark:text-[#F1F5F9]/70 hover:text-[#232F72] dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Sertifikat
        </Link>
        <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-12 text-center bg-white dark:bg-[#121358] space-y-4 max-w-md mx-auto">
          <Award className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
          <p className="font-black text-sm text-[#232F72] dark:text-white">Sertifikat belum diterbitkan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative pb-10">
      <SuccessToast variant="mahasiswa" show={showToast} message="Sertifikat Magang PDF telah berhasil diunduh!" title="Unduhan Berhasil" icon={<CheckCircle2 className="w-5 h-5 text-white" />} />

      {/* Nav */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/mahasiswa/sertifikat" className="inline-flex items-center gap-2 text-xs font-bold text-[#2F578A] dark:text-[#F1F5F9]/70 hover:text-[#232F72] dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Sertifikat
        </Link>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#2F578A] dark:text-[#F1F5F9]/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Pratinjau Sertifikat Magang
        </div>
      </div>

      <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 md:p-10 bg-white dark:bg-[#121358] shadow-xl space-y-6 max-w-3xl mx-auto">

        {/* Preview area */}
        <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-2xl bg-[#F8FAFC] dark:bg-[#232F72]/30 min-h-[340px] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#36ADA3]/5 via-transparent to-[#2F578A]/5 pointer-events-none" />
          <div className="absolute opacity-5 pointer-events-none right-4 top-4">
            <Award className="w-48 h-48" />
          </div>

          <div className="max-w-md space-y-5 relative z-10">
            <Award className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#36ADA3]">Sertifikat Kelulusan Resmi</span>
              <h3 className="text-lg font-black text-[#232F72] dark:text-white">CERTIFICATE OF COMPLETION</h3>
              <p className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/60 font-semibold">Diberikan Kepada Mahasiswa:</p>
            </div>

            <div className="border-y border-[#2F578A]/20 dark:border-[#2F578A]/40 py-4 space-y-1">
              <p className="font-extrabold text-base text-[#232F72] dark:text-white">{certificate.recipient}</p>
              <p className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/50 font-bold uppercase">
                NIM. {user?.nim || "-"} • {user?.universitas || "Universitas"}
              </p>
            </div>

            <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold leading-relaxed">
              Telah menyelesaikan program magang industri sebagai <strong className="text-[#232F72] dark:text-white">{certificate.role}</strong>{" "}
              di mitra kerja <strong className="text-[#232F72] dark:text-white">{certificate.company}</strong>.
            </p>

            <div className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 border border-emerald-100/30 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Status: Terverifikasi Pembimbing
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/dashboard/mahasiswa/sertifikat"
            className="flex-1 px-5 py-3.5 bg-[#F8FAFC] hover:bg-[#2F578A]/10 dark:bg-[#232F72]/30 dark:hover:bg-[#232F72]/60 text-[#232F72] dark:text-white rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 transition-all border border-[#2F578A]/30 dark:border-[#2F578A]/50"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 px-5 py-3.5 bg-[#36ADA3] hover:bg-[#2eb1a6] disabled:bg-[#36ADA3]/70 text-white rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(54,173,163,0.3)] active:scale-95"
          >
            {isDownloading ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengunduh...</> : <><Download className="w-4 h-4" /> Unduh Sertifikat</>}
          </button>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#2F578A]/20 dark:border-[#2F578A]/40 text-[10.5px] text-[#2F578A] dark:text-[#F1F5F9]/60 font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Verifikasi Keabsahan: Dokumen ini telah ditandatangani secara digital oleh Otoritas Akademik.</span>
        </div>

      </div>
    </div>
  );
}
