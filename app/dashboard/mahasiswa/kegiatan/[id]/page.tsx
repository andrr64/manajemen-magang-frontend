"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft, Calendar, FileText, Paperclip,
  AlertCircle, ExternalLink, CheckCircle2,
  Clock, XCircle, RefreshCw, UserCheck,
} from "lucide-react";
import { useActivities } from "@/modules/data_kegiatan/hooks";
import { mediaAPI } from "@/modules/media/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
    "Disetujui": {
      cls: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/40",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      label: "Disetujui",
    },
    "Belum Disetujui": {
      cls: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/40 animate-pulse",
      icon: <Clock className="w-3.5 h-3.5" />,
      label: "Menunggu Persetujuan",
    },
    "Ditolak": {
      cls: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/40",
      icon: <XCircle className="w-3.5 h-3.5" />,
      label: "Ditolak",
    },
  };
  const { cls, icon, label } = cfg[status] ?? cfg["Belum Disetujui"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border ${cls}`}>
      {icon} {label}
    </span>
  );
}

export default function MahasiswaKegiatanDetailPage({ params }: PageProps) {
  const { id: activityId } = use(params);
  const { activities, isLoading } = useActivities();

  const activity = useMemo(
    () => activities.find(a => String(a.id) === String(activityId)),
    [activities, activityId]
  );

  const fileUrls = useMemo(
    () => (activity?.fileUrls ?? []).map(key => mediaAPI.getFileUrl(key)),
    [activity]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-[#2F578A]/80 dark:text-[#F1F5F9]/50">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-bold">Memuat detail kegiatan...</span>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-400" />
        <p className="font-extrabold text-[#232F72] dark:text-white">Kegiatan tidak ditemukan</p>
        <p className="text-xs text-[#2F578A]/80 dark:text-[#F1F5F9]/50">ID: {activityId}</p>
        <Link
          href="/dashboard/mahasiswa/kegiatan"
          className="px-5 py-2.5 bg-[#36ADA3] text-white text-xs font-extrabold rounded-xl hover:bg-[#2eb1a6] transition-all active:scale-95"
        >
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 max-w-3xl">

      {/* Back nav + status */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          href="/dashboard/mahasiswa/kegiatan"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2F578A] dark:text-[#F1F5F9]/70 hover:text-[#232F72] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Kegiatan
        </Link>
        <StatusBadge status={activity.status} />
      </div>

      {/* Card detail */}
      <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 md:p-8 bg-white dark:bg-[#121358] shadow-xl space-y-6">

        {/* Judul */}
        <div className="pb-5 border-b border-[#2F578A]/10 dark:border-[#2F578A]/30">
          <h3 className="font-extrabold text-lg text-[#232F72] dark:text-white leading-snug">{activity.title}</h3>
        </div>

        {/* Tanggal & waktu */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-2xl space-y-1">
            <p className="text-[10px] font-black uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Tanggal
            </p>
            <p className="text-sm font-extrabold text-[#232F72] dark:text-white">{activity.date}</p>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Deskripsi Kegiatan
          </p>
          <p className="text-sm font-semibold leading-relaxed text-[#232F72]/80 dark:text-[#F1F5F9]/80">
            {activity.deskripsi || <span className="italic text-[#2F578A]/50">Tidak ada deskripsi.</span>}
          </p>
        </div>

        {/* Diverifikasi oleh mentor */}
        {activity.status === "Disetujui" && (
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/40 dark:border-emerald-900/40 rounded-2xl">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl flex-shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-emerald-600/80 dark:text-emerald-400/70 tracking-wider">Disetujui oleh</p>
              <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
                {activity.namaMentor ?? "Mentor"}
              </p>
            </div>
          </div>
        )}

        {/* Lampiran */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 tracking-wider flex items-center gap-1.5">
            <Paperclip className="w-3.5 h-3.5" /> Lampiran ({fileUrls.length} berkas)
          </p>

          {fileUrls.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 border border-dashed border-[#2F578A]/30 dark:border-[#2F578A]/40 rounded-2xl">
              <AlertCircle className="w-7 h-7 text-[#2F578A]/40" />
              <p className="text-xs font-bold text-[#2F578A]/60 dark:text-[#F1F5F9]/40">Belum ada lampiran</p>
              <Link
                href="/dashboard/mahasiswa/kegiatan/tambah"
                className="text-[10px] font-extrabold text-[#36ADA3] hover:underline"
              >
                Tambah kegiatan baru dengan lampiran
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {fileUrls.map((url, i) => {
                const name = url.split("/").pop()?.split("?")[0] || `berkas-${i + 1}`;
                return (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3.5 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-2xl hover:border-[#36ADA3] hover:bg-[#36ADA3]/5 transition-all group"
                  >
                    <div className="p-2 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl flex-shrink-0">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#232F72] dark:text-white truncate group-hover:text-[#36ADA3] transition-colors">{name}</p>
                      <p className="text-[9px] text-[#2F578A]/60 dark:text-[#F1F5F9]/40 mt-0.5">Klik untuk membuka</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#2F578A]/30 group-hover:text-[#36ADA3] flex-shrink-0 transition-colors" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
