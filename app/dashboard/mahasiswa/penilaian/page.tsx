"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import ttdImage from "../absensi/assets/ttd-pak-agus.png";
import {
  Award, Download, TrendingUp, Scale,
  MessageSquare, User, Loader2, AlertCircle,
  CheckCircle2, Calendar, Clock, FileBarChart2, FileText
} from "lucide-react";
import { useAssessment } from "@/modules/penilaian/hooks";
import { useMyStudentProfile } from "@/modules/data_mahasiswa/hooks";
import { useDownloadPenilaianPDF } from "./useDownloadPenilaianPDF";

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
  const { profile } = useMyStudentProfile();

  const [activeTab, setActiveTab] = useState<"laporan" | "rekap">("laporan");
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

  const { download: downloadPDF, isGenerating } = useDownloadPenilaianPDF(
    profile, penilaian, assessments, ttdBase64
  );

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

  const now = new Date();
  const hari = now.toLocaleDateString("id-ID", { day: "numeric" });
  const bulan = now.toLocaleDateString("id-ID", { month: "long" });
  const tahun = now.getFullYear();

  return (
    <div className="space-y-6 relative pb-10">

      {/* ── TABS & TOMBOL DOWNLOAD ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-[#F8FAFC] dark:bg-[#121358]/60 p-1 rounded-2xl border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 w-max">
          <button
            onClick={() => setActiveTab("laporan")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "laporan"
                ? "bg-white dark:bg-[#232F72] text-[#232F72] dark:text-white shadow-sm"
                : "text-[#2F578A]/70 dark:text-[#F1F5F9]/50 hover:text-[#232F72] dark:hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileBarChart2 className="w-4 h-4" /> Laporan Penilaian
            </div>
          </button>
          <button
            onClick={() => setActiveTab("rekap")}
            disabled={!sudahDinilai}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "rekap"
                ? "bg-white dark:bg-[#232F72] text-[#232F72] dark:text-white shadow-sm"
                : "text-[#2F578A]/70 dark:text-[#F1F5F9]/50 hover:text-[#232F72] dark:hover:text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> Preview Rekap
            </div>
          </button>
        </div>
        
        {sudahDinilai && (
          <button
            onClick={downloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-extrabold
                       bg-[#232F72] dark:bg-[#36ADA3] text-white
                       hover:bg-[#1a2256] dark:hover:bg-[#2eb1a6]
                       disabled:opacity-60 disabled:cursor-not-allowed
                       shadow-[0_0_14px_rgba(35,47,114,0.25)] dark:shadow-[0_0_14px_rgba(54,173,163,0.3)]
                       transition-all active:scale-95 cursor-pointer"
          >
            {isGenerating
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Membuat PDF...</>
              : <><Download className="w-4 h-4" /> Download Rekap</>
            }
          </button>
        )}
      </div>

      {activeTab === "laporan" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* HERO HEADER */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#232F72] via-[#121358] to-[#121358] text-white relative overflow-hidden shadow-xl border-2 border-[#2F578A]/30">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-[#36ADA3]/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">

          {/* Info kiri */}
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#36ADA3] bg-[#36ADA3]/10 px-3 py-1.5 rounded-lg border-2 border-[#36ADA3]/20">
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
              <div className="flex items-center gap-3 p-4 bg-white/5 border-2 border-white/10 rounded-2xl">
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
              <div className="px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-center">
                <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <p className="text-[10px] font-black uppercase tracking-wider text-amber-400">Menunggu Penilaian</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BELUM DINILAI */}
      {!sudahDinilai && (
        <div className="border-2 border-amber-200/50 dark:border-amber-900/40 rounded-3xl p-10 bg-white dark:bg-[#121358] shadow-sm flex flex-col items-center gap-4 text-center">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200/40 text-amber-500 dark:text-amber-400 rounded-2xl">
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
          <div className="border-2 border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-5 md:p-6 bg-white dark:bg-[#121358] shadow-sm overflow-hidden">
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
                        <span className={`inline-flex items-center justify-center font-black px-3 py-1 rounded-xl text-xs border-2 ${scoreBadge(item.score)}`}>
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
                      <span className={`inline-flex items-center justify-center font-black px-3 py-1.5 rounded-xl text-sm border-2 ${scoreBadge(avg)}`}>
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
              <div className="border-2 border-[#2F578A]/30 dark:border-[#2F578A]/50 p-5 rounded-3xl bg-white dark:bg-[#121358] shadow-sm space-y-2">
                <p className="text-[10px] font-black uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#36ADA3]" /> Catatan Mentor
                </p>
                <p className="text-xs font-semibold leading-relaxed italic text-[#232F72]/80 dark:text-[#F1F5F9]/70">"{penilaian.catatan}"</p>
                <p className="text-[10px] font-bold text-[#2F578A]/60 dark:text-[#F1F5F9]/40">— {penilaian.namaMentor}</p>
              </div>
            )}
            <div className="border-2 border-[#2F578A]/30 dark:border-[#2F578A]/50 p-5 rounded-3xl bg-white dark:bg-[#121358] shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-[#2F578A]/10 dark:bg-[#232F72]/50 text-[#36ADA3] rounded-2xl border-2 border-[#2F578A]/20 flex-shrink-0">
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
      )}

      {/* ══════════════════════════════════════════════════════════════
          REKAP PENILAIAN (PREVIEW)
      ══════════════════════════════════════════════════════════════ */}

      {activeTab === "rekap" && sudahDinilai && (
        <div className="bg-white dark:bg-[#0f1535] border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          <div className="p-8 md:p-12 space-y-8 text-[#1a1a2e] dark:text-[#e8eaf6]">
            
            {/* KOP */}
            <div className="text-center space-y-1 border-b-4 border-double border-[#232F72]/30 dark:border-[#36ADA3]/30 pb-6">
              <h1 className="text-2xl font-black text-[#232F72] dark:text-white tracking-tight">REKAPITULASI PENILAIAN MAGANG</h1>
              <p className="font-extrabold text-[#2F578A]/80 dark:text-[#F1F5F9]/60 tracking-widest text-sm">DIREKTORAT WILAYAH 1</p>
            </div>

            {/* INFO MHS */}
            <div className="grid grid-cols-[130px_10px_1fr] md:grid-cols-[160px_10px_1fr] gap-y-3 text-[13px]">
              <div className="font-extrabold text-[#232F72] dark:text-[#F1F5F9]/80">Nama</div>
              <div className="font-bold">:</div>
              <div className="font-bold text-[#2F578A] dark:text-white">{profile?.name || "Budi Santoso"}</div>

              <div className="font-extrabold text-[#232F72] dark:text-[#F1F5F9]/80">NIM</div>
              <div className="font-bold">:</div>
              <div className="font-bold text-[#2F578A] dark:text-white">{profile?.nim || "2021001234"}</div>

              <div className="font-extrabold text-[#232F72] dark:text-[#F1F5F9]/80">Instansi / PT</div>
              <div className="font-bold">:</div>
              <div className="font-bold text-[#2F578A] dark:text-white">{profile?.university || "Universitas Negeri Jakarta"}</div>

              <div className="font-extrabold text-[#232F72] dark:text-[#F1F5F9]/80">Periode Magang</div>
              <div className="font-bold">:</div>
              <div className="font-bold text-[#2F578A] dark:text-white">
                {formatDate(penilaian.tanggalMulai)} – {formatDate(penilaian.tanggalBerakhir)}
              </div>
            </div>

            {/* TABEL */}
            <div className="border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#232F72] dark:bg-[#121358] text-white">
                  <tr>
                    <th className="py-3 px-4 text-center w-16 text-xs uppercase tracking-widest">No.</th>
                    <th className="py-3 px-4 text-left text-xs uppercase tracking-widest">Kriteria</th>
                    <th className="py-3 px-4 text-center w-28 text-xs uppercase tracking-widest">Nilai</th>
                    <th className="py-3 px-4 text-center w-36 text-xs uppercase tracking-widest">Capaian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2F578A]/10 dark:divide-[#2F578A]/20">
                  {assessments.map((row, idx) => {
                    const capaian = row.score >= 85 ? "Sangat Baik" : row.score >= 75 ? "Baik" : "Cukup";
                    return (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white dark:bg-transparent" : "bg-[#F8FAFC] dark:bg-[#232F72]/10"}>
                        <td className="py-2.5 px-4 text-center font-bold text-[#2F578A] dark:text-[#F1F5F9]/60">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-[#232F72] dark:text-white">{row.name}</td>
                        <td className="py-2.5 px-4 text-center font-black">
                          <span className={scoreBadge(row.score).split(" ")[0].replace("bg-", "text-")}>
                            {row.score.toFixed(1).replace('.', ',')}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center font-bold text-[#2F578A] dark:text-[#F1F5F9]/80">{capaian}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* SUMMARY KANAN */}
            <div className="flex justify-end">
              <div className="w-64 border-t-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 pt-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-extrabold text-[11px] text-[#2F578A]/70 dark:text-[#F1F5F9]/50 uppercase tracking-widest">NILAI TOTAL</span>
                  <span className={`font-black text-2xl ${color}`}>{avg.toFixed(1).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#2F578A]/70 dark:text-[#F1F5F9]/50">Grade / Capaian:</span>
                  <span className={`font-black ${color}`}>{grade} — {status}</span>
                </div>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-dashed border-[#2F578A]/25 dark:border-[#2F578A]/40" />

            <div className="flex flex-col md:flex-row justify-between gap-8 items-start">
              {/* CATATAN (Kiri) */}
              <div className="max-w-md space-y-2">
                {penilaian.catatan && penilaian.catatan !== "-" && (
                  <>
                    <p className="font-extrabold text-[11px] text-[#36ADA3] uppercase tracking-widest">Catatan Mentor:</p>
                    <p className="text-xs font-semibold leading-relaxed italic text-[#2F578A] dark:text-[#F1F5F9]/80">"{penilaian.catatan}"</p>
                  </>
                )}
              </div>

              {/* TANDA TANGAN (Kanan) */}
              <div className="flex flex-col items-end gap-1 text-[11px] flex-shrink-0">
                <p className="font-semibold text-[#2F578A]/80 dark:text-[#F1F5F9]/60">
                  Jakarta, {hari} {bulan} {tahun}
                </p>
                <div className="mt-4 flex flex-col items-center gap-3">
                  <div className="w-40 h-24 relative">
                    <Image
                      src={ttdImage}
                      alt="Tanda Tangan Direktur Wilayah 1"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-extrabold text-[13px] text-[#232F72] dark:text-white underline underline-offset-4">
                      Agus Joko Saptono
                    </p>
                    <p className="font-semibold text-[10px] text-[#2F578A]/70 dark:text-[#F1F5F9]/50 mt-0.5">
                      (Direktur Wilayah 1)
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

