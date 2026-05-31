"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  School, 
  User, 
  MapPin,
  Calendar, 
  Briefcase, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Award,
  Users,
  Send,
  Check,
  X
} from "lucide-react";
import { studentsData, Student } from "../studentsData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MentorStudentDetailPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const studentId = parseInt(unwrappedParams.id, 10);
  
  // Find the student
  const student = studentsData.find((s) => s.id === studentId);

  // States for interactive dummy features
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: "Mentor (Anda)", text: "Progres bagus untuk minggu ini, pastikan modul autentikasi teruji dengan baik.", time: "Kemarin, 16:30" },
    { sender: "Mahasiswa", text: "Baik Pak, terima kasih masukannya. Minggu ini saya mulai lanjut integrasi API.", time: "Hari ini, 08:15" }
  ]);
  const [successMessage, setSuccessMessage] = useState("");

  // Handler to add a comment
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
  };

  // Handler to approve a logbook (dummy simulation)
  const handleApproveLogbook = (week: number) => {
    setSuccessMessage(`Logbook Minggu ${week} berhasil disetujui secara langsung!`);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  // If student is not found, render a nice 404 block
  if (!student) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-full inline-block border border-rose-100 dark:border-rose-900/40">
          <AlertCircle className="w-10 h-10 animate-bounce" />
        </div>
        <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Mahasiswa Tidak Ditemukan</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          Data mahasiswa dengan ID #{unwrappedParams.id} tidak terdaftar di basis data bimbingan magang Anda.
        </p>
        <Link 
          href="/dashboard/mentor/data-mahasiswa"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all mt-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Daftar Mahasiswa
        </Link>
      </div>
    );
  }

  // Dummy weekly logbooks
  const dummyLogbooks = [
    { week: 8, date: "25 Mei 2026", task: "Integrasi API Pembayaran & Pengujian Backend", desc: "Melakukan integrasi API pembayaran menggunakan gateway Midtrans. Membuat unit testing untuk skenario pembayaran sukses, tertunda, dan gagal. Menambahkan webhook listener untuk sinkronisasi status transaksi secara real-time.", status: "Dalam Review", category: "Technical Development" },
    { week: 7, date: "18 Mei 2026", task: "Implementasi Dashboard Admin & Visualisasi Chart", desc: "Membangun tampilan dashboard admin dengan analitik statistik transaksi mingguan dan bulanan. Menggunakan Chart.js untuk visualisasi data interaktif. Menyempurnakan layout agar responsif di mobile.", status: "Disetujui", category: "Frontend UI/UX" },
    { week: 6, date: "11 Mei 2026", task: "Setup Database & Model Relasional Transaksi", desc: "Mendesain skema database relasional untuk menampung transaksi, detail pesanan, dan log aktivitas user. Membuat migrasi tabel, seeder data testing, serta mengoptimalkan query relational join.", status: "Disetujui", category: "Database Designing" },
    { week: 5, date: "04 Mei 2026", task: "Autentikasi Pengguna & Manajemen Role (RBAC)", desc: "Mengembangkan modul registrasi, login, dan logout lengkap dengan proteksi JWT. Menerapkan Middleware Role-Based Access Control (RBAC) untuk memisahkan hak akses antara Admin, Merchant, dan Pelanggan umum.", status: "Disetujui", category: "Security & Auth" },
    { week: 4, date: "27 Apr 2026", task: "Slicing Figma UI & Komponen Dasar React", desc: "Melakukan konversi rancangan UI/UX Figma menjadi komponen-komponen Next.js yang reusable. Menyusun state global menggunakan Context API serta menambahkan feedback form interaktif.", status: "Disetujui", category: "Slicing UI" },
    { week: 3, date: "20 Apr 2026", task: "Uji Kelayakan Kebutuhan Pengguna & Riset Kompetitor", desc: "Melakukan survei singkat kepada 15 calon pengguna potensial untuk memvalidasi fitur-fitur utama. Menganalisis kelebihan serta kekurangan platform kompetitor sejenis untuk diferensiasi produk.", status: "Disetujui", category: "Business Analyst" }
  ];

  return (
    <div className="space-y-6">
      
      {/* SUCCESS ALERTS (DUMMY TOASTS) */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-2xl shadow-xl flex items-center gap-3 animate-float max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs font-bold leading-normal">{successMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/mentor/data-mahasiswa"
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#070e24]/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar
        </Link>

        <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">
          ID Mahasiswa Bimbingan: #{student.id}
        </span>
      </div>

      {/* TWO-COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Profile info & key parameters (4 Grid Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* PROFILE SUMMARY CARD */}
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm bg-white dark:bg-[#070e24]/40 text-center space-y-4">
            <div className="relative inline-block mx-auto">
              <div className={`w-24 h-24 rounded-3xl bg-gradient-to-tr ${student.avatarColor} text-white font-black flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/10`}>
                {student.name.split(" ").map(n=>n[0]).join("").substring(0, 2)}
              </div>
              <span className={`absolute -bottom-1.5 -right-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white border-2 border-white dark:border-slate-900 bg-indigo-600`}>
                M-#{student.id}
              </span>
            </div>

            <div>
              <h4 className="font-black text-lg text-slate-900 dark:text-white leading-tight">
                {student.name}
              </h4>
              <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mt-1">
                NIM: {student.nim}
              </p>
            </div>

            {/* Badges container */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${
                student.gender === "Laki-laki" 
                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/40 dark:border-blue-900/40" 
                  : "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border-pink-200/40 dark:border-pink-900/40"
              }`}>
                <User className="w-3 h-3" />
                {student.gender}
              </span>

              <span className={`inline-flex px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${
                student.status === "Selesai" 
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/40 dark:border-emerald-900/40" 
                  : student.status === "Dalam Review"
                    ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/40 dark:border-amber-900/40"
                    : "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200/40 dark:border-sky-900/40"
              }`}>
                {student.status}
              </span>
            </div>

            <hr className="border-slate-100 dark:border-slate-800/80 my-2" />

            <div className="text-left space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
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
                <a href={`tel:${student.phone.replace(/[^0-9+]/g, '')}`} className="hover:underline hover:text-indigo-500">{student.phone}</a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span className="leading-snug text-[11px]">{student.address}</span>
              </div>
            </div>
          </div>

          {/* ACADEMIC PERFORMANCE CARD */}
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-500" />
              Progres & Penilaian
            </h4>

            {/* Circular score display */}
            <div className="flex justify-between items-center py-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Nilai Bimbingan</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {student.grade !== null ? `${student.grade}/100` : "Belum Diisi"}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${student.grade !== null ? "from-emerald-500/20 to-emerald-500/10 text-emerald-500" : "from-slate-500/20 to-slate-500/10 text-slate-400"}`}>
                <Award className="w-6 h-6" />
              </div>
            </div>

            {/* Cumulative progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                <span>Pengerjaan Proyek Magang</span>
                <span className="text-indigo-600 dark:text-indigo-400">{student.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-200/30 dark:border-slate-800/40">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500`} 
                  style={{ width: `${student.progress}%` }} 
                />
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block text-right font-medium">
                Logbook dikumpulkan: {student.logbooksCount - student.logbooksPending}/{student.logbooksCount} minggu
              </span>
            </div>
          </div>

          {/* ATTENDANCE SUMMARY CARD */}
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Rekapitulasi Kehadiran
            </h4>

            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: "Hadir", count: student.attendance.present, color: "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40" },
                { label: "Sakit", count: student.attendance.sick, color: "bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40" },
                { label: "Izin", count: student.attendance.leave, color: "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40" },
                { label: "Alfa", count: student.attendance.absent, color: "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40" }
              ].map((att, i) => (
                <div key={i} className={`p-2.5 rounded-xl border ${att.color} flex flex-col justify-center`}>
                  <span className="text-[10px] font-bold opacity-80 block truncate">{att.label}</span>
                  <span className="text-sm font-black mt-1">{att.count}</span>
                </div>
              ))}
            </div>
            
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed text-center">
              Presensi tercatat secara otomatis menggunakan platform Geolocation & Face Recognition harian.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: Internship Info, Timeline Logbook, Discussion (8 Grid Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* INTERNSHIP DETAILS CARD */}
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-500" />
              Detail Penempatan Magang Industri
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 space-y-2">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Perusahaan Mitra</span>
                <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">{student.company}</h5>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold space-y-1">
                  <p>Posisi: {student.role}</p>
                  <p>Program Studi: {student.program}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 space-y-2">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Periode Magang</span>
                <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">{student.period}</h5>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold space-y-1">
                  <p>Durasi: 6 Bulan Kontrak</p>
                  <p>Supervisor Lapangan: Bpk. Hermawan S.T.</p>
                </div>
              </div>

            </div>
          </div>

          {/* TIMELINE LOGBOOK */}
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  Logbook Mingguan Mahasiswa
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  Tinjau dan setujui deskripsi tugas mahasiswa bimbingan setiap minggunya
                </p>
              </div>
              
              <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold border border-amber-200/40 rounded-xl text-[10px]">
                {student.logbooksPending} Logbook Perlu Tinjauan
              </span>
            </div>

            {/* Timeline element */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 before:dark:bg-slate-800/60">
              
              {dummyLogbooks.map((log) => (
                <div key={log.week} className="relative group/timeline">
                  
                  {/* Timeline point indicator */}
                  <span className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 transition-all ${
                    log.status === "Dalam Review" 
                      ? "bg-amber-500 shadow-md shadow-amber-500/20 animate-pulse" 
                      : "bg-emerald-500 shadow-md shadow-emerald-500/20"
                  }`} />

                  {/* Logbook card detail */}
                  <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-800/60 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-colors space-y-3">
                    
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          Minggu Ke-{log.week} • {log.date}
                        </span>
                        <h5 className="font-extrabold text-xs text-slate-900 dark:text-white leading-normal mt-0.5">
                          {log.task}
                        </h5>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {log.category}
                        </span>
                        <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                          log.status === "Disetujui"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/30 dark:border-emerald-900/30"
                            : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/30 dark:border-amber-900/30"
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 font-semibold">
                      {log.desc}
                    </p>

                    {/* Action on Logbook if pending review */}
                    {log.status === "Dalam Review" && (
                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800/50">
                        <span className="text-[10px] text-slate-400 font-medium mr-auto">
                          Unggah Berkas Lampiran: <span className="text-indigo-500 font-bold hover:underline cursor-pointer">laporan_mingguan_w{log.week}.pdf</span>
                        </span>
                        <button 
                          onClick={() => handleApproveLogbook(log.week)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-[10px] rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Setujui Langsung
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ))}

            </div>
          </div>

          {/* DISCUSSION BOARD CARD (DUMMY FEEDBACK) */}
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              Kolom Diskusi & Umpan Balik Bimbingan
            </h4>
            
            {/* Thread list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {comments.map((comment, index) => (
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
                placeholder="Tulis instruksi, saran, atau komentar bimbingan..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
              />
              <button
                type="submit"
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
                title="Kirim Komentar"
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
