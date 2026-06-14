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
  Check,
  Pencil,
  Trash2,
  Briefcase,
  GraduationCap,
  MapPin,
  AlertTriangle
} from "lucide-react";
import { Student } from "@/modules/mahasiswa/types";
import { useStudents, useStudentStats } from "@/modules/mahasiswa/hooks";
import { mahasiswaAPI } from "@/modules/mahasiswa/api";

export default function MentorDataMahasiswaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("Semua");
  const [univFilter, setUnivFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { students: filteredStudents, isLoading, refreshStudents, removeStudent } = useStudents({
    gender: genderFilter !== "Semua" ? genderFilter : undefined,
    universitas: univFilter !== "Semua" ? univFilter : undefined,
    status: statusFilter !== "Semua" ? statusFilter : undefined,
    searchQuery: searchQuery
  });

  const { stats: backendStats } = useStudentStats({
    gender: genderFilter !== "Semua" ? genderFilter : undefined,
    universitas: univFilter !== "Semua" ? univFilter : undefined
  });

  // Local state for student internship periods (initially mapped from dates)
  const [studentPeriods, setStudentPeriods] = useState<Record<string | number, { startDate: string; endDate: string }>>({});

  // State for editing period
  const [editingStudentId, setEditingStudentId] = useState<string | number | null>(null);
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

    const studentName = filteredStudents.find(s => s.id === editingStudentId)?.name || "Mahasiswa";
    setIsSavingPeriod(false);
    setEditingStudentId(null);
    setShowPeriodToast(`Periode magang ${studentName} berhasil diperbarui!`);
    setTimeout(() => setShowPeriodToast(""), 3000);
  };

  // State for deleting student
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for editing student details
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    nim: "",
    email: "",
    university: "",
    phone: "",
    gender: "Laki-laki" as "Laki-laki" | "Perempuan",
    program: "",
    company: "",
    role: "",
    periodStart: "",
    periodEnd: "",
    address: "",
    status: "Aktif" as Student["status"]
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const parsePeriodToDates = (periodStr: string) => {
    if (!periodStr) return { start: "2026-02-01", end: "2026-07-31" };
    const parts = periodStr.split(" - ");
    if (parts.length < 2) return { start: "2026-02-01", end: "2026-07-31" };

    const parseIndoDate = (str: string) => {
      try {
        const cleanStr = str.trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStr)) return cleanStr;
        
        const monthMap: Record<string, string> = { 
          "januari": "01", "februari": "02", "maret": "03", "april": "04", "mei": "05", "juni": "06", 
          "juli": "07", "agustus": "08", "september": "09", "oktober": "10", "november": "11", "desember": "12" 
        };
        
        const p = cleanStr.toLowerCase().split(/\s+/);
        if (p.length >= 3) {
          const day = p[0].padStart(2, "0");
          const month = monthMap[p[1]] || "01";
          const year = p[2];
          return `${year}-${month}-${day}`;
        }

        const d = new Date(cleanStr);
        if (!isNaN(d.getTime())) {
          return d.toISOString().split("T")[0];
        }
      } catch (_) {}
      return "2026-02-01";
    };

    return {
      start: parseIndoDate(parts[0]),
      end: parseIndoDate(parts[1])
    };
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    const parsedDates = parsePeriodToDates(student.period);
    setEditForm({
      name: student.name,
      nim: student.nim,
      email: student.email,
      university: student.university,
      phone: student.phone,
      gender: student.gender,
      program: student.program || "",
      company: student.company || "",
      role: student.role || "",
      periodStart: parsedDates.start,
      periodEnd: parsedDates.end,
      address: student.address || "",
      status: student.status
    });
    setEditError("");
  };

  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      await removeStudent(deletingStudent.id);
      setShowPeriodToast(`Data mahasiswa ${deletingStudent.name} berhasil dihapus.`);
      setTimeout(() => setShowPeriodToast(""), 3000);
    } catch (err: any) {
      alert(err.message || "Gagal menghapus data mahasiswa.");
    } finally {
      setIsDeleting(false);
      setDeletingStudent(null);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError("");

    if (!editForm.name.trim()) return setEditError("Nama Lengkap wajib diisi.");
    if (!editForm.nim.trim()) return setEditError("NIM wajib diisi.");
    if (!/^\d+$/.test(editForm.nim.trim())) return setEditError("NIM harus berupa angka saja.");
    if (!editForm.email.trim()) return setEditError("Alamat Email wajib diisi.");
    if (!/\S+@\S+\.\S+/.test(editForm.email)) return setEditError("Format email tidak valid.");
    if (!editForm.university.trim()) return setEditError("Universitas wajib diisi.");
    if (!editForm.phone.trim()) return setEditError("Nomor HP wajib diisi.");
    if (!editForm.company.trim()) return setEditError("Nama Perusahaan Mitra wajib diisi.");
    if (!editForm.role.trim()) return setEditError("Posisi/Peran Magang wajib diisi.");
    if (!editForm.program.trim()) return setEditError("Program Studi wajib diisi.");

    if (!editForm.periodStart || !editForm.periodEnd) {
      return setEditError("Harap lengkapi tanggal awal dan akhir kegiatan.");
    }
    if (new Date(editForm.periodStart) > new Date(editForm.periodEnd)) {
      return setEditError("Tanggal awal tidak boleh melampaui tanggal akhir.");
    }

    setIsSavingEdit(true);

    const formatIndoDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    };
    const periodStr = `${formatIndoDate(editForm.periodStart)} - ${formatIndoDate(editForm.periodEnd)}`;

    try {
      await mahasiswaAPI.updateStudent(editingStudent!.id, {
        name: editForm.name,
        nim: editForm.nim,
        email: editForm.email,
        university: editForm.university,
        phone: editForm.phone,
        gender: editForm.gender,
        program: editForm.program,
        company: editForm.company,
        role: editForm.role,
        period: periodStr,
        address: editForm.address,
        status: editForm.status
      });

      setStudentPeriods((prev) => ({
        ...prev,
        [editingStudent!.id]: { startDate: editForm.periodStart, endDate: editForm.periodEnd }
      }));

      await refreshStudents();
      setIsSavingEdit(false);
      setEditingStudent(null);
      setShowPeriodToast(`Data mahasiswa ${editForm.name} berhasil diperbarui!`);
      setTimeout(() => setShowPeriodToast(""), 3000);
    } catch (err: any) {
      setIsSavingEdit(false);
      setEditError(err.message || "Gagal memperbarui data mahasiswa.");
    }
  };

  // Extract unique universities for filter dropdown (Hardcoded based on typical partners)
  const uniqueUniversities = [
    "Semua",
    "Universitas Indonesia",
    "Institut Teknologi Bandung",
    "Universitas Gadjah Mada",
    "Universitas Bina Nusantara",
    "Universitas Diponegoro",
    "Universitas Padjadjaran",
    "Telkom University"
  ];

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
        totalCount: (backendStats.totalAktif || 0) + (backendStats.totalSelesai || 0) + (backendStats.totalAktifTanpaPenilaian || 0),
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
      {showPeriodToast && (
        <div className="fixed bottom-6 right-6 z-55 p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-2xl shadow-xl flex items-center gap-3 animate-float max-w-sm">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs font-bold leading-normal">{showPeriodToast}</span>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setDeletingStudent(null)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#070e24] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-center space-y-6 animate-float"
          >
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-200/50 dark:border-rose-900/40 flex items-center justify-center mx-auto shadow-md">
              <Trash2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Hapus Data Mahasiswa?</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                Apakah Anda yakin ingin menghapus data mahasiswa bimbingan bernama <strong className="text-slate-800 dark:text-white">{deletingStudent.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-550 disabled:bg-rose-500/70 text-white font-extrabold rounded-xl shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  "Ya, Hapus Data"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STUDENT DETAILS MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setEditingStudent(null)}>
          <form 
            onSubmit={handleSaveEdit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#070e24] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-5 animate-float max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/35 text-indigo-600 rounded-xl">
                <Pencil className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                  Edit Data Mahasiswa
                </h4>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">
                  Ubah rincian informasi data mahasiswa {editingStudent.name} secara aman.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {editError && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-400 rounded-xl flex items-start gap-2.5 shadow-sm text-xs font-semibold leading-normal animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{editError}</span>
              </div>
            )}

            {/* Modal Form Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* NIM */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  NIM (Nomor Induk) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editForm.nim}
                    onChange={(e) => setEditForm(prev => ({ ...prev, nim: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                  <span className="text-[9px] font-extrabold text-slate-400 absolute left-3.5 top-3.5">NIM</span>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Alamat Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* No. HP */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Nomor HP / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Universitas */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Universitas Asal <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editForm.university}
                    onChange={(e) => setEditForm(prev => ({ ...prev, university: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                  <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Program Studi */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Program Studi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editForm.program}
                    onChange={(e) => setEditForm(prev => ({ ...prev, program: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Jenis Kelamin */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block">
                  Jenis Kelamin <span className="text-rose-500">*</span>
                </label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm(prev => ({ ...prev, gender: e.target.value as "Laki-laki" | "Perempuan" }))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 dark:text-white"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              {/* Status Magang */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block">
                  Status Magang <span className="text-rose-500">*</span>
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as "Aktif" | "Selesai" }))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 dark:text-white"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              {/* Perusahaan Mitra */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Perusahaan Mitra <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editForm.company}
                    onChange={(e) => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Posisi/Peran Magang */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Posisi Magang <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editForm.role}
                    onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Tanggal Mulai Magang */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Awal Kegiatan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={editForm.periodStart}
                    onChange={(e) => setEditForm(prev => ({ ...prev, periodStart: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Tanggal Selesai Magang */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Akhir Kegiatan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={editForm.periodEnd}
                    onChange={(e) => setEditForm(prev => ({ ...prev, periodEnd: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Alamat Domisili */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Alamat Domisili
                </label>
                <div className="relative">
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    rows={2}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white resize-none"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
              >
                Batal
              </button>
              
              <button
                type="submit"
                disabled={isSavingEdit}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-500/70 text-white font-extrabold rounded-xl shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                {isSavingEdit ? (
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
                  Mahasiswa: {filteredStudents.find(s => s.id === editingStudentId)?.name}
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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Mahasiswa", value: stats.totalCount, desc: "Terdaftar Aktif", color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/50 dark:border-indigo-900/40" },
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
                        : student.gender === "Perempuan"
                          ? "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border-pink-200/50 dark:border-pink-900/40"
                          : "bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/40"
                    }`}>
                      <User className="w-3 h-3" />
                      {student.gender}
                    </span>
                  </td>
 
                  {/* Column 7: Periode Magang */}
                  <td className="py-4">
                    <div className="flex items-center gap-2 group/period">
                      <div className="flex flex-col text-slate-850 dark:text-slate-200 font-bold">
                        <span className="text-[11px] font-mono leading-none">{studentPeriods[student.id]?.startDate || student.tanggalMulai || "-"}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider my-0.5 text-center">s.d.</span>
                        <span className="text-[11px] font-mono leading-none">{studentPeriods[student.id]?.endDate || student.tanggalBerakhir || "-"}</span>
                      </div>
                    </div>
                  </td>

                  {/* Column 8: Aksi */}
                  <td className="py-4 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <Link 
                        href={`/dashboard/mentor/data-mahasiswa/${student.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white border border-transparent dark:border-slate-800 text-[11px] font-bold rounded-xl transition-all text-slate-700 dark:text-slate-300"
                        title="Lihat Detail"
                      >
                        Detail
                      </Link>

                      <button 
                        onClick={() => handleOpenEdit(student)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-sky-600 dark:hover:bg-sky-500 hover:text-white border border-transparent dark:border-slate-800 text-[11px] font-bold rounded-xl transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Edit Data Mahasiswa"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button 
                        onClick={() => setDeletingStudent(student)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-rose-650 dark:hover:bg-rose-600 hover:text-white border border-transparent dark:border-slate-800 text-[11px] font-bold rounded-xl transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Hapus Mahasiswa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
