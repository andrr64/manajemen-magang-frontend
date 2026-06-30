"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, Calendar, MapPin, 
  FileText, Clock, RefreshCw, Paperclip, Download, Loader2
} from "lucide-react";
import { useDownloadRekapPDF } from "../../../mahasiswa/absensi/useDownloadRekapPDF";
import ttdImage from "../../../mahasiswa/absensi/assets/ttd-pak-agus.png";
import { useRekapDetailAbsensi } from "@/modules/data_absensi/hooks";
import { mahasiswaAPI } from "@/modules/data_mahasiswa/api";
import { Student } from "@/modules/data_mahasiswa/types";
import { mediaAPI } from "@/modules/media/api";

export default function DetailAbsensiClient({ mahasiswaId }: { mahasiswaId: string }) {
  const router = useRouter();
  
  const [student, setStudent] = useState<Student | null>(null);
  const [loadingStudent, setLoadingStudent] = useState(true);

  useEffect(() => {
    mahasiswaAPI.getStudentById(mahasiswaId)
      .then(res => setStudent(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoadingStudent(false));
  }, [mahasiswaId]);

  const todayISO = new Date().toISOString().split("T")[0];
  const { data: rekapData, isLoading: loadingRekap } = useRekapDetailAbsensi(student?.tanggalMulai || "", todayISO, mahasiswaId);



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

  const sortedRekapData = useMemo(() => {
    return [...rekapData].sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
  }, [rekapData]);

  const chronologicalHistory = useMemo(() => {
    return sortedRekapData.map((r, i) => {
      const typeRaw = (r.status || "alpha").toLowerCase();
      const type = typeRaw === "hadir" ? "Hadir" :
                   typeRaw === "izin" ? "Izin" :
                   typeRaw === "sakit" ? "Sakit" : "Alpha";
                   
      return {
        id: `rekap-${i}`,
        date: new Date(r.tanggal).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
        tanggalISO: r.tanggal,
        type: type as any,
        checkIn: "-- : --",
        checkOut: "-- : --",
        document: null,
        status: "Diverifikasi" as any,
      };
    });
  }, [sortedRekapData]);

  const { download: downloadPDF, isGenerating: isGeneratingPDF } = useDownloadRekapPDF(
    student, chronologicalHistory, ttdBase64
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
            Detail Absensi Mahasiswa
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            ID: {mahasiswaId}
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-white dark:bg-[#121358]/60 border border-slate-100 dark:border-[#2F578A]/40 shadow-xl shadow-indigo-100/20 dark:shadow-none min-h-[160px]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        
        {loadingStudent ? (
           <div className="flex flex-col items-center justify-center py-6 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 relative z-10">
             <RefreshCw className="w-6 h-6 animate-spin mb-2 text-[#232F72] dark:text-white" />
             <span className="font-bold text-xs">Memuat profil...</span>
           </div>
        ) : student ? (
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-tr ${student.avatarColor || "from-blue-500 to-indigo-600"} text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-indigo-200 dark:shadow-none shrink-0`}>
              {student.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                  {student.name}
                </h2>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {student.nim} • {student.university}
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  Periode: {student.period}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  Jurusan: {student.program || "-"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-rose-500 py-6 font-bold relative z-10">
            Profil mahasiswa tidak ditemukan.
          </div>
        )}
      </div>

      {/* Detailed History Table */}
      <div className="bg-white dark:bg-[#121358]/60 border border-slate-100 dark:border-[#2F578A]/40 rounded-3xl p-6 shadow-lg shadow-indigo-100/10 dark:shadow-none">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-[#232F72] dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4" /> Riwayat Kehadiran Lengkap
          </h3>
          <div className="flex items-center gap-2">
            {!loadingRekap && rekapData.length > 0 && (
              <>

                <button
                  onClick={downloadPDF}
                  disabled={isGeneratingPDF}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#232F72] hover:bg-[#1a2256] text-white rounded-lg text-[10px] font-extrabold shadow-sm shadow-[#232F72]/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingPDF ? <><Loader2 className="w-3.5 h-3.5 animate-spin"/> PDF...</> : <><Download className="w-3.5 h-3.5" /> PDF</>}
                </button>
                <span className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] font-extrabold text-slate-500 border border-slate-200 dark:border-slate-700">
                  {rekapData.length} Catatan
                </span>
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#2F578A]/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">
                <th className="pb-4 w-1/2">Tanggal</th>
                <th className="pb-4 w-1/2">Status</th>
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
              ) : sortedRekapData.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-12 text-center text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-bold">
                    Tidak ada riwayat kehadiran ditemukan.
                  </td>
                </tr>
              ) : (
                sortedRekapData.map((row, idx) => {
                  const date = row.tanggal;
                  const statusRaw = (row.status || "alpha").toLowerCase();
                  const statusFormatted = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);

                  return (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#232F72]/50 transition-colors">
                      <td className="py-4 text-center text-slate-800 dark:text-slate-200">
                        {new Date(date).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${
                          statusRaw === "hadir" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50" :
                          statusRaw === "izin" ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50" :
                          statusRaw === "sakit" ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50" :
                          "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50"
                        }`}>
                          {statusFormatted}
                        </span>
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
