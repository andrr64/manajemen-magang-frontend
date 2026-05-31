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
  UserCheck, 
  AlertCircle,
  FileSpreadsheet,
  ChevronDown
} from "lucide-react";

interface Mentor {
  id: number;
  name: string;
  type: "Akademik" | "Industri"; // Akademik = Dosen Pembimbing, Industri = Mentor Lapangan
  identityNo: string; // NIDN for Akademik, NIK for Industri
  email: string;
  phone: string;
  departmentOrCompany: string; // Fakultas/Prodi for Akademik, Company Name for Industri
  studentsCount: number;
  status: "Aktif" | "Nonaktif";
}

export default function KelolaMentorPage() {
  // Initial Mock Mentors Data
  const [mentors, setMentors] = useState<Mentor[]>([
    {
      id: 1,
      name: "Dr. Ahmad Hidayat, M.T.",
      type: "Akademik",
      identityNo: "0423127801",
      email: "ahmad.hidayat@lecturer.ac.id",
      phone: "0812-3456-7890",
      departmentOrCompany: "Fakultas Ilmu Komputer (FASILKOM)",
      studentsCount: 8,
      status: "Aktif"
    },
    {
      id: 2,
      name: "Dr. Rina Astuti, S.Kom., M.MSI.",
      type: "Akademik",
      identityNo: "0412088502",
      email: "rina.astuti@lecturer.ac.id",
      phone: "0813-9876-5432",
      departmentOrCompany: "Fakultas Ilmu Komputer (FASILKOM)",
      studentsCount: 6,
      status: "Aktif"
    },
    {
      id: 3,
      name: "Hendra Wijaya, Ph.D.",
      type: "Akademik",
      identityNo: "0319078103",
      email: "hendra.wijaya@lecturer.ac.id",
      phone: "0857-1122-3344",
      departmentOrCompany: "Fakultas Teknik (FT)",
      studentsCount: 5,
      status: "Aktif"
    },
    {
      id: 4,
      name: "Denny Siregar, S.T.",
      type: "Industri",
      identityNo: "GTN-88012",
      email: "denny.siregar@globaltech.co.id",
      phone: "0821-4455-6677",
      departmentOrCompany: "PT. Global Teknologi Nusantara",
      studentsCount: 4,
      status: "Aktif"
    },
    {
      id: 5,
      name: "Jessica Alba, M.B.A.",
      type: "Industri",
      identityNo: "SHP-0992",
      email: "jessica.alba@shopee.co.id",
      phone: "0811-9988-7766",
      departmentOrCompany: "PT. Shopee Internasional Indonesia",
      studentsCount: 3,
      status: "Aktif"
    },
    {
      id: 6,
      name: "Bambang Pamungkas, M.M.",
      type: "Industri",
      identityNo: "TEL-7711",
      email: "bambang.p@telkom.co.id",
      phone: "0812-7766-5544",
      departmentOrCompany: "PT. Telkom Indonesia Tbk",
      studentsCount: 0,
      status: "Nonaktif"
    }
  ]);

  // Search, filter, and tabs state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"Semua" | "Akademik" | "Industri">("Semua");
  const [selectedStatus, setSelectedStatus] = useState<"Semua" | "Aktif" | "Nonaktif">("Semua");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<"Akademik" | "Industri">("Akademik");
  const [formIdentityNo, setFormIdentityNo] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDeptOrCompany, setFormDeptOrCompany] = useState("");
  const [formStatus, setFormStatus] = useState<"Aktif" | "Nonaktif">("Aktif");

  // Toast / Banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reset form helper
  const resetForm = () => {
    setFormName("");
    setFormType("Akademik");
    setFormIdentityNo("");
    setFormEmail("");
    setFormPhone("");
    setFormDeptOrCompany("");
    setFormStatus("Aktif");
    setEditingMentor(null);
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (mentor: Mentor) => {
    setEditingMentor(mentor);
    setFormName(mentor.name);
    setFormType(mentor.type);
    setFormIdentityNo(mentor.identityNo);
    setFormEmail(mentor.email);
    setFormPhone(mentor.phone);
    setFormDeptOrCompany(mentor.departmentOrCompany);
    setFormStatus(mentor.status);
    setIsModalOpen(true);
  };

  // Trigger Toast Notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handle Form Submit (Add or Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formName || !formIdentityNo || !formEmail || !formDeptOrCompany) {
      alert("Harap isi semua kolom wajib!");
      return;
    }

    if (editingMentor) {
      // Edit mode
      setMentors(mentors.map(m => m.id === editingMentor.id ? {
        ...m,
        name: formName,
        type: formType,
        identityNo: formIdentityNo,
        email: formEmail,
        phone: formPhone || "-",
        departmentOrCompany: formDeptOrCompany,
        status: formStatus
      } : m));
      triggerToast(`Data mentor "${formName}" berhasil diperbarui!`);
    } else {
      // Add mode
      const newMentor: Mentor = {
        id: Date.now(),
        name: formName,
        type: formType,
        identityNo: formIdentityNo,
        email: formEmail,
        phone: formPhone || "-",
        departmentOrCompany: formDeptOrCompany,
        studentsCount: 0,
        status: formStatus
      };
      setMentors([newMentor, ...mentors]);
      triggerToast(`Mentor "${formName}" berhasil didaftarkan di sistem!`);
    }
    setIsModalOpen(false);
    resetForm();
  };

  // Handle Delete Mentor
  const handleDeleteMentor = (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data mentor "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      setMentors(mentors.filter(m => m.id !== id));
      triggerToast(`Data mentor "${name}" berhasil dihapus.`);
    }
  };

  // Toggle Mentor Status (Active / Inactive)
  const handleToggleStatus = (id: number) => {
    setMentors(mentors.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === "Aktif" ? "Nonaktif" : "Aktif";
        triggerToast(`Status ${m.name} diubah menjadi ${nextStatus}.`);
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  // Dynamic Filtering Logic
  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      const matchSearch = 
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.identityNo.includes(searchQuery) ||
        mentor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.departmentOrCompany.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchType = selectedType === "Semua" || mentor.type === selectedType;
      const matchStatus = selectedStatus === "Semua" || mentor.status === selectedStatus;

      return matchSearch && matchType && matchStatus;
    });
  }, [mentors, searchQuery, selectedType, selectedStatus]);

  // Statistics Computations
  const stats = useMemo(() => {
    const total = mentors.length;
    const akademik = mentors.filter(m => m.type === "Akademik").length;
    const industri = mentors.filter(m => m.type === "Industri").length;
    const active = mentors.filter(m => m.status === "Aktif").length;
    const totalStudentsAssigned = mentors.reduce((acc, m) => acc + m.studentsCount, 0);
    const avgStudents = total > 0 ? (totalStudentsAssigned / total).toFixed(1) : "0.0";

    return { total, akademik, industri, active, totalStudentsAssigned, avgStudents };
  }, [mentors]);

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
        
        {/* Total Mentors */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Total Pembimbing & Mentor
            </span>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {stats.total} Orang
            </h4>
            <span className="text-[9px] font-semibold text-emerald-500 block pt-1">
              {stats.active} Aktif Terdaftar
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/20 shadow-sm">
            <UserCheck className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Academic Mentors */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Dosen Pembimbing
            </span>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {stats.akademik} Dosen
            </h4>
            <span className="text-[9px] font-semibold text-slate-450 block pt-1">
              Pembimbing Akademik Kampus
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/20 shadow-sm">
            <GraduationCap className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Industrial Mentors */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Mentor Industri
            </span>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {stats.industri} Mentor
            </h4>
            <span className="text-[9px] font-semibold text-slate-450 block pt-1">
              Pembimbing Lapangan Perusahaan
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200/20 shadow-sm">
            <Building className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Average Load */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Beban Rata-Rata
            </span>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {stats.avgStudents} Mhs
            </h4>
            <span className="text-[9px] font-semibold text-amber-500 block pt-1">
              Bimbingan per pembimbing
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/20 shadow-sm">
            <Users className="w-5.5 h-5.5" />
          </div>
        </div>

      </div>

      {/* FILTER & TABLE PANEL */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 shadow-sm space-y-4">
        
        {/* Table Title and Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Direktori Pengajar & Mentor Magang</h3>
            <p className="text-xs text-slate-400 mt-0.5">Kelola data pembimbing akademik universitas serta pengawas industri mitra magang.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                alert("Mengekspor berkas CSV/Excel...");
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
              <span>Registrasi Mentor</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col lg:flex-row gap-4 pt-2">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari mentor berdasarkan nama, NIDN/NIK, instansi, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-[#030712] transition-all dark:text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Filters Selects */}
          <div className="flex flex-wrap gap-3">
            {/* Filter by Type */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">Tipe:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as "Semua" | "Akademik" | "Industri")}
                className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none pr-1"
              >
                <option value="Semua">Semua Tipe</option>
                <option value="Akademik">Dosen Akademik</option>
                <option value="Industri">Mentor Industri</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as "Semua" | "Aktif" | "Nonaktif")}
                className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none pr-1"
              >
                <option value="Semua">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>
        </div>

        {/* MENTORS TABLE */}
        <div className="overflow-x-auto border border-slate-200/50 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-950/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-[#070e24]/60 text-slate-450 dark:text-slate-400 border-b border-slate-150 dark:border-slate-800 text-[10px] uppercase font-bold tracking-wider">
                <th className="px-5 py-3">Nama Lengkap & Kontak</th>
                <th className="px-5 py-3">Tipe Mentor</th>
                <th className="px-5 py-3">Nomor Identitas (NIDN/NIK)</th>
                <th className="px-5 py-3">Fakultas / Instansi Kerja</th>
                <th className="px-5 py-3 text-center">Bimbingan</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-850 text-xs font-medium text-slate-700 dark:text-slate-300">
              {filteredMentors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-450 dark:text-slate-500">
                    <AlertCircle className="w-10 h-10 mx-auto text-slate-350 dark:text-slate-650 mb-3" />
                    <p className="font-bold text-sm">Data Mentor Tidak Ditemukan</p>
                    <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau penyaring status Anda.</p>
                  </td>
                </tr>
              ) : (
                filteredMentors.map(mentor => (
                  <tr key={mentor.id} className="hover:bg-slate-50/50 dark:hover:bg-[#070e24]/10 transition-colors">
                    
                    {/* Name & Contact */}
                    <td className="px-5 py-4 min-w-[200px]">
                      <div className="space-y-1">
                        <span className="font-extrabold text-slate-900 dark:text-white block hover:text-rose-500 transition-colors">
                          {mentor.name}
                        </span>
                        <div className="space-y-0.5 text-[10px] text-slate-450 dark:text-slate-500 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {mentor.email}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {mentor.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="px-5 py-4">
                      {mentor.type === "Akademik" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-900/50 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 rounded-lg">
                          <GraduationCap className="w-3.5 h-3.5" />
                          Dosen Kampus
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200/50 dark:border-cyan-900/50 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 rounded-lg">
                          <Building className="w-3.5 h-3.5" />
                          Mentor Industri
                        </span>
                      )}
                    </td>

                    {/* Identity No */}
                    <td className="px-5 py-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                      {mentor.identityNo}
                    </td>

                    {/* Instansi/Departemen */}
                    <td className="px-5 py-4 max-w-[200px] truncate font-bold text-slate-800 dark:text-slate-200">
                      {mentor.departmentOrCompany}
                    </td>

                    {/* Assigned Student Count */}
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                        mentor.studentsCount > 0 
                          ? 'bg-slate-100 dark:bg-slate-900 text-slate-850 dark:text-slate-100' 
                          : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/10'
                      }`}>
                        {mentor.studentsCount} Mhs
                      </span>
                    </td>

                    {/* Status Toggle Switch styled */}
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(mentor.id)}
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black cursor-pointer uppercase ${
                          mentor.status === "Aktif"
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/25"
                            : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200/25"
                        }`}
                      >
                        {mentor.status}
                      </button>
                    </td>

                    {/* Actions buttons */}
                    <td className="px-5 py-4 text-right min-w-[100px]">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(mentor)}
                          className="p-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMentor(mentor.id, mentor.name)}
                          disabled={mentor.studentsCount > 0}
                          className="p-2 bg-slate-50 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer"
                          title={mentor.studentsCount > 0 ? "Tidak dapat menghapus mentor yang memiliki bimbingan mahasiswa aktif" : "Hapus Mentor"}
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
                  {editingMentor ? `Edit Profil: ${editingMentor.name}` : "Registrasi Akun Mentor Baru"}
                </h4>
                <p className="text-[11px] text-slate-450 dark:text-slate-500 mt-0.5">
                  {editingMentor ? "Perbarui kredensial dan detail kerja pengajar." : "Daftarkan pembimbing akademik atau pengawas industri magang."}
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
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Type Option */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">Tipe Pembimbing / Mentor</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormType("Akademik");
                      if (!formDeptOrCompany.startsWith("PT.")) setFormDeptOrCompany("Fakultas Ilmu Komputer (FASILKOM)");
                    }}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                      formType === "Akademik" 
                        ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-400 text-rose-600 dark:text-rose-450' 
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>Dosen Kampus (Akademik)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormType("Industri");
                      setFormDeptOrCompany("PT. Global Teknologi Nusantara");
                    }}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                      formType === "Industri" 
                        ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-400 text-rose-600 dark:text-rose-450' 
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <Building className="w-5 h-5" />
                    <span>Mentor Lapangan (Industri)</span>
                  </button>
                </div>
              </div>

              {/* Name field */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dr. Ahmad Hidayat, M.T."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Identity Number */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">
                    {formType === "Akademik" ? "NIDN / NIP *" : "NIK Karyawan Perusahaan *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={formType === "Akademik" ? "Contoh: 0423127801" : "Contoh: NIK-99012"}
                    value={formIdentityNo}
                    onChange={(e) => setFormIdentityNo(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold font-mono focus:outline-none transition-all dark:text-white"
                  />
                </div>
                {/* Phone */}
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

              {/* Email */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">Surel Akademik / Kantor *</label>
                <input
                  type="email"
                  required
                  placeholder="Contoh: nama.mentor@lecturer.ac.id"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                />
              </div>

              {/* Department / Company */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">
                  {formType === "Akademik" ? "Fakultas / Program Studi *" : "Instansi / Perusahaan Tempat Kerja *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={formType === "Akademik" ? "Contoh: Fakultas Ilmu Komputer" : "Contoh: PT. Telekomunikasi Indonesia"}
                  value={formDeptOrCompany}
                  onChange={(e) => setFormDeptOrCompany(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                />
              </div>

              {/* Status Selector */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">Status Akun Mentor</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === "Aktif"}
                      onChange={() => setFormStatus("Aktif")}
                      className="text-rose-500 focus:ring-rose-500"
                    />
                    <span>Aktif (Diberikan Akses Masuk)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === "Nonaktif"}
                      onChange={() => setFormStatus("Nonaktif")}
                      className="text-rose-500 focus:ring-rose-500"
                    />
                    <span>Nonaktif (Blokir Akses)</span>
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
                  {editingMentor ? "Simpan Perubahan" : "Daftarkan Mentor"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
