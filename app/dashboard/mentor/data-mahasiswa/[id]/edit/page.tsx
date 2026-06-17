"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil, User, Mail, Phone, School, Calendar, AlertTriangle, Check, Loader2, GraduationCap
} from "lucide-react";
import { useStudentDetail } from "@/modules/data_mahasiswa/hooks";
import { useUniversitas } from "@/modules/universitas/hooks";
import { BackNavBar, FormSectionHeader, FormInputField, PageLoader, NotFoundBlock } from "@/components/shared";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditMahasiswaPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { student, isLoading, updateStudentDetail } = useStudentDetail(id);
  const { universitasList } = useUniversitas();

  const [form, setForm] = useState({
    name: "",
    nim: "",
    email: "",
    phone: "",
    idUniversity: 0,
    university: "",
    gender: "Laki-laki" as "Laki-laki" | "Perempuan",
    periodStart: "",
    periodEnd: "",
    periodStatus: "aktif" as "aktif" | "selesai" | "batal",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!student) return;
    setForm({
      name: student.name || "",
      nim: student.nim || "",
      email: student.email || "",
      phone: student.phone || "",
      idUniversity: student.idUniversity || 0,
      university: student.university || "",
      gender: (student.gender === "Perempuan" ? "Perempuan" : "Laki-laki"),
      periodStart: student.tanggalMulai || "",
      periodEnd: student.tanggalBerakhir || "",
      periodStatus:
        student.statusPeriode?.toLowerCase() === "selesai" ? "selesai"
        : student.statusPeriode?.toLowerCase() === "batal" ? "batal"
        : "aktif",
    });
  }, [student]);

  const validate = () => {
    if (!form.name.trim()) return "Nama Lengkap wajib diisi.";
    if (!form.nim.trim()) return "NIM wajib diisi.";
    if (!/^\d+$/.test(form.nim.trim())) return "NIM harus berupa angka saja.";
    if (!form.email.trim()) return "Alamat Email wajib diisi.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Format email tidak valid.";
    if (form.idUniversity === 0) return "Universitas wajib dipilih.";
    if (!form.phone.trim()) return "Nomor HP wajib diisi.";
    if (!form.periodStart || !form.periodEnd) return "Harap lengkapi tanggal awal dan akhir kegiatan.";
    if (new Date(form.periodStart) > new Date(form.periodEnd)) return "Tanggal awal tidak boleh melampaui tanggal akhir.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const err = validate();
    if (err) { setErrorMessage(err); window.scrollTo({ top: 0, behavior: "smooth" }); return; }

    setIsSubmitting(true);
    try {
      await updateStudentDetail({
        nama: form.name,
        nim: form.nim,
        email: form.email,
        idUniversity: form.idUniversity,
        noHp: form.phone,
        gender: form.gender,
        periode: {
          tanggalMulai: form.periodStart,
          tanggalBerakhir: form.periodEnd,
          status: form.periodStatus,
        },
      });
      router.push("/dashboard/mentor/data-mahasiswa");
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memperbarui data mahasiswa.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <PageLoader text="Memuat data mahasiswa..." />;
  if (!student) return (
    <NotFoundBlock
      title="Mahasiswa Tidak Ditemukan"
      description={`Data mahasiswa dengan ID ${id} tidak terdaftar.`}
      backHref="/dashboard/mentor/data-mahasiswa"
      backLabel="Kembali ke Daftar Mahasiswa"
    />
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <BackNavBar
        href="/dashboard/mentor/data-mahasiswa"
        label="Batal & Kembali"
        rightContent={
          <span className="flex items-center gap-1.5 text-xs text-[#2F578A] dark:text-[#F1F5F9]/60 font-bold">
            <Pencil className="w-3.5 h-3.5 text-[#36ADA3]" />
            Edit Data Mahasiswa
          </span>
        }
      />

      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-400 rounded-2xl flex items-start gap-3 shadow-sm animate-pulse">
          <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs font-bold leading-normal space-y-0.5">
            <p>Ada kesalahan pengisian formulir:</p>
            <p className="font-semibold opacity-90">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-6 md:p-8 shadow-sm bg-white dark:bg-[#121358]/40 space-y-6">

        <div className="flex items-center gap-4 pb-5 border-b border-[#2F578A]/20 dark:border-[#2F578A]">
          <div className="w-12 h-12 rounded-2xl bg-[#121358] text-[#36ADA3] border border-[#2F578A]/40 flex items-center justify-center shadow-sm">
            <Pencil className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-base md:text-lg text-[#232F72] dark:text-white">Edit Data Mahasiswa</h4>
            <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/60 font-semibold mt-0.5">
              Ubah rincian informasi data mahasiswa <strong>{student.name}</strong>.
            </p>
          </div>
        </div>

        {/* SECTION I */}
        <div className="space-y-4">
          <FormSectionHeader icon={<GraduationCap className="w-4 h-4" />} title="I. Data Akademik & Pribadi" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <FormInputField label="Nama Lengkap" name="name" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Budi Santoso" icon={User} required />

            <FormInputField label="Nomor Induk Mahasiswa (NIM)" name="nim" value={form.nim}
              onChange={e => setForm(p => ({ ...p, nim: e.target.value }))}
              placeholder="e.g. 2201012001" icon={User} required />

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 flex items-center gap-1">
                Universitas Asal <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.idUniversity}
                  onChange={e => {
                    const selId = Number(e.target.value);
                    const selUniv = universitasList.find(u => u.id === selId);
                    setForm(p => ({ ...p, idUniversity: selId, university: selUniv?.nameUniversity ?? p.university }));
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white appearance-none"
                >
                  <option value={0} disabled>Pilih Universitas...</option>
                  {universitasList?.map(u => <option key={u.id} value={u.id}>{u.nameUniversity}</option>)}
                </select>
                <School className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block">
                Jenis Kelamin <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.gender}
                onChange={e => setForm(p => ({ ...p, gender: e.target.value as "Laki-laki" | "Perempuan" }))}
                className="w-full p-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#232F72] dark:text-white"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION II */}
        <div className="space-y-4 pt-2">
          <FormSectionHeader icon={<Mail className="w-4 h-4" />} title="II. Informasi Kontak" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInputField label="Alamat Email" name="email" type="email" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="e.g. budi@student.ac.id" icon={Mail} required />
            <FormInputField label="Nomor HP / WhatsApp" name="phone" value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              placeholder="e.g. +62 812-9876-5432" icon={Phone} required />
          </div>
        </div>

        {/* SECTION III */}
        <div className="space-y-4 pt-2">
          <FormSectionHeader icon={<Calendar className="w-4 h-4" />} title="III. Periode Pelaksanaan Magang" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInputField label="Awal Kegiatan" name="periodStart" type="date" value={form.periodStart}
              onChange={e => setForm(p => ({ ...p, periodStart: e.target.value }))}
              icon={Calendar} required />
            <FormInputField label="Akhir Kegiatan" name="periodEnd" type="date" value={form.periodEnd}
              onChange={e => setForm(p => ({ ...p, periodEnd: e.target.value }))}
              icon={Calendar} required />
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block">
                Status Periode <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.periodStatus}
                onChange={e => setForm(p => ({ ...p, periodStatus: e.target.value as "aktif" | "selesai" | "batal" }))}
                className="w-full p-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#232F72] dark:text-white"
              >
                <option value="aktif">Aktif</option>
                <option value="selesai">Selesai</option>
                <option value="batal">Batal</option>
              </select>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="pt-4 border-t border-[#2F578A]/20 dark:border-[#2F578A] flex items-center justify-end gap-3 text-xs">
          <button
            type="button"
            onClick={() => router.push("/dashboard/mentor/data-mahasiswa")}
            className="px-5 py-2.5 rounded-xl border border-[#2F578A]/50 dark:border-[#2F578A] text-[#232F72]/80 dark:text-[#F1F5F9] font-bold hover:bg-[#F8FAFC] dark:hover:bg-[#121358] cursor-pointer transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#232F72] hover:brightness-110 text-white font-extrabold rounded-xl shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-70"
          >
            {isSubmitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan...</> : <><Check className="w-3.5 h-3.5" /> Simpan Perubahan</>}
          </button>
        </div>

      </form>
    </div>
  );
}
