"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Scroll, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  User, 
  School,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Paperclip,
  FileText
} from "lucide-react";
import { studentsData } from "../data-mahasiswa/studentsData";
import { useStudentReferenceLetters } from "@/modules/surat-keterangan/hooks";
import { useStudents } from "@/modules/mahasiswa/hooks";

export default function MentorReferenceLetterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  // Real hook integration
  const { letters, statistics, isLoading, refreshLetters } = useStudentReferenceLetters();
  const { rawStudents } = useStudents();
  const studentsList = rawStudents;

  // Fetch data reactively
  useEffect(() => {
    const backendStatus = statusFilter === "Semua" ? "semua status" : statusFilter;
    refreshLetters(backendStatus, searchQuery);
  }, [statusFilter, searchQuery, refreshLetters]);

  // Map student info
  const enrichedLetters = useMemo(() => {
    return letters.map(letLog => {
      const student = studentsList.find(s => s.nim === letLog.nim || s.name === letLog.namaMahasiswa);
      const studentId = student ? student.id : letLog.mahasiswaId;
      
      return {
        id: letLog.mahasiswaId,
        studentId,
        fileName: letLog.url && letLog.url !== "-" ? letLog.url.split("/").pop() || "surat_keterangan.pdf" : null,
        status: letLog.statusSurat === "Sudah Diunggah" ? "Sudah Diunggah" : "Belum Diunggah",
        studentName: letLog.namaMahasiswa,
        studentNim: letLog.nim,
        studentAvatar: student ? student.avatarColor : "from-slate-400 to-slate-500",
        studentUniv: student ? student.university : "Universitas Mitra"
      };
    });
  }, [letters, studentsList]);

  // Filter logs based on search and status select
  const filteredLetters = enrichedLetters;

  // Calculate certificate statistics
  const stats = useMemo(() => {
    const total = statistics?.totalJumlahSurat || 0;
    const uploaded = statistics?.totalSuratDiunggah || 0;
    const pending = statistics?.totalSuratBelumDiunggah || 0;
    const ratio = total > 0 ? ((uploaded / total) * 100).toFixed(1) : "0.0";
    return { total, uploaded, pending, ratio };
  }, [statistics]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("Semua");
  };

  return (
    <div className="space-y-6">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#232F72] dark:text-[#FFFFFF]">
            Surat Keterangan Selesai Magang (SKSM)
          </h3>
          <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold mt-1">
            Unggah dan kelola lembar berkas Surat Keterangan Selesai Magang bagi mahasiswa bimbingan sebagai bukti absah pelaksanaan MBKM.
          </p>
        </div>

        {/* Reset Filters */}
        <button 
          onClick={handleResetFilters}
          className="flex items-center gap-1.5 px-4 py-2 border border-[#2F578A]/50 dark:border-[#2F578A] hover:border-[#232F72] rounded-xl text-xs font-bold text-[#232F72]/80 dark:text-[#F1F5F9] bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md transition-all cursor-pointer active:scale-95 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Filter
        </button>
      </div>

      {/* METRIC STATISTICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Bimbingan", value: stats.total, desc: "Bimbingan Terdaftar", icon: User, color: "text-[#232F72] dark:text-[#FFFFFF] bg-[#F8FAFC] dark:bg-[#232F72] border-[#2F578A]/30" },
          { label: "Surat Diunggah", value: stats.uploaded, desc: "Berkas Terbit", icon: FileText, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40" },
          { label: "Belum Diunggah", value: stats.pending, desc: "Segera Proses", icon: Clock, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-900/40" },
          { label: "Penyelesaian", value: `${stats.ratio}%`, desc: "Rasio Penerbitan SKSM", icon: TrendingUp, color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border-sky-200/50 dark:border-sky-900/40" }
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
      <div className="glass-card border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#232F72] dark:text-[#FFFFFF]" />
          <h4 className="font-extrabold text-sm text-[#232F72] dark:text-[#FFFFFF]">Pencarian & Penyaringan Berkas</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Keyword Search (8 Cols) */}
          <div className="md:col-span-8 relative">
            <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mb-1.5">
              Cari Nama / NIM
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama mahasiswa, NIM, atau universitas asal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
              />
              <Search className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Status Filter (4 Cols) */}
          <div className="md:col-span-4">
            <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mb-1.5">
              Status Berkas SKSM
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#232F72] text-[#232F72]/80 dark:text-[#F1F5F9]"
            >
              <option value="Semua">Semua Status</option>
              <option value="Sudah Diunggah">Sudah Diunggah</option>
              <option value="Belum Diunggah">Belum Diunggah</option>
            </select>
          </div>

        </div>
      </div>

      {/* DATA TABLE */}
      <div className="glass-card border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b border-[#2F578A]/30 dark:border-[#2F578A] text-[10px] font-bold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 uppercase tracking-widest text-left">
                <th className="pb-3.5 pl-4 font-bold">Nama Mahasiswa</th>
                <th className="pb-3.5 font-bold">ID Mahasiswa (NIM)</th>
                <th className="pb-3.5 font-bold">Universitas Asal</th>
                <th className="pb-3.5 font-bold">Nama Berkas Surat</th>
                <th className="pb-3.5 font-bold text-center">Status Berkas</th>
                <th className="pb-3.5 pr-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2F578A]/30 dark:divide-[#2F578A]/50 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <RefreshCw className="w-8 h-8 text-[#232F72] dark:text-[#FFFFFF] animate-spin" />
                      <p className="text-[#2F578A] dark:text-[#F1F5F9]/70 font-extrabold text-xs">
                        Memuat data berkas surat keterangan...
                      </p>
                      <p className="text-[#2F578A]/80 dark:text-[#F1F5F9]/50 text-[10px]">
                        Silakan tunggu sebentar, sedang mengambil data dari server.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredLetters.map((letLog) => {
                const isUploaded = letLog.status === "Sudah Diunggah";
                
                return (
                  <tr key={letLog.studentId} className="hover:bg-[#F8FAFC]/50 dark:hover:bg-[#121358]/50 transition-colors group">
                    
                    {/* Column 1: Nama (Click to detail page) */}
                    <td className="py-4 pl-4">
                      <Link href={`/dashboard/mentor/surat-keterangan/${letLog.studentId}`} className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${letLog.studentAvatar} text-white font-extrabold flex items-center justify-center text-xs shadow-inner shadow-sm group-hover:scale-105 transition-transform`}>
                          {letLog.studentName.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#232F72] dark:text-[#FFFFFF] group-hover:text-[#232F72] dark:text-[#FFFFFF] dark:group-hover:text-[#FFFFFF] transition-colors leading-tight">
                            {letLog.studentName}
                          </p>
                          <span className="text-[10px] font-semibold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mt-0.5">
                            {letLog.studentUniv}
                          </span>
                        </div>
                      </Link>
                    </td>

                    {/* Column 2: NIM (ID Mahasiswa) */}
                    <td className="py-4 font-bold text-[#232F72]/80 dark:text-[#F1F5F9]">
                      <Link href={`/dashboard/mentor/surat-keterangan/${letLog.studentId}`} className="block w-full py-1">
                        {letLog.studentNim}
                      </Link>
                    </td>

                    {/* Column 3: Universitas */}
                    <td className="py-4">
                      <Link href={`/dashboard/mentor/surat-keterangan/${letLog.studentId}`} className="inline-flex items-center gap-1 text-[#232F72]/80 dark:text-[#F1F5F9] font-bold">
                        <School className="w-3.5 h-3.5 text-[#232F72] dark:text-[#FFFFFF]" />
                        <span>{letLog.studentUniv}</span>
                      </Link>
                    </td>

                    {/* Column 4: Nama Berkas Surat */}
                    <td className="py-4 text-slate-650 dark:text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold">
                      {isUploaded ? (
                        <div className="flex items-center gap-1.5 text-[#232F72] dark:text-[#FFFFFF]">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span className="max-w-[180px] truncate">{letLog.fileName}</span>
                        </div>
                      ) : (
                        <span className="text-[#2F578A]/80 dark:text-[#F1F5F9]/50">Belum Ada Berkas</span>
                      )}
                    </td>

                    {/* Column 5: Status */}
                    <td className="py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${
                        isUploaded
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40"
                          : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/40"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isUploaded ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {letLog.status}
                      </span>
                    </td>

                    {/* Column 6: Aksi */}
                    <td className="py-4 pr-4 text-right">
                      <Link 
                        href={`/dashboard/mentor/surat-keterangan/${letLog.studentId}`}
                        className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-[10px] font-black transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm ${
                          isUploaded
                            ? "bg-[#F1F5F9] dark:bg-[#232F72] hover:bg-[#232F72] dark:bg-[#232F72] hover:text-white dark:hover:bg-[#F1F5F9]0 text-[#232F72]/80 dark:text-[#F1F5F9] border border-[#2F578A]/50 dark:border-[#2F578A] hover:border-transparent"
                            : "bg-[#232F72] dark:bg-[#232F72] hover:opacity-90 shadow-md text-white shadow-md shadow-md"
                        }`}
                      >
                        {isUploaded ? "Kelola Surat" : "Unggah Surat"}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>

                  </tr>
                );
              })}

              {filteredLetters.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="max-w-md mx-auto space-y-2">
                      <AlertCircle className="w-8 h-8 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 mx-auto" />
                      <p className="text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-extrabold text-xs">
                        Tidak ada bimbingan beraliran filter ini
                      </p>
                      <p className="text-[#2F578A]/80 dark:text-[#F1F5F9]/50 text-[10px] leading-relaxed">
                        Coba sesuaikan kata kunci pencarian atau setel ulang filter status dokumen Anda.
                      </p>
                      <button 
                        onClick={handleResetFilters}
                        className="px-3 py-1.5 bg-[#F8FAFC] dark:bg-[#232F72] text-[#232F72] dark:text-[#FFFFFF] text-[10px] font-bold rounded-lg border border-[#2F578A]/30 hover:bg-[#F1F5F9] transition-all cursor-pointer mt-1"
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
