"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Mail,
  Phone,
  School,
  User,
  Filter,
  RefreshCw,
  UserPlus,
  Pencil,
  Trash2,
} from "lucide-react";
import { useStudents, useStudentStats } from "@/modules/data_mahasiswa/hooks";
import { useUniversitas } from "@/modules/universitas/hooks";
import { SuccessToast, TableLoadingRow, TableEmptyRow, PageHeader, DashboardPagination } from "@/components/shared";

export default function MentorDataMahasiswaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("Semua");
  const [univFilter, setUnivFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { students: filteredStudents, isLoading, updateStudent } = useStudents({
    gender: genderFilter !== "Semua" ? genderFilter : undefined,
    universitas: univFilter !== "Semua" ? univFilter : undefined,
    status: statusFilter !== "Semua" ? statusFilter : undefined,
    searchQuery: searchQuery
  });

  const { stats: backendStats } = useStudentStats({
    gender: genderFilter !== "Semua" ? genderFilter : undefined,
    universitas: univFilter !== "Semua" ? univFilter : undefined
  });

  const { universitasList } = useUniversitas();

  const [showPeriodToast, setShowPeriodToast] = useState("");

  // Extract unique universities for filter dropdown (Dynamic from universitas module)
  const uniqueUniversities = useMemo(() => {
    return ["Semua", ...universitasList?.map(u => u.nameUniversity)];
  }, [universitasList]);

  // Pagination logic
  const total = filteredStudents.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const startIdx = (page - 1) * perPage;
  const pagedStudents = useMemo(() => {
    const adjustedPage = page > totalPages ? totalPages : page;
    const start = (adjustedPage - 1) * perPage;
    return filteredStudents.slice(start, start + perPage);
  }, [filteredStudents, page, totalPages, perPage]);

  // Quick stats calculation from Backend Real API
  const stats = useMemo(() => {
    if (backendStats) {
      return {
        totalCount: backendStats.totalMahasiswa || 0,
        activeCount: backendStats.totalAktif || 0,
        pendingCount: backendStats.totalAktifTanpaPenilaian || 0,
        completedCount: backendStats.totalSelesai || 0
      };
    }
    return { totalCount: 0, activeCount: 0, pendingCount: 0, completedCount: 0 };
  }, [backendStats]);

  const resetFilters = () => {
    setSearchQuery("");
    setGenderFilter("Semua");
    setUnivFilter("Semua");
    setStatusFilter("Semua");
    setPage(1);
  };

  return (
    <div className="space-y-6 relative">

      {/* FLOAT SUCCESS TOAST */}
      <SuccessToast show={!!showPeriodToast} message={showPeriodToast} />



      {/* QUICK STATUS STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Mahasiswa", value: stats.totalCount, desc: "Terdaftar Aktif", color: "text-[#232F72] dark:text-[#FFFFFF] bg-[#F8FAFC] dark:bg-[#232F72] border-[#2F578A]/30" },
          { label: "Aktif Magang", value: stats.activeCount, desc: "Di Perusahaan Mitra", color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border-sky-200/50 dark:border-sky-900/40" },
          { label: "Selesai Magang", value: stats.completedCount, desc: "Laporan Diterima", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40" }
        ].map((item, index) => (
          <div key={index} className={`p-4 rounded-2xl border ${item.color} flex flex-col justify-between shadow-sm`}>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-85">{item.label}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold tracking-tight">{item.value}</span>
              <span className="text-[10px] font-semibold opacity-75">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH AND FILTERS PANEL */}
      <div className="glass-card border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-4 h-4 text-[#232F72] dark:text-[#FFFFFF]" />
          <h4 className="font-extrabold text-sm text-[#232F72] dark:text-[#FFFFFF]">Panel Filter & Pencarian</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* SEARCH BAR (5 Columns) */}
          <div className="md:col-span-5 relative">
            <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mb-1.5">
              Cari Mahasiswa
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama, nim, email, universitas..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] dark:border-[#121358] rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
              />
              <Search className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* GENDER FILTER (2 Columns) */}
          <div className="md:col-span-2">
            <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mb-1.5">
              Gender
            </label>
            <select
              value={genderFilter}
              onChange={(e) => { setGenderFilter(e.target.value); setPage(1); }}
              className="w-full p-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#232F72] dark:border-[#121358] text-[#232F72]/80 dark:text-[#F1F5F9]"
            >
              <option value="Semua">Semua Gender</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          {/* UNIVERSITY FILTER (3 Columns) */}
          <div className="md:col-span-3">
            <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mb-1.5">
              Universitas asal
            </label>
            <select
              value={univFilter}
              onChange={(e) => { setUnivFilter(e.target.value); setPage(1); }}
              className="w-full p-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#232F72] dark:border-[#121358] text-[#232F72]/80 dark:text-[#F1F5F9]"
            >
              {uniqueUniversities?.map((univ) => (
                <option key={univ} value={univ}>
                  {univ === "Semua" ? "Semua Universitas" : univ}
                </option>
              ))}
            </select>
          </div>

          {/* STATUS FILTER (2 Columns) */}
          <div className="md:col-span-2">
            <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mb-1.5">
              Status Magang
            </label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full p-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#232F72] dark:border-[#121358] text-[#232F72]/80 dark:text-[#F1F5F9]"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

        </div>
      </div>

      {/* TABLE AND RESULTS */}
      <div className="glass-card border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2 text-xs">
          <span className="font-semibold text-[#2F578A] dark:text-[#F1F5F9]/70">
            Menampilkan <strong className="text-[#232F72] dark:text-[#FFFFFF]">{filteredStudents.length === 0 ? 0 : startIdx + 1} - {Math.min(startIdx + perPage, total)}</strong> dari <strong className="text-[#232F72] dark:text-[#FFFFFF]">{total}</strong> hasil filter.
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-medium">Baris per halaman:</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="px-2 py-1 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-lg text-xs focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* MAIN DATA TABLE */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 uppercase tracking-widest text-left">
                <th className="py-3 pl-4 pr-3 font-bold border border-[#2F578A]/30 dark:border-[#2F578A] bg-[#F1F5F9]/70 dark:bg-[#232F72]/60">Nama Lengkap</th>
                <th className="py-3 px-3 font-bold border border-[#2F578A]/30 dark:border-[#2F578A] bg-[#F1F5F9]/70 dark:bg-[#232F72]/60">NIM</th>
                <th className="py-3 px-3 font-bold border border-[#2F578A]/30 dark:border-[#2F578A] bg-[#F1F5F9]/70 dark:bg-[#232F72]/60">Email</th>
                <th className="py-3 px-3 font-bold border border-[#2F578A]/30 dark:border-[#2F578A] bg-[#F1F5F9]/70 dark:bg-[#232F72]/60">Universitas</th>
                <th className="py-3 px-3 font-bold border border-[#2F578A]/30 dark:border-[#2F578A] bg-[#F1F5F9]/70 dark:bg-[#232F72]/60">No. HP</th>
                <th className="py-3 px-3 font-bold border border-[#2F578A]/30 dark:border-[#2F578A] bg-[#F1F5F9]/70 dark:bg-[#232F72]/60">Gender</th>
                <th className="py-3 px-3 font-bold border border-[#2F578A]/30 dark:border-[#2F578A] bg-[#F1F5F9]/70 dark:bg-[#232F72]/60">Periode Magang</th>
                <th className="py-3 pl-3 pr-4 font-bold border border-[#2F578A]/30 dark:border-[#2F578A] bg-[#F1F5F9]/70 dark:bg-[#232F72]/60 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {isLoading ? (
                <TableLoadingRow colSpan={7} text="Memuat data mahasiswa bimbingan..." />
              ) : pagedStudents?.map((student) => (
                <tr 
                  key={student.id} 
                  className="hover:bg-[#F8FAFC]/50 dark:hover:bg-[#121358]/50 transition-colors group cursor-pointer"
                >
                  {/* Column 1: Nama Lengkap */}
                  <td className="py-4 pl-4 pr-3 border border-[#2F578A]/20 dark:border-[#2F578A]/50">
                    <Link href={`/dashboard/mentor/data-mahasiswa/${student.id}`} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${student.avatarColor} text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-[#232F72]/10 group-hover:scale-105 transition-transform`}>
                        {(student?.name || "U").split(" ").map(n=>n[0]).join("").substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-extrabold text-[#232F72] dark:text-[#FFFFFF] group-hover:text-[#232F72] dark:text-[#FFFFFF] transition-colors leading-tight">
                          {student.name}
                        </p>
                      </div>
                    </Link>
                  </td>

                  {/* Column 2: NIM */}
                  <td className="py-4 px-3 font-bold text-[#232F72]/80 dark:text-[#F1F5F9] border border-[#2F578A]/20 dark:border-[#2F578A]/50">
                    <Link href={`/dashboard/mentor/data-mahasiswa/${student.id}`} className="block h-full w-full py-1">
                      {student.nim}
                    </Link>
                  </td>

                  {/* Column 3: Email */}
                  <td className="py-4 px-3 text-[#2F578A] dark:text-[#F1F5F9]/80 border border-[#2F578A]/20 dark:border-[#2F578A]/50">
                    <a 
                      href={`mailto:${student.email}`}
                      className="inline-flex items-center gap-1 hover:text-[#232F72] dark:text-[#FFFFFF] dark:hover:text-[#232F72] dark:text-[#FFFFFF] font-semibold"
                      title="Kirim Email"
                      onClick={(e) => e.stopPropagation()} // Stop navigation trigger
                    >
                      <Mail className="w-3.5 h-3.5 text-[#2F578A]/80 dark:text-[#F1F5F9]/50" />
                      <span className="truncate max-w-[150px]">{student.email}</span>
                    </a>
                  </td>

                  {/* Column 4: Universitas */}
                  <td className="py-4 px-3 border border-[#2F578A]/20 dark:border-[#2F578A]/50">
                    <div className="inline-flex items-center gap-1 text-[#232F72]/80 dark:text-[#F1F5F9] font-bold">
                      <School className="w-3.5 h-3.5 text-[#232F72] dark:text-[#FFFFFF]" />
                      <span>{student.university}</span>
                    </div>
                  </td>

                  {/* Column 5: No HP */}
                  <td className="py-4 px-3 text-[#2F578A] dark:text-[#F1F5F9]/80 font-semibold border border-[#2F578A]/20 dark:border-[#2F578A]/50">
                    <a 
                      href={`tel:${(student?.phone || "").replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1 hover:text-[#232F72] dark:text-[#FFFFFF] dark:hover:text-[#232F72] dark:text-[#FFFFFF]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="w-3.5 h-3.5 text-[#2F578A]/80 dark:text-[#F1F5F9]/50" />
                      <span>{student.phone}</span>
                    </a>
                  </td>
 
                  {/* Column 6: Gender */}
                  <td className="py-4 px-3 border border-[#2F578A]/20 dark:border-[#2F578A]/50">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide border ${
                      student.gender === "Laki-laki" 
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/40" 
                        : student.gender === "Perempuan"
                          ? "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border-pink-200/50 dark:border-pink-900/40"
                          : "bg-[#F1F5F9] dark:bg-[#232F72]/80 text-[#2F578A] dark:text-[#F1F5F9]/80 border-[#2F578A]/30 dark:border-[#2F578A]/40"
                    }`}>
                      <User className="w-3 h-3" />
                      {student.gender}
                    </span>
                  </td>
 
                  {/* Column 7: Periode Magang */}
                  <td className="py-4 px-3 border border-[#2F578A]/20 dark:border-[#2F578A]/50">
                    <div className="flex flex-col gap-1.5 group/period">
                      <div className="flex text-slate-850 dark:text-slate-200 font-bold items-center gap-1">
                        <span className="text-[11px] font-mono leading-none">{student.tanggalMulai || "-"}</span>
                        <span className="text-[9px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-bold uppercase tracking-wider text-center">-</span>
                        <span className="text-[11px] font-mono leading-none">{student.tanggalBerakhir || "-"}</span>
                      </div>
                      <select 
                        className="px-2 py-0.5 text-[10px] font-bold rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 w-fit cursor-pointer outline-none focus:ring-1 focus:ring-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors uppercase tracking-wider"
                        value={student.statusPeriode || (student.status === "Selesai" ? "selesai" : "aktif")}
                        onClick={(e) => e.stopPropagation()}
                        onChange={async (e) => {
                          try {
                            const newStatus = e.target.value;
                            await updateStudent(student.id, { 
                              email: student.email,
                              nim: student.nim,
                              nama: student.name,
                              noHp: student.phone,
                              idUniversity: student.idUniversity ?? undefined,
                              periode: { 
                                tanggalMulai: student.tanggalMulai || "2026-02-01", 
                                tanggalBerakhir: student.tanggalBerakhir || "2026-07-31", 
                                status: newStatus 
                              } 
                            });
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      >
                        <option value="aktif">AKTIF</option>
                        <option value="selesai">SELESAI</option>
                        <option value="batal">BATAL</option>
                      </select>
                    </div>
                  </td>

                  {/* Column 8: Aksi */}
                  <td className="py-4 pl-3 pr-4 text-right border border-[#2F578A]/20 dark:border-[#2F578A]/50">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <Link 
                        href={`/dashboard/mentor/data-mahasiswa/${student.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#F1F5F9] dark:bg-[#232F72] hover:bg-[#232F72] dark:bg-[#232F72] dark:hover:bg-[#232F72] dark:bg-[#232F72] hover:text-white border border-transparent dark:border-[#2F578A] text-[11px] font-bold rounded-xl transition-all text-[#232F72]/80 dark:text-[#F1F5F9]"
                        title="Lihat Detail"
                      >
                        Detail
                      </Link>

                      <Link
                        href={`/dashboard/mentor/data-mahasiswa/${student.id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#F1F5F9] dark:bg-[#232F72] hover:bg-sky-600 dark:hover:bg-sky-500 hover:text-white border border-transparent dark:border-[#2F578A] text-[11px] font-bold rounded-xl transition-all text-[#232F72]/80 dark:text-[#F1F5F9]"
                        title="Edit Data Mahasiswa"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/dashboard/mentor/data-mahasiswa/${student.id}/hapus`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#F1F5F9] dark:bg-[#232F72] hover:bg-rose-600 hover:text-white border border-transparent dark:border-[#2F578A] text-[11px] font-bold rounded-xl transition-all text-[#232F72]/80 dark:text-[#F1F5F9]"
                        title="Hapus Mahasiswa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {pagedStudents.length === 0 && (
                <TableEmptyRow
                  colSpan={8}
                  title="Tidak ada mahasiswa yang cocok"
                  description="Silakan sesuaikan kriteria pencarian atau atur ulang filter Anda menggunakan tombol di atas."
                  onReset={resetFilters}
                />
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION PANEL */}
        {totalPages > 1 && (
          <DashboardPagination
            page={page}
            totalPages={totalPages}
            pageSize={perPage}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPerPage(s); setPage(1); }}
          />
        )}
      </div>
    </div>
  );
}
