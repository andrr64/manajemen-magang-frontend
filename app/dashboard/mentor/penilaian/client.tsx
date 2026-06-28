"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Sparkles,
  Download,
  Loader2
} from "lucide-react";
import { useStudentAssessments, usePenilaianStats, usePenilaianRekap } from "@/modules/penilaian/hooks";
import { useStudents } from "@/modules/data_mahasiswa/hooks";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader, StatsGrid, StatItem } from "@/components/shared";
import ttdImage from "../../mahasiswa/absensi/assets/ttd-pak-agus.png";
import { useDownloadPenilaianMentorPDF } from "./useDownloadPenilaianMentorPDF";

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

  const { download: downloadPDF, isGenerating: isGeneratingPDF } = useDownloadPenilaianMentorPDF(
    rekapList, ttdBase64
  );

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#36ADA3]" />
                <h4 className="font-extrabold text-lg text-[#232F72] dark:text-[#FFFFFF]">Rekapitulasi Penilaian Mahasiswa</h4>
              </div>
              <button
                onClick={downloadPDF}
                disabled={isGeneratingPDF || rekapList.length === 0}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#232F72] hover:bg-[#2F578A] text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
              >
                {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>{isGeneratingPDF ? "Membuat PDF..." : "Ekspor ke PDF"}</span>
              </button>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-[#2F578A]/20 dark:border-[#2F578A]/50">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-[#232F72] text-white">
                    <th className="px-4 py-3 font-extrabold border-b border-[#2F578A]/50 w-12 text-center">No</th>
                    <th className="px-4 py-3 font-extrabold border-b border-[#2F578A]/50 w-[30%]">Nama Mahasiswa</th>
                    <th className="px-4 py-3 font-extrabold border-b border-[#2F578A]/50 w-[40%]">Kriteria Penilaian</th>
                    <th className="px-4 py-3 font-extrabold border-b border-[#2F578A]/50 w-[20%] text-center">Nilai</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-[#121358]/40">
                  {isRekapLoading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[#2F578A] dark:text-white font-semibold">
                        Memuat data rekapitulasi...
                      </td>
                    </tr>
                  ) : rekapList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[#2F578A] dark:text-white font-semibold">
                        Belum ada data rekapitulasi penilaian.
                      </td>
                    </tr>
                  ) : (
                    rekapList.map((row, index) => {
                      const p = row.penilaian;
                      const isEven = index % 2 === 0;
                      const rowClass = isEven ? "bg-white dark:bg-[#121358]/20" : "bg-[#F8FAFC] dark:bg-[#232F72]/20";

                      if (!p) {
                        return (
                          <tr key={index} className={`border-b border-[#2F578A]/20 dark:border-[#2F578A]/50 ${rowClass}`}>
                            <td className="px-4 py-3 text-center font-bold text-[#232F72] dark:text-white">{index + 1}</td>
                            <td className="px-4 py-3 font-extrabold text-[#232F72] dark:text-white">{row.nama}</td>
                            <td className="px-4 py-3 font-semibold text-amber-600 dark:text-amber-400 italic">Belum di nilai</td>
                            <td className="px-4 py-3 font-bold text-center text-[#232F72] dark:text-white">-</td>
                          </tr>
                        );
                      }

                      const kriteria = [
                        { label: "Kinerja Pekerjaan", value: p.kinerja },
                        { label: "Kedisiplinan", value: p.kedisiplinan },
                        { label: "Tanggung Jawab", value: p.tanggungJawab },
                        { label: "Komunikasi", value: p.komunikasi },
                        { label: "Sikap & Etika Kerja", value: p.sikap },
                        { label: "Kerapihan", value: p.kerapihan },
                        { label: "Kehadiran", value: p.absensi },
                        { label: "Kerjasama Tim", value: p.kerjasama },
                        { label: "Catatan", value: p.catatan || "-" }
                      ];

                      return (
                        <React.Fragment key={index}>
                          <tr className={`border-b border-[#2F578A]/10 dark:border-[#2F578A]/20 ${rowClass}`}>
                            <td className="px-4 py-3 text-center font-bold text-[#232F72] dark:text-white align-top" rowSpan={kriteria.length}>
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 font-extrabold text-[#232F72] dark:text-white align-top" rowSpan={kriteria.length}>
                              {row.nama}
                            </td>
                            <td className="px-4 py-2 font-semibold text-[#2F578A] dark:text-[#F1F5F9]/80 border-b border-[#2F578A]/10 dark:border-[#2F578A]/30">
                              {kriteria[0].label}
                            </td>
                            <td className="px-4 py-2 font-bold text-center text-[#232F72] dark:text-white border-b border-[#2F578A]/10 dark:border-[#2F578A]/30">
                              {kriteria[0].value}
                            </td>
                          </tr>
                          {kriteria.slice(1).map((k, kIdx) => {
                            const isLast = kIdx === kriteria.length - 2;
                            return (
                              <tr key={`${index}-${kIdx}`} className={rowClass}>
                                <td className={`px-4 py-2 font-semibold text-[#2F578A] dark:text-[#F1F5F9]/80 ${isLast ? 'border-b border-[#2F578A]/20 dark:border-[#2F578A]/50' : 'border-b border-[#2F578A]/10 dark:border-[#2F578A]/30'}`}>
                                  {k.label}
                                </td>
                                <td className={`px-4 py-2 font-bold text-center text-[#232F72] dark:text-white ${isLast ? 'border-b border-[#2F578A]/20 dark:border-[#2F578A]/50' : 'border-b border-[#2F578A]/10 dark:border-[#2F578A]/30'}`}>
                                  {k.value}
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
