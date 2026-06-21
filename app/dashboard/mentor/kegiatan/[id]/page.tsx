"use client";

import React, { use, useState, useMemo } from "react";
import Link from "next/link";
import {
  Mail, Phone, School,
  Calendar, FileText, Paperclip,
  Check, X, CheckCircle, AlertCircle,
  Clock, ArrowLeft, ExternalLink, RefreshCw,
} from "lucide-react";
import { useMentorActivities } from "@/modules/data_kegiatan/hooks";
import { useStudents } from "@/modules/data_mahasiswa/hooks";
import { mediaAPI } from "@/modules/media/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MentorActivityDetailPage({ params }: PageProps) {
  const { id: activityId } = use(params);

  const { activities, isLoading, approveActivity, rejectActivity, getFileUrls } = useMentorActivities();
  const { rawStudents } = useStudents();

  const [successToast, setSuccessToast] = useState("");
  const [optimisticStatus, setOptimisticStatus] = useState<"Disetujui" | "Dalam Review" | null>(null);

  const activity = useMemo(
    () => activities.find(a => String(a.id) === String(activityId)),
    [activities, activityId]
  );

  const student = useMemo(
    () => activity ? rawStudents.find(s => String(s.id) === String(activity.studentId)) : undefined,
    [activity, rawStudents]
  );

  const fileUrls = useMemo(
    () => activity ? getFileUrls(activity) : [],
    [activity, getFileUrls]
  );

  const currentStatus = optimisticStatus ?? activity?.status;

  function toast(msg: string) { setSuccessToast(msg); setTimeout(() => setSuccessToast(""), 4000); }

  const handleApprove = async () => {
    if (!activity) return;
    try {
      await approveActivity(activity.id);
      setOptimisticStatus("Disetujui");
      toast("Kegiatan berhasil disetujui.");
    } catch (err: any) {
      alert(err.message || "Gagal menyetujui kegiatan.");
    }
  };

  const handleReject = async () => {
    if (!activity) return;
    if (!confirm(`Tolak dan hapus kegiatan "${activity.activityName}"?`)) return;
    try {
      await rejectActivity(activity.id);
      toast("Kegiatan ditolak.");
      setTimeout(() => window.location.href = "/dashboard/mentor/kegiatan", 1500);
    } catch (err: any) {
      alert(err.message || "Gagal menolak kegiatan.");
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-[#2F578A]/80 dark:text-[#F1F5F9]/50">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-bold">Memuat data kegiatan...</span>
        </div>
      </div>
    );
  }

  // Not found
  if (!activity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400" />
        <p className="font-extrabold text-[#232F72] dark:text-white">Kegiatan tidak ditemukan</p>
        <p className="text-xs text-[#2F578A]/80 dark:text-[#F1F5F9]/50">ID: {activityId}</p>
        <Link href="/dashboard/mentor/kegiatan" className="px-5 py-2.5 bg-[#232F72] text-white text-xs font-extrabold rounded-xl hover:brightness-110 transition-all">
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">

      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold max-w-sm">
          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          {successToast}
        </div>
      )}

      {/* Back nav */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/mentor/kegiatan" className="inline-flex items-center gap-2 text-xs font-bold text-[#2F578A] dark:text-[#F1F5F9]/70 hover:text-[#232F72] dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Log Kegiatan
        </Link>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border ${
          currentStatus === "Disetujui"
            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/40"
            : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/40 animate-pulse"
        }`}>
          {currentStatus === "Disetujui" ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
          {currentStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT — Profil Mahasiswa */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 bg-white dark:bg-[#121358] shadow-sm space-y-4">
            {student ? (
              <>
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${student.avatarColor} text-white font-extrabold flex items-center justify-center text-xl shadow-lg`}>
                    {student.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-[#232F72] dark:text-white">{student.name}</p>
                    <p className="text-[10px] font-bold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 mt-0.5">NIM: {student.nim}</p>
                  </div>
                </div>

                <hr className="border-[#2F578A]/20 dark:border-[#2F578A]/40" />

                <div className="space-y-2 text-xs font-semibold text-[#2F578A] dark:text-[#F1F5F9]/70">
                  <div className="flex items-center gap-2">
                    <School className="w-3.5 h-3.5 text-[#36ADA3] flex-shrink-0" />
                    <span className="truncate">{student.university || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#36ADA3] flex-shrink-0" />
                    <a href={`mailto:${student.email}`} className="hover:underline truncate">{student.email || "-"}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#36ADA3] flex-shrink-0" />
                    <span>{student.phone || "-"}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6 space-y-2">
                <AlertCircle className="w-8 h-8 text-[#2F578A]/40 mx-auto" />
                <p className="text-xs font-bold text-[#2F578A]/80 dark:text-[#F1F5F9]/50">Data profil mahasiswa tidak tersedia</p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT — Detail Kegiatan */}
        <div className="lg:col-span-8 space-y-5">

          {/* Card utama kegiatan */}
          <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 bg-white dark:bg-[#121358] shadow-sm space-y-5">

            {/* Judul */}
            <div className="pb-4 border-b border-[#2F578A]/10 dark:border-[#2F578A]/30">
              <h3 className="font-extrabold text-base text-[#232F72] dark:text-white leading-snug">{activity.activityName}</h3>
            </div>

            {/* Waktu */}
            <div className="p-4 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-2xl">
              <p className="text-[10px] font-black uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 tracking-wider flex items-center gap-1.5 mb-3">
                <Calendar className="w-3.5 h-3.5" /> Waktu Pelaksanaan
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Tahun",   val: activity.year },
                  { label: "Bulan",   val: activity.month },
                  { label: "Tanggal", val: `Tgl. ${activity.day}` },
                ].map(({ label, val }) => (
                  <div key={label} className="p-2.5 bg-white dark:bg-[#121358] border border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-xl">
                    <span className="text-[9px] font-extrabold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block uppercase">{label}</span>
                    <span className="text-xs font-black text-[#232F72] dark:text-white mt-0.5 block">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keterangan */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Keterangan
              </p>
              <p className="text-xs font-semibold leading-relaxed text-[#232F72]/80 dark:text-[#F1F5F9]/80">
                {activity.deskripsi || <span className="italic text-[#2F578A]/60">Tidak ada deskripsi.</span>}
              </p>
            </div>

            {/* Lampiran */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-black uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 tracking-wider flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5" /> Berkas Lampiran ({fileUrls.length})
              </p>

              {fileUrls.length === 0 ? (
                <div className="p-4 border border-dashed border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-2xl text-center space-y-1">
                  <AlertCircle className="w-6 h-6 text-[#2F578A]/40 mx-auto" />
                  <p className="text-xs font-bold text-[#2F578A]/60 dark:text-[#F1F5F9]/40">Tidak ada lampiran yang diunggah</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {fileUrls.map((url, i) => {
                    const name = url.split("/").pop() || `berkas-${i + 1}`;
                    return (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-2xl hover:border-[#36ADA3] hover:bg-[#36ADA3]/5 transition-all group"
                      >
                        <div className="p-2 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl flex-shrink-0">
                          <Paperclip className="w-4 h-4" />
                        </div>
                        <span className="flex-1 text-xs font-bold text-[#232F72] dark:text-white truncate group-hover:text-[#36ADA3] transition-colors">{name}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#2F578A]/40 group-hover:text-[#36ADA3] flex-shrink-0 transition-colors" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tombol aksi */}
            {currentStatus === "Dalam Review" && (
              <div className="pt-4 border-t border-[#2F578A]/10 dark:border-[#2F578A]/30 flex items-center justify-end gap-3 flex-wrap">
                <span className="text-[10px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-bold mr-auto flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Belum diverifikasi
                </span>
                <button onClick={handleReject} className="px-4 py-2 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 bg-white dark:bg-transparent hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" /> Tolak
                </button>
                <button onClick={handleApprove} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 shadow-md flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Setujui
                </button>
              </div>
            )}

            {currentStatus === "Disetujui" && (
              <div className="pt-4 border-t border-[#2F578A]/10 dark:border-[#2F578A]/30 flex justify-end">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 rounded-xl text-xs font-bold">
                  <CheckCircle className="w-3.5 h-3.5" /> Disetujui Pembimbing
                </span>
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
}
