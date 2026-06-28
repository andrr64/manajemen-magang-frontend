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
import { useStudents } from "@/modules/data_mahasiswa/hooks";
import { useIam } from "@/modules/iam/hooks";
import { useAttendanceStatsByDateRange } from "@/modules/dashboard_mentor/hooks";

export default function DashboardHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const { rawStudents, isLoading } = useStudents();
  const { user } = useIam();

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

  const [attendanceFilter, setAttendanceFilter] = useState<"Minggu ini" | "Bulan ini" | "Tahun ini">("Tahun ini");
  
  const { tanggalAwal, tanggalAkhir } = useMemo(() => {
    const today = new Date();
    let start = new Date(today);
    
    if (attendanceFilter === "Minggu ini") {
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      start = new Date(start.setDate(diff));
    } else if (attendanceFilter === "Bulan ini") {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (attendanceFilter === "Tahun ini") {
      start = new Date(today.getFullYear(), 0, 1);
    }
    
    const formatDate = (date: Date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
    
    return {
      tanggalAwal: formatDate(start),
      tanggalAkhir: formatDate(today)
    };
  }, [attendanceFilter]);

  const { stats: apiAttendanceStats, isLoading: isAttendanceLoading } = useAttendanceStatsByDateRange(tanggalAwal, tanggalAkhir);
  
  const attendanceStats = useMemo(() => {
    const totalHadir = apiAttendanceStats?.jumlahHadir || 0;
    const totalIzin = apiAttendanceStats?.jumlahIzin || 0;
    const totalSakit = apiAttendanceStats?.jumlahSakit || 0;
    
    const total = totalHadir + totalSakit + totalIzin;
    const pctHadir = total > 0 ? ((totalHadir / total) * 100).toFixed(1) : "0.0";
    const pctSakit = total > 0 ? ((totalSakit / total) * 100).toFixed(1) : "0.0";
    const pctIzin = total > 0 ? ((totalIzin / total) * 100).toFixed(1) : "0.0";
    
    return { totalHadir, totalSakit, totalIzin, total, pctHadir, pctSakit, pctIzin };
  }, [apiAttendanceStats]);

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
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#121358] to-[#232F72] text-[#FFFFFF] relative overflow-hidden shadow-xl shadow-[#121358]/20 animate-float">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#36ADA3]/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#F1F5F9] bg-[#2F578A]/50 px-3 py-1.5 rounded-lg border border-[#2F578A] inline-block">
            Pemberitahuan
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight leading-tight">
            Selamat Datang Kembali, {user?.nama || user?.email || "Mentor"}!
          </h3>
          <p className="text-xs text-[#F1F5F9] leading-relaxed font-semibold">
            Semua mahasiswa bimbingan Anda aktif melaksanakan magang industri semester genap. Pantau progres kehadiran, verifikasi absensi manual, dan berikan penilaian akhir secara digital.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link 
              href="/dashboard/mentor/data-mahasiswa/tambah-mahasiswa"
              className="px-4 py-2.5 rounded-xl bg-[#36ADA3] text-[#FFFFFF] text-xs font-extrabold shadow-[0_0_15px_rgba(54,173,163,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Daftarkan Mahasiswa Baru
            </Link>
            <Link 
              href="/dashboard/mentor/kegiatan"
              className="px-4 py-2.5 rounded-xl bg-[#2F578A]/50 hover:bg-[#2F578A] text-[#FFFFFF] text-xs font-bold border border-[#2F578A] transition-all"
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
          <div className="glass-card p-5 rounded-3xl border border-[#2F578A]/30 dark:border-[#2F578A] bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#2F578A] dark:text-[#F1F5F9]/70 uppercase tracking-wider block">
                Jumlah Mahasiswa Aktif
              </span>
              <h4 className="text-3xl font-black tracking-tight text-[#232F72] dark:text-[#FFFFFF]">
                {activeStudentsCount}
              </h4>
              <span className="text-[9px] font-bold text-[#36ADA3] block pt-1">
                Sedang Melaksanakan Magang
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#232F72] text-[#36ADA3] border border-[#2F578A]/30 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Jumlah Mahasiswa Selesai */}
          <div className="glass-card p-5 rounded-3xl border border-[#2F578A]/30 dark:border-[#2F578A] bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#2F578A] dark:text-[#F1F5F9]/70 uppercase tracking-wider block">
                Jumlah Mahasiswa Selesai
              </span>
              <h4 className="text-3xl font-black tracking-tight text-[#232F72] dark:text-[#FFFFFF]">
                {completedStudentsCount}
              </h4>
              <span className="text-[9px] font-bold text-[#36ADA3] block pt-1">
                Laporan Akhir Terverifikasi
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#232F72] text-[#36ADA3] border border-[#2F578A]/30 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* RIGHT PART: Absensi Tampilkan Dalam Bentuk Diagram Keseluruhan (lg:col-span-7) */}
        <div className="lg:col-span-7">
          <div className="glass-card p-5 rounded-3xl border border-[#2F578A]/30 dark:border-[#2F578A] bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md shadow-sm flex flex-col justify-between h-full">
            
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#2F578A] dark:text-[#F1F5F9]/70 block">
                Diagram Rekap Absensi
              </span>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 gap-3">
                <h4 className="text-sm font-extrabold text-[#232F72] dark:text-[#FFFFFF]">
                  Akumulasi Presensi Keseluruhan Mahasiswa
                </h4>
                <div className="flex bg-[#F1F5F9] dark:bg-[#121358] p-1 rounded-xl">
                  {["Minggu ini", "Bulan ini", "Tahun ini"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setAttendanceFilter(filter as any)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        attendanceFilter === filter 
                          ? "bg-[#36ADA3] text-white shadow-sm" 
                          : "text-[#2F578A] dark:text-[#F1F5F9]/70 hover:bg-[#E2E8F0] dark:hover:bg-[#232F72]"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STACKED PROGRESS DIAGRAM */}
            <div className="w-full bg-[#F1F5F9] dark:bg-[#232F72] h-6 rounded-2xl overflow-hidden flex mt-4 border border-[#2F578A]/30">
              <div 
                className="bg-[#36ADA3] h-full hover:opacity-90 transition-opacity cursor-pointer relative group" 
                style={{ width: `${attendanceStats.pctHadir}%` }} 
                title={`Hadir: ${attendanceStats.pctHadir}%`}
              />
              <div 
                className="bg-[#2F578A] h-full hover:opacity-90 transition-opacity cursor-pointer" 
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
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#2F578A]/30 dark:border-[#2F578A]/50 text-[10px] font-bold text-center">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[#36ADA3]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#36ADA3]" />
                  Hadir
                </span>
                <p className="text-xs font-black text-[#232F72] dark:text-[#FFFFFF]">{attendanceStats.totalHadir} Hari</p>
                <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold">({attendanceStats.pctHadir}%)</span>
              </div>
              
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[#2F578A] dark:text-[#F1F5F9]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2F578A]" />
                  Izin
                </span>
                <p className="text-xs font-black text-[#232F72] dark:text-[#FFFFFF]">{attendanceStats.totalIzin} Hari</p>
                <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold">({attendanceStats.pctIzin}%)</span>
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-amber-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Sakit
                </span>
                <p className="text-xs font-black text-[#232F72] dark:text-[#FFFFFF]">{attendanceStats.totalSakit} Hari</p>
                <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold">({attendanceStats.pctSakit}%)</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* STUDENT TABLE ROW: NAMA, NIM, UNIVERSITAS, EMAIL, NO TELP, GENDER */}
      <div className="glass-card border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 shadow-sm overflow-hidden flex flex-col bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md space-y-4">
        
        {/* Table Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h4 className="font-extrabold text-base text-[#232F72] dark:text-[#FFFFFF]">Direktori Kontak & Mahasiswa Bimbingan</h4>
            <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/70">Daftar lengkap parameter profil pribadi dan rincian kontak akademik mahasiswa bimbingan.</p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari nama, nim, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/30 focus:border-[#36ADA3] rounded-xl text-xs font-semibold focus:outline-none transition-all text-[#232F72] dark:text-[#FFFFFF] placeholder:text-[#2F578A]/50 dark:placeholder:text-[#F1F5F9]/50"
            />
            <Search className="w-3.5 h-3.5 text-[#2F578A]/50 dark:text-[#F1F5F9]/50 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* 6 Required Columns Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[900px] border-collapse border border-[#2F578A]/20 dark:border-[#2F578A]/40">
            <thead>
              <tr className="border-b border-[#2F578A]/30 dark:border-[#2F578A] text-[10px] font-bold text-[#2F578A] dark:text-[#F1F5F9]/70 uppercase tracking-widest text-center bg-[#F8FAFC]/70 dark:bg-[#232F72]/50">
                <th className="py-3 px-4 font-bold border border-[#2F578A]/20 dark:border-[#2F578A]/40">Nama</th>
                <th className="py-3 px-4 font-bold border border-[#2F578A]/20 dark:border-[#2F578A]/40">NIM</th>
                <th className="py-3 px-4 font-bold border border-[#2F578A]/20 dark:border-[#2F578A]/40">Universitas</th>
                <th className="py-3 px-4 font-bold border border-[#2F578A]/20 dark:border-[#2F578A]/40">Email</th>
                <th className="py-3 px-4 font-bold border border-[#2F578A]/20 dark:border-[#2F578A]/40">No. Telp</th>
                <th className="py-3 px-4 font-bold border border-[#2F578A]/20 dark:border-[#2F578A]/40">Gender</th>
                <th className="py-3 px-4 font-bold border border-[#2F578A]/20 dark:border-[#2F578A]/40">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {filteredStudents?.map((student) => (
                <tr key={student.id} className="hover:bg-[#F8FAFC]/50 dark:hover:bg-[#121358]/50 transition-colors group cursor-pointer border-b border-[#2F578A]/20 dark:border-[#2F578A]/40">
                  
                  {/* Column 1: Nama (Avatar initials, name, link to detail data-mahasiswa) */}
                  <td className="py-4 px-4 border border-[#2F578A]/20 dark:border-[#2F578A]/40 text-center">
                    <Link href={`/dashboard/mentor/data-mahasiswa/${student.id}`} className="flex justify-center items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${student.avatarColor} text-white font-extrabold flex items-center justify-center text-xs shadow-inner group-hover:scale-105 transition-transform`}>
                        {(student.name || "Mahasiswa").split(" ").map(n=>n[0]).join("").substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-extrabold text-[#232F72] dark:text-[#FFFFFF] group-hover:text-[#36ADA3] dark:group-hover:text-[#36ADA3] transition-colors leading-tight">
                          {student.name}
                        </p>
                        <span className="text-[10px] font-bold text-[#2F578A] dark:text-[#F1F5F9]/70 block mt-0.5 truncate max-w-[150px]">
                          {student.company}
                        </span>
                      </div>
                    </Link>
                  </td>

                  {/* Column 2: NIM */}
                  <td className="py-4 px-4 font-bold text-[#232F72]/80 dark:text-[#F1F5F9] border border-[#2F578A]/20 dark:border-[#2F578A]/40 text-center">
                    <Link href={`/dashboard/mentor/data-mahasiswa/${student.id}`} className="block w-full py-1">
                      {student.nim}
                    </Link>
                  </td>

                  {/* Column 3: Universitas */}
                  <td className="py-4 px-4 border border-[#2F578A]/20 dark:border-[#2F578A]/40 text-center">
                    <Link href={`/dashboard/mentor/data-mahasiswa/${student.id}`} className="inline-flex items-center gap-1.5 text-[#232F72]/80 dark:text-[#F1F5F9] font-bold">
                      <School className="w-3.5 h-3.5 text-[#36ADA3]" />
                      <span>{student.university}</span>
                    </Link>
                  </td>

                  {/* Column 4: Email */}
                  <td className="py-4 px-4 text-[#2F578A] dark:text-[#F1F5F9]/80 font-semibold border border-[#2F578A]/20 dark:border-[#2F578A]/40 text-center">
                    <a 
                      href={`mailto:${student.email}`}
                      className="inline-flex items-center gap-1 hover:text-[#36ADA3] dark:hover:text-[#36ADA3]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail className="w-3.5 h-3.5 text-[#2F578A] dark:text-[#F1F5F9]/70" />
                      <span>{student.email}</span>
                    </a>
                  </td>

                  {/* Column 5: No Telp */}
                  <td className="py-4 px-4 text-[#2F578A] dark:text-[#F1F5F9]/80 border border-[#2F578A]/20 dark:border-[#2F578A]/40 text-center">
                    <a 
                      href={`tel:${(student.phone || "").replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1 hover:text-[#36ADA3] dark:hover:text-[#36ADA3] font-bold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="w-3.5 h-3.5 text-[#2F578A] dark:text-[#F1F5F9]/70" />
                      <span>{student.phone || "-"}</span>
                    </a>
                  </td>

                  {/* Column 6: Gender */}
                  <td className="py-4 px-4 border border-[#2F578A]/20 dark:border-[#2F578A]/40 text-center">
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
                  <td className="py-4 px-4 text-center border border-[#2F578A]/20 dark:border-[#2F578A]/40">
                    <Link 
                      href={`/dashboard/mentor/data-mahasiswa/${student.id}`}
                      className="inline-flex items-center gap-0.5 px-3 py-1.5 bg-[#F1F5F9] dark:bg-[#232F72] hover:bg-[#36ADA3] hover:text-[#FFFFFF] dark:hover:bg-[#36ADA3] dark:hover:text-[#FFFFFF] text-[10px] font-black rounded-xl transition-all text-[#232F72] dark:text-[#F1F5F9]"
                    >
                      Profil
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>

                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-[#2F578A] dark:text-[#F1F5F9]/70 font-extrabold">
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
