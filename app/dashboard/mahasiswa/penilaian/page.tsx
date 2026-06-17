"use client";

import { useMemo } from "react";
import {
  Award, Download, TrendingUp, Scale,
  MessageSquare, User, Loader2, AlertCircle,
  CheckCircle2, Calendar, Clock,
} from "lucide-react";
import { useAssessment } from "@/modules/penilaian/hooks";

function formatDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function scoreBadge(score: number) {
  if (score >= 85) return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/40";
  if (score >= 75) return "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200/40";
  return "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200/40";
}

function scoreBar(score: number) {
  if (score >= 85) return "bg-emerald-500";
  if (score >= 75) return "bg-blue-500";
  return "bg-amber-500";
}

function gradeInfo(avg: number) {
  if (avg >= 85) return { grade: "A", status: "Sangat Memuaskan", color: "text-[#36ADA3]" };
  if (avg >= 75) return { grade: "B", status: "Memuaskan",        color: "text-blue-400"  };
  return          { grade: "C", status: "Cukup",                  color: "text-amber-400" };
}

export default function StudentPenilaianPage() {
  const { penilaian, assessments, isLoading, error } = useAssessment();

  const avg = Number(penilaian?.nilaiTotal ?? 0);
  const { grade, status, color } = gradeInfo(avg);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-[#2F578A]/80 dark:text-[#F1F5F9]/50">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-bold">Memuat data penilaian...</span>
        </div>
      </div>
    );
  }

  // Tidak ada periode magang aktif sama sekali
  if (!penilaian) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="p-4 bg-[#2F578A]/10 dark:bg-[#232F72]/40 text-[#232F72] dark:text-white rounded-2xl">
          <Award className="w-8 h-8" />
        </div>
        <p className="font-extrabold text-sm text-[#232F72] dark:text-white">Tidak ada periode magang aktif</p>
        <p className="text-xs text-[#2F578A]/80 dark:text-[#F1F5F9]/50 max-w-xs">
          Data penilaian hanya tersedia untuk mahasiswa yang sedang aktif menjalani magang.
        </p>
      </div>
    );
  }

  const sudahDinilai = penilaian.statusPenilaian === "SUDAH_DINILAI";

  return (
    <div className="space-y-6 pb-10">

      {/* HERO HEADER */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#232F72] via-[#121358] to-[#121358] text-white relative overflow-hidden shadow-xl border border-[#2F578A]/30">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-[#36ADA3]/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">

          {/* Info kiri */}
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#36ADA3] bg-[#36ADA3]/10 px-3 py-1.5 rounded-lg border border-[#36ADA3]/20">
              <Award className="w-3.5 h-3.5" /> Penilaian Magang
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Rekapitulasi Nilai dari Mentor
            </h3>

            {/* Periode magang */}
            <div className="flex items-center gap-2 text-xs text-[#F1F5F9]/70 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#36ADA3] flex-shrink-0" />
              <span>
                {formatDate(penilaian.tanggalMulai)} — {formatDate(penilaian.tanggalBerakhir)}
              </span>
            </div>

            {/* Mentor */}
            <div className="flex items-center gap-2 text-xs text-[#F1F5F9]/70 font-semibold">
              <User className="w-3.5 h-3.5 text-[#36ADA3] flex-shrink-0" />
              {sudahDinilai && penilaian.namaMentor
                ? <span>Dinilai oleh: <span className="text-white font-black">{penilaian.namaMentor}</span></span>
                : <span className="text-[#F1F5F9]/40 italic">Belum ada penilaian dari mentor</span>
              }
            </div>
          </div>

          {/* Nilai kanan */}
          <div className="flex gap-3 items-center flex-shrink-0">
            {sudahDinilai ? (
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-center">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#F1F5F9]/70 block">Nilai Akhir</span>
                  <span className="text-3xl font-black text-white mt-0.5 block">{avg.toFixed(2)}</span>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div className="text-center">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#F1F5F9]/70 block">Grade</span>
                  <span className={`text-3xl font-black mt-0.5 block ${color}`}>{grade}</span>
                </div>
              </div>
            ) : (
              <div className="px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <p className="text-[10px] font-black uppercase tracking-wider text-amber-400">Menunggu Penilaian</p>
              </div>
            )}
            {sudahDinilai && (
              <button onClick={() => window.print()} className="p-4 bg-white text-[#232F72] rounded-2xl hover:bg-[#F8FAFC] transition-all flex flex-col items-center gap-1 cursor-pointer active:scale-95">
                <Download className="w-5 h-5 text-[#36ADA3]" />
                <span className="text-[9px] uppercase font-extrabold">Cetak</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BELUM DINILAI */}
      {!sudahDinilai && (
        <div className="border border-amber-200/50 dark:border-amber-900/40 rounded-3xl p-10 bg-white dark:bg-[#121358] shadow-sm flex flex-col items-center gap-4 text-center">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/40 text-amber-500 dark:text-amber-400 rounded-2xl">
            <Clock className="w-8 h-8" />
          </div>
          <p className="font-extrabold text-sm text-[#232F72] dark:text-white">Penilaian belum tersedia</p>
          <p className="text-xs text-[#2F578A]/80 dark:text-[#F1F5F9]/50 max-w-sm leading-relaxed">
            Mentor Anda belum mengisi nilai untuk periode magang ini.<br />
            Silakan hubungi mentor untuk meminta penilaian.
          </p>
        </div>
      )}

      {/* TABEL KRITERIA — hanya tampil jika SUDAH_DINILAI */}
      {sudahDinilai && (
        <>
          <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-5 md:p-6 bg-white dark:bg-[#121358] shadow-sm overflow-hidden">
            <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#36ADA3]" /> Rincian Per Kriteria
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse">
                <thead>
                  <tr className="border-b border-[#2F578A]/20 dark:border-[#2F578A]/40 text-[10px] font-bold text-[#2F578A] dark:text-[#F1F5F9]/60 uppercase tracking-widest text-left">
                    <th className="pb-3 pl-4 w-10">No</th>
                    <th className="pb-3">Kriteria</th>
                    <th className="pb-3 text-center w-20">Nilai</th>
                    <th className="pb-3 w-44">Capaian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2F578A]/10 dark:divide-[#2F578A]/30 text-xs">
                  {assessments.map((item, i) => (
                    <tr key={item.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#232F72]/20 transition-colors">
                      <td className="py-3.5 pl-4 font-extrabold text-[#2F578A]/60 dark:text-[#F1F5F9]/40">{i + 1}</td>
                      <td className="py-3.5 pr-4">
                        <p className="font-extrabold text-[#232F72] dark:text-white">{item.name}</p>
                        <p className="text-[10px] text-[#2F578A]/70 dark:text-[#F1F5F9]/50 mt-0.5">{item.desc}</p>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className={`inline-flex items-center justify-center font-black px-3 py-1 rounded-xl text-xs border ${scoreBadge(item.score)}`}>
                          {item.score.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="w-full bg-[#F1F5F9] dark:bg-[#232F72]/40 rounded-full h-2 overflow-hidden">
                          <div className={`h-2 rounded-full transition-all duration-700 ${scoreBar(item.score)}`} style={{ width: `${Math.min(item.score, 100)}%` }} />
                        </div>
                        <span className="text-[9px] text-[#2F578A]/60 dark:text-[#F1F5F9]/40 mt-0.5 block">
                          {item.score >= 85 ? "Sangat Baik" : item.score >= 75 ? "Baik" : "Cukup"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 bg-[#F8FAFC] dark:bg-[#232F72]/20">
                    <td colSpan={2} className="py-3.5 pl-4 font-black text-xs text-[#232F72] dark:text-white">NILAI TOTAL</td>
                    <td className="py-3.5 text-center">
                      <span className={`inline-flex items-center justify-center font-black px-3 py-1.5 rounded-xl text-sm border ${scoreBadge(avg)}`}>
                        {avg.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`text-xs font-extrabold ${color}`}>Grade {grade} — {status}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Catatan + Skala */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {penilaian.catatan && penilaian.catatan !== "-" && (
              <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 p-5 rounded-3xl bg-white dark:bg-[#121358] shadow-sm space-y-2">
                <p className="text-[10px] font-black uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#36ADA3]" /> Catatan Mentor
                </p>
                <p className="text-xs font-semibold leading-relaxed italic text-[#232F72]/80 dark:text-[#F1F5F9]/70">"{penilaian.catatan}"</p>
                <p className="text-[10px] font-bold text-[#2F578A]/60 dark:text-[#F1F5F9]/40">— {penilaian.namaMentor}</p>
              </div>
            )}
            <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 p-5 rounded-3xl bg-white dark:bg-[#121358] shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-[#2F578A]/10 dark:bg-[#232F72]/50 text-[#36ADA3] rounded-2xl border border-[#2F578A]/20 flex-shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-black uppercase tracking-wider block mb-1.5">Skala Grade</span>
                <div className="space-y-1 text-[10px] font-extrabold">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Grade A — ≥ 85</div>
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400"><CheckCircle2 className="w-3 h-3" /> Grade B — 75–84</div>
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400"><CheckCircle2 className="w-3 h-3" /> Grade C — &lt; 75</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
