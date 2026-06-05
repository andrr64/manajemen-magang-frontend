"use client";

import React, { use, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  School, 
  User, 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
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
  Briefcase
} from "lucide-react";
import { studentsData } from "../../data-mahasiswa/studentsData";
import { useAssessment, useStudentAssessments } from "@/modules/penilaian/hooks";
import { useStudents } from "@/modules/mahasiswa/hooks";

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
  const { assessments, isLoading, refreshAssessments } = useStudentAssessments();
  const { submitGrades } = useAssessment();
  const { rawStudents } = useStudents();
  const studentsList = rawStudents.length > 0 ? rawStudents : studentsData;

  // Fetch once on mount
  useEffect(() => {
    refreshAssessments();
  }, [refreshAssessments]);

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
    { id: "absensi", label: "Kedisiplinan Absensi", desc: "Ketepatan waktu kehadiran harian, kepatuhan toleransi keterlambatan, dan pengumpulan izin formal.", weight: 15 },
    { id: "kinerja", label: "Kinerja", desc: "Kualitas hasil pengerjaan proyek magang, efisiensi kerja teknis, dan pencapaian target mingguan.", weight: 20 },
    { id: "kedisiplinan", label: "Kedisiplinan", desc: "Kepatuhan terhadap tata tertib industri mitra, SOP perusahaan, dan instruksi mentor akademik.", weight: 15 },
    { id: "kerjasama", label: "Kerja Sama", desc: "Kemampuan berkolaborasi dalam tim divisi, koordinasi antar departemen, dan kontribusi diskusi.", weight: 15 },
    { id: "tanggungjawab", label: "Tanggung Jawab", desc: "Komitmen menyelesaikan tugas yang diberikan, kesiapan menanggung risiko teknis, dan inisiatif tinggi.", weight: 15 },
    { id: "komunikasi", label: "Komunikasi", desc: "Kejelasan menyampaikan laporan progres harian, etika berbahasa, serta responsivitas koordinasi.", weight: 10 },
    { id: "penampilan", label: "Penampilan", desc: "Kerapian berpakaian kerja sesuai regulasi mitra, etika profesionalisme sikap, dan presentasi akhir.", weight: 10 }
  ];

  // Initialize grades state. Prefill if student has already been graded in database.
  const [grades, setGrades] = useState<Record<string, number>>({
    absensi: 80, kinerja: 80, kedisiplinan: 80, kerjasama: 80, tanggungjawab: 80, komunikasi: 80, penampilan: 80
  });

  // Supporting attachments files for EACH criteria column/slot
  const [attachments, setAttachments] = useState<Record<string, string | null>>({
    absensi: null, kinerja: null, kedisiplinan: null, kerjasama: null, tanggungjawab: null, komunikasi: null, penampilan: null
  });

  // Short descriptive comments for each criteria
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({
    absensi: "Kehadiran sangat konsisten, selalu check-in tepat waktu.",
    kinerja: "Kualitas penulisan kode sangat bersih, dokumentasi teratur.",
    kedisiplinan: "Sopan santun dan kepatuhan SOP kantor sangat baik.",
    kerjasama: "Aktif berkoordinasi dalam tim agile sprint.",
    tanggungjawab: "Menuntaskan tugas backend API sesuai target.",
    komunikasi: "Responsif saat dipanggil rapat koordinasi.",
    penampilan: "Selalu berpakaian rapi dan profesional saat On-site."
  });

  // Reactively prefill grades and feedback when assessmentRecord or mockStudent becomes available
  useEffect(() => {
    if (assessmentRecord) {
      const isAlreadyGraded = assessmentRecord.nilaiTotal !== null && assessmentRecord.nilaiTotal !== undefined;
      if (isAlreadyGraded) {
        setGrades({
          absensi: assessmentRecord.absensi ?? 80,
          kinerja: assessmentRecord.kinerja ?? 80,
          kedisiplinan: assessmentRecord.kedisiplinan ?? 80,
          kerjasama: assessmentRecord.kerjasama ?? 80,
          tanggungjawab: assessmentRecord.tanggungJawab ?? 80,
          komunikasi: assessmentRecord.komunikasi ?? 80,
          penampilan: assessmentRecord.kerapihan ?? 80,
        });
        setAttachments({
          absensi: "bukti_absen_rekap.pdf",
          kinerja: "bukti_tugas_laporan.pdf",
          kedisiplinan: null,
          kerjasama: "penilaian_peer_to_peer.docx",
          tanggungjawab: null,
          komunikasi: null,
          penampilan: "rubrik_sidang_akhir.pdf"
        });
        if (assessmentRecord.catatan) {
          setFeedbacks({
            absensi: assessmentRecord.catatan,
            kinerja: assessmentRecord.catatan,
            kedisiplinan: assessmentRecord.catatan,
            kerjasama: assessmentRecord.catatan,
            tanggungjawab: assessmentRecord.catatan,
            komunikasi: assessmentRecord.catatan,
            penampilan: assessmentRecord.catatan,
          });
        }
      }
    } else if (mockStudent && mockStudent.grade !== null) {
      setAttachments({
        absensi: "bukti_absen_rekap.pdf",
        kinerja: "bukti_tugas_laporan.pdf",
        kedisiplinan: null,
        kerjasama: "penilaian_peer_to_peer.docx",
        tanggungjawab: null,
        komunikasi: null,
        penampilan: "rubrik_sidang_akhir.pdf"
      });
      if (mockStudent.id === 1) setGrades({ absensi: 92, kinerja: 88, kedisiplinan: 90, kerjasama: 85, tanggungjawab: 88, komunikasi: 85, penampilan: 86 });
      if (mockStudent.id === 2) setGrades({ absensi: 85, kinerja: 80, kedisiplinan: 83, kerjasama: 82, tanggungjawab: 84, komunikasi: 80, penampilan: 82 });
      if (mockStudent.id === 3) setGrades({ absensi: 94, kinerja: 90, kedisiplinan: 92, kerjasama: 92, tanggungjawab: 95, komunikasi: 90, penampilan: 93 });
      if (mockStudent.id === 5) setGrades({ absensi: 98, kinerja: 94, kedisiplinan: 96, kerjasama: 95, tanggungjawab: 96, komunikasi: 92, penampilan: 95 });
      if (mockStudent.id === 6) setGrades({ absensi: 88, kinerja: 84, kedisiplinan: 85, kerjasama: 86, tanggungjawab: 85, komunikasi: 82, penampilan: 85 });
      if (mockStudent.id === 8) setGrades({ absensi: 90, kinerja: 86, kedisiplinan: 87, kerjasama: 88, tanggungjawab: 88, komunikasi: 85, penampilan: 86 });
    }
  }, [assessmentRecord, mockStudent]);

  // States for dynamic uploaders
  const [uploadingCriteria, setUploadingCriteria] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // General Page Action States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  // Grade adjustment handler
  const handleGradeChange = (criteriaId: string, value: number) => {
    setGrades(prev => ({ ...prev, [criteriaId]: value }));
  };

  // Feedback note change handler
  const handleFeedbackChange = (criteriaId: string, value: string) => {
    setFeedbacks(prev => ({ ...prev, [criteriaId]: value }));
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

  // Form Submission
  const handleSaveAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setIsSubmitting(true);

    // Map form inputs to SubmitGradeRequest payload
    const gradesList = Object.keys(grades).map(key => ({
      criteriaId: key,
      score: grades[key],
      feedback: feedbacks[key] || "Performa magang sangat memuaskan."
    }));

    try {
      await submitGrades({
        studentId: student.id,
        periodeMagangId: assessmentRecord?.periodeId || "5c1a8d9b-2e9c-4aa4-8f7b-23fcd10d9e81",
        mentorId: assessmentRecord?.mentorId || "3cb1ab0d-4ea3-4cfb-81d0-d3cdb2413e11",
        grades: gradesList
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/dashboard/mentor/penilaian");
      }, 2000);
    } catch (err: any) {
      setIsSubmitting(false);
      alert(err.message || "Gagal menyimpan evaluasi.");
    }
  };

  // Render loading state while fetching assessments
  if (isLoading) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-full inline-block border border-indigo-100 dark:border-indigo-900/40">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        </div>
        <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Memuat Data Evaluasi</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          Sedang mengambil detail penilaian mahasiswa dari server...
        </p>
      </div>
    );
  }

  // Render 404 block if student is missing
  if (!student) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-full inline-block border border-rose-100 dark:border-rose-900/40">
          <AlertCircle className="w-10 h-10 animate-bounce" />
        </div>
        <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Mahasiswa Tidak Ditemukan</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          Data mahasiswa dengan ID #{unwrappedParams.id} tidak terdaftar di sistem penilaian magang.
        </p>
        <Link 
          href="/dashboard/mentor/penilaian"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all mt-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Daftar Penilaian
        </Link>
      </div>
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

      {/* SUCCESS REDIRECT MODAL */}
      {isSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#070e24] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-4 animate-float">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-200/50 dark:border-emerald-900/40 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-black text-lg text-slate-900 dark:text-white">Evaluasi Berhasil Disimpan!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                Penilaian untuk bimbingan magang <strong>{student.name}</strong> dengan nilai rata-rata <strong>{gradingCalculations.average} ({gradingCalculations.predicate})</strong> berhasil disimpan secara permanen.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              Mengalihkan kembali ke daftar evaluasi...
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION BAR */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/mentor/penilaian"
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#070e24]/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Batal & Kembali
        </Link>

        <span className="text-xs text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Lembar Evaluasi Mahasiswa #{student.id}
        </span>
      </div>

      {/* TWO-COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Student Profile & Real-time Live Scorecard (4 Grid Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* PROFILE SUMMARY CARD */}
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
                <span className="text-[11px] truncate">Progres Tugas: {student.progress}% Selesai</span>
              </div>
            </div>
          </div>

          {/* LIVE ROUNDED SCORECARD PANEL */}
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-4 text-center">
            <h5 className="font-extrabold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 justify-center">
              <Scale className="w-4 h-4 text-indigo-500" />
              Live Perhitungan Nilai Rata-rata
            </h5>

            {/* Score circle layout */}
            <div className="py-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800/60 space-y-2 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
              
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Skor Akumulatif Akhir</p>
              <h3 className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                {gradingCalculations.average}
              </h3>
              
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-550 dark:bg-indigo-950/60 border border-indigo-200/20 text-[10px] font-black text-indigo-600 dark:text-indigo-400 rounded-xl mt-1">
                Predikat: Grade {gradingCalculations.predicate}
              </div>
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
          
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-6">
            
            {/* Form Title banner */}
            <div className="flex items-start gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-900/40 rounded-2xl shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-base md:text-lg text-slate-900 dark:text-white leading-tight">
                  Formulir Evaluasi 7 Kriteria Kompetensi Magang
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  Lengkapi isian nilai (0 - 100) dan lampirkan berkas bukti pendukung (*evidence*) di setiap parameter penilaian.
                </p>
              </div>
            </div>

            {/* Assessment Submit Form Wrapper */}
            <form onSubmit={handleSaveAssessment} className="space-y-6">
              
              <div className="space-y-6">
                
                {/* Loop of the 7 criteria columns */}
                {assessmentCriteria.map((c, index) => {
                  const score = grades[c.id] || 0;
                  const attachment = attachments[c.id] || null;
                  const feedback = feedbacks[c.id] || "";
                  
                  return (
                    <div 
                      key={c.id} 
                      className="p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-800/60 hover:border-indigo-500/30 transition-all space-y-4 relative"
                    >
                      {/* Criteria label */}
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div className="space-y-1 max-w-[420px]">
                          <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                            Kriteria Ke-{index + 1} (Bobot: {c.weight}%)
                          </span>
                          <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {c.label}
                          </h5>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
                            {c.desc}
                          </p>
                        </div>

                        {/* Direct score input */}
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={score}
                            onChange={(e) => handleGradeChange(c.id, Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                            className="w-14 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-center text-xs font-black focus:outline-none"
                          />
                          <span className="text-[10px] font-bold text-slate-400">/100</span>
                        </div>
                      </div>

                      {/* Range slider and input */}
                      <div className="flex items-center gap-4 py-1.5">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={score}
                          onChange={(e) => handleGradeChange(c.id, parseInt(e.target.value))}
                          className="flex-1 accent-indigo-650 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 w-8 text-right">
                          {score} pt
                        </span>
                      </div>

                      {/* Criteria feedback remark notes */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500">
                          Catatan Umpan Balik Kriteria
                        </label>
                        <input
                          type="text"
                          value={feedback}
                          onChange={(e) => handleFeedbackChange(c.id, e.target.value)}
                          placeholder="e.g. Masukkan deskripsi alasan pemberian nilai..."
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                        />
                      </div>

                      {/* Attachment component slot for each criteria column */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between flex-wrap gap-2 text-[10px]">
                        <span className="font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-indigo-550" />
                          Berkas Bukti / Lampiran (Attachment)
                        </span>

                        {uploadingCriteria === c.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Mengunggah ({uploadProgress}%)
                            </span>
                            <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          </div>
                        ) : attachment ? (
                          <div className="flex items-center gap-2">
                            <a
                              href="#"
                              onClick={(e) => { e.preventDefault(); alert(`Lampiran berkas kriteria ${c.label}: ${attachment}`); }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-200/30 rounded-xl font-bold transition-all"
                            >
                              <Paperclip className="w-3 h-3" />
                              <span className="truncate max-w-[120px]">{attachment}</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(c.id, c.label)}
                              className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 rounded-lg transition-all border border-rose-200/30"
                              title="Hapus berkas"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAttachmentUpload(c.id, c.label)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-indigo-650 hover:text-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-transparent text-[10px] font-black rounded-xl transition-all cursor-pointer hover:scale-[1.01] active:scale-95 shadow-sm"
                          >
                            <Upload className="w-3 h-3" />
                            Simpan Lampiran
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}

              </div>

              {/* Form buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-3 flex-wrap">
                <Link
                  href="/dashboard/mentor/penilaian"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
                >
                  Batal
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-500/65 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan Nilai...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Simpan Penilaian
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
