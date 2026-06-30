"use client";
import { WEB_ROUTES } from "@/modules/web-routes";

import React, { use, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  School,
  User,
  Award,
  CheckCircle2,
  Clock,
  Paperclip,
  Upload,
  Check,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  Trash2,
  Loader2,
  CalendarCheck,
  Scale,
  Briefcase,
  Download
} from "lucide-react";
import { BackNavBar, PageLoader, NotFoundBlock, ModalActions } from "@/components/shared";
import ttdImage from "../../../mahasiswa/absensi/assets/ttd-pak-agus.png";
import { useDownloadPenilaianMentorPDF } from "../useDownloadPenilaianMentorPDF";
import { studentsData } from "../../data-mahasiswa/studentsData";
import { useStudentAssessments } from "@/modules/penilaian/hooks";
import { useStudents } from "@/modules/data_mahasiswa/hooks";
import { useIam } from "@/modules/iam/hooks";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Defining the assessment criteria structures
interface CriteriaItem {
  id: string;
  label: string;
  desc: string;
  weight: number; // Percentage weight for calculating weighted average
}

export default function MentorStudentGradingPage({ params }: PageProps) {
  const router = useRouter();
  const unwrappedParams = use(params);
  
  // Instantiating real evaluation API hook and student assessments list
  const { assessments, isLoading, isSubmitting, submitGrades } = useStudentAssessments();
  const { rawStudents } = useStudents();
  const { user: authUser } = useIam();
  const studentsList = rawStudents;

  // Find target assessment record
  const assessmentRecord = useMemo(() => {
    return assessments.find(item => String(item.mahasiswaId) === String(unwrappedParams.id));
  }, [assessments, unwrappedParams.id]);

  // Find target mock student
  const mockStudent = useMemo(() => {
    if (!assessmentRecord) {
      return studentsList.find(s => String(s.id) === String(unwrappedParams.id));
    }
    return studentsList.find(s => String(s.id) === String(assessmentRecord.mahasiswaId) || s.nim === assessmentRecord.nim);
  }, [assessmentRecord, unwrappedParams.id, studentsList]);

  // Unified student object
  const student = useMemo(() => {
    if (assessmentRecord) {
      return {
        id: assessmentRecord.mahasiswaId,
        name: assessmentRecord.namaMahasiswa,
        nim: assessmentRecord.nim,
        university: mockStudent ? mockStudent.university : "Universitas Mitra",
        company: mockStudent ? mockStudent.company : "Kantor Mitra",
        avatarColor: mockStudent ? mockStudent.avatarColor : "from-indigo-500 to-cyan-500",
        progress: mockStudent ? mockStudent.progress : 80,
        grade: assessmentRecord.nilaiTotal
      };
    } else if (mockStudent) {
      return {
        id: mockStudent.id,
        name: mockStudent.name,
        nim: mockStudent.nim,
        university: mockStudent.university,
        company: mockStudent.company,
        avatarColor: mockStudent.avatarColor,
        progress: mockStudent.progress,
        grade: mockStudent.grade
      };
    }
    return null;
  }, [assessmentRecord, mockStudent]);

  // Form Assessment Criteria configurations
  const assessmentCriteria: CriteriaItem[] = [
    { id: "kinerja", label: "Kinerja", desc: "Kualitas hasil pengerjaan proyek magang, efisiensi kerja teknis, dan pencapaian target mingguan.", weight: 15 },
    { id: "kedisiplinan", label: "Kedisiplinan", desc: "Kepatuhan terhadap tata tertib industri mitra, SOP perusahaan, dan instruksi mentor akademik.", weight: 15 },
    { id: "tanggungjawab", label: "Tanggung Jawab", desc: "Komitmen menyelesaikan tugas yang diberikan, kesiapan menanggung risiko teknis, dan inisiatif tinggi.", weight: 15 },
    { id: "komunikasi", label: "Komunikasi", desc: "Kejelasan menyampaikan laporan progres harian, etika berbahasa, serta responsivitas koordinasi.", weight: 10 },
    { id: "sikap", label: "Sikap", desc: "Sopan santun dalam berkomunikasi, kepatuhan terhadap regulasi perusahaan, dan integritas profesional.", weight: 10 },
    { id: "kerapihan", label: "Kerapihan", desc: "Kerapian berpakaian kerja sesuai regulasi mitra, etika profesionalisme sikap, dan presentasi akhir.", weight: 10 },
    { id: "absensi", label: "Absensi", desc: "Ketepatan waktu kehadiran harian, kepatuhan toleransi keterlambatan, dan pengumpulan izin formal.", weight: 10 },
    { id: "kerjasama", label: "Kerja Sama", desc: "Kemampuan berkolaborasi dalam tim divisi, koordinasi antar departemen, dan kontribusi diskusi.", weight: 15 }
  ];

  // Initialize grades state. Prefill if student has already been graded in database.
  const [grades, setGrades] = useState<Record<string, number>>({
    kinerja: 80, kedisiplinan: 80, tanggungjawab: 80, komunikasi: 80, sikap: 80, kerapihan: 80, absensi: 80, kerjasama: 80
  });

  // Supporting attachments files for EACH criteria column/slot
  const [attachments, setAttachments] = useState<Record<string, string | null>>({
    kinerja: null, kedisiplinan: null, tanggungjawab: null, komunikasi: null, sikap: null, kerapihan: null, absensi: null, kerjasama: null
  });

  const [catatan, setCatatan] = useState<string>("");

  useEffect(() => {
    if (assessmentRecord && assessmentRecord.statusPenilaian === "SUDAH_DINILAI") {
      setGrades({
        kinerja: assessmentRecord.kinerja || 0,
        kedisiplinan: assessmentRecord.kedisiplinan || 0,
        tanggungjawab: assessmentRecord.tanggungJawab || 0,
        komunikasi: assessmentRecord.komunikasi || 0,
        sikap: assessmentRecord.sikap || 0,
        kerapihan: assessmentRecord.kerapihan || 0,
        absensi: assessmentRecord.absensi || 0,
        kerjasama: assessmentRecord.kerjasama || 0,
      });

      // Simulation of attached documents if any (frontend only visual feature)
      if (Object.keys(attachments).length === 0) {
        setAttachments({
          kinerja: "bukti_tugas_laporan.pdf",
          kedisiplinan: null,
          tanggungjawab: null,
          komunikasi: null,
          sikap: null,
          kerapihan: "rubrik_sidang_akhir.pdf",
          absensi: "bukti_absen_rekap.pdf",
          kerjasama: "penilaian_peer_to_peer.docx"
        });
        if (assessmentRecord.catatan) {
          setCatatan(assessmentRecord.catatan);
        }
      }
    } else if (mockStudent && mockStudent.grade !== null) {
      setAttachments({
        kinerja: "bukti_tugas_laporan.pdf",
        kedisiplinan: null,
        tanggungjawab: null,
        komunikasi: null,
        sikap: null,
        kerapihan: "rubrik_sidang_akhir.pdf",
        absensi: "bukti_absen_rekap.pdf",
        kerjasama: "penilaian_peer_to_peer.docx"
      });
      if (mockStudent.id === 1) setGrades({ kinerja: 88, kedisiplinan: 90, tanggungjawab: 88, komunikasi: 85, sikap: 92, kerapihan: 86, absensi: 92, kerjasama: 85 });
      if (mockStudent.id === 2) setGrades({ kinerja: 80, kedisiplinan: 83, tanggungjawab: 84, komunikasi: 80, sikap: 85, kerapihan: 82, absensi: 85, kerjasama: 82 });
      if (mockStudent.id === 3) setGrades({ kinerja: 90, kedisiplinan: 92, tanggungjawab: 95, komunikasi: 90, sikap: 94, kerapihan: 93, absensi: 94, kerjasama: 92 });
      if (mockStudent.id === 5) setGrades({ kinerja: 94, kedisiplinan: 96, tanggungjawab: 96, komunikasi: 92, sikap: 98, kerapihan: 95, absensi: 98, kerjasama: 95 });
      if (mockStudent.id === 6) setGrades({ kinerja: 84, kedisiplinan: 85, tanggungjawab: 85, komunikasi: 82, sikap: 88, kerapihan: 85, absensi: 88, kerjasama: 86 });
      if (mockStudent.id === 8) setGrades({ kinerja: 86, kedisiplinan: 87, tanggungjawab: 88, komunikasi: 85, sikap: 90, kerapihan: 86, absensi: 90, kerjasama: 88 });
    }
  }, [assessmentRecord, mockStudent]);

  // States for dynamic uploaders
  const [uploadingCriteria, setUploadingCriteria] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [successToast, setSuccessToast] = useState("");

  // Grade adjustment handler
  const handleGradeChange = (criteriaId: string, value: number) => {
    setGrades(prev => ({ ...prev, [criteriaId]: value }));
  };



  // Simulated Custom File Upload Action for EACH criteria slot
  const handleAttachmentUpload = (criteriaId: string, criteriaLabel: string) => {
    const documents = [
      "rubrik_penilaian.pdf",
      "evidence_pendukung_akhir.zip",
      "sertifikat_industri.png",
      "laporan_tambahan.docx",
      "rekap_evaluasi.pdf"
    ];
    const randomFile = documents[Math.floor(Math.random() * documents.length)];
    
    setUploadingCriteria(criteriaId);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          setAttachments(db => ({ ...db, [criteriaId]: randomFile }));
          setUploadingCriteria(null);
          setSuccessToast(`Berkas bukti sukses dilampirkan pada ${criteriaLabel}!`);
          setTimeout(() => setSuccessToast(""), 3000);

          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  // Delete Attachment handler
  const handleRemoveAttachment = (criteriaId: string, criteriaLabel: string) => {
    setAttachments(prev => ({ ...prev, [criteriaId]: null }));
    setSuccessToast(`Berkas bukti lampiran pada ${criteriaLabel} berhasil dihapus.`);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  // Real-time live average calculations
  const gradingCalculations = useMemo(() => {
    let totalScore = 0;
    let totalWeights = 0;
    
    assessmentCriteria.forEach(c => {
      const score = grades[c.id] || 0;
      totalScore += (score * c.weight);
      totalWeights += c.weight;
    });

    const average = totalWeights > 0 ? (totalScore / totalWeights) : 0;
    const finalAverage = parseFloat(average.toFixed(1));

    // Calculate predicate grades
    let predicate = "E";
    let status = "Tidak Lulus";
    let color = "text-rose-500 bg-rose-50 border-rose-200/50";

    if (finalAverage >= 85) {
      predicate = "A";
      status = "Lulus Sangat Memuaskan";
      color = "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/40 dark:border-emerald-900/40";
    } else if (finalAverage >= 80) {
      predicate = "A-";
      status = "Lulus Memuaskan";
      color = "text-teal-600 bg-teal-50 dark:bg-teal-950/30 border-teal-200/40 dark:border-teal-900/40";
    } else if (finalAverage >= 75) {
      predicate = "B+";
      status = "Lulus Sangat Baik";
      color = "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/40 dark:border-indigo-900/40";
    } else if (finalAverage >= 70) {
      predicate = "B";
      status = "Lulus Baik";
      color = "text-sky-600 bg-sky-50 dark:bg-sky-950/30 border-sky-200/40 dark:border-sky-900/40";
    } else if (finalAverage >= 60) {
      predicate = "C";
      status = "Lulus Cukup";
      color = "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200/40 dark:border-amber-900/40";
    }

    return { average: finalAverage, predicate, status, color };
  }, [grades]);

  // Setup PDF generation hook and live rekap conversion
  const [ttdBase64, setTtdBase64] = useState<string | null>(null);
  useEffect(() => {
    const src = typeof ttdImage === "string" ? ttdImage : (ttdImage as any).src;
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      setTtdBase64(canvas.toDataURL("image/png"));
    };
  }, []);

  const currentRekapList = useMemo(() => {
    if (!student) return [];
    const p: any = {
      kinerja: grades.kinerja,
      kedisiplinan: grades.kedisiplinan,
      tanggungJawab: grades.tanggungjawab,
      komunikasi: grades.komunikasi,
      sikap: grades.sikap,
      kerapihan: grades.kerapihan,
      absensi: grades.absensi,
      kerjasama: grades.kerjasama,
      catatan: catatan
    };
    return [{
      nama: student.name,
      penilaian: p
    }];
  }, [student, grades, catatan]);

  const { download: downloadPDF, isGenerating: isGeneratingPDF } = useDownloadPenilaianMentorPDF(
    currentRekapList as any, ttdBase64
  );

  // Form Submission
  const handleSaveAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !assessmentRecord?.periodeMagangId) {
      alert("Data periode magang mahasiswa tidak ditemukan.");
      return;
    }
    try {
      await submitGrades({
        periodeMagangId: assessmentRecord.periodeMagangId,
        mentorId: authUser?.id || "",
        kinerja:       grades.kinerja       || 0,
        kedisiplinan:  grades.kedisiplinan  || 0,
        tanggungJawab: grades.tanggungjawab || 0,
        komunikasi:    grades.komunikasi    || 0,
        sikap:         grades.sikap         || 0,
        kerapihan:     grades.kerapihan     || 0,
        absensi:       grades.absensi       || 0,
        kerjasama:     grades.kerjasama     || 0,
        catatan: catatan || "-",
      });
      router.push(WEB_ROUTES.MENTOR_PENILAIAN);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan evaluasi.");
    }
  };

  // Render loading state while fetching assessments
  if (isLoading) {
    return (
      <PageLoader text="Memuat data penilaian mahasiswa..." spinnerColor="text-indigo-500" />
    );
  }

  // Render 404 block if student is missing
  if (!student) {
    return (
      <NotFoundBlock
        title="Mahasiswa Tidak Ditemukan"
        description={`Data mahasiswa dengan ID #${unwrappedParams.id} tidak terdaftar di sistem penilaian magang.`}
        backHref="/dashboard/mentor/penilaian"
        backLabel="Kembali ke Daftar Penilaian"
      />
    );
  }

  return (
    <div className="space-y-6">

      {/* FLOAT SUCCESS TOAST */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-2xl shadow-xl flex items-center gap-3 animate-float max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs font-bold leading-normal">{successToast}</span>
        </div>
      )}

      {/* NAVIGATION BAR */}
      <BackNavBar
        href="/dashboard/mentor/penilaian"
        label="Batal & Kembali"
        rightContent={
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Lembar Evaluasi Mahasiswa
          </span>
        }
      />

      {/* TWO-COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Student Profile & Real-time Live Scorecard (4 Grid Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* PROFILE SUMMARY CARD */}
          <div className="glass-card border border-white/40 dark:border-white/5 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl bg-gradient-to-b from-white/80 to-white/40 dark:from-[#0b132c]/80 dark:to-[#070e24]/60 text-center space-y-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-cyan-500/10 blur-3xl"></div>
            
            <div className="relative inline-block mx-auto group">
              <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className={`relative w-24 h-24 rounded-2xl bg-gradient-to-tr ${student.avatarColor} text-white font-black flex items-center justify-center text-3xl shadow-xl ring-4 ring-white/60 dark:ring-white/10 group-hover:scale-105 transition-transform duration-500`}>
                {(student?.name || "U").split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
              </div>
            </div>

            <div className="relative z-10">
              <h4 className="font-black text-lg text-slate-900 dark:text-white leading-tight">
                {student.name}
              </h4>
              <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mt-1">
                NIM: {student.nim}
              </p>
            </div>

            <hr className="border-slate-100 dark:border-slate-800/60 relative z-10" />

            <div className="text-left space-y-3.5 text-xs text-slate-500 dark:text-slate-400 font-medium relative z-10">
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400 shadow-sm">
                  <School className="w-4 h-4 flex-shrink-0" />
                </div>
                <span className="text-slate-800 dark:text-white font-semibold truncate">{student.university}</span>
              </div>
            </div>
          </div>

          {/* LIVE ROUNDED SCORECARD PANEL */}
          <div className="glass-card border border-white/40 dark:border-white/5 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl bg-gradient-to-b from-white/80 to-white/40 dark:from-[#0b132c]/80 dark:to-[#070e24]/60 space-y-5 text-center relative overflow-hidden">
            <h5 className="font-extrabold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 justify-center">
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-md">
                <Scale className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              Live Perhitungan
            </h5>

            {/* Score circle layout */}
            <div className="py-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/80 dark:to-slate-800/40 rounded-[1.5rem] border border-white/60 dark:border-white/5 shadow-inner space-y-3 relative overflow-hidden group">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-75" />
              <div className="absolute left-0 top-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-300" />
              
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase relative z-10">Skor Akumulatif Akhir</p>
              <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400 tracking-tight drop-shadow-sm relative z-10 group-hover:scale-110 transition-transform duration-500">
                {Number(gradingCalculations.average).toFixed(1).replace('.', ',')}
              </h3>
              

            </div>

            {/* Status card */}
            <div className={`p-3.5 border rounded-2xl text-[11px] font-black tracking-wide ${gradingCalculations.color} text-center`}>
              Status Kelulusan: {gradingCalculations.status}
            </div>

            <p className="text-[10px] text-slate-400 leading-normal font-semibold">
              Nilai dihitung secara tertimbang otomatis berdasarkan bobot evaluasi akademik fakultas teknik.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive 7 Criteria Evaluation Form (8 Grid Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="glass-card border border-white/40 dark:border-white/5 rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl bg-gradient-to-br from-white/90 to-white/50 dark:from-[#0b132c]/90 dark:to-[#070e24]/70 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
            
            {/* Form Title banner */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/60 relative z-10">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                   <FileSpreadsheet className="w-5 h-5" />
                 </div>
                 <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Lembar Penilaian</h4>
              </div>
              <button
                onClick={downloadPDF}
                type="button"
                disabled={isGeneratingPDF}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 disabled:opacity-50"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin relative z-10" /> : <Download className="w-4 h-4 relative z-10" />}
                <span className="relative z-10">{isGeneratingPDF ? "Membuat PDF..." : "Ekspor ke PDF"}</span>
              </button>
            </div>

            {/* Assessment Submit Form Wrapper */}
            <form onSubmit={handleSaveAssessment} className="space-y-6">
              
              <div className="space-y-6">
                
                {/* Loop of the 7 criteria columns */}
                {assessmentCriteria?.map((c, index) => {
                  const score = grades[c.id] || 0;
                  const attachment = attachments[c.id] || null;
                  
                  return (
                    <div 
                      key={c.id} 
                      className="p-6 rounded-[1.5rem] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-white/60 dark:border-slate-700/50 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 space-y-5 relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 rounded-[1.5rem] transition-opacity duration-500 pointer-events-none"></div>
                      
                      {/* Criteria label */}
                      <div className="flex justify-between items-start flex-wrap gap-4 relative z-10">
                        <div className="space-y-1.5 max-w-[420px]">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider rounded-lg">
                            Kriteria {index + 1} • Bobot {c.weight}%
                          </div>
                          <h5 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                            {c.label}
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            {c.desc}
                          </p>
                        </div>

                        {/* Direct score input */}
                        <div className="flex items-center gap-2 bg-slate-50/80 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step="0.1"
                            value={score}
                            onChange={(e) => handleGradeChange(c.id, Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                            className="w-16 px-2 py-2 bg-white dark:bg-slate-900 border-none shadow-sm rounded-xl text-center text-sm font-black text-indigo-700 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                          />
                          <span className="text-[10px] font-black text-slate-400 pr-2">/100</span>
                        </div>
                      </div>

                      {/* Range slider and input */}
                      <div className="flex items-center gap-5 py-2 relative z-10">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step="0.1"
                          value={score}
                          onChange={(e) => handleGradeChange(c.id, parseFloat(e.target.value) || 0)}
                          className="flex-1 accent-indigo-600 h-2.5 bg-slate-200/80 dark:bg-slate-700/80 rounded-full appearance-none cursor-pointer hover:accent-indigo-500 transition-all shadow-inner"
                        />
                        <div className="w-12 text-right">
                          <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400">
                            {Number(score).toFixed(1).replace('.', ',')}
                          </span>
                        </div>
                      </div>





                    </div>
                  );
                })}

              </div>

              {/* General Feedback / Catatan */}
              <div className="p-6 rounded-[1.5rem] bg-gradient-to-br from-indigo-50/80 to-slate-50/80 dark:from-indigo-950/30 dark:to-slate-900/30 border border-indigo-100/80 dark:border-indigo-800/40 space-y-4 shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-indigo-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <label className="text-xs font-extrabold uppercase text-indigo-700 dark:text-indigo-400 tracking-wider flex items-center gap-2 relative z-10">
                  <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                    <Paperclip className="w-3.5 h-3.5" />
                  </div>
                  Catatan Evaluasi / Pesan Mentor
                </label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Berikan umpan balik menyeluruh terkait performa mahasiswa magang..."
                  className="w-full px-5 py-4 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-indigo-100 dark:border-indigo-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm font-medium focus:outline-none transition-all duration-300 resize-none min-h-[120px] text-slate-800 dark:text-slate-200 shadow-sm relative z-10 hover:border-indigo-300 dark:hover:border-indigo-700"
                ></textarea>
              </div>

              {/* Form buttons */}
              <ModalActions
                cancelHref="/dashboard/mentor/penilaian"
                submitLabel="Simpan Penilaian"
                submittingLabel="Menyimpan Nilai..."
                isSubmitting={isSubmitting}
                submitIcon={<Check className="w-4 h-4" />}
                variant="indigo"
              />

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
