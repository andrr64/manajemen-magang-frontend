"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Users, 
  FileText, 
  Calendar, 
  Award, 
  ChevronRight, 
  Plus, 
  Clock, 
  FileSpreadsheet,
  Mail,
  Phone,
  School,
  User,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Search,
  Scale
} from "lucide-react";
import { studentsData, Student } from "./data-mahasiswa/studentsData";
import { useStudents } from "@/modules/mahasiswa/hooks";

export default function DashboardHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const { rawStudents, isLoading } = useStudents();

  // Combine raw backend students with fallback mock students data
  const studentsList = useMemo(() => {
    return rawStudents;
  }, [rawStudents]);

  const activeStudentsCount = useMemo(() => {
    return studentsList.filter(s => s.status === "Aktif").length;
  }, [studentsList]);

  const completedStudentsCount = useMemo(() => {
    return studentsList.filter(s => s.status === "Selesai").length;
  }, [studentsList]);

  // Calculate cumulative attendance statistics dynamically
  const attendanceStats = useMemo(() => {
    let totalHadir = 0;
    let totalSakit = 0;
    let totalIzin = 0;

    studentsList.forEach(s => {
      if (s.attendance) {
        totalHadir += s.attendance.present || 0;
        totalSakit += s.attendance.sick || 0;
        totalIzin += s.attendance.leave || 0;
      }
    });

    const total = totalHadir + totalSakit + totalIzin;
    const pctHadir = total > 0 ? ((totalHadir / total) * 100).toFixed(1) : "0.0";
    const pctSakit = total > 0 ? ((totalSakit / total) * 100).toFixed(1) : "0.0";
    const pctIzin = total > 0 ? ((totalIzin / total) * 100).toFixed(1) : "0.0";

    return { totalHadir, totalSakit, totalIzin, total, pctHadir, pctSakit, pctIzin };
  }, [studentsList]);

  // Filter students directory on home page table
  const filteredStudents = useMemo(() => {
    return studentsList.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      return (
        q === "" ||
        s.name.toLowerCase().includes(q) ||
        s.nim.includes(q) ||
        s.university.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    });
  }, [studentsList, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* WELCOME ANNOUNCEMENT CARD */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white relative overflow-hidden shadow-xl shadow-indigo-900/10 animate-float">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-200 bg-indigo-800/60 px-3 py-1.5 rounded-lg border border-indigo-700/50 inline-block">
            Pemberitahuan
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight leading-tight">
            Selamat Datang Kembali, Dr. Ahmad Hidayat!
          </h3>
          <p className="text-xs text-indigo-200 leading-relaxed font-semibold">
            Semua mahasiswa bimbingan Anda aktif melaksanakan magang industri semester genap. Pantau progres kehadiran, verifikasi absensi manual, dan berikan penilaian akhir secara digital.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link 
              href="/dashboard/mentor/data-mahasiswa/tambah-mahasiswa"
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 text-xs font-extrabold shadow-md hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-indigo-900" />
              Daftarkan Mahasiswa Baru
            </Link>
            <Link 
              href="/dashboard/mentor/data-kegiatan"
              className="px-4 py-2.5 rounded-xl bg-indigo-700/50 hover:bg-indigo-700 text-white text-xs font-bold border border-indigo-600/50 hover:border-indigo-600 transition-all"
            >
              Tinjau Log Kegiatan (8)
            </Link>
          </div>
        </div>
      </div>

      {/* METRIC STATISTICS & ATTENDANCE DIAGRAM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT PART: 2 Smaller Metric Columns (lg:col-span-5) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          
          {/* Card 1: Jumlah Mahasiswa Aktif */}
          <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Jumlah Mahasiswa Aktif
              </span>
              <h4 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {activeStudentsCount}
              </h4>
              <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 block pt-1">
                Sedang Melaksanakan Magang
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/20 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Jumlah Mahasiswa Selesai */}
          <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Jumlah Mahasiswa Selesai
              </span>
              <h4 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {completedStudentsCount}
              </h4>
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 block pt-1">
                Laporan Akhir Terverifikasi
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200/20 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* RIGHT PART: Absensi Tampilkan Dalam Bentuk Diagram Keseluruhan (lg:col-span-7) */}
        <div className="lg:col-span-7">
          <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 shadow-sm flex flex-col justify-between h-full">
            
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                Diagram Rekap Absensi
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                Akumulasi Presensi Keseluruhan Mahasiswa
              </h4>
            </div>

            {/* STACKED PROGRESS DIAGRAM */}
            <div className="w-full bg-slate-100 dark:bg-slate-900 h-6 rounded-2xl overflow-hidden flex mt-4 border border-slate-200/20">
              <div 
                className="bg-emerald-500 h-full hover:opacity-90 transition-opacity cursor-pointer relative group" 
                style={{ width: `${attendanceStats.pctHadir}%` }} 
                title={`Hadir: ${attendanceStats.pctHadir}%`}
              />
              <div 
                className="bg-blue-500 h-full hover:opacity-90 transition-opacity cursor-pointer" 
                style={{ width: `${attendanceStats.pctIzin}%` }} 
                title={`Izin: ${attendanceStats.pctIzin}%`}
              />
              <div 
                className="bg-amber-500 h-full hover:opacity-90 transition-opacity cursor-pointer" 
                style={{ width: `${attendanceStats.pctSakit}%` }} 
                title={`Sakit: ${attendanceStats.pctSakit}%`}
              />
            </div>

            {/* DIAGRAM DETAILED LEGENDS */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[10px] font-bold text-center">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-emerald-650 dark:text-emerald-450">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Hadir
                </span>
                <p className="text-xs font-black text-slate-800 dark:text-white">{attendanceStats.totalHadir} Hari</p>
                <span className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold">({attendanceStats.pctHadir}%)</span>
              </div>
              
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-blue-650 dark:text-blue-450">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Izin
                </span>
                <p className="text-xs font-black text-slate-800 dark:text-white">{attendanceStats.totalIzin} Hari</p>
                <span className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold">({attendanceStats.pctIzin}%)</span>
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-amber-650 dark:text-amber-450">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Sakit
                </span>
                <p className="text-xs font-black text-slate-800 dark:text-white">{attendanceStats.totalSakit} Hari</p>
                <span className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold">({attendanceStats.pctSakit}%)</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* STUDENT TABLE ROW: NAMA, NIM, UNIVERSITAS, EMAIL, NO TELP, GENDER */}
      <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm overflow-hidden flex flex-col bg-white dark:bg-[#070e24]/40 space-y-4">
        
        {/* Table Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Direktori Kontak & Mahasiswa Bimbingan</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Daftar lengkap parameter profil pribadi dan rincian kontak akademik mahasiswa bimbingan.</p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari nama, nim, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* 6 Required Columns Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">
                <th className="pb-3.5 pl-4 font-bold">Nama</th>
                <th className="pb-3.5 font-bold">NIM</th>
                <th className="pb-3.5 font-bold">Universitas</th>
                <th className="pb-3.5 font-bold">Email</th>
                <th className="pb-3.5 font-bold">No. Telp</th>
                <th className="pb-3.5 font-bold">Gender</th>
                <th className="pb-3.5 pr-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors group cursor-pointer">
                  
                  {/* Column 1: Nama (Avatar initials, name, link to detail data-mahasiswa) */}
                  <td className="py-4 pl-4">
                    <Link href={`/dashboard/mentor/data-mahasiswa/${student.id}`} className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${student.avatarColor} text-white font-extrabold flex items-center justify-center text-xs shadow-inner group-hover:scale-105 transition-transform`}>
                        {student.name.split(" ").map(n=>n[0]).join("").substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                          {student.name}
                        </p>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mt-0.5 truncate max-w-[150px]">
                          {student.company}
                        </span>
                      </div>
                    </Link>
                  </td>

                  {/* Column 2: NIM */}
                  <td className="py-4 font-bold text-slate-700 dark:text-slate-300">
                    <Link href={`/dashboard/mentor/data-mahasiswa/${student.id}`} className="block w-full py-1">
                      {student.nim}
                    </Link>
                  </td>

                  {/* Column 3: Universitas */}
                  <td className="py-4">
                    <Link href={`/dashboard/mentor/data-mahasiswa/${student.id}`} className="inline-flex items-center gap-1.5 text-slate-750 dark:text-slate-300 font-bold">
                      <School className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{student.university}</span>
                    </Link>
                  </td>

                  {/* Column 4: Email */}
                  <td className="py-4 text-slate-600 dark:text-slate-400 font-semibold">
                    <a 
                      href={`mailto:${student.email}`}
                      className="inline-flex items-center gap-1 hover:text-indigo-650 dark:hover:text-indigo-455"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-455 dark:text-slate-500" />
                      <span>{student.email}</span>
                    </a>
                  </td>

                  {/* Column 5: No Telp */}
                  <td className="py-4 text-slate-600 dark:text-slate-400">
                    <a 
                      href={`tel:${student.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1 hover:text-indigo-655 dark:hover:text-indigo-455 font-bold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-455 dark:text-slate-500" />
                      <span>{student.phone}</span>
                    </a>
                  </td>

                  {/* Column 6: Gender */}
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${
                      student.gender === "Laki-laki" 
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/40" 
                        : "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border-pink-200/50 dark:border-pink-900/40"
                    }`}>
                      <User className="w-3 h-3" />
                      {student.gender}
                    </span>
                  </td>

                  {/* Action Link to Student details page */}
                  <td className="py-4 pr-4 text-right">
                    <Link 
                      href={`/dashboard/mentor/data-mahasiswa/${student.id}`}
                      className="inline-flex items-center gap-0.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 text-[10px] font-black rounded-xl transition-all text-slate-700 dark:text-slate-350"
                    >
                      Profil
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>

                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-slate-400 font-extrabold">
                    Tidak ada data bimbingan yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
