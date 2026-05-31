"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  UserPlus, 
  Mail, 
  Phone, 
  School, 
  User, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  GraduationCap
} from "lucide-react";

export default function TambahMahasiswaPage() {
  const router = useRouter();

  // Form Fields State
  const [formData, setFormData] = useState({
    name: "",
    nim: "",
    email: "",
    university: "",
    phone: "",
    gender: "Laki-laki" as "Laki-laki" | "Perempuan",
    program: "",
    company: "",
    role: "",
    period: "1 Februari 2026 - 31 Juli 2026",
    address: ""
  });

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Input Change Handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(""); // Reset error message on input change
  };

  // Custom Gender Selector Handler
  const handleGenderSelect = (gender: "Laki-laki" | "Perempuan") => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  // Form Validation
  const validateForm = () => {
    if (!formData.name.trim()) return "Nama Lengkap wajib diisi.";
    if (!formData.nim.trim()) return "NIM wajib diisi.";
    if (!/^\d+$/.test(formData.nim.trim())) return "NIM harus berupa angka saja.";
    if (!formData.email.trim()) return "Alamat Email wajib diisi.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Format email tidak valid.";
    if (!formData.university.trim()) return "Universitas wajib diisi.";
    if (!formData.phone.trim()) return "Nomor HP wajib diisi.";
    if (!formData.company.trim()) return "Nama Perusahaan Mitra wajib diisi.";
    if (!formData.role.trim()) return "Posisi/Peran Magang wajib diisi.";
    if (!formData.program.trim()) return "Program Studi wajib diisi.";
    return null;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    // Simulate API storage delay
    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      setIsSubmitting(false);
      setIsSuccess(true);

      // Redirect back to students table after showing success modal
      setTimeout(() => {
        router.push("/dashboard/mentor/data-mahasiswa");
      }, 2000);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage("Terjadi kesalahan sistem. Silakan coba kembali.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      
      {/* SUCCESS MODAL OVERLAY */}
      {isSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#070e24] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-4 animate-float">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-200/50 dark:border-emerald-900/40 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-black text-lg text-slate-900 dark:text-white">Pendaftaran Berhasil!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                Mahasiswa bimbingan <strong>{formData.name}</strong> berhasil ditambahkan ke database sistem secara aman.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              Mengalihkan kembali ke dashboard...
            </div>
          </div>
        </div>
      )}

      {/* TOP NAVIGATION */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/mentor/data-mahasiswa"
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#070e24]/40 transition-all hover:scale-[1.02] active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Batal & Kembali
        </Link>
        
        <span className="text-xs text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Pendaftaran Mahasiswa Baru
        </span>
      </div>

      {/* ERROR TOAST NOTIFICATION */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-400 rounded-2xl flex items-start gap-3 shadow-sm animate-pulse">
          <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs font-bold leading-normal">
            <p>Ada kesalahan pengisian formulir:</p>
            <p className="font-semibold opacity-90">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* FORM CARD */}
      <form onSubmit={handleSubmit} className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-6">
        
        {/* CARD HEADER */}
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-900/40 flex items-center justify-center shadow-sm">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-base md:text-lg text-slate-900 dark:text-white">Registrasi Mahasiswa Bimbingan</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Daftarkan mahasiswa magang baru di bawah pengawasan akademik Anda untuk memulai monitoring mingguan.
            </p>
          </div>
        </div>

        {/* SECTION I: PERSONAL DATA */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1.5 border-b border-dashed border-slate-100 dark:border-slate-800/60">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <h5 className="font-extrabold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              I. Data Akademik & Pribadi
            </h5>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Budi Santoso"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* NIM */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                Nomor Induk Mahasiswa (NIM) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="nim"
                  value={formData.nim}
                  onChange={handleChange}
                  placeholder="e.g. 2201012001"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                />
                <span className="text-[10px] font-extrabold text-slate-400 absolute left-3.5 top-3.5">NIM</span>
              </div>
            </div>

            {/* University */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                Universitas Asal <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  placeholder="e.g. Universitas Indonesia"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                />
                <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Program Studi */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                Program Studi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  placeholder="e.g. S1 Teknik Informatika"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                />
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Gender Selection */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                Jenis Kelamin / Gender <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 text-center text-xs font-bold">
                {[
                  { value: "Laki-laki" as const, label: "Laki-laki" },
                  { value: "Perempuan" as const, label: "Perempuan" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleGenderSelect(option.value)}
                    className={`py-3 px-4 border rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formData.gender === option.value
                        ? option.value === "Laki-laki"
                          ? "bg-blue-50 border-blue-300 text-blue-600 dark:bg-blue-950/30 dark:border-blue-900/60 dark:text-blue-400 shadow-md shadow-blue-500/5 scale-[1.01]"
                          : "bg-pink-50 border-pink-300 text-pink-600 dark:bg-pink-950/30 dark:border-pink-900/60 dark:text-pink-400 shadow-md shadow-pink-500/5 scale-[1.01]"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* SECTION II: CONTACT & ADDRESS */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-1.5 border-b border-dashed border-slate-100 dark:border-slate-800/60">
            <Mail className="w-4 h-4 text-indigo-500" />
            <h5 className="font-extrabold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              II. Informasi Kontak & Domisili
            </h5>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                Alamat Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. budi.santoso@student.ui.ac.id"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Nomor HP / WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                Nomor HP / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +62 812-9876-5432"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                Alamat Domisili Rumah
              </label>
              <div className="relative">
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Jl. Margonda Raya No. 100, Depok, Jawa Barat"
                  rows={2}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white resize-none"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION III: INTERNSHIP PENEMENTAN */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-1.5 border-b border-dashed border-slate-100 dark:border-slate-800/60">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <h5 className="font-extrabold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              III. Informasi Penempatan Magang Industri
            </h5>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Perusahaan Mitra */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                Nama Perusahaan Mitra <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. PT. Global Teknologi Nusantara"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                />
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Posisi Magang */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                Posisi / Peran Magang <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineering Intern"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                />
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Periode Magang */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                Periode Pelaksanaan Kontrak
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  placeholder="e.g. 1 Februari 2026 - 31 Juli 2026"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* FORM ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100 dark:border-slate-800/80">
          <Link
            href="/dashboard/mentor/data-mahasiswa"
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
          >
            Batal
          </Link>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-500/65 text-white text-xs font-extrabold flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan Data...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Simpan Mahasiswa
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
