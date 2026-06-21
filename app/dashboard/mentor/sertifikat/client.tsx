"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  FileBadge,
  Clock,
  AlertCircle,
  User,
  School,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Paperclip,
  FileCheck
} from "lucide-react";
import { useStudentCertificates } from "@/modules/sertifikat/hooks";
import { useStudents } from "@/modules/data_mahasiswa/hooks";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader, StatsGrid, StatItem } from "@/components/shared";

export default function MentorCertificatePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const { certificates, statistics, isLoading, refreshCertificates } = useStudentCertificates();
  const { rawStudents } = useStudents();
  const studentsList = rawStudents;

  useEffect(() => {
    const backendStatus = statusFilter === "Semua" ? "semua status" : statusFilter;
    refreshCertificates(backendStatus, searchQuery);
  }, [statusFilter, searchQuery, refreshCertificates]);

  const enrichedCertificates = useMemo(() => {
    return certificates?.map(cert => {
      const student = studentsList.find(s => s.nim === cert.nim || s.name === cert.namaMahasiswa);
      const studentId = student ? student.id : 1;
      return {
        studentId,
        fileName: cert.url && cert.url !== "-" ? cert.url.split("/").pop() || "sertifikat.pdf" : null,
        status: cert.statusSertifikat === "SUDAH_DIUNGGAH" ? "Sudah Diunggah" : "Belum Diunggah",
        studentName: cert.namaMahasiswa,
        studentNim: cert.nim,
        studentAvatar: student ? student.avatarColor : "from-slate-400 to-slate-500",
        studentUniv: student ? student.university : "Universitas Asal"
      };
    });
  }, [certificates, studentsList]);

  const filteredCertificates = enrichedCertificates;

  const stats = useMemo(() => {
    const total = statistics?.totalJumlahSertifikat || 0;
    const uploaded = statistics?.totalSertifikatDiunggah || 0;
    const pending = statistics?.totalSertifikatBelumDiunggah || 0;
    const ratio = total > 0 ? ((uploaded / total) * 100).toFixed(1) : "0.0";
    return { total, uploaded, pending, ratio };
  }, [statistics]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("Semua");
  };

  return (
    <div className="space-y-6">



      {/* METRIC STATISTICS */}
      {(() => {
        const statsConfig: StatItem[] = [
          { label: "Total Mahasiswa", value: stats.total, desc: "Bimbingan Terdaftar", colorClass: "text-[#232F72] dark:text-[#FFFFFF] bg-[#F8FAFC] dark:bg-[#232F72] border-[#2F578A]/30", icon: User },
          { label: "Sertifikat Diunggah", value: stats.uploaded, desc: "Valid Terbit", colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40", icon: FileCheck },
          { label: "Belum Diunggah", value: stats.pending, desc: "Menanti Lembar Berkas", colorClass: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-900/40", icon: Clock },
          { label: "Penyelesaian", value: `${stats.ratio}%`, desc: "Rasio Penerbitan", colorClass: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border-sky-200/50 dark:border-sky-900/40", icon: TrendingUp },
        ];
        return <StatsGrid stats={statsConfig} gridClass="grid-cols-2 lg:grid-cols-4" />;
      })()}

      {/* FILTER PANEL */}
      <div className="glass-card border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#232F72] dark:text-[#FFFFFF]" />
          <h4 className="font-extrabold text-sm text-[#232F72] dark:text-[#FFFFFF]">Pencarian & Penyaringan Dokumen</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
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
          <div className="md:col-span-4">
            <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mb-1.5">
              Status Berkas Sertifikat
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
      <DataTable
        data={filteredCertificates ?? []}
        loading={isLoading}
        emptyMessage="Tidak ada data sertifikat yang cocok. Coba reset filter."
        className="rounded-3xl"
        columns={[
          {
            key: "nama",
            label: "Nama Mahasiswa",
            render: (cert) => (
              <Link href={`/dashboard/mentor/sertifikat/${cert.studentId}`} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${cert.studentAvatar} text-white font-extrabold flex items-center justify-center text-xs shadow-inner group-hover:scale-105 transition-transform`}>
                  {(cert?.studentName || "U").split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
                </div>
                <div>
                  <p className="font-extrabold text-[#232F72] dark:text-[#FFFFFF] leading-tight">
                    {cert.studentName}
                  </p>
                  <span className="text-[10px] font-semibold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mt-0.5">
                    {cert.studentUniv}
                  </span>
                </div>
              </Link>
            ),
          },
          {
            key: "nim",
            label: "ID Mahasiswa (NIM)",
            render: (cert) => (
              <Link href={`/dashboard/mentor/sertifikat/${cert.studentId}`} className="font-bold text-[#232F72]/80 dark:text-[#F1F5F9] block py-1">
                {cert.studentNim}
              </Link>
            ),
          },
          {
            key: "universitas",
            label: "Universitas Asal",
            render: (cert) => (
              <Link href={`/dashboard/mentor/sertifikat/${cert.studentId}`} className="inline-flex items-center gap-1 text-[#232F72]/80 dark:text-[#F1F5F9] font-bold">
                <School className="w-3.5 h-3.5 text-[#232F72] dark:text-[#FFFFFF]" />
                <span>{cert.studentUniv}</span>
              </Link>
            ),
          },
          {
            key: "fileName",
            label: "Nama Berkas Sertifikat",
            render: (cert) => {
              const isUploaded = cert.status === "Sudah Diunggah";
              return isUploaded ? (
                <div className="flex items-center gap-1.5 text-[#232F72] dark:text-[#FFFFFF]">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span className="max-w-[150px] truncate font-semibold">{cert.fileName}</span>
                </div>
              ) : (
                <span className="text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold">Belum Ada Berkas</span>
              );
            },
          },
          {
            key: "status",
            label: "Status Berkas",
            align: "center",
            render: (cert) => {
              const isUploaded = cert.status === "Sudah Diunggah";
              return (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${
                  isUploaded
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40"
                    : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/40"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isUploaded ? "bg-emerald-500" : "bg-amber-500"}`} />
                  {cert.status}
                </span>
              );
            },
          },
          {
            key: "aksi",
            label: "Aksi",
            align: "right",
            render: (cert) => {
              const isUploaded = cert.status === "Sudah Diunggah";
              return (
                <Link
                  href={`/dashboard/mentor/sertifikat/${cert.studentId}`}
                  className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-[10px] font-black transition-all hover:scale-[1.02] active:scale-95 shadow-sm ${
                    isUploaded
                      ? "bg-[#F1F5F9] dark:bg-[#232F72] hover:bg-[#232F72] hover:text-white text-[#232F72]/80 dark:text-[#F1F5F9] border border-[#2F578A]/50 dark:border-[#2F578A] hover:border-transparent"
                      : "bg-[#232F72] hover:brightness-110 text-white shadow-[#232F72]/20"
                  }`}
                >
                  {isUploaded ? "Kelola File" : "Unggah File"}
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
