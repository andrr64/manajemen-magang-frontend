"use client";

import { useState, useMemo } from "react";
import { 
  Award, 
  Search, 
  CheckCircle, 
  Download, 
  TrendingUp, 
  Scale, 
  Calendar,
  MessageSquare,
  User,
  Plus,
  Loader2
} from "lucide-react";
import { useAssessment } from "@/modules/penilaian/hooks";
import { useStudentDetail } from "@/modules/mahasiswa/hooks";

interface AssessmentItem {
  id: string;
  name: string;
  desc: string;
  score: number;
  weight: number;
  feedback: string;
  attachment: string | null;
}

export default function StudentPenilaianPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState<"Semua" | "Sangat Baik" | "Baik" | "Cukup">("Semua");

  // Fetch assessments from API
  const { assessments, isLoading } = useAssessment();
  // Fetch real mentor detail
  const { student } = useStudentDetail(1);

  // Dynamic calculations for GPA/Overall Score
  const overallStats = useMemo(() => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    assessments.forEach(item => {
      totalWeightedScore += item.score * (item.weight / 100);
      totalWeight += item.weight;
    });

    const average = totalWeight > 0 ? parseFloat(totalWeightedScore.toFixed(1)) : 0;
    let grade = "C";
    let status = "Lulus Bersyarat";
    let color = "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-500/20";

    if (average >= 85) {
      grade = "A";
      status = "Lulus Sangat Memuaskan";
      color = "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/20";
    } else if (average >= 75) {
      grade = "B";
      status = "Lulus Memuaskan";
      color = "text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-500/20";
    }

    return { average, grade, status, color };
  }, [assessments]);

  // Filtered Assessments List
  const filteredAssessments = useMemo(() => {
    return assessments.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesScore = true;
      if (scoreFilter === "Sangat Baik") matchesScore = item.score >= 85;
      else if (scoreFilter === "Baik") matchesScore = item.score >= 75 && item.score < 85;
      else if (scoreFilter === "Cukup") matchesScore = item.score < 75;

      return matchesSearch && matchesScore;
    });
  }, [assessments, searchQuery, scoreFilter]);

  return (
    <div className="space-y-6 relative pb-10">
      
      {/* GPA & FINAL GRADE OVERVIEW HERO */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#232F72] via-[#121358] to-[#121358] text-white relative overflow-hidden shadow-xl shadow-[#121358]/20 border border-[#2F578A]/30">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-[#36ADA3]/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-60 h-60 bg-[#2F578A]/20 rounded-full blur-[70px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#36ADA3] bg-[#36ADA3]/10 px-3 py-1.5 rounded-lg border border-[#36ADA3]/20">
              <Award className="w-3.5 h-3.5 text-[#36ADA3]" />
              Transkrip Nilai Akademik Magang
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
              Rekapitulasi Hasil Penilaian Industri
            </h3>
            <p className="text-xs text-[#F1F5F9]/80 leading-relaxed max-w-lg font-semibold">
              Nilai diakumulasikan secara otomatis berdasarkan bobot parameter penilaian dari Dosen Pembimbing Akademik dan Mentor Lapangan.
            </p>
          </div>

          <div className="flex gap-4 items-center">
            
            {/* Average Score Ring Card */}
            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-[#F1F5F9]/70">Nilai Akhir</span>
                <span className="text-3xl font-black text-white block mt-0.5">
                  {isLoading ? <Loader2 className="w-8 h-8 animate-spin mx-auto text-white/50" /> : overallStats.average}
                </span>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="text-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-[#F1F5F9]/70">Grade</span>
                <span className="text-3xl font-black text-[#36ADA3] block mt-0.5">
                  {isLoading ? "-" : overallStats.grade}
                </span>
              </div>
            </div>

            {/* Print button */}
            <button 
              onClick={() => window.print()}
              className="p-4 bg-white text-[#232F72] rounded-2xl hover:bg-[#F8FAFC] transition-all font-black text-xs shadow-[0_0_15px_rgba(255,255,255,0.2)] flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
            >
              <Download className="w-5 h-5 text-[#36ADA3]" />
              <span className="text-[9px] tracking-wider uppercase font-extrabold text-[#232F72]">Cetak Nilai</span>
            </button>

          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="p-4 rounded-3xl border border-[#2F578A]/30 dark:border-[#2F578A]/50 bg-white dark:bg-[#121358] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Cari penilaian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-transparent focus:border-[#36ADA3] rounded-2xl text-xs font-semibold focus:outline-none transition-all dark:text-white shadow-inner"
          />
          <Search className="w-4 h-4 text-[#2F578A] dark:text-[#F1F5F9]/50 absolute left-3.5 top-3" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setScoreFilter("Semua")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              scoreFilter === "Semua"
                ? "bg-[#36ADA3] text-white shadow-[0_0_10px_rgba(54,173,163,0.3)]"
                : "bg-[#F8FAFC] dark:bg-[#232F72]/30 text-[#2F578A] dark:text-[#F1F5F9]/60 hover:bg-[#2F578A]/10 dark:hover:bg-[#232F72]/60"
            }`}
          >
            Semua ({assessments.length})
          </button>
          
          <button
            onClick={() => setScoreFilter("Sangat Baik")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              scoreFilter === "Sangat Baik"
                ? "bg-[#36ADA3] text-white shadow-[0_0_10px_rgba(54,173,163,0.3)]"
                : "bg-[#F8FAFC] dark:bg-[#232F72]/30 text-[#2F578A] dark:text-[#F1F5F9]/60 hover:bg-[#2F578A]/10 dark:hover:bg-[#232F72]/60"
            }`}
          >
            Sangat Baik (&gt;=85)
          </button>

          <button
            onClick={() => setScoreFilter("Baik")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              scoreFilter === "Baik"
                ? "bg-[#36ADA3] text-white shadow-[0_0_10px_rgba(54,173,163,0.3)]"
                : "bg-[#F8FAFC] dark:bg-[#232F72]/30 text-[#2F578A] dark:text-[#F1F5F9]/60 hover:bg-[#2F578A]/10 dark:hover:bg-[#232F72]/60"
            }`}
          >
            Baik (75-84)
          </button>
        </div>

      </div>

      {/* CORE ASSESSMENT DATA TABLE */}
      <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#121358] overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[850px] border-collapse">
            <thead>
              <tr className="border-b border-[#2F578A]/20 dark:border-[#2F578A]/40 text-[10px] font-bold text-[#2F578A] dark:text-[#F1F5F9]/60 uppercase tracking-widest text-left">
                <th className="pb-3.5 pl-4 font-bold w-12">NO</th>
                <th className="pb-3.5 font-bold w-60">Nama Penilaian</th>
                <th className="pb-3.5 font-bold text-center w-24">Nilai</th>
                <th className="pb-3.5 font-bold pl-4">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2F578A]/10 dark:divide-[#2F578A]/30 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-16 text-center text-[#2F578A] dark:text-[#F1F5F9]/50 font-extrabold">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-[#36ADA3]" />
                      Memuat data penilaian...
                    </div>
                  </td>
                </tr>
              ) : filteredAssessments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-16 text-center text-[#2F578A] dark:text-[#F1F5F9]/50 font-extrabold">
                    Tidak ada parameter penilaian magang yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredAssessments.map((item, index) => {
                  return (
                    <tr key={item.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#232F72]/30 transition-colors group">
                    
                    {/* NO */}
                    <td className="py-4 pl-4 font-extrabold text-[#2F578A] dark:text-[#F1F5F9]/60">
                      {index + 1}
                    </td>

                    {/* Nama Penilaian */}
                    <td className="py-4 pr-3">
                      <div>
                        <p className="font-extrabold text-[#232F72] dark:text-white leading-normal">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/60 font-semibold leading-relaxed mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </td>

                    {/* Nilai */}
                    <td className="py-4 text-center">
                      <span className={`inline-flex items-center justify-center font-black px-3 py-1 rounded-xl text-xs ${
                        item.score >= 85
                          ? "bg-[#36ADA3]/10 dark:bg-[#36ADA3]/20 text-[#36ADA3] border border-[#36ADA3]/30"
                          : "bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                      }`}>
                        {item.score}
                      </span>
                    </td>

                    <td className="py-4 pl-4 pr-2">
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-1.5 text-[#2F578A] dark:text-[#F1F5F9]/70">
                          <MessageSquare className="w-3.5 h-3.5 text-[#36ADA3] flex-shrink-0 mt-0.5" />
                          <p className="font-bold leading-normal italic text-[#232F72] dark:text-[#F1F5F9]/80">{item.feedback}</p>
                        </div>
                      </div>
                    </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RATING INFORMATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Mentor Signature & Identity */}
        <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 p-6 rounded-3xl bg-white dark:bg-[#121358] shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-[#2F578A]/10 dark:bg-[#232F72]/50 text-[#36ADA3] rounded-2xl border border-[#2F578A]/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/50 font-black uppercase tracking-wider block">TIM PENILAI INDEPENDEN</span>
            <h5 className="font-black text-sm text-[#232F72] dark:text-white mt-1">
              {student?.namaMentor || "Belum Ada Mentor"}
            </h5>
            <p className="text-[10px] text-[#2F578A] dark:text-[#F1F5F9]/70 mt-0.5 leading-normal">
              Dosen Pembimbing Akademik Utama • {student?.university || "Universitas"}
            </p>
          </div>
        </div>

        {/* Rubric grading scales */}
        <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 p-6 rounded-3xl bg-white dark:bg-[#121358] shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-[#2F578A]/10 dark:bg-[#232F72]/50 text-[#36ADA3] rounded-2xl border border-[#2F578A]/20">
            <Scale className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/50 font-black uppercase tracking-wider block">Grade Nilai</span>
            <div className="flex items-center justify-between flex-wrap gap-2 mt-1.5 text-[10px] font-extrabold">
              <span className="flex items-center gap-1 text-[#36ADA3]">
                <span className="w-2 h-2 rounded-full bg-[#36ADA3]" />
                Grade A (&gt;= 85)
              </span>
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Grade B (75 - 84)
              </span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Grade C (&lt; 75)
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
