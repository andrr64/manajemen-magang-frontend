"use client";
import { WEB_ROUTES } from "@/modules/web-routes";

import React, { use, useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  School,
  FileBadge,
  CheckCircle,
  Clock,
  Upload,
  Check,
  RefreshCw,
  Sparkles,
  Paperclip,
  Trash2,
  Loader2,
  Briefcase,
  Download,
  CalendarCheck,
  FileCheck
} from "lucide-react";
import { BackNavBar, PageLoader, NotFoundBlock, SuccessModal, ModalActions } from "@/components/shared";
import { studentsData } from "../../data-mahasiswa/studentsData";
import { useStudentCertificates } from "@/modules/sertifikat/hooks";
import { useStudents } from "@/modules/data_mahasiswa/hooks";
import { useFileUpload } from "@/modules/media/hooks";
import { mediaAPI } from "@/modules/media/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MentorCertificateDetailPage({ params }: PageProps) {
  const router = useRouter();
  const unwrappedParams = use(params);
  
  // Instantiating real certificates hook
  const { certificates, isLoading, isSubmitting: isHookSubmitting, uploadStudentCertificate, refreshCertificates } = useStudentCertificates();
  const { rawStudents } = useStudents();
  const studentsList = rawStudents;

  // Fetch certificates once on mount
  useEffect(() => {
    refreshCertificates();
  }, [refreshCertificates]);

  // Find matched certificate info from the API results
  const matchedCert = useMemo(() => {
    return certificates.find(c => String(c.mahasiswaId) === String(unwrappedParams.id));
  }, [certificates, unwrappedParams.id]);

  // Find target mock student
  const mockStudent = useMemo(() => {
    if (!matchedCert) {
      return studentsList.find(s => String(s.id) === String(unwrappedParams.id));
    }
    return studentsList.find(s => s.nim === matchedCert.nim || s.name === matchedCert.namaMahasiswa);
  }, [matchedCert, unwrappedParams.id, studentsList]);

  // Unified student object
  const student = useMemo(() => {
    if (matchedCert) {
      return {
        id: matchedCert.mahasiswaId,
        name: matchedCert.namaMahasiswa,
        nim: matchedCert.nim,
        university: mockStudent ? mockStudent.university : "Universitas Mitra",
        company: mockStudent ? mockStudent.company : "Kantor Mitra",
        avatarColor: mockStudent ? mockStudent.avatarColor : "from-indigo-500 to-cyan-500",
        grade: mockStudent ? mockStudent.grade : null
      };
    } else if (mockStudent) {
      return {
        id: mockStudent.id,
        name: mockStudent.name,
        nim: mockStudent.nim,
        university: mockStudent.university,
        company: mockStudent.company,
        avatarColor: mockStudent.avatarColor,
        grade: mockStudent.grade
      };
    }
    return null;
  }, [matchedCert, mockStudent]);

  // State for file attachment upload
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState<string | null>(null);

  // Sync state once matchedCert is resolved from backend
  useEffect(() => {
    if (matchedCert) {
      if (matchedCert.url && matchedCert.url !== "-") {
        setFileName(matchedCert.url.split("/").pop() || "sertifikat.pdf");
        setFileUrl(mediaAPI.getFileUrl(matchedCert.url));
        setFileKey(matchedCert.url);
      } else {
        setFileName(null);
        setFileUrl(null);
        setFileKey(null);
      }
    }
  }, [matchedCert]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileSize, setFileSize] = useState<string>("2.4 MB");
  const [fileType, setFileType] = useState<string>("application/pdf");

  const { upload, isUploading, error: uploadError } = useFileUpload({
    maxSizeMB: 5,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  });
  const [showToast, setShowToast] = useState("");

  // States for final page submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Trigger file browser input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Real upload to media module
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const typeLabel = file.type || "application/pdf";

    try {
      const result = await upload(file);
      setFileName(result.fileName);
      setFileUrl(result.url);
      setFileKey(result.key);
      setFileSize(`${sizeInMb} MB`);
      setFileType(typeLabel);
      setShowToast(`Sertifikat "${result.fileName}" sukses diunggah!`);
      setTimeout(() => setShowToast(""), 3000);
    } catch (err: any) {
      alert(err.message || "Gagal mengunggah berkas sertifikat.");
    }
  };

  // Simulated Certificate Deletion
  const handleRemoveCertificate = () => {
    if (confirm("Apakah Anda yakin ingin menghapus berkas sertifikat ini?")) {
      setFileName(null);
      setFileUrl(null);
      setFileKey(null);
      setShowToast("Berkas sertifikat magang berhasil dihapus.");
      setTimeout(() => setShowToast(""), 3000);
    }
  };

  // Real API save submit
  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !matchedCert || !fileKey) return;

    setIsSubmitting(true);

    try {
      await uploadStudentCertificate(matchedCert.periodeMagangId, fileKey);

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        router.push(WEB_ROUTES.MENTOR_SERTIFIKAT);
      }, 2000);
    } catch (err: any) {
      setIsSubmitting(false);
      alert(err.message || "Gagal menyimpan berkas.");
    }
  };

  // Render 404 block if student not found
  if (!student) {
    return (
      <NotFoundBlock
        title="Mahasiswa Tidak Ditemukan"
        description={`Data mahasiswa dengan ID #${unwrappedParams.id} tidak terdaftar di sistem penerbitan sertifikat magang.`}
        backHref="/dashboard/mentor/sertifikat"
        backLabel="Kembali ke Daftar Sertifikat"
      />
    );
  }

  if (isLoading) {
    return (
      <PageLoader text="Memuat data berkas sertifikat..." spinnerColor="text-indigo-500" />
    );
  }

  return (
    <div className="space-y-6">

      {/* FLOAT SUCCESS TOAST */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-2xl shadow-xl flex items-center gap-3 animate-float max-w-sm">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs font-bold leading-normal">{showToast}</span>
        </div>
      )}

      {/* SUCCESS MODAL OVERLAY */}
      <SuccessModal
        show={isSuccess}
        title="Sertifikat Berhasil Disimpan!"
        description={`Lampiran sertifikat magang untuk bimbingan ${student.name} berhasil dikunci dan diverifikasi oleh sistem.`}
        variant="indigo"
      />

      {/* TOP NAVIGATION BAR */}
      <BackNavBar
        href="/dashboard/mentor/sertifikat"
        label="Batal & Kembali"
        rightContent={
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Unggah Lampiran Berkas Sertifikat
          </span>
        }
      />

      {/* TWO-COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Student Profile Card (4 Grid Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm bg-white dark:bg-[#070e24]/40 text-center space-y-4">
            <div className="relative inline-block mx-auto">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${student.avatarColor} text-white font-extrabold flex items-center justify-center text-2xl shadow-lg`}>
                {(student?.name || "U").split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
              </div>
              <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] border-2 border-white dark:border-slate-900 shadow">
                {student.id}
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                {student.name}
              </h4>
              <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mt-1">
                NIM: {student.nim}
              </p>
            </div>

            <hr className="border-slate-100 dark:border-slate-800/60" />

            <div className="text-left space-y-2.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="text-slate-800 dark:text-white truncate">{student.university}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-bold truncate">{student.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="text-[11px] truncate">Program Magang Semester Genap</span>
              </div>
            </div>
          </div>

          {/* ACADEMIC ASSESSMENTS SCORECARD */}
          {student.grade !== null && (
            <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-3 text-center">
              <h5 className="font-extrabold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Hasil Evaluasi Akademik
              </h5>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Nilai Akhir Rata-rata</p>
                <p className="text-2xl font-black text-indigo-650 dark:text-indigo-450 mt-1">{student.grade}</p>
                <span className="text-[9px] font-extrabold text-slate-400 block mt-0.5">Status: Lulus Bimbingan</span>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Attachment File Upload & Digital Certificate Preview (8 Grid Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-6">
            
            {/* Banner Title */}
            <div className="flex items-start gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-900/40 rounded-2xl shadow-sm">
                <FileBadge className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-base md:text-lg text-slate-900 dark:text-white leading-tight">
                  Unggah Berkas Lampiran Sertifikat Kelulusan
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  Unggah salinan dokumen sertifikat magang resmi dalam format PDF atau Gambar untuk dipublikasikan ke halaman kelulusan mahasiswa.
                </p>
              </div>
            </div>

            {/* main component area */}
            <form onSubmit={handleSaveCertificate} className="space-y-6">
              
              {/* Conditional rendering based on upload status */}
              {isUploading ? (
                
                /* UPLOADING LOADER BOX STATE */
                <div className="p-10 border-2 border-dashed border-indigo-200 dark:border-indigo-900/40 rounded-3xl text-center space-y-4 bg-slate-50/50 dark:bg-slate-900/20">
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto" />
                  <div className="space-y-1.5 max-w-xs mx-auto">
                    <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                      Sedang Mengunggah Berkas Sertifikat...
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Harap tunggu, berkas sedang divalidasi dan disimpan di server aman.
                    </p>
                  </div>
                  
                </div>

              ) : fileName === null ? (
                
                /* REAL FILE UPLOADER & DRAG & DROP DROPZONE (BELUM DIUNGGAH) */
                <>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".pdf,image/*" 
                    className="hidden" 
                  />
                  <div 
                    onClick={triggerFileInput}
                    className="p-12 border-2 border-dashed border-slate-200 hover:border-indigo-500 dark:border-slate-800 dark:hover:border-indigo-500/80 rounded-3xl text-center space-y-3 bg-slate-50/40 dark:bg-slate-900/10 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all group scale-100 hover:scale-[1.005]"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/20 dark:border-indigo-900/20 flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5 max-w-sm mx-auto">
                      <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                        Klik Di Sini Untuk Unggah Berkas Sertifikat
                      </h5>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal font-semibold">
                        Pilih file sertifikat asli dari komputer Anda (Mendukung format file PDF atau Gambar dengan ukuran maksimal 5 MB).
                      </p>
                      {uploadError && (
                        <p className="text-[10px] text-rose-500 font-bold">{uploadError}</p>
                      )}
                    </div>
                  </div>
                </>

              ) : (

                /* CERTIFICATE ATTACHED SUCCESS CARD PREVIEW (SUDAH DIUNGGAH) */
                <div className="space-y-6">
                  
                  {/* Digital Certificate Preview Frame (Aesthetic Wow factor) */}
                  <div className="p-6 md:p-8 rounded-3xl border-4 border-indigo-600/10 dark:border-indigo-400/15 bg-[#fafbfd] dark:bg-[#040817] shadow-inner relative overflow-hidden flex flex-col items-center text-center space-y-4">
                    {/* Decorative Seal Icon */}
                    <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
                      <FileBadge className="w-48 h-48" />
                    </div>

                    <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/30 flex items-center justify-center text-indigo-600">
                      <FileBadge className="w-6 h-6 animate-pulse" />
                    </div>

                    <div className="space-y-1.5 max-w-md mx-auto">
                      <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/30 px-3 py-1.5 rounded-xl">
                        Sertifikat Kelulusan Resmi
                      </span>
                      <h4 className="text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white pt-2.5">
                        CERTIFICATE OF APPRECIATION
                      </h4>
                      <p className="text-[10px] text-slate-400 leading-normal font-semibold">
                        Sistem memverifikasi kelulusan bimbingan magang program MBKM industri secara formal.
                      </p>
                    </div>

                    <div className="border-y border-slate-200/60 dark:border-slate-800/80 py-4 w-full max-w-sm space-y-1 text-slate-800 dark:text-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Diberikan Kepada:</p>
                      <h5 className="font-extrabold text-sm">{student.name}</h5>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase pt-1">
                        NIM: {student.nim} • {student.university}
                      </p>
                    </div>

                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 max-w-sm">
                      Diterbitkan Atas Selesainya Magang Di: <strong className="text-slate-700 dark:text-slate-350">{student.company}</strong>
                    </div>

                    <div className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1.5 border border-emerald-100/30 rounded-xl mt-1">
                      <Check className="w-3.5 h-3.5" />
                      Status: Terverifikasi Pembimbing
                    </div>
                  </div>

                  {/* File Metadata & Actions */}
                  <div className="p-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-xl">
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{fileName}</p>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Ukuran Berkas: {fileSize} • Tipe: {fileType.includes("pdf") ? "PDF Document" : "Image File"}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={fileUrl ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200/30 rounded-xl font-extrabold text-[10px] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                      <button
                        type="button"
                        onClick={handleRemoveCertificate}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/30 rounded-xl cursor-pointer transition-all active:scale-95"
                        title="Hapus Sertifikat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* Form Action buttons */}
              <ModalActions
                cancelHref="/dashboard/mentor/sertifikat"
                submitLabel="Simpan & Terapkan"
                submittingLabel="Menyimpan..."
                isSubmitting={isSubmitting || isHookSubmitting || isUploading || fileKey === null}
                submitIcon={<Check className="w-4 h-4 text-white" />}
                variant="indigo"
              />

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
