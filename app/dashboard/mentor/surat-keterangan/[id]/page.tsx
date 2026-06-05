"use client";

import React, { use, useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  School, 
  User, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
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
  Scroll,
  FileCheck
} from "lucide-react";
import { studentsData } from "../../data-mahasiswa/studentsData";
import { useStudentReferenceLetters } from "@/modules/surat-keterangan/hooks";
import { useStudents } from "@/modules/mahasiswa/hooks";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MentorReferenceLetterDetailPage({ params }: PageProps) {
  const router = useRouter();
  const unwrappedParams = use(params);
  
  // Instantiating real reference letters API hook
  const { letters, isLoading, isSubmitting: isHookSubmitting, uploadStudentLetter, refreshLetters } = useStudentReferenceLetters();
  const { rawStudents } = useStudents();
  const studentsList = rawStudents.length > 0 ? rawStudents : studentsData;

  // Fetch letters on mount
  useEffect(() => {
    refreshLetters();
  }, [refreshLetters]);

  // Find matched reference letter record
  const matchedCert = useMemo(() => {
    return letters.find(c => String(c.mahasiswaId) === String(unwrappedParams.id));
  }, [letters, unwrappedParams.id]);

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
        grade: mockStudent ? mockStudent.grade : null,
        role: mockStudent ? mockStudent.role : "Intern",
      };
    } else if (mockStudent) {
      return {
        id: mockStudent.id,
        name: mockStudent.name,
        nim: mockStudent.nim,
        university: mockStudent.university,
        company: mockStudent.company,
        avatarColor: mockStudent.avatarColor,
        grade: mockStudent.grade,
        role: mockStudent.role,
      };
    }
    return null;
  }, [matchedCert, mockStudent]);

  // State for file attachment upload
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // Sync state once matchedCert finishes loading
  useEffect(() => {
    if (matchedCert) {
      if (matchedCert.url && matchedCert.url !== "-") {
        setFileName(matchedCert.url.split("/").pop() || "surat_keterangan.pdf");
        setFileUrl(matchedCert.url);
      } else {
        setFileName(null);
        setFileUrl(null);
      }
    }
  }, [matchedCert]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileSize, setFileSize] = useState<string>("1.8 MB");
  const [fileType, setFileType] = useState<string>("application/pdf");

  // State for live upload simulator
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showToast, setShowToast] = useState("");

  // States for final page submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Trigger file browser input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Real File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const typeLabel = file.type || "application/pdf";

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          setFileName(file.name);
          setFileUrl(`https://storage.internflow.com/letters/${file.name}`);
          setFileSize(`${sizeInMb} MB`);
          setFileType(typeLabel);
          setIsUploading(false);
          setShowToast(`Surat keterangan "${file.name}" sukses diunggah!`);
          setTimeout(() => setShowToast(""), 3000);

          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  // Simulated Reference Letter Deletion
  const handleRemoveLetter = () => {
    if (confirm("Apakah Anda yakin ingin menghapus berkas surat keterangan ini?")) {
      setFileName(null);
      setFileUrl(null);
      setShowToast("Berkas surat keterangan magang berhasil dihapus.");
      setTimeout(() => setShowToast(""), 3000);
    }
  };

  // Real API save submit
  const handleSaveLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !matchedCert) return;

    setIsSubmitting(true);

    try {
      const finalUrl = fileUrl || `https://storage.internflow.com/letters/surat_keterangan_${student.name.toLowerCase().replace(/\s+/g, "_")}.pdf`;
      await uploadStudentLetter(matchedCert.periodeMagangId, finalUrl);
      
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/dashboard/mentor/surat-keterangan");
      }, 2000);
    } catch (err: any) {
      setIsSubmitting(false);
      alert(err.message || "Gagal menyimpan berkas.");
    }
  };

  // Render loading state while fetching reference letters
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-extrabold text-sm animate-pulse">
          Memuat data berkas surat keterangan...
        </p>
      </div>
    );
  }

  // Render 404 block if student not found
  if (!student) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-full inline-block border border-rose-100 dark:border-rose-900/40">
          <AlertCircle className="w-10 h-10 animate-bounce" />
        </div>
        <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Mahasiswa Tidak Ditemukan</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          Data mahasiswa dengan ID #{unwrappedParams.id} tidak terdaftar di sistem penerbitan surat keterangan magang.
        </p>
        <Link 
          href="/dashboard/mentor/surat-keterangan"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all mt-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Daftar Surat Keterangan
        </Link>
      </div>
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
      {isSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#070e24] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-4 animate-float">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-200/50 dark:border-emerald-900/40 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-black text-lg text-slate-900 dark:text-white">Surat Keterangan Berhasil Disimpan!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                Lampiran Surat Keterangan Selesai Magang (SKSM) untuk bimbingan <strong>{student.name}</strong> berhasil dikunci dan diverifikasi oleh sistem.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              Mengalihkan kembali ke daftar surat keterangan...
            </div>
          </div>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/mentor/surat-keterangan"
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#070e24]/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Batal & Kembali
        </Link>

        <span className="text-xs text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Unggah Lampiran Surat Keterangan Magang
        </span>
      </div>

      {/* TWO-COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Student Profile Card (4 Grid Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm bg-white dark:bg-[#070e24]/40 text-center space-y-4">
            <div className="relative inline-block mx-auto">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${student.avatarColor} text-white font-extrabold flex items-center justify-center text-2xl shadow-lg`}>
                {student.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
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
                <span className="text-[11px] truncate">Program MBKM Magang Industri</span>
              </div>
            </div>
          </div>

          {/* ACADEMIC ASSESSMENTS SCORECARD */}
          {student.grade !== null && (
            <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-3 text-center">
              <h5 className="font-extrabold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Hasil Evaluasi Akhir
              </h5>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Nilai Akumulatif Akhir</p>
                <p className="text-2xl font-black text-indigo-650 dark:text-indigo-440 mt-1">{student.grade}</p>
                <span className="text-[9px] font-extrabold text-slate-400 block mt-0.5">Status Kelulusan: Lulus</span>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Attachment File Upload & Digital Letter Preview (8 Grid Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-6">
            
            {/* Banner Title */}
            <div className="flex items-start gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-900/40 rounded-2xl shadow-sm">
                <Scroll className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-base md:text-lg text-slate-900 dark:text-white leading-tight">
                  Unggah Berkas Surat Keterangan Selesai Magang
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  Unggah dokumen Surat Keterangan Selesai Magang (SKSM) resmi dalam format PDF atau Gambar untuk diverifikasi sebagai bukti konkrit kelulusan bimbingan.
                </p>
              </div>
            </div>

            {/* main component area */}
            <form onSubmit={handleSaveLetter} className="space-y-6">
              
              {/* Conditional rendering based on upload status */}
              {isUploading ? (
                
                /* UPLOADING LOADER BOX STATE */
                <div className="p-10 border-2 border-dashed border-indigo-200 dark:border-indigo-900/40 rounded-3xl text-center space-y-4 bg-slate-50/50 dark:bg-slate-900/20">
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto" />
                  <div className="space-y-1.5 max-w-xs mx-auto">
                    <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                      Sedang Mengunggah Surat Keterangan...
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Harap tunggu, berkas sedang divalidasi dan disimpan secara aman.
                    </p>
                  </div>
                  
                  {/* Progress percentage bar */}
                  <div className="max-w-xs mx-auto space-y-1">
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200/30">
                      <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block text-right">
                      {uploadProgress}%
                    </span>
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
                        Klik Di Sini Untuk Unggah Berkas Surat Keterangan
                      </h5>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal font-semibold">
                        Pilih berkas surat keterangan asli dari komputer Anda (Mendukung format file PDF atau Gambar dengan ukuran maksimal 5 MB).
                      </p>
                    </div>
                  </div>
                </>

              ) : (

                /* SURAT KETERANGAN ATTACHED SUCCESS CARD PREVIEW (SUDAH DIUNGGAH) */
                <div className="space-y-6">
                  
                  {/* Digital Document Preview Frame (Formal copy layout) */}
                  <div className="p-8 rounded-3xl border-4 border-indigo-600/10 dark:border-indigo-400/15 bg-white dark:bg-[#030613] shadow-inner relative overflow-hidden flex flex-col items-center text-center space-y-4">
                    {/* Decorative Seal Background */}
                    <div className="absolute left-6 top-6 opacity-[0.03] pointer-events-none">
                      <Scroll className="w-56 h-56" />
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/30 flex items-center justify-center text-indigo-600">
                      <Scroll className="w-5.5 h-5.5 animate-bounce" />
                    </div>

                    <div className="space-y-1.5 max-w-lg mx-auto">
                      <h4 className="text-sm font-black tracking-widest text-slate-900 dark:text-white uppercase">
                        SURAT KETERANGAN SELESAI MAGANG (SKSM)
                      </h4>
                      <p className="text-[9px] text-slate-400 tracking-wider font-semibold">
                        Nomor Ref: SKSM/MBKM-FT/2026/058
                      </p>
                    </div>

                    <div className="py-4 w-full text-slate-650 dark:text-slate-350 text-xs font-semibold leading-relaxed text-center border-y border-slate-100 dark:border-slate-800/80 max-w-md">
                      Menerangkan dengan sebenar-benarnya bahwa:
                      <div className="py-2.5 space-y-0.5">
                        <p className="font-extrabold text-slate-900 dark:text-white text-sm">{student.name}</p>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase">NIM. {student.nim} • {student.university}</p>
                      </div>
                      telah berhasil menyelesaikan rangkaian program Magang Kerja MBKM selama periode 6 (enam) bulan penuh pada posisi/peran <strong>{student.role || "Software Engineering Intern"}</strong> di mitra industri <strong>{student.company}</strong> dengan nilai evaluasi akhir bimbingan terakumulasi <strong>{student.grade || "85"} (Lulus)</strong>.
                    </div>

                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 space-y-1">
                      <p>Diverifikasi Secara Elektronik Oleh:</p>
                      <p className="font-extrabold text-slate-700 dark:text-slate-300">Dr. Ahmad Hidayat, M.T.</p>
                      <p className="text-[9px] font-medium opacity-80">NIDN. 0423127801 (Dosen Pembimbing Akademik)</p>
                    </div>

                    <div className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1.5 border border-emerald-100/30 rounded-xl mt-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      Status Dokumen: Absah & Terbit
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
                      <button
                        type="button"
                        onClick={() => alert(`Mengunduh berkas: ${fileName}`)}
                        className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200/30 rounded-xl font-extrabold text-[10px] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveLetter}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/30 rounded-xl cursor-pointer transition-all active:scale-95"
                        title="Hapus Surat Keterangan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* Form Action buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-3 flex-wrap">
                <Link
                  href="/dashboard/mentor/surat-keterangan"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
                >
                  Batal
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting || fileName === null}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-500/65 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Simpan & Terapkan
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
