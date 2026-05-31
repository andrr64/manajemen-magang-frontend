"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Award, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  User, 
  School,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { studentsData, Student } from "../data-mahasiswa/studentsData";
import { useStudentAssessments } from "@/modules/penilaian/hooks";

export default function MentorPenilaianPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  // Instantiating real assessments hook
  const { assessments, isLoading, refreshAssessments } = useStudentAssessments();

  // Reactive Effect to fetch assessments from API whenever filters change
  useEffect(() => {
    refreshAssessments(statusFilter, searchQuery);
  }, [statusFilter, searchQuery, refreshAssessments]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("Semua");
  };

  // Map student evaluation list response to view models
  const enrichedStudents = useMemo(() => {
    return assessments.map(item => {
      const studentIdNum = item.mahasiswaId ? parseInt(item.mahasiswaId.toString(), 10) : 0;
      const student = studentsData.find(s => s.id === studentIdNum || s.nim === item.nim);
      return {
        id: item.mahasiswaId,
        name: item.namaMahasiswa,
        nim: item.nim,
        university: student ? student.university : "Universitas Mitra",
        company: student ? student.company : "Kantor Mitra",
        avatarColor: student ? student.avatarColor : "from-indigo-500 to-cyan-500",
        grade: item.nilaiTotal,
        penilaianId: item.penilaianId
      };
    });
  }, [assessments]);

  const filteredStudents = enrichedStudents;

  // Calculate assessment quick statistics reactively
  const stats = useMemo(() => {
    const total = assessments.length;
    const graded = assessments.filter(s => s.penilaianId !== null).length;
    const pending = total - graded;
    const ratio = total > 0 ? ((graded / total) * 100).toFixed(1) : "0.0";
    return { total, graded, pending, ratio };
  }, [assessments]);

  return (
    <div className="space-y-6">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Lembar Penilaian Akhir Mahasiswa Magang
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Evaluasi performa akhir magang bimbingan Anda berdasarkan parameter kedisiplinan, kinerja teknis, dan laporan tertulis.
          </p>
        </div>

        {/* Reset Filters */}
        <button 
          onClick={handleResetFilters}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#070e24]/40 transition-all cursor-pointer active:scale-95 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Filter
        </button>
      </div>

      {/* METRIC STATISTICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Bimbingan", value: stats.total, desc: "Mahasiswa Terdaftar", icon: User, color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/50 dark:border-indigo-900/40" },
          { label: "Sudah Dinilai", value: stats.graded, desc: "Rekomendasi Lulus", icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40" },
          { label: "Belum Dinilai", value: stats.pending, desc: "Segera Input Nilai", icon: Clock, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-900/40" },
          { label: "Penyelesaian", value: `${stats.ratio}%`, desc: "Rasio Evaluasi Akhir", icon: TrendingUp, color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border-sky-200/50 dark:border-sky-900/40" }
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className={`p-4 rounded-2xl border ${item.color} flex justify-between items-start shadow-sm`}>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-85 block">{item.label}</span>
                <div className="flex items-baseline mt-2">
                  <span className="text-2xl font-black tracking-tight">{item.value}</span>
                </div>
                <span className="text-[10px] font-semibold opacity-75 block pt-1.5">{item.desc}</span>
              </div>
              <div className="p-2 bg-white/40 dark:bg-black/20 rounded-xl">
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTER PANEL */}
      <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Pencarian & Penyaringan Evaluasi</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Keyword Search (8 Cols) */}
          <div className="md:col-span-8 relative">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block mb-1.5">
              Cari Mahasiswa
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama mahasiswa, NIM, universitas, atau mitra industri..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Assessment Status Filter (4 Cols) */}
          <div className="md:col-span-4">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block mb-1.5">
              Status Input Nilai
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300"
            >
              <option value="Semua">Semua Status</option>
              <option value="Sudah Dinilai">Sudah Dinilai</option>
              <option value="Belum Dinilai">Belum Dinilai</option>
            </select>
          </div>

        </div>
      </div>

      {/* ASSESSMENT TABLE */}
      <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#070e24]/40 flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">
                <th className="pb-3.5 pl-4 font-bold">Nama Lengkap</th>
                <th className="pb-3.5 font-bold">ID Mahasiswa (NIM)</th>
                <th className="pb-3.5 font-bold">Universitas Asal</th>
                <th className="pb-3.5 font-bold text-center">Rata-rata Nilai</th>
                <th className="pb-3.5 font-bold text-center">Status Penilaian</th>
                <th className="pb-3.5 pr-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                      <p className="text-slate-500 dark:text-slate-400 font-extrabold text-xs">
                        Memuat data penilaian mahasiswa...
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px]">
                        Silakan tunggu sebentar, sedang mengambil data dari server.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.map((student) => {
                const isGraded = student.penilaianId !== null && student.penilaianId !== undefined;
                
                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors group">
                    
                    {/* Column 1: Nama (Interactive click to detail) */}
                    <td className="py-4 pl-4">
                      <Link href={`/dashboard/mentor/penilaian/${student.id}`} className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${student.avatarColor} text-white font-extrabold flex items-center justify-center text-xs shadow-inner shadow-indigo-500/10 group-hover:scale-105 transition-transform`}>
                          {student.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                            {student.name}
                          </p>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mt-0.5">
                            Mitra: {student.company}
                          </span>
                        </div>
                      </Link>
                    </td>

                    {/* Column 2: ID Mahasiswa (NIM) */}
                    <td className="py-4 font-bold text-slate-700 dark:text-slate-300">
                      <Link href={`/dashboard/mentor/penilaian/${student.id}`} className="block w-full py-1">
                        {student.nim}
                      </Link>
                    </td>

                    {/* Column 3: Universitas Asal */}
                    <td className="py-4">
                      <Link href={`/dashboard/mentor/penilaian/${student.id}`} className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold">
                        <School className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{student.university}</span>
                      </Link>
                    </td>

                    {/* Column 4: Rata-rata Nilai */}
                    <td className="py-4 text-center font-black text-sm">
                      {isGraded ? (
                        <span className="text-indigo-600 dark:text-indigo-400 font-black">{student.grade}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Column 5: Status Penilaian */}
                    <td className="py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${
                        isGraded
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40"
                          : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/40"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isGraded ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {isGraded ? "Sudah Dinilai" : "Belum Dinilai"}
                      </span>
                    </td>

                    {/* Column 6: Aksi */}
                    <td className="py-4 pr-4 text-right">
                      <Link 
                        href={`/dashboard/mentor/penilaian/${student.id}`}
                        className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-[10px] font-black transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm ${
                          isGraded
                            ? "bg-slate-100 dark:bg-slate-900 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-transparent"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10"
                        }`}
                      >
                        {isGraded ? "Edit Nilai" : "Beri Nilai"}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>

                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="max-w-md mx-auto space-y-2">
                      <AlertCircle className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
                      <p className="text-slate-400 dark:text-slate-500 font-extrabold text-xs">
                        Tidak ada bimbingan beraliran filter ini
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] leading-relaxed">
                        Coba sesuaikan kata kunci pencarian atau setel ulang filter status evaluasi Anda.
                      </p>
                      <button 
                        onClick={handleResetFilters}
                        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg border border-indigo-200/40 dark:border-indigo-900/40 hover:bg-indigo-100 transition-all cursor-pointer mt-1"
                      >
                        Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
