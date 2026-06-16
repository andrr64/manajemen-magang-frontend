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
import { useStudentAssessments, usePenilaianStats } from "@/modules/penilaian/hooks";
import { useStudents } from "@/modules/data_mahasiswa/hooks";
import { DataTable } from "@/components/ui/data-table";

export default function MentorPenilaianPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const { assessments, isLoading, refreshAssessments } = useStudentAssessments();
  const { stats: apiStats } = usePenilaianStats(searchQuery);
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

  return (
    <div className="space-y-6">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#232F72] dark:text-[#FFFFFF]">
            Lembar Penilaian Akhir Mahasiswa Magang
          </h3>
          <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold mt-1">
            Evaluasi performa akhir magang bimbingan Anda berdasarkan parameter kedisiplinan, kinerja teknis, dan laporan tertulis.
          </p>
        </div>
        <button
          onClick={handleResetFilters}
          className="flex items-center gap-1.5 px-4 py-2 border border-[#2F578A]/50 dark:border-[#2F578A] hover:border-[#232F72] rounded-xl text-xs font-bold text-[#232F72]/80 dark:text-[#F1F5F9] bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md transition-all cursor-pointer active:scale-95 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Filter
        </button>
      </div>

      {/* METRIC STATISTICS */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Bimbingan", value: stats.total, desc: "Mahasiswa Terdaftar", icon: User, color: "text-[#232F72] dark:text-[#FFFFFF] bg-[#F8FAFC] dark:bg-[#232F72] border-[#2F578A]/30" },
          { label: "Sudah Dinilai", value: stats.graded, desc: "Rekomendasi Lulus", icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40" },
          { label: "Belum Dinilai", value: stats.pending, desc: "Segera Input Nilai", icon: Clock, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-900/40" }
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
  );
}
