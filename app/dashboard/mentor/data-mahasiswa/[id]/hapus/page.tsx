"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, Loader2, ArrowLeft } from "lucide-react";
import { useStudentDetail } from "@/modules/data_mahasiswa/hooks";
import { mahasiswaAPI } from "@/modules/data_mahasiswa/api";
import { BackNavBar, PageLoader, NotFoundBlock } from "@/components/shared";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function HapusMahasiswaPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { student, isLoading } = useStudentDetail(id);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError("");
    try {
      await mahasiswaAPI.deleteStudent(id);
      router.push("/dashboard/mentor/data-mahasiswa");
    } catch (err: any) {
      setError(err.message || "Gagal menghapus data mahasiswa.");
      setIsDeleting(false);
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
    <div className="space-y-6 max-w-lg mx-auto">
      <BackNavBar
        href="/dashboard/mentor/data-mahasiswa"
        label="Batal & Kembali"
        rightContent={
          <span className="text-xs text-rose-500 font-bold flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" />
            Hapus Mahasiswa
          </span>
        }
      />

      <div className="border border-rose-200/60 dark:border-rose-900/40 rounded-3xl p-8 md:p-10 shadow-sm bg-white dark:bg-[#121358]/40 text-center space-y-6">

        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 border border-rose-200/50 dark:border-rose-900/40 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h4 className="font-black text-base text-[#232F72] dark:text-white">Hapus Data Mahasiswa?</h4>
          <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold leading-relaxed max-w-sm mx-auto">
            Apakah Anda yakin ingin menghapus data mahasiswa bimbingan bernama{" "}
            <strong className="text-[#232F72] dark:text-white">{student.name}</strong>?{" "}
            Tindakan ini <span className="text-rose-500 font-extrabold">tidak dapat dibatalkan</span>.
          </p>
        </div>

        <div className="p-4 bg-[#F8FAFC] dark:bg-[#232F72]/30 border border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-2xl text-left text-xs space-y-1.5">
          <p className="text-[10px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-black uppercase tracking-wider">Ringkasan Data</p>
          <p className="font-extrabold text-[#232F72] dark:text-white">{student.name}</p>
          <p className="text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold">NIM: {student.nim}</p>
          <p className="text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold">{student.university}</p>
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-bold">{error}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/dashboard/mentor/data-mahasiswa")}
            className="flex-1 px-5 py-3 rounded-2xl border border-[#2F578A]/50 dark:border-[#2F578A] text-[#232F72]/80 dark:text-[#F1F5F9] font-bold text-xs hover:bg-[#F8FAFC] dark:hover:bg-[#121358] cursor-pointer transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Batal, Kembali
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 px-5 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-extrabold rounded-2xl text-xs shadow-md active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1.5"
          >
            {isDeleting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Menghapus...</> : <><Trash2 className="w-3.5 h-3.5" /> Ya, Hapus Data</>}
          </button>
        </div>

      </div>
    </div>
  );
}
