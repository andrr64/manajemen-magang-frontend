"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, RefreshCw, AlertCircle, Calendar, Download, Loader2
} from "lucide-react";
import { useDownloadKegiatanMentorPDF } from "../useDownloadKegiatanMentorPDF";
import { useRekapKegiatan } from "@/modules/data_kegiatan/hooks";
import { mahasiswaAPI } from "@/modules/data_mahasiswa/api";
import { Student } from "@/modules/data_mahasiswa/types";

import ttdImage from "../../../mahasiswa/absensi/assets/ttd-pak-agus.png";

export default function DetailKegiatanClient({ mahasiswaId }: { mahasiswaId: string }) {
  const router = useRouter();
  
  const [student, setStudent] = useState<Student | null>(null);
  const [loadingStudent, setLoadingStudent] = useState(true);

  useEffect(() => {
    mahasiswaAPI.getStudentById(mahasiswaId)
      .then(res => setStudent(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoadingStudent(false));
  }, [mahasiswaId]);

  const { data: rekapData, isLoading: loadingRekap } = useRekapKegiatan(mahasiswaId);

  const [ttdBase64, setTtdBase64] = useState<string | null>(null);
  useEffect(() => {
    const src = typeof ttdImage === "string" ? ttdImage : (ttdImage as any).src;
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      setTtdBase64(canvas.toDataURL("image/png"));
    };
  }, []);

  const { download: downloadPDF, isGenerating: isGeneratingPDF } = useDownloadKegiatanMentorPDF(
    rekapData,
    ttdBase64,
    { approved: 0, pending: 0, total: 0 }
  );

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121358]/40 hover:bg-slate-50 dark:hover:bg-[#232F72] text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#232F72] dark:text-white flex items-center gap-2">
            Detail Rekap Kegiatan Mahasiswa
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            ID: {mahasiswaId}
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-white dark:bg-[#121358]/60 border border-slate-100 dark:border-[#2F578A]/40 shadow-xl shadow-indigo-100/20 dark:shadow-none min-h-[160px]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-teal-500/10 to-transparent rounded-full -ml-10 -mb-10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr ${student?.avatarColor || "from-slate-400 to-slate-500"} text-white font-extrabold flex items-center justify-center text-3xl shadow-lg ring-4 ring-white/50 dark:ring-white/10`}>
              {(student?.name || "U").split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
            </div>
            <div>
              {loadingStudent ? (
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg" />
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg" />
                </div>
              ) : student ? (
                <>
                  <h2 className="text-xl md:text-2xl font-black text-[#232F72] dark:text-white">{student.name}</h2>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">{student.nim}</p>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{student.university}</p>
                </>
              ) : (
                <h2 className="text-xl font-bold text-slate-400">Mahasiswa tidak ditemukan</h2>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            {student && (
              <>
                <button
                  onClick={downloadPDF}
                  disabled={isGeneratingPDF || loadingRekap || rekapData.length === 0}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#232F72] hover:bg-[#1a2256] text-white rounded-xl text-xs font-extrabold shadow-md shadow-[#232F72]/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingPDF ? <><Loader2 className="w-4 h-4 animate-spin"/> Membuat PDF...</> : <><Download className="w-4 h-4" /> Ekspor Rekap</>}
                </button>
                <span className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] font-extrabold text-slate-500 border border-slate-200 dark:border-slate-700">
                  {rekapData.length} Kegiatan
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#2F578A]/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">
                <th className="pb-4 w-1/4">Tanggal</th>
                <th className="pb-4 w-3/4">Nama Kegiatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-[#2F578A]/30 text-xs font-semibold">
              {loadingRekap ? (
                <tr>
                  <td colSpan={2} className="py-12 text-center text-[#2F578A]/80 dark:text-[#F1F5F9]/50">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#232F72] dark:text-white" />
                    Memuat riwayat...
                  </td>
                </tr>
              ) : rekapData.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-12 text-center text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-bold">
                    Tidak ada kegiatan ditemukan.
                  </td>
                </tr>
              ) : (
                rekapData.map((row, idx) => {
                  const date = row.waktu.split("T")[0];

                  return (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#232F72]/50 transition-colors">
                      <td className="py-4 text-center text-slate-800 dark:text-slate-200">
                        {new Date(date).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </td>
                      <td className="py-4 text-center text-[#232F72] dark:text-white font-extrabold">
                        {row.namaKegiatan}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
