"use client";

import { useState, useMemo } from "react";
import { 
  Users, 
  GraduationCap, 
  Building, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Filter, 
  Mail, 
  Phone, 
  X, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  User,
  Zap,
  MapPin,
  Clock,
  BookOpen,
  Loader2
} from "lucide-react";
import { useStudents, useStudentStats } from "@/modules/data_mahasiswa/hooks";
import { Student } from "@/modules/data_mahasiswa/types";
import { mahasiswaAPI } from "@/modules/data_mahasiswa/api";

export default function KelolaMahasiswaPage() {
  // Search, filter, and tabs state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniv, setSelectedUniv] = useState<string>("Semua");
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua");

  // Call the backend hooks
  const {
    students: filteredStudents,
    rawStudents,
    isLoading,
    isSubmitting,
    error: apiError,
    addStudent,
    updateStudent,
    removeStudent,
    refreshStudents
  } = useStudents({
    universitas: selectedUniv,
    status: selectedStatus,
    searchQuery: searchQuery
  });

  const {
    stats: apiStats,
    refreshStats
  } = useStudentStats({
    universitas: selectedUniv
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formNim, setFormNim] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formGender, setFormGender] = useState<"Laki-laki" | "Perempuan" | "-">("Laki-laki");
  const [formUniv, setFormUniv] = useState("Universitas Indonesia");
  const [formProgram, setFormProgram] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formStatus, setFormStatus] = useState<Student["status"]>("Aktif");
  const [formProgress, setFormProgress] = useState(0);
  const [formPeriod, setFormPeriod] = useState("");

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Universities list for filtering
  const universities = useMemo(() => {
    const list = new Set(rawStudents.map(s => s.university));
    return ["Semua", ...Array.from(list)];
  }, [rawStudents]);

  // Reset form helper
  const resetForm = () => {
    setFormName("");
    setFormNim("");
    setFormEmail("");
    setFormPhone("");
    setFormGender("Laki-laki");
    setFormUniv("Universitas Indonesia");
    setFormProgram("");
    setFormCompany("");
    setFormRole("");
    setFormStatus("Aktif");
    setFormProgress(0);
    setFormPeriod("");
    setEditingStudent(null);
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormName(student.name);
    setFormNim(student.nim);
    setFormEmail(student.email);
    setFormPhone(student.phone === "-" ? "" : student.phone);
    setFormGender(student.gender || "Laki-laki");
    setFormUniv(student.university);
    setFormProgram(student.program);
    setFormCompany(student.company === "Belum Ditempatkan" ? "" : student.company);
    setFormRole(student.role === "-" ? "" : student.role);
    setFormStatus(student.status);
    setFormProgress(student.progress);
    setFormPeriod(student.period === "-" ? "" : student.period);
    setIsModalOpen(true);
  };

  // Trigger Toast Notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Handle Form Submit (Add or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formName || !formNim || !formEmail || !formProgram) {
      alert("Harap isi semua kolom wajib!");
      return;
    }

    const resolvedCompany = formCompany.trim() || "Belum Ditempatkan";
    const resolvedRole = formRole.trim() || "-";
    const resolvedPeriod = formPeriod.trim() || "-";
    const resolvedStatus = resolvedCompany === "Belum Ditempatkan" ? "Belum Penempatan" : formStatus;

    // Formatting date range for API payload
    const dateRange = resolvedPeriod !== "-" ? resolvedPeriod.split(" - ") : [];
    const hasDates = dateRange.length > 1;

    try {
      if (editingStudent) {
        // Edit mode
        await updateStudent(editingStudent.id, {
          email: formEmail,
          nim: formNim,
          nama: formName,
          gender: formGender,
          noHp: formPhone || "-",
          periode: hasDates ? {
            tanggalMulai: undefined, // Will be parsed inside api.ts from resolvedPeriod
            tanggalBerakhir: undefined,
            status: resolvedStatus === "Selesai" ? "selesai" : "aktif"
          } : undefined
        });
        await refreshStudents();
        await refreshStats();
        triggerToast(`Data mahasiswa "${formName}" berhasil diperbarui!`);
      } else {
        // Add mode
        await addStudent({
          email: formEmail,
          password: "SecurePassword123!", // temporary secure default password
          nim: formNim,
          name: formName,
          phone: formPhone || "-",
          gender: formGender,
          university: formUniv,
          program: formProgram,
          company: resolvedCompany,
          role: resolvedRole,
          tanggalMulai: hasDates ? undefined : "2026-02-01", // Default if not filled
          tanggalBerakhir: hasDates ? undefined : "2026-07-31",
          periodeStatus: resolvedStatus === "Selesai" ? "selesai" : "aktif",
          period: resolvedPeriod !== "-" ? resolvedPeriod : undefined
        });
        await refreshStats();
        triggerToast(`Mahasiswa "${formName}" berhasil didaftarkan!`);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan data mahasiswa.");
    }
  };

  // Handle Delete Student
  const handleDeleteStudent = async (id: number | string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data mahasiswa "${name}"? Tindakan ini akan menghapus akun dan rekam presensi akademik.`)) {
      try {
        await removeStudent(id);
        await refreshStats();
        triggerToast(`Data mahasiswa "${name}" telah dihapus.`);
      } catch (err: any) {
        alert(err.message || "Gagal menghapus mahasiswa.");
      }
    }
  };

  // Statistics Computations
  const stats = useMemo(() => {
    const total = rawStudents.length;
    const active = apiStats ? apiStats.totalAktif : rawStudents.filter(s => s.status === "Aktif").length;
    const review = rawStudents.filter(s => s.status === "Dalam Review").length;
    const completed = apiStats ? apiStats.totalSelesai : rawStudents.filter(s => s.status === "Selesai").length;
    const unplaced = rawStudents.filter(s => s.status === "Belum Penempatan").length;

    return { total, active, review, completed, unplaced };
  }, [rawStudents, apiStats]);

  return (
    <div className="space-y-6">
      
      {/* TOAST SUCCESS NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-slate-800 dark:border-slate-200 animate-float-none animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-lg">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* METRIC CARD BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Students */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Total Mahasiswa Terdaftar
            </span>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {stats.total} Mahasiswa
            </h4>
            <span className="text-[9px] font-semibold text-rose-500 block pt-1">
              Dari {universities.length - 1} Perguruan Tinggi
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 border border-rose-200/20 shadow-sm">
            <GraduationCap className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Active Interns */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Aktif Magang Industri
            </span>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {stats.active + stats.review} Mhs
            </h4>
            <span className="text-[9px] font-semibold text-emerald-500 block pt-1">
              {stats.review} Mahasiswa dalam evaluasi
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/20 shadow-sm">
            <Zap className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Completed Interns */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Alumni Magang / Selesai
            </span>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {stats.completed} Mahasiswa
            </h4>
            <span className="text-[9px] font-semibold text-indigo-500 block pt-1">
              Sertifikat siap diunduh
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/20 shadow-sm">
            <BookOpen className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Unplaced Students */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Belum Penempatan
            </span>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {stats.unplaced} Mahasiswa
            </h4>
            <span className="text-[9px] font-semibold text-amber-500 block pt-1">
              Memerlukan penyaluran mitra
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/20 shadow-sm">
            <Clock className="w-5.5 h-5.5" />
          </div>
        </div>

      </div>

      {/* FILTER & TABLE PANEL */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 shadow-sm space-y-4">
        
        {/* Table Title and Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Direktori Akademik Mahasiswa Magang</h3>
            <p className="text-xs text-slate-400 mt-0.5">Kelola data rekam akademis mahasiswa, pemantauan progress, serta penyelarasan penempatan magang industri.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                alert("Mengekspor berkas Excel data mahasiswa...");
              }}
              className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Ekspor Data</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-rose-600/10 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Daftarkan Mahasiswa</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col lg:flex-row gap-4 pt-2">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari mahasiswa berdasarkan nama, NIM, perguruan tinggi, perusahaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-[#030712] transition-all dark:text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Filters Selects */}
          <div className="flex flex-wrap gap-3">
            {/* Filter by Univ */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">Kampus:</span>
              <select
                value={selectedUniv}
                onChange={(e) => setSelectedUniv(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none pr-1"
              >
                {universities.map(univ => (
                  <option key={univ} value={univ}>{univ}</option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none pr-1"
              >
                <option value="Semua">Semua Status</option>
                <option value="Aktif">Aktif Magang</option>
                <option value="Dalam Review">Dalam Evaluasi</option>
                <option value="Selesai">Alumni / Selesai</option>
                <option value="Belum Penempatan">Belum Ditempatkan</option>
              </select>
            </div>
          </div>
        </div>

        {/* STUDENTS TABLE */}
        <div className="overflow-x-auto border border-slate-200/50 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-950/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-[#070e24]/60 text-slate-450 dark:text-slate-400 border-b border-slate-150 dark:border-slate-800 text-[10px] uppercase font-bold tracking-wider">
                <th className="px-5 py-3">Nama & Universitas</th>
                <th className="px-5 py-3">Program Studi</th>
                <th className="px-5 py-3">NIM</th>
                <th className="px-5 py-3">Tempat Penempatan</th>
                <th className="px-5 py-3 text-center">Progress</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-850 text-xs font-medium text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-slate-450 dark:text-slate-500">
                    <Loader2 className="w-10 h-10 mx-auto text-rose-500 mb-3 animate-spin" />
                    <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200">Menghubungkan ke Spring Boot...</p>
                    <p className="text-xs mt-1">Silakan tunggu selagi kami mengambil data terbaru dari backend.</p>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-450 dark:text-slate-500">
                    <AlertCircle className="w-10 h-10 mx-auto text-slate-350 dark:text-slate-650 mb-3" />
                    <p className="font-bold text-sm">Data Mahasiswa Tidak Ditemukan</p>
                    <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau ganti filter penyaringan.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-[#070e24]/10 transition-colors">
                    
                    {/* Name & University */}
                    <td className="px-5 py-4 min-w-[200px]">
                      <div className="space-y-1">
                        <span className="font-extrabold text-slate-900 dark:text-white block hover:text-rose-500 transition-colors">
                          {student.name}
                        </span>
                        <div className="space-y-0.5 text-[10px] text-slate-450 dark:text-slate-500 font-semibold flex flex-col">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {student.university}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {student.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Program Study */}
                    <td className="px-5 py-4 font-bold text-slate-800 dark:text-slate-200">
                      {student.program}
                    </td>

                    {/* NIM */}
                    <td className="px-5 py-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                      {student.nim}
                    </td>

                    {/* Placement Company */}
                    <td className="px-5 py-4 min-w-[180px]">
                      {student.company === "Belum Ditempatkan" ? (
                        <span className="text-[10px] px-2 py-1 font-bold rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/10">
                          Belum Ditempatkan
                        </span>
                      ) : (
                        <div className="space-y-1">
                          <span className="font-extrabold text-slate-900 dark:text-white block">{student.company}</span>
                          <span className="text-[9px] text-slate-400 block font-semibold">{student.role}</span>
                        </div>
                      )}
                    </td>

                    {/* Progress Bar */}
                    <td className="px-5 py-4 text-center min-w-[120px]">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              student.status === "Selesai" 
                                ? "bg-indigo-500" 
                                : student.status === "Dalam Review"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`} 
                            style={{ width: `${student.progress}%` }} 
                          />
                        </div>
                        <span className="font-mono text-[10px] font-bold text-slate-950 dark:text-white">
                          {student.progress}%
                        </span>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                        student.status === "Aktif"
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/25"
                          : student.status === "Selesai"
                          ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-200/25"
                          : student.status === "Dalam Review"
                          ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200/25"
                          : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200/25"
                      }`}>
                        {student.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-5 py-4 text-right min-w-[100px]">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(student)}
                          className="p-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id, student.name)}
                          className="p-2 bg-slate-50 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-colors cursor-pointer"
                          title="Hapus Mahasiswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* REGISTRATION & EDIT SLIDE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#070e24] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-float-none">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-150 dark:border-slate-850 flex justify-between items-center bg-gradient-to-r from-rose-50 to-transparent dark:from-rose-950/10">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {editingStudent ? `Edit Profil: ${editingStudent.name}` : "Registrasi Akun Mahasiswa Baru"}
                </h4>
                <p className="text-[11px] text-slate-450 dark:text-slate-500 mt-0.5">
                  {editingStudent ? "Perbarui rekam akademik mahasiswa." : "Daftarkan mahasiswa baru untuk program magang."}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Name field */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">Nama Lengkap Mahasiswa *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                />
              </div>

              {/* NIM & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">NIM Mahasiswa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 2201012001"
                    value={formNim}
                    onChange={(e) => setFormNim(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold font-mono focus:outline-none transition-all dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">No. Telepon / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812-xxxx-xxxx"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              {/* Email & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">Surel Akademik Mahasiswa *</label>
                  <input
                    type="email"
                    required
                    placeholder="Contoh: budi.santoso@student.ui.ac.id"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">Jenis Kelamin *</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as "Laki-laki" | "Perempuan" | "-")}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              {/* University & Program */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">Perguruan Tinggi *</label>
                  <select
                    value={formUniv}
                    onChange={(e) => setFormUniv(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  >
                    <option value="Universitas Indonesia">Universitas Indonesia</option>
                    <option value="Institut Teknologi Bandung">Institut Teknologi Bandung</option>
                    <option value="Universitas Gadjah Mada">Universitas Gadjah Mada</option>
                    <option value="Universitas Padjadjaran">Universitas Padjadjaran</option>
                    <option value="Institut Teknologi Sepuluh Nopember">Institut Teknologi Sepuluh Nopember</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">Program Studi *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: S1 Teknik Informatika"
                    value={formProgram}
                    onChange={(e) => setFormProgram(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              {/* Placement Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-3.5">
                <span className="text-[10px] uppercase font-black text-rose-500 tracking-wider block">Informasi Penempatan Magang</span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1">Nama Perusahaan / Mitra</label>
                    <input
                      type="text"
                      placeholder="Contoh: PT. Global Tech (Kosongkan jika belum)"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-rose-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1">Posisi / Peran Magang</label>
                    <input
                      type="text"
                      placeholder="Contoh: Software Engineer Intern"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-rose-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1">Durasi / Periode Magang</label>
                    <input
                      type="text"
                      placeholder="Contoh: 1 Feb 2026 - 31 Jul 2026"
                      value={formPeriod}
                      onChange={(e) => setFormPeriod(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-rose-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1">Progres Akademis (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Contoh: 85"
                      value={formProgress}
                      onChange={(e) => setFormProgress(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-rose-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">Status Magang Mahasiswa</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold text-slate-700 dark:text-slate-350">
                  <label className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    formStatus === "Aktif" 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-400 text-emerald-600 dark:text-emerald-450' 
                      : 'border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === "Aktif"}
                      onChange={() => setFormStatus("Aktif")}
                      className="sr-only"
                    />
                    <span>Aktif</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    formStatus === "Dalam Review" 
                      ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-400 text-amber-600 dark:text-amber-450' 
                      : 'border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === "Dalam Review"}
                      onChange={() => setFormStatus("Dalam Review")}
                      className="sr-only"
                    />
                    <span>Review</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    formStatus === "Selesai" 
                      ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-400 text-indigo-600 dark:text-indigo-450' 
                      : 'border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === "Selesai"}
                      onChange={() => setFormStatus("Selesai")}
                      className="sr-only"
                    />
                    <span>Selesai</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    formStatus === "Belum Penempatan" 
                      ? 'bg-red-50 dark:bg-red-950/20 border-red-400 text-red-600 dark:text-red-450' 
                      : 'border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === "Belum Penempatan"}
                      onChange={() => setFormStatus("Belum Penempatan")}
                      className="sr-only"
                    />
                    <span>Belum Placed</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-150 dark:border-slate-850 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-rose-600/10 cursor-pointer"
                >
                  {editingStudent ? "Simpan Perubahan" : "Daftarkan Mahasiswa"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
