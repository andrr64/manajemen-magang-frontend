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
  RefreshCw,
  Sparkles
} from "lucide-react";
import { useStudentAssessments, usePenilaianStats, usePenilaianRekap } from "@/modules/penilaian/hooks";
import { useStudents } from "@/modules/data_mahasiswa/hooks";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader, StatsGrid, StatItem } from "@/components/shared";

export default function MentorPenilaianPage() {
  const [activeTab, setActiveTab] = useState<"data" | "ekspor">("data");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const { assessments, isLoading, refreshAssessments } = useStudentAssessments();
  const { stats: apiStats } = usePenilaianStats(searchQuery);
  const { rekap, isLoading: isRekapLoading } = usePenilaianRekap();
  const { rawStudents } = useStudents();
  const studentsList = rawStudents;

  useEffect(() => {
    refreshAssessments(statusFilter, searchQuery);
  }, [statusFilter, searchQuery, refreshAssessments]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("Semua");
  };

  const enrichedStudents = useMemo(() => {
    return studentsList?.map(student => {
      const assessment = assessments.find(a => String(a.mahasiswaId) === String(student.id) || a.nim === student.nim);
      return {
        id: student.id,
        name: student.name,
        nim: student.nim,
        university: student.university || "Universitas Mitra",
        company: student.company || "Kantor Mitra",
        avatarColor: student.avatarColor || "from-[#2F578A] to-[#232F72]",
        grade: assessment ? assessment.nilaiTotal : null,
        penilaianId: assessment ? assessment.id : null
      };
    });
  }, [studentsList, assessments]);

  const filteredStudents = useMemo(() => {
    let result = enrichedStudents;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.nim.toLowerCase().includes(q) ||
        s.university.toLowerCase().includes(q) ||
        s.company.toLowerCase().includes(q)
      );
    }
    if (statusFilter === "Sudah Dinilai") {
      result = result.filter(s => s.penilaianId !== null);
    } else if (statusFilter === "Belum Dinilai") {
      result = result.filter(s => s.penilaianId === null);
    }
    return result;
  }, [enrichedStudents, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = enrichedStudents.length;
    const graded = enrichedStudents.filter(s => s.penilaianId !== null).length;
    const pending = total - graded;
    const ratio = total > 0 ? ((graded / total) * 100).toFixed(1) : "0.0";
    return { total, graded, pending, ratio };
  }, [enrichedStudents]);

  const rekapList = useMemo(() => {
    if (!rekap) return [];
    return Object.entries(rekap).map(([nama, penilaians]) => ({
      nama,
      penilaian: penilaians && penilaians.length > 0 ? penilaians[0] : null
    }));
  }, [rekap]);

  return (
    <div className="space-y-6">


      {/* METRIC STATISTICS */}
      {(() => {
        const statsConfig: StatItem[] = [
          { label: "Sudah Dinilai", value: stats.graded, desc: "Rekomendasi Lulus", colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40", icon: CheckCircle },
          { label: "Belum Dinilai", value: stats.pending, desc: "Segera Input Nilai", colorClass: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-900/40", icon: Clock },
        ];
        return <StatsGrid stats={statsConfig} gridClass="grid-cols-2" />;
      })()}

      <div className="flex border-b border-[#2F578A]/20 dark:border-[#2F578A]/50 mt-4">
        <button
          onClick={() => setActiveTab("data")}
          className={`pb-3 px-4 text-sm font-extrabold uppercase tracking-wide transition-all ${
            activeTab === "data"
              ? "border-b-2 border-[#36ADA3] text-[#232F72] dark:text-white"
              : "text-[#2F578A]/60 dark:text-[#F1F5F9]/40 hover:text-[#232F72] dark:hover:text-[#F1F5F9]"
          }`}
        >
          Data Penilaian
        </button>
        <button
          onClick={() => setActiveTab("ekspor")}
          className={`pb-3 px-4 text-sm font-extrabold uppercase tracking-wide transition-all ${
            activeTab === "ekspor"
              ? "border-b-2 border-[#36ADA3] text-[#232F72] dark:text-white"
              : "text-[#2F578A]/60 dark:text-[#F1F5F9]/40 hover:text-[#232F72] dark:hover:text-[#F1F5F9]"
          }`}
        >
          Ekspor Rekap
        </button>
      </div>

      {activeTab === "data" && (
        <div className="space-y-6">
          {/* FILTER PANEL */}
      <div className="glass-card border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#232F72] dark:text-[#FFFFFF]" />
          <h4 className="font-extrabold text-sm text-[#232F72] dark:text-[#FFFFFF]">Pencarian & Penyaringan Evaluasi</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mb-1.5">
              Cari Mahasiswa
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama mahasiswa, NIM, universitas, atau mitra industri..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
              />
              <Search className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-3.5 top-3" />
            </div>
          </div>
          <div className="md:col-span-4">
            <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mb-1.5">
              Status Input Nilai
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#232F72] text-[#232F72]/80 dark:text-[#F1F5F9]"
            >
              <option value="Semua">Semua Status</option>
              <option value="Sudah Dinilai">Sudah Dinilai</option>
              <option value="Belum Dinilai">Belum Dinilai</option>
            </select>
          </div>
        </div>
      </div>

      {/* ASSESSMENT TABLE */}
      <DataTable
        data={filteredStudents ?? []}
        loading={isLoading}
        emptyMessage="Tidak ada mahasiswa yang cocok dengan filter. Coba reset filter."
        className="rounded-3xl"
        columns={[
          {
            key: "nama",
            label: "Nama Lengkap",
            render: (student) => (
              <Link href={`/dashboard/mentor/penilaian/${student.id}`} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${student.avatarColor} text-white font-extrabold flex items-center justify-center text-xs shadow-inner group-hover:scale-105 transition-transform`}>
                  {(student?.name || "U").split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
                </div>
                <div>
                  <p className="font-extrabold text-[#232F72] dark:text-[#FFFFFF] leading-tight">
                    {student.name}
                  </p>
                  <span className="text-[10px] font-bold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mt-0.5">
                    Mitra: {student.company}
                  </span>
                </div>
              </Link>
            ),
          },
          {
            key: "nim",
            label: "ID Mahasiswa (NIM)",
            render: (student) => (
              <Link href={`/dashboard/mentor/penilaian/${student.id}`} className="font-bold text-[#232F72]/80 dark:text-[#F1F5F9] block py-1">
                {student.nim}
              </Link>
            ),
          },
          {
            key: "university",
            label: "Universitas Asal",
            render: (student) => (
              <Link href={`/dashboard/mentor/penilaian/${student.id}`} className="inline-flex items-center gap-1 text-[#232F72]/80 dark:text-[#F1F5F9] font-bold">
                <School className="w-3.5 h-3.5 text-[#232F72] dark:text-[#FFFFFF]" />
                <span>{student.university}</span>
              </Link>
            ),
          },
          {
            key: "grade",
            label: "Rata-rata Nilai",
            align: "center",
            render: (student) => {
              const isGraded = student.penilaianId !== null && student.penilaianId !== undefined;
              return isGraded
                ? <span className="font-black text-[#232F72] dark:text-[#FFFFFF] text-sm">{student.grade}</span>
                : <span className="text-[#2F578A]/80 dark:text-[#F1F5F9]/50">—</span>;
            },
          },
          {
            key: "status",
            label: "Status Penilaian",
            align: "center",
            render: (student) => {
              const isGraded = student.penilaianId !== null && student.penilaianId !== undefined;
              return (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${
                  isGraded
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40"
                    : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/40"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isGraded ? "bg-emerald-500" : "bg-amber-500"}`} />
                  {isGraded ? "Sudah Dinilai" : "Belum Dinilai"}
                </span>
              );
            },
          },
          {
            key: "aksi",
            label: "Aksi",
            align: "right",
            render: (student) => {
              const isGraded = student.penilaianId !== null && student.penilaianId !== undefined;
              return (
                <Link
                  href={`/dashboard/mentor/penilaian/${student.id}`}
                  className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-[10px] font-black transition-all hover:scale-[1.02] active:scale-95 shadow-sm ${
                    isGraded
                      ? "bg-[#F1F5F9] dark:bg-[#232F72] hover:bg-[#232F72] hover:text-white text-[#232F72]/80 dark:text-[#F1F5F9] border border-[#2F578A]/50 dark:border-[#2F578A] hover:border-transparent"
                      : "bg-[#232F72] hover:brightness-110 text-white shadow-[#232F72]/20"
                  }`}
                >
                  {isGraded ? "Edit Nilai" : "Beri Nilai"}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              );
            },
          },
        ]}
      />
        </div>
      )}

      {activeTab === "ekspor" && (
        <div className="space-y-6">
          <div className="glass-card border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#36ADA3]" />
              <h4 className="font-extrabold text-lg text-[#232F72] dark:text-[#FFFFFF]">Rekapitulasi Penilaian Mahasiswa</h4>
            </div>
            
            <DataTable
              data={rekapList}
              loading={isRekapLoading}
              emptyMessage="Belum ada data rekapitulasi penilaian."
              className="rounded-3xl"
              columns={[
                {
                  key: "nama",
                  label: "Nama Mahasiswa",
                  render: (row) => (
                    <span className="font-extrabold text-[#232F72] dark:text-[#FFFFFF] text-sm">{row.nama}</span>
                  )
                },
                {
                  key: "detail",
                  label: "Detail Penilaian",
                  render: (row) => {
                    const p = row.penilaian;
                    if (!p) {
                      return <span className="text-amber-600 dark:text-amber-400 font-bold italic text-sm">Belum di nilai</span>;
                    }
                    return (
                      <div className="w-full max-w-lg bg-[#F8FAFC] dark:bg-[#232F72]/30 p-4 rounded-xl border border-[#2F578A]/20 dark:border-[#2F578A]/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs font-semibold text-[#2F578A] dark:text-[#F1F5F9]/80">
                          <div className="flex justify-between border-b border-[#2F578A]/10 pb-1"><span>Kinerja Pekerjaan:</span> <span className="font-bold text-[#232F72] dark:text-white">{p.kinerja}</span></div>
                          <div className="flex justify-between border-b border-[#2F578A]/10 pb-1"><span>Kedisiplinan:</span> <span className="font-bold text-[#232F72] dark:text-white">{p.kedisiplinan}</span></div>
                          <div className="flex justify-between border-b border-[#2F578A]/10 pb-1"><span>Tanggung Jawab:</span> <span className="font-bold text-[#232F72] dark:text-white">{p.tanggungJawab}</span></div>
                          <div className="flex justify-between border-b border-[#2F578A]/10 pb-1"><span>Komunikasi:</span> <span className="font-bold text-[#232F72] dark:text-white">{p.komunikasi}</span></div>
                          <div className="flex justify-between border-b border-[#2F578A]/10 pb-1"><span>Sikap & Etika:</span> <span className="font-bold text-[#232F72] dark:text-white">{p.sikap}</span></div>
                          <div className="flex justify-between border-b border-[#2F578A]/10 pb-1"><span>Kerapihan:</span> <span className="font-bold text-[#232F72] dark:text-white">{p.kerapihan}</span></div>
                          <div className="flex justify-between border-b border-[#2F578A]/10 pb-1"><span>Kehadiran:</span> <span className="font-bold text-[#232F72] dark:text-white">{p.absensi}</span></div>
                          <div className="flex justify-between border-b border-[#2F578A]/10 pb-1"><span>Kerjasama Tim:</span> <span className="font-bold text-[#232F72] dark:text-white">{p.kerjasama}</span></div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#2F578A]/20 dark:border-[#2F578A]/50">
                          <span className="font-extrabold text-[#232F72] dark:text-white text-xs block mb-1">Catatan Evaluasi:</span>
                          <p className="text-xs font-medium text-[#2F578A] dark:text-[#F1F5F9]/80 italic bg-white dark:bg-[#121358]/50 p-2 rounded-lg border border-[#2F578A]/10">"{p.catatan || 'Tidak ada catatan.'}"</p>
                        </div>
                      </div>
                    );
                  }
                }
              ]}
            />
          </div>
        </div>
      )}

    </div>
  );
}
