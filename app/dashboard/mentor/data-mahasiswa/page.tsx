"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Mail, 
  Phone, 
  School, 
  User, 
  ChevronRight, 
  Filter, 
  RefreshCw,
  TrendingUp,
  Award,
  CheckCircle,
  ExternalLink,
  UserPlus,
  Calendar,
  Loader2,
  Check
} from "lucide-react";
import { studentsData, Student } from "./studentsData";
import { useStudents } from "@/modules/mahasiswa/hooks";
import { mahasiswaAPI } from "@/modules/mahasiswa/api";

export default function MentorDataMahasiswaPage() {
  const { rawStudents, isLoading, refreshStudents } = useStudents();
  const studentsList = rawStudents.length > 0 ? rawStudents : studentsData;

  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("Semua");
  const [univFilter, setUnivFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Local state for student internship periods (initially mapped from dates)
  const [studentPeriods, setStudentPeriods] = useState<Record<number, { startDate: string; endDate: string }>>({
    1: { startDate: "2026-02-01", endDate: "2026-07-31" },
    2: { startDate: "2026-02-01", endDate: "2026-07-31" },
    3: { startDate: "2026-02-01", endDate: "2026-07-31" },
    4: { startDate: "2026-03-01", endDate: "2026-08-31" },
    5: { startDate: "2026-01-01", endDate: "2026-06-30" },
    6: { startDate: "2026-02-01", endDate: "2026-07-31" },
    7: { startDate: "2026-03-01", endDate: "2026-08-31" },
    8: { startDate: "2026-02-01", endDate: "2026-07-31" }
  });

  // State for editing period
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [isSavingPeriod, setIsSavingPeriod] = useState(false);
  const [showPeriodToast, setShowPeriodToast] = useState("");

  const handleOpenEditPeriod = (studentId: number, start: string, end: string) => {
    setEditingStudentId(studentId);
    setEditStartDate(start);
    setEditEndDate(end);
  };

  const handleSavePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStartDate || !editEndDate) {
      alert("Harap lengkapi tanggal awal dan akhir kegiatan.");
      return;
    }

    if (new Date(editStartDate) > new Date(editEndDate)) {
      alert("Tanggal awal kegiatan tidak boleh melampaui tanggal akhir kegiatan.");
      return;
    }

    setIsSavingPeriod(true);

    // Format period string
    const formatIndoDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    };
    const periodStr = `${formatIndoDate(editStartDate)} - ${formatIndoDate(editEndDate)}`;

    try {
      await mahasiswaAPI.updateStudent(editingStudentId!, {
        period: periodStr
      });
      await refreshStudents();
    } catch (err) {
      console.error("Gagal memperbarui periode magang via API:", err);
    }

    setStudentPeriods((prev) => ({
      ...prev,
      [editingStudentId!]: { startDate: editStartDate, endDate: editEndDate }
    }));

    const studentName = studentsList.find(s => s.id === editingStudentId)?.name || "Mahasiswa";
    setIsSavingPeriod(false);
    setEditingStudentId(null);
    setShowPeriodToast(`Periode magang ${studentName} berhasil diperbarui!`);
    setTimeout(() => setShowPeriodToast(""), 3000);
  };

  // Extract unique universities for filter dropdown
  const uniqueUniversities = useMemo(() => {
    const univs = studentsList.map((s) => s.university);
    return ["Semua", ...Array.from(new Set(univs))];
  }, [studentsList]);

  // Filter students based on all selected criteria
  const filteredStudents = useMemo(() => {
    return studentsList.filter((s) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        s.name.toLowerCase().includes(q) ||
        s.nim.includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.university.toLowerCase().includes(q) ||
        s.phone.includes(q);

      const matchesGender = genderFilter === "Semua" || s.gender === genderFilter;
      const matchesUniv = univFilter === "Semua" || s.university === univFilter;
      const matchesStatus = statusFilter === "Semua" || s.status === statusFilter;

      return matchesSearch && matchesGender && matchesUniv && matchesStatus;
    });
  }, [studentsList, searchQuery, genderFilter, univFilter, statusFilter]);

  // Pagination logic
  const total = filteredStudents.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const startIdx = (page - 1) * perPage;
  const pagedStudents = useMemo(() => {
    const adjustedPage = page > totalPages ? totalPages : page;
    const start = (adjustedPage - 1) * perPage;
    return filteredStudents.slice(start, start + perPage);
  }, [filteredStudents, page, totalPages, perPage]);

  // Quick stats calculation
  const stats = useMemo(() => {
    const totalCount = studentsList.length;
    const activeCount = studentsList.filter(s => s.status === "Aktif").length;
    const pendingCount = studentsList.filter(s => s.status === "Dalam Review").length;
    const completedCount = studentsList.filter(s => s.status === "Selesai").length;
    return { totalCount, activeCount, pendingCount, completedCount };
  }, [studentsList]);

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
      {showPeriodToast && (
        <div className="fixed bottom-6 right-6 z-55 p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-2xl shadow-xl flex items-center gap-3 animate-float max-w-sm">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs font-bold leading-normal">{showPeriodToast}</span>
        </div>
      )}

      {/* EDIT MODAL DIALOG (YYYY-MM-DD Date picker) */}
      {editingStudentId !== null && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-55 flex items-center justify-center p-4" onClick={() => setEditingStudentId(null)}>
          <form 
            onSubmit={handleSavePeriod}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#070e24] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-float"
          >
            {/* Modal Header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/35 text-indigo-600 rounded-xl">
                <Calendar className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                  Atur Periode Magang
                </h4>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">
                  Mahasiswa: {studentsList.find(s => s.id === editingStudentId)?.name}
                </p>
              </div>
            </div>

            {/* Modal Inputs (Awal & Akhir Kegiatan) */}
            <div className="space-y-4">
              
              {/* Tanggal Awal Kegiatan */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Awal Kegiatan (Tahun-Bulan-Tanggal) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Tanggal Akhir Kegiatan */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Akhir Kegiatan (Tahun-Bulan-Tanggal) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <button
                type="button"
                onClick={() => setEditingStudentId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
              >
                Batal
              </button>
              
              <button
                type="submit"
                disabled={isSavingPeriod}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-500/70 text-white font-extrabold rounded-xl shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                {isSavingPeriod ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}
      
      {/* HEADER SECTION WITH METRIC BADGES */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Data Mahasiswa Bimbingan Magang
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Kelola, monitor progres, dan lihat data lengkap mahasiswa yang Anda bimbing di berbagai industri mitra.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#070e24]/40 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Filter
          </button>
          


          <Link
            href="/dashboard/mentor/data-mahasiswa/tambah-mahasiswa"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-extrabold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Tambah Mahasiswa
          </Link>
        </div>
      </div>

      {/* QUICK STATUS STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Mahasiswa", value: stats.totalCount, desc: "Terdaftar Aktif", color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/50 dark:border-indigo-900/40" },
          { label: "Aktif Magang", value: stats.activeCount, desc: "Di Perusahaan Mitra", color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border-sky-200/50 dark:border-sky-900/40" },
          { label: "Dalam Review", value: stats.pendingCount, desc: "Perlu Penilaian", color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-900/40" },
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
      <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-4 h-4 text-indigo-500" />
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Panel Filter & Pencarian</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* SEARCH BAR (5 Columns) */}
          <div className="md:col-span-5 relative">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block mb-1.5">
              Cari Mahasiswa
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama, nim, email, universitas..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* GENDER FILTER (2 Columns) */}
          <div className="md:col-span-2">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block mb-1.5">
              Gender
            </label>
            <select
              value={genderFilter}
              onChange={(e) => { setGenderFilter(e.target.value); setPage(1); }}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300"
            >
              <option value="Semua">Semua Gender</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          {/* UNIVERSITY FILTER (3 Columns) */}
          <div className="md:col-span-3">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block mb-1.5">
              Universitas asal
            </label>
            <select
              value={univFilter}
              onChange={(e) => { setUnivFilter(e.target.value); setPage(1); }}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300"
            >
              {uniqueUniversities.map((univ) => (
                <option key={univ} value={univ}>
                  {univ === "Semua" ? "Semua Universitas" : univ}
                </option>
              ))}
            </select>
          </div>

          {/* STATUS FILTER (2 Columns) */}
          <div className="md:col-span-2">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block mb-1.5">
              Status Magang
            </label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Dalam Review">Dalam Review</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

        </div>
      </div>

      {/* TABLE AND RESULTS */}
      <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#070e24]/40 flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2 text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            Menampilkan <strong className="text-slate-800 dark:text-white">{filteredStudents.length === 0 ? 0 : startIdx + 1} - {Math.min(startIdx + perPage, total)}</strong> dari <strong className="text-slate-800 dark:text-white">{total}</strong> hasil filter.
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Baris per halaman:</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
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
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">
                <th className="pb-3.5 pl-4 font-bold">Nama Lengkap</th>
                <th className="pb-3.5 font-bold">NIM</th>
                <th className="pb-3.5 font-bold">Email</th>
                <th className="pb-3.5 font-bold">Universitas</th>
                <th className="pb-3.5 font-bold">No. HP</th>
                <th className="pb-3.5 font-bold">Gender</th>
                <th className="pb-3.5 font-bold">Periode Magang</th>
                <th className="pb-3.5 pr-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                      <span className="text-xs font-bold">Memuat data mahasiswa bimbingan...</span>
                    </div>
                  </td>
                </tr>
              ) : pagedStudents.map((student) => (
                <tr 
                  key={student.id} 
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors group cursor-pointer"
                >
                  {/* Column 1: Nama Lengkap */}
                  <td className="py-4 pl-4">
                    <Link href={`/dashboard/mentor/data-mahasiswa/${student.id}`} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${student.avatarColor} text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform`}>
                        {student.name.split(" ").map(n=>n[0]).join("").substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                          {student.name}
                        </p>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mt-0.5">
                          Aktif: {student.lastActive}
                        </span>
                      </div>
                    </Link>
                  </td>

                  {/* Column 2: NIM */}
                  <td className="py-4 font-bold text-slate-700 dark:text-slate-300">
                    <Link href={`/dashboard/mentor/data-mahasiswa/${student.id}`} className="block h-full w-full py-1">
                      {student.nim}
                    </Link>
                  </td>

                  {/* Column 3: Email */}
                  <td className="py-4 text-slate-600 dark:text-slate-400">
                    <a 
                      href={`mailto:${student.email}`}
                      className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
                      title="Kirim Email"
                      onClick={(e) => e.stopPropagation()} // Stop navigation trigger
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span className="truncate max-w-[150px]">{student.email}</span>
                    </a>
                  </td>

                  {/* Column 4: Universitas */}
                  <td className="py-4">
                    <div className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold">
                      <School className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                      <span>{student.university}</span>
                    </div>
                  </td>

                  {/* Column 5: No HP */}
                  <td className="py-4 text-slate-600 dark:text-slate-400 font-semibold">
                    <a 
                      href={`tel:${student.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{student.phone}</span>
                    </a>
                  </td>
 
                  {/* Column 6: Gender */}
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide border ${
                      student.gender === "Laki-laki" 
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/40" 
                        : "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border-pink-200/50 dark:border-pink-900/40"
                    }`}>
                      <User className="w-3 h-3" />
                      {student.gender}
                    </span>
                  </td>
 
                  {/* Column 7: Periode Magang */}
                  <td className="py-4">
                    <div className="flex items-center gap-2 group/period">
                      <div className="flex flex-col text-slate-850 dark:text-slate-200 font-bold">
                        <span className="text-[11px] font-mono leading-none">{studentPeriods[student.id]?.startDate || "2026-02-01"}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider my-0.5 text-center">s.d.</span>
                        <span className="text-[11px] font-mono leading-none">{studentPeriods[student.id]?.endDate || "2026-07-31"}</span>
                      </div>
                    </div>
                  </td>

                  {/* Column 8: Aksi */}
                  <td className="py-4 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link 
                        href={`/dashboard/mentor/data-mahasiswa/${student.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white border border-transparent dark:border-slate-800 hover:dark:border-transparent text-[11px] font-bold rounded-xl transition-all text-slate-700 dark:text-slate-300"
                      >
                        Detail
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {pagedStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="max-w-md mx-auto space-y-2">
                      <p className="text-slate-400 dark:text-slate-500 font-extrabold text-sm">Tidak ada mahasiswa yang cocok</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs">
                        Silakan sesuaikan kriteria pencarian atau atur ulang filter Anda menggunakan tombol di atas.
                      </p>
                      <button 
                        onClick={resetFilters}
                        className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl mt-2 cursor-pointer border border-indigo-200/50 dark:border-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all"
                      >
                        Setel Ulang Semua Filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION PANEL */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-4 flex-wrap gap-3">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              Halaman {page} dari {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setPage(1)} 
                disabled={page === 1} 
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                Awal
              </button>
              <button 
                onClick={() => setPage(Math.max(1, page - 1))} 
                disabled={page === 1} 
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                Sebelumnya
              </button>
              
              {/* Numeric Page Buttons */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      page === pageNum
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button 
                onClick={() => setPage(Math.min(totalPages, page + 1))} 
                disabled={page === totalPages} 
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                Selanjutnya
              </button>
              <button 
                onClick={() => setPage(totalPages)} 
                disabled={page === totalPages} 
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                Akhir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
