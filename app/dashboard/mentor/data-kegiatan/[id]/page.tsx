"use client";

import React, { use, useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  School, 
  User, 
  Calendar, 
  Briefcase, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Paperclip,
  Send,
  Check,
  X,
  Sparkles,
  Activity,
  Trash2
} from "lucide-react";
import { studentsData } from "../../data-mahasiswa/studentsData";
import { ActivityLog } from "../page";
import { useMentorActivities } from "../../../../../modules/data_kegiatan/hooks";
import { useStudents } from "../../../../../modules/data_mahasiswa/hooks";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MentorActivityDetailPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const activityIdStr = unwrappedParams.id;

  // Expanded local database with dummy activity logs including description narratives
  const dummyActivities: ActivityLog[] = [
    { id: 1, studentId: 1, activityName: "Implementasi Payment Gateway API Midtrans", category: "Software Engineering", year: "2026", month: "Mei (05)", day: "28", status: "Dalam Review", attachment: "midtrans_integration_doc.pdf" },
    { id: 2, studentId: 2, activityName: "Visualisasi Data Transaksi Menggunakan Chart.js", category: "Data Analytics", year: "2026", month: "Mei (05)", day: "28", status: "Disetujui", attachment: "chart_analytics_draft.png" },
    { id: 3, studentId: 3, activityName: "Slicing Landing Page & Setup Tailwind Config", category: "Software Engineering", year: "2026", month: "Mei (05)", day: "27", status: "Disetujui", attachment: "tailwind_slicing_v2.zip" },
    { id: 4, studentId: 4, activityName: "Riset User Journey & Figma Wireframing Dashboard", category: "UI/UX Design", year: "2026", month: "Mei (05)", day: "26", status: "Dalam Review", attachment: null },
    { id: 5, studentId: 5, activityName: "Penyusunan Laporan Proyek Akhir Magang Bab 1-3", category: "Administration", year: "2026", month: "Mei (05)", day: "26", status: "Disetujui", attachment: "laporan_akhir_draft1.docx" },
    { id: 6, studentId: 6, activityName: "Wiring Diagram Listrik Gardu Induk & ETAP", category: "Software Engineering", year: "2026", month: "Mei (05)", day: "25", status: "Dalam Review", attachment: "diagram_wiring_gardu.pdf" },
    { id: 7, studentId: 7, activityName: "Refactoring Relasional Database Query Optimization", category: "Data Analytics", year: "2026", month: "Mei (05)", day: "25", status: "Dalam Review", attachment: null },
    { id: 8, studentId: 8, activityName: "Konfigurasi Terraform Script untuk AWS VPC", category: "Software Engineering", year: "2026", month: "Mei (05)", day: "24", status: "Disetujui", attachment: "aws_vpc_terraform.tf" }
  ];

  // Dummy descriptions for the activities to make details page rich
  const activityDescriptions: Record<string | number, string> = {
    1: "Mengintegrasikan backend API dengan payment gateway Midtrans untuk menangani transaksi pesanan pelanggan secara aman. Mengembangkan listener webhook untuk mencatat dan memperbarui status pembayaran (pending, capture, settlement, deny, expire) secara asinkronus ke database lokal. Menyusun penanganan pengecualian (exception handling) dan skenario pembatalan transaksi demi menjamin integritas data sistem.",
    2: "Membuat visualisasi analitik untuk data transaksi finansial mingguan dan bulanan pada dashboard utama admin. Menggunakan library Chart.js untuk menampilkan grafik garis multi-dataset (line charts) dan diagram lingkaran (pie charts). Mengoptimalkan query database agregasi PostgreSQL untuk mempercepat perolehan data visualisasi secara real-time.",
    3: "Melakukan proses slicing (konversi rancangan UI Figma) menjadi halaman Landing Page interaktif menggunakan framework Next.js dan styling Tailwind CSS. Menyusun file konfigurasi Tailwind (`tailwind.config.ts`) dengan custom palet warna korporat, breakpoints responsif, serta mendaftarkan dependensi komponen UI agar seragam secara visual.",
    4: "Melakukan wawancara singkat (user interview) kepada 5 calon pengguna potensial dan menyusun User Journey Map untuk memetakan alur interaksi. Merancang wireframe kasar beresolusi rendah (low-fidelity wireframes) pada Figma untuk halaman dashboard admin, memprioritaskan keterbacaan data metrik dan kemudahan navigasi menu samping.",
    5: "Menyusun draft laporan resmi pelaksanaan magang industri bab 1 (Pendahuluan: Profil Mitra Industri), bab 2 (Tinjauan Pustaka: Landasan Teori Sistem), dan bab 3 (Metodologi Pelaksanaan: Jadwal & Lingkup Penugasan). Melakukan bimbingan awal dengan supervisor industri untuk menyelaraskan keabsahan isi laporan.",
    6: "Merancang skema wiring diagram satu garis (single-line wiring diagram) untuk instalasi kelistrikan gardu induk berkapasitas 150kV. Melakukan simulasi aliran daya (load flow analysis) menggunakan software ETAP 19.0 untuk menguji batas kestabilan tegangan listrik serta meminimalisir rugi-rugi transmisi (transmission losses).",
    7: "Mengoptimalkan performa relational database dengan melakukan refactoring query SQL yang lambat pada modul data bimbingan. Menambahkan indeks (indexes) pada kolom primary/foreign keys, mengganti subqueries yang kompleks dengan relasi JOIN terstruktur, serta menganalisis efisiensi query menggunakan perintah EXPLAIN ANALYZE.",
    8: "Menyusun skrip infrastruktur berbasis kode (Infrastructure as Code - IaC) menggunakan Terraform untuk mengotomatisasi penyediaan arsitektur jaringan di layanan AWS. Skrip mencakup konfigurasi VPC (Virtual Private Cloud), public & private subnets, internet gateway, route tables, serta pembatasan akses keamanan melalui Security Groups."
  };

  const { activities, approveActivity, rejectActivity } = useMentorActivities();
  const { rawStudents } = useStudents();
  
  const [localActivityOverride, setLocalActivityOverride] = useState<any | null>(null);

  // Combine raw backend students with fallback mock students data
  const studentsList = rawStudents;

  // Find current activity log
  const activity = useMemo(() => {
    if (localActivityOverride) return localActivityOverride;
    return activities.find(a => String(a.id) === String(activityIdStr)) || 
           dummyActivities.find(a => String(a.id) === String(activityIdStr));
  }, [activities, activityIdStr, localActivityOverride]);

  // State for interactive features
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: "Mentor (Anda)", text: "Apakah berkas bukti pengujian unit testing sudah diunggah ke lampiran?", time: "Kemarin, 10:15 WIB" },
    { sender: "Mahasiswa", text: "Sudah saya unggah Pak, berkas laporan pengujian terlampir dalam file PDF di kolom kanan.", time: "Kemarin, 14:30 WIB" }
  ]);
  const [successToast, setSuccessToast] = useState("");

  // Map student details dynamically
  const student = useMemo(() => {
    if (!activity) return undefined;
    return studentsList.find(s => String(s.id) === String(activity.studentId));
  }, [activity, studentsList]);

  // Handler to add feedback comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setComments([
      ...comments,
      {
        sender: "Mentor (Anda)",
        text: commentInput,
        time: "Baru saja"
      }
    ]);
    setCommentInput("");
    setSuccessToast("Komentar bimbingan berhasil dikirim!");
    setTimeout(() => setSuccessToast(""), 3000);
  };

  // Handler to approve activity (ceklis)
  const handleApproveActivity = async () => {
    if (!activity) return;
    try {
      if (typeof activity.id === "number" && activity.id <= 8) {
        setLocalActivityOverride({ ...activity, status: "Disetujui" });
      } else {
        await approveActivity(activity.id as any);
      }
      setSuccessToast("Kegiatan mahasiswa telah disetujui (Status: Disetujui)!");
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal menyetujui kegiatan.");
    }
  };

  // Handler to reject activity
  const handleRejectActivity = async () => {
    if (!activity) return;
    try {
      if (typeof activity.id === "number" && activity.id <= 8) {
        setLocalActivityOverride({ ...activity, status: "Ditolak" });
      } else {
        await rejectActivity(activity.id as any);
      }
      setSuccessToast("Log kegiatan ini telah ditolak.");
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal menolak kegiatan.");
    }
  };

  // Render 404 block if activity not found
  if (!activity) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-full inline-block border border-rose-100 dark:border-rose-900/40">
          <AlertCircle className="w-10 h-10 animate-bounce" />
        </div>
        <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Kegiatan Tidak Ditemukan</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          Data log kegiatan dengan ID #{activityIdStr} tidak terdaftar di sistem bimbingan magang.
        </p>
        <Link 
          href="/dashboard/mentor/data-kegiatan"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all mt-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Daftar Kegiatan
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* FLOAT SUCCESS TOAST */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-2xl shadow-xl flex items-center gap-3 animate-float max-w-sm">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs font-bold leading-normal">{successToast}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/mentor/data-kegiatan"
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#070e24]/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Log Kegiatan
        </Link>

        <span className="text-xs text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Detail Kegiatan #{activity.id}
        </span>
      </div>

      {/* TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Student Profile Card (4 Grid Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {student ? (
            <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm bg-white dark:bg-[#070e24]/40 text-center space-y-4">
              <div className="relative inline-block mx-auto">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${student.avatarColor} text-white font-extrabold flex items-center justify-center text-2xl shadow-lg`}>
                  {(student?.name || "U").split(" ").map(n=>n[0]).join("").substring(0, 2)}
                </div>
                <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] border-2 border-white dark:border-slate-900">
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

              <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${
                student.gender === "Laki-laki"
                  ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200/40"
                  : "bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 border-pink-200/40"
              }`}>
                {student.gender}
              </span>

              <hr className="border-slate-100 dark:border-slate-800/60" />

              <div className="text-left space-y-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <div className="flex items-center gap-2">
                  <School className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="text-slate-800 dark:text-white truncate">{student.university}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <a href={`mailto:${student.email}`} className="hover:underline hover:text-indigo-500 truncate">{student.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <a href={`tel:${(student?.phone || "").replace(/[^0-9+]/g, '')}`} className="hover:underline hover:text-indigo-500">{student.phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="truncate text-slate-700 dark:text-slate-300 font-bold">{student.company}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm bg-white dark:bg-[#070e24]/40 text-center">
              <p className="text-xs text-slate-400 font-bold">Data profil mahasiswa tidak tersedia</p>
            </div>
          )}

          {/* ATTENDANCE REKAP MINI CARD */}
          {student && (
            <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-3">
              <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">Rekapitulasi Kehadiran</h5>
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-lg">
                  <p>Hadir</p>
                  <p className="text-xs font-black mt-0.5">{(student?.attendance?.present || 0)}</p>
                </div>
                <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-lg">
                  <p>Sakit</p>
                  <p className="text-xs font-black mt-0.5">{(student?.attendance?.sick || 0)}</p>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-lg">
                  <p>Izin</p>
                  <p className="text-xs font-black mt-0.5">{(student?.attendance?.leave || 0)}</p>
                </div>
                <div className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-lg">
                  <p>Alfa</p>
                  <p className="text-xs font-black mt-0.5">{(student?.attendance?.absent || 0)}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Activity report and verification (8 Grid Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* DETAILED ACTIVITY REPORT CARD */}
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-5">
            
            {/* Header info */}
            <div className="flex justify-between items-start flex-wrap gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">
                    {activity.category}
                  </span>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                    activity.status === "Disetujui"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/30"
                      : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/30"
                  }`}>
                    {activity.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-base md:text-lg text-slate-900 dark:text-white leading-tight">
                  {activity.activityName}
                </h3>
              </div>
            </div>

            {/* Time parameters: broken down into Year, Month, Day */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
              <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Waktu Pelaksanaan
              </h5>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 border border-slate-200/50 dark:border-slate-800/60 rounded-xl bg-white dark:bg-[#070e24]/40">
                  <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Tahun</span>
                  <span className="text-xs font-black text-slate-800 dark:text-white mt-0.5 block">{activity.year}</span>
                </div>
                <div className="p-2 border border-slate-200/50 dark:border-slate-800/60 rounded-xl bg-white dark:bg-[#070e24]/40">
                  <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Bulan</span>
                  <span className="text-xs font-black text-slate-800 dark:text-white mt-0.5 block">{activity.month}</span>
                </div>
                <div className="p-2 border border-slate-200/50 dark:border-slate-800/60 rounded-xl bg-white dark:bg-[#070e24]/40">
                  <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Tanggal</span>
                  <span className="text-xs font-black text-slate-800 dark:text-white mt-0.5 block">Tanggal {activity.day}</span>
                </div>
              </div>
            </div>

            {/* Log description narrative */}
            <div className="space-y-2">
              <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                Rincian Deskripsi Laporan Kegiatan
              </h5>
              <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                {activityDescriptions[activity.id] || "Deskripsi pengerjaan kegiatan teknis harian mahasiswa bimbingan industri."}
              </p>
            </div>

            {/* Attachment block */}
            <div className="space-y-2.5 pt-2">
              <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                Berkas Lampiran Pendukung (Attachment)
              </h5>

              {activity.attachment ? (
                <div className="flex items-center gap-3 p-3 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl bg-indigo-50/20 dark:bg-indigo-950/20">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Paperclip className="w-5 h-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{activity.attachment}</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Tipe: Dokumen PDF/Lampiran Bukti</span>
                  </div>
                  <button 
                    onClick={() => alert(`Mengunduh file: ${activity.attachment}`)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    Unduh File
                  </button>
                </div>
              ) : (
                <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-slate-400 dark:text-slate-500 font-bold text-xs space-y-1 bg-slate-50/50 dark:bg-slate-900/20">
                  <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
                  <p>Tidak ada berkas lampiran yang diunggah oleh mahasiswa</p>
                </div>
              )}
            </div>

            {/* Mentor direct verification buttons (Ceklis and Hapus/Tolak) */}
            {activity.status === "Dalam Review" && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-3 flex-wrap">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mr-auto flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Pemberitahuan: Log ini belum divalidasi akademik.
                </span>

                <button 
                  onClick={handleRejectActivity}
                  className="px-4 py-2 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 bg-white hover:bg-rose-50 dark:bg-[#070e24]/40 dark:hover:bg-rose-950/20 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  Tolak Log
                </button>

                <button 
                  onClick={handleApproveActivity}
                  className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 shadow-md shadow-emerald-600/10 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 font-black" />
                  Ceklis (Setujui)
                </button>
              </div>
            )}
            
            {activity.status === "Disetujui" && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 rounded-xl text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Kegiatan Terverifikasi & Disetujui Pembimbing
                </span>
              </div>
            )}

          </div>

          {/* FORUM UMPAN BALIK / DISCUSSION TIMELINE */}
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              Kolom Umpan Balik Log Kegiatan
            </h4>
            
            {/* Thread feed */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {comments?.map((comment, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                    comment.sender.includes("Mentor")
                      ? "bg-indigo-50/40 border-indigo-100/40 text-slate-800 dark:bg-indigo-950/20 dark:border-indigo-900/30 dark:text-slate-200 ml-6"
                      : "bg-slate-50 border-slate-100 text-slate-800 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-200 mr-6"
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-black tracking-wider uppercase">
                    <span className={comment.sender.includes("Mentor") ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"}>
                      {comment.sender}
                    </span>
                    <span className="text-slate-400 font-semibold">{comment.time}</span>
                  </div>
                  <p className="font-semibold">{comment.text}</p>
                </div>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <input
                type="text"
                placeholder="Tulis instruksi revisi atau umpan balik..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
              />
              <button
                type="submit"
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
                title="Kirim Catatan"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
