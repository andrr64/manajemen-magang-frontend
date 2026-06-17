"use client";
import { WEB_ROUTES } from "@/modules/web-routes";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Mail,
  Phone,
  School,
  User,
  Calendar,
  Sparkles,
  AlertTriangle,
  GraduationCap
} from "lucide-react";
import { useStudents } from "@/modules/data_mahasiswa/hooks";
import { useUniversitas } from "@/modules/universitas/hooks";
import {
  BackNavBar,
  FormSectionHeader,
  FormInputField,
  ModalActions,
} from "@/components/shared";

export default function TambahMahasiswaPage() {
  const router = useRouter();
  const { addStudent } = useStudents();
  const { universitasList } = useUniversitas();

  const defaultTanggalMulai = new Date().toISOString().split("T")[0];
  const defaultTanggalBerakhir = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split("T")[0];
  })();

  const [formData, setFormData] = useState({
    name: "",
    nim: "",
    email: "",
    idUniversity: 0,
    phone: "",
    gender: "Laki-laki" as "Laki-laki" | "Perempuan",
    tanggalMulai: defaultTanggalMulai,
    tanggalBerakhir: defaultTanggalBerakhir,
    periodeStatus: "aktif" as "aktif" | "selesai" | "batal"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Nama Lengkap wajib diisi.";
    if (!formData.nim.trim()) return "NIM wajib diisi.";
    if (!/^\d+$/.test(formData.nim.trim())) return "NIM harus berupa angka saja.";
    if (!formData.email.trim()) return "Alamat Email wajib diisi.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Format email tidak valid.";
    if (formData.idUniversity === 0) return "Universitas wajib dipilih.";
    if (!formData.phone.trim()) return "Nomor HP wajib diisi.";
    if (!formData.tanggalMulai) return "Tanggal mulai magang wajib diisi.";
    if (!formData.tanggalBerakhir) return "Tanggal akhir magang wajib diisi.";
    if (new Date(formData.tanggalMulai) > new Date(formData.tanggalBerakhir))
      return "Tanggal mulai tidak boleh melampaui tanggal akhir.";
    return null;
  };

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

    try {
      await addStudent({
        name: formData.name,
        nim: formData.nim,
        email: formData.email,
        idUniversity: formData.idUniversity,
        university: "",
        gender: formData.gender,
        phone: formData.phone,
        tanggalMulai: formData.tanggalMulai,
        tanggalBerakhir: formData.tanggalBerakhir,
        periodeStatus: formData.periodeStatus
      });

      setIsSubmitting(false);
      router.push(WEB_ROUTES.MENTOR_DATA_MAHASISWA);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || "Terjadi kesalahan sistem. Silakan coba kembali.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">

      <BackNavBar
        href="/dashboard/mentor/data-mahasiswa"
        label="Batal & Kembali"
        rightContent={
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#36ADA3]" />
            Pendaftaran Mahasiswa Baru
          </span>
        }
      />

      {/* ERROR TOAST */}
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
      <form onSubmit={handleSubmit} className="border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-6 md:p-8 shadow-sm bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md space-y-6">

        {/* CARD HEADER */}
        <div className="flex items-center gap-4 pb-5 border-b border-[#2F578A]/20 dark:border-[#2F578A]">
          <div className="w-12 h-12 rounded-2xl bg-[#121358] text-[#36ADA3] border border-[#2F578A]/40 flex items-center justify-center shadow-sm">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-base md:text-lg text-[#232F72] dark:text-white">Registrasi Mahasiswa Bimbingan</h4>
            <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/60 font-semibold mt-0.5">
              Daftarkan mahasiswa magang baru di bawah pengawasan akademik Anda untuk memulai monitoring mingguan.
            </p>
          </div>
        </div>

        {/* SECTION I: DATA AKADEMIK & PRIBADI */}
        <div className="space-y-4">
          <FormSectionHeader icon={<GraduationCap className="w-4 h-4" />} title="I. Data Akademik & Pribadi" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <FormInputField label="Nama Lengkap" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Budi Santoso" icon={User} required />
            <FormInputField label="Nomor Induk Mahasiswa (NIM)" name="nim" value={formData.nim} onChange={handleChange} placeholder="e.g. 2201012001" icon={User} required />

            {/* Universitas */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 flex items-center gap-1">
                Universitas Asal <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="idUniversity"
                  value={formData.idUniversity}
                  onChange={(e) => setFormData(prev => ({ ...prev, idUniversity: Number(e.target.value) }))}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white appearance-none"
                >
                  <option value={0} disabled>Pilih Universitas...</option>
                  {universitasList?.map(u => (
                    <option key={u.id} value={u.id}>{u.nameUniversity}</option>
                  ))}
                </select>
                <School className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Jenis Kelamin */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block">
                Jenis Kelamin <span className="text-rose-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#232F72] dark:text-white"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

          </div>
        </div>

        {/* SECTION II: KONTAK */}
        <div className="space-y-4 pt-2">
          <FormSectionHeader icon={<Mail className="w-4 h-4" />} title="II. Informasi Kontak" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInputField label="Alamat Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="e.g. budi.santoso@student.ui.ac.id" icon={Mail} required />
            <FormInputField label="Nomor HP / WhatsApp" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +62 812-9876-5432" icon={Phone} required />
          </div>
        </div>

        {/* SECTION III: PERIODE MAGANG */}
        <div className="space-y-4 pt-2">
          <FormSectionHeader icon={<Calendar className="w-4 h-4" />} title="III. Periode Pelaksanaan Magang" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInputField label="Awal Kegiatan" name="tanggalMulai" type="date" value={formData.tanggalMulai} onChange={handleChange} icon={Calendar} required />
            <FormInputField label="Akhir Kegiatan" name="tanggalBerakhir" type="date" value={formData.tanggalBerakhir} onChange={handleChange} icon={Calendar} required />

            {/* Status Periode */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block">
                Status Periode <span className="text-rose-500">*</span>
              </label>
              <select
                name="periodeStatus"
                value={formData.periodeStatus}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#232F72] dark:text-white"
              >
                <option value="aktif">Aktif</option>
                <option value="selesai">Selesai</option>
                <option value="batal">Batal</option>
              </select>
            </div>

          </div>
        </div>

        <ModalActions
          cancelHref="/dashboard/mentor/data-mahasiswa"
          submitLabel="Simpan Mahasiswa"
          submittingLabel="Menyimpan Data..."
          isSubmitting={isSubmitting}
          submitIcon={<UserPlus className="w-4 h-4" />}
        />

      </form>
    </div>
  );
}
