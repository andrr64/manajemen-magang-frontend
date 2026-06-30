"use client";

import {
  Award, Download, Calendar, User,
  CheckCircle2, AlertCircle, Loader2, FileText, Clock,
} from "lucide-react";
import { useCertificate } from "@/modules/sertifikat/hooks";
import { mediaAPI } from "@/modules/media/api";

function formatDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function formatDateTime(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function StudentSertifikatPage() {
  const { certificate, isLoading, error } = useCertificate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-[#2F578A]/80 dark:text-[#F1F5F9]/50">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-bold">Memuat sertifikat...</span>
        </div>
      </div>
    );
  }

  // Tidak ada periode magang aktif
  if (!certificate) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-black text-[#232F72] dark:text-white">Sertifikat Kelulusan</h3>
          <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/70 mt-1">Berkas sertifikat yang diunggah oleh mentor bimbingan Anda.</p>
        </div>
        <div className="border-2 border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-12 bg-white dark:bg-[#121358] text-center space-y-4 max-w-md">
          <Award className="w-12 h-12 text-[#2F578A]/40 mx-auto" />
          <p className="font-extrabold text-sm text-[#232F72] dark:text-white">Tidak ada periode magang aktif</p>
          <p className="text-xs text-[#2F578A]/70 dark:text-[#F1F5F9]/50">Data sertifikat hanya tersedia untuk mahasiswa yang sedang aktif menjalani magang.</p>
        </div>
      </div>
    );
  }

  const sudahDiunggah = certificate.statusSertifikat === "SUDAH_DIUNGGAH";
  const downloadUrl   = sudahDiunggah && certificate.url ? mediaAPI.getFileUrl(certificate.url) : null;

  return (
    <div className="space-y-6 pb-10 max-w-2xl">

      {/* Status banner */}
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 ${
        sudahDiunggah
          ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400"
          : "bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-900/40 text-amber-700 dark:text-amber-400"
      }`}>
        {sudahDiunggah
          ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          : <Clock className="w-5 h-5 flex-shrink-0" />
        }
        <div>
          <p className="font-extrabold text-sm">{sudahDiunggah ? "Sertifikat Telah Diunggah" : "Menunggu Sertifikat dari Mentor"}</p>
          <p className="text-[10px] font-semibold opacity-80 mt-0.5">
            {sudahDiunggah ? "Anda dapat mengunduh berkas sertifikat di bawah ini." : "Mentor Anda belum mengunggah berkas sertifikat."}
          </p>
        </div>
      </div>

      {/* Metadata card */}
      <div className="border-2 border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl bg-white dark:bg-[#121358] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#2F578A]/10 dark:border-[#2F578A]/30">
          <p className="text-[10px] font-black uppercase tracking-wider text-[#2F578A]/80 dark:text-[#F1F5F9]/50">Informasi Sertifikat</p>
        </div>
        <div className="divide-y divide-[#2F578A]/10 dark:divide-[#2F578A]/30">
          {[
            { label: "Nama Mahasiswa", value: certificate.namaMahasiswa, icon: User },
            { label: "NIM",            value: certificate.nim,            icon: FileText },
            { label: "Periode Magang", value: `${formatDate(certificate.tanggalMulai)} — ${formatDate(certificate.tanggalBerakhir)}`, icon: Calendar },
            { label: "Mentor Pembimbing", value: certificate.namaMentor ?? "Belum ada data mentor", icon: Award },
            ...(sudahDiunggah ? [{ label: "Diunggah Pada", value: formatDateTime(certificate.createdAt), icon: CheckCircle2 }] : []),
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-4 px-5 py-3.5">
              <div className="p-2 bg-[#F1F5F9] dark:bg-[#232F72]/50 text-[#36ADA3] rounded-xl flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#2F578A]/70 dark:text-[#F1F5F9]/50">{label}</p>
                <p className="text-xs font-extrabold text-[#232F72] dark:text-white mt-0.5 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download button */}
      {sudahDiunggah && downloadUrl && (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#36ADA3] hover:bg-[#2eb1a6] text-white rounded-2xl text-xs font-black shadow-[0_0_15px_rgba(54,173,163,0.3)] hover:shadow-[0_0_20px_rgba(54,173,163,0.5)] transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          Unduh / Buka Sertifikat
        </a>
      )}

    </div>
  );
}

