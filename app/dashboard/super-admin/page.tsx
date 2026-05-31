"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Building, 
  Briefcase, 
  FileCheck, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  Activity, 
  ArrowUpRight,
  Database,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ChevronRight,
  Server,
  Terminal,
  Filter
} from "lucide-react";

export default function SuperAdminDashboardHome() {
  // Stats filtering state
  const [selectedPeriod, setSelectedPeriod] = useState("Semester Genap 2025/2026");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // System diagnostic state
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<null | {
    status: string;
    dbStatus: string;
    serverLoad: string;
    time: string;
  }>(null);

  // In-memory mock data for pending partners that can be updated dynamically
  const [pendingPartners, setPendingPartners] = useState([
    { id: 1, name: "PT. Bukalapak.com Tbk", sector: "Teknologi & E-Commerce", slots: 8, logo: "BL", reqDate: "30 Mei 2026" },
    { id: 2, name: "PT. Bank Central Asia Tbk", sector: "Perbankan & Keuangan", slots: 15, logo: "BCA", reqDate: "28 Mei 2026" },
    { id: 3, name: "PT. Pertamina (Persero)", sector: "Energi & Sumber Daya", slots: 10, logo: "PERT", reqDate: "27 Mei 2026" }
  ]);

  // Approved count offset to demonstrate interactivity
  const [approvedCountOffset, setApprovedCountOffset] = useState(0);

  // Periods for the filter
  const periods = [
    "Semester Genap 2025/2026",
    "Semester Ganjil 2025/2026",
    "Semester Genap 2024/2025"
  ];

  // Run diagnostics simulation
  const handleRunDiagnostics = () => {
    setIsDiagnosticRunning(true);
    setDiagnosticResult(null);
    setTimeout(() => {
      setIsDiagnosticRunning(false);
      setDiagnosticResult({
        status: "Normal",
        dbStatus: "Terhubung (Ping: 4ms)",
        serverLoad: "14% CPU / 42% RAM",
        time: new Date().toLocaleTimeString("id-ID")
      });
    }, 1500);
  };

  // Approve a partner action
  const handleApprovePartner = (id: number, name: string) => {
    alert(`Mitra "${name}" berhasil disetujui dan diaktifkan di sistem!`);
    setPendingPartners(pendingPartners.filter(partner => partner.id !== id));
    setApprovedCountOffset(prev => prev + 1);
  };

  // Reject a partner action
  const handleRejectPartner = (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menolak pengajuan kerja sama dari "${name}"?`)) {
      setPendingPartners(pendingPartners.filter(partner => partner.id !== id));
    }
  };

  // Overall statistics
  const baseStats = {
    mahasiswa: 1248,
    mitra: 186,
    dosen: 94,
    program: 320,
    penyerapan: 82.5
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER CONTROLS ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#070e24]/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 glass-card">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Periode Aktif</span>
            <p className="text-sm font-extrabold text-slate-800 dark:text-white">{selectedPeriod}</p>
          </div>
        </div>

        {/* Filter Period Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="w-full sm:w-auto flex items-center justify-between gap-2.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" />
              Ganti Periode
            </span>
            <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${showFilterDropdown ? 'rotate-90' : ''}`} />
          </button>
          
          {showFilterDropdown && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowFilterDropdown(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#070e24] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-40 p-1.5 animate-float-none">
                {periods.map(period => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
                      selectedPeriod === period 
                        ? 'bg-rose-500 text-white' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-150 dark:hover:bg-slate-900'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* WELCOME BANNER CARD */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden shadow-xl shadow-slate-950/20 border border-slate-800/40">
        {/* Dynamic Spheres */}
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-rose-600/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-72 h-72 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-200 bg-rose-950/50 border border-rose-800 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-450 animate-pulse" />
              Super Admin • Kontrol Penuh Sistem
            </span>
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                Selamat Datang Kembali, Administrator!
              </h3>
              <p className="text-xs text-rose-200 mt-2 font-semibold leading-relaxed max-w-xl">
                Sistem manajemen magang <strong className="text-white">InternFlow</strong> berjalan dengan lancar. Anda memiliki hak akses penuh untuk mengelola mahasiswa, instansi mitra, dosen pembimbing, serta memantau analitik akademik secara real-time.
              </p>
            </div>
            
            {/* Quick Stats Summary Tags */}
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-rose-400" />
                Database: <strong className="text-white">Synced (99.9%)</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                Server Status: <strong className="text-emerald-400">Online</strong>
              </span>
            </div>
          </div>

          {/* Diagnostic Widget */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm text-center min-w-[240px]">
            <span className="text-[10px] font-black uppercase text-rose-300 tracking-wider">Kesehatan Infrastruktur</span>
            
            {isDiagnosticRunning ? (
              <div className="flex flex-col items-center justify-center py-4">
                <RefreshCw className="w-7 h-7 text-rose-400 animate-spin" />
                <span className="text-xs font-bold text-slate-300 mt-2">Menganalisis sistem...</span>
              </div>
            ) : diagnosticResult ? (
              <div className="mt-2 space-y-1.5 w-full text-left">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Status Server:</span>
                  <span className="font-bold text-emerald-400">{diagnosticResult.status}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Koneksi DB:</span>
                  <span className="font-bold text-white truncate max-w-[120px]">{diagnosticResult.dbStatus}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Beban Server:</span>
                  <span className="font-bold text-white">{diagnosticResult.serverLoad}</span>
                </div>
                <span className="text-[9px] text-slate-500 block text-center pt-1">
                  Terakhir dicek: {diagnosticResult.time}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-white mt-1">99.8%</span>
                <span className="text-[9px] font-bold text-emerald-400 mt-1.5 block">Uptime Server Bulan Ini</span>
              </div>
            )}
            
            <button
              onClick={handleRunDiagnostics}
              disabled={isDiagnosticRunning}
              className="mt-3.5 w-full py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-rose-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Server className="w-3.5 h-3.5" />
              {isDiagnosticRunning ? "Memproses..." : "Diagnosis Sistem"}
            </button>
          </div>
        </div>
      </div>

      {/* METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Mahasiswa */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Mahasiswa Terdaftar
            </span>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {baseStats.mahasiswa}
            </h4>
            <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 block pt-1">
              +12% dibanding semester lalu
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 border border-rose-200/20 shadow-sm">
            <Users className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Metric 2: Mitra Industri */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Mitra Perusahaan
            </span>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {baseStats.mitra + approvedCountOffset}
            </h4>
            <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 block pt-1">
              +{approvedCountOffset + 5} mitra baru aktif
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/20 shadow-sm">
            <Building className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Metric 3: Program Lowongan */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Lowongan Terbuka
            </span>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {baseStats.program}
            </h4>
            <span className="text-[9px] font-semibold text-violet-600 dark:text-violet-400 block pt-1">
              Kapasitas: 1,500+ mahasiswa
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-200/20 shadow-sm">
            <Briefcase className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Metric 4: Persentase Penyerapan */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Tingkat Penyerapan
            </span>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {baseStats.penyerapan}%
            </h4>
            <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400 block pt-1">
              Target penyerapan magang: 85%
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/20 shadow-sm">
            <TrendingUp className="w-5.5 h-5.5" />
          </div>
        </div>

      </div>

      {/* TWO PANEL CONTENT (MAIN ANALYTICS & INTERACTIVE PENDING LIST) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: SYSTEM USAGE & ACADEMIC STATISTICS (2 COLS on Large Screen) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Visual Stats Panel */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                  Analitik Keterlibatan Magang
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                  Distribusi Magang Berdasarkan Fakultas
                </h4>
              </div>
              <span className="text-xs text-rose-600 dark:text-rose-450 font-bold hover:underline cursor-pointer flex items-center gap-1">
                Selengkapnya
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Custom Visual Distribution Bars (No Chart library to keep it perfectly robust) */}
            <div className="space-y-4">
              
              {/* Fakultas 1 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-350">Fakultas Ilmu Komputer (FASILKOM)</span>
                  <span className="text-slate-900 dark:text-white">412 Mahasiswa (33%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-500 to-rose-650 h-full rounded-full" style={{ width: "33%" }}></div>
                </div>
              </div>

              {/* Fakultas 2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-350">Fakultas Teknik (FT)</span>
                  <span className="text-slate-900 dark:text-white">356 Mahasiswa (28.5%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-violet-600 h-full rounded-full" style={{ width: "28.5%" }}></div>
                </div>
              </div>

              {/* Fakultas 3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-350">Fakultas Ekonomi & Bisnis (FEB)</span>
                  <span className="text-slate-900 dark:text-white">285 Mahasiswa (22.8%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-650 h-full rounded-full" style={{ width: "22.8%" }}></div>
                </div>
              </div>

              {/* Fakultas 4 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-350">Fakultas Ilmu Sosial & Politik (FISIP)</span>
                  <span className="text-slate-900 dark:text-white">195 Mahasiswa (15.7%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-full rounded-full" style={{ width: "15.7%" }}></div>
                </div>
              </div>

            </div>

            {/* Quick Actions Shortcuts */}
            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/80">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block mb-3">
                Pintasan Navigasi Cepat
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link 
                  href="/dashboard/super-admin/pengguna"
                  className="p-3 bg-slate-50 dark:bg-slate-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-slate-200/60 dark:border-slate-800/60 hover:border-rose-300 dark:hover:border-rose-900/55 rounded-xl text-center transition-all duration-200 group"
                >
                  <Users className="w-5 h-5 mx-auto text-slate-500 dark:text-slate-400 group-hover:text-rose-500 mb-1.5 transition-colors" />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Tambah User</span>
                </Link>
                
                <Link 
                  href="/dashboard/super-admin/mitra"
                  className="p-3 bg-slate-50 dark:bg-slate-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-slate-200/60 dark:border-slate-800/60 hover:border-rose-300 dark:hover:border-rose-900/55 rounded-xl text-center transition-all duration-200 group"
                >
                  <Building className="w-5 h-5 mx-auto text-slate-500 dark:text-slate-400 group-hover:text-rose-500 mb-1.5 transition-colors" />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Daftar Mitra</span>
                </Link>

                <Link 
                  href="/dashboard/super-admin/persetujuan"
                  className="p-3 bg-slate-50 dark:bg-slate-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-slate-200/60 dark:border-slate-800/60 hover:border-rose-300 dark:hover:border-rose-900/55 rounded-xl text-center transition-all duration-200 group"
                >
                  <FileCheck className="w-5 h-5 mx-auto text-slate-500 dark:text-slate-400 group-hover:text-rose-500 mb-1.5 transition-colors" />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Verifikasi Berkas</span>
                </Link>

                <Link 
                  href="/dashboard/super-admin/pengaturan"
                  className="p-3 bg-slate-50 dark:bg-slate-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-slate-200/60 dark:border-slate-800/60 hover:border-rose-300 dark:hover:border-rose-900/55 rounded-xl text-center transition-all duration-200 group"
                >
                  <Database className="w-5 h-5 mx-auto text-slate-500 dark:text-slate-400 group-hover:text-rose-500 mb-1.5 transition-colors" />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Backup DB</span>
                </Link>
              </div>
            </div>

          </div>

          {/* System Audit Log */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-rose-500" />
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Audit Log & Aktivitas Sistem Terbaru
                </h4>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-500 dark:text-slate-400 flex items-center gap-1">
                Live Feed
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Log Item 1 */}
              <div className="flex gap-3 text-xs leading-normal items-start group">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full mt-1 border-2 border-white dark:border-[#070e24] shadow-sm flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-slate-700 dark:text-slate-350">
                    <strong className="text-slate-900 dark:text-white font-bold">Super Admin</strong> menyetujui aktivasi akun kerja sama untuk instansi <strong className="text-rose-600 dark:text-rose-400 font-semibold">PT. Shopee Internasional Indonesia</strong>.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">5 menit yang lalu • Web Dashboard</span>
                </div>
              </div>

              {/* Log Item 2 */}
              <div className="flex gap-3 text-xs leading-normal items-start group">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-1 border-2 border-white dark:border-[#070e24] shadow-sm flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-slate-700 dark:text-slate-350">
                    Mahasiswa <strong className="text-slate-900 dark:text-white font-bold">Farhan Ramadhan (NIM. 2201012015)</strong> berhasil memverifikasi presensi harian pada portal industri.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">24 menit yang lalu • App Mobile</span>
                </div>
              </div>

              {/* Log Item 3 */}
              <div className="flex gap-3 text-xs leading-normal items-start group">
                <span className="w-2.5 h-2.5 bg-violet-500 rounded-full mt-1 border-2 border-white dark:border-[#070e24] shadow-sm flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-slate-700 dark:text-slate-350">
                    Dosen Pembimbing <strong className="text-slate-900 dark:text-white font-bold">Dr. Rina Astuti</strong> mengubah parameter penilaian akhir mahasiswa program magang Fakultas Ekonomi.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">1 jam yang lalu • Web Portal</span>
                </div>
              </div>

              {/* Log Item 4 */}
              <div className="flex gap-3 text-xs leading-normal items-start group">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-1 border-2 border-white dark:border-[#070e24] shadow-sm flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-slate-700 dark:text-slate-350">
                    Sistem otomatis memperbarui status program magang 12 mahasiswa dari Fakultas Komputer menjadi <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Selesai (Sertifikat Siap)</strong>.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">3 jam yang lalu • Engine Cron Job</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ACTION REQUIRED & PENDING MITRA APPROVAL */}
        <div className="space-y-6">
          
          {/* Pending Mitra Request Card */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                Tindakan Diperlukan
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                Persetujuan Mitra Industri ({pendingPartners.length})
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-1 leading-normal">
                Instansi berikut mengajukan kolaborasi program magang dan memerlukan verifikasi kelayakan administratif sebelum dipublikasikan.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {pendingPartners.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Semua Beres!</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Tidak ada pengajuan mitra yang tertunda.</p>
                </div>
              ) : (
                pendingPartners.map(partner => (
                  <div key={partner.id} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl space-y-3.5 transition-all">
                    
                    <div className="flex items-center gap-3">
                      {/* Industrial Mock Logo */}
                      <div className="w-10 h-10 bg-gradient-to-tr from-slate-250 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-700 dark:text-slate-300 font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-inner">
                        {partner.logo}
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{partner.name}</h5>
                        <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 block mt-0.5">{partner.sector}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Diajukan: {partner.reqDate}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-xl text-[10px] font-bold">
                      <span className="text-slate-400">Kuota Lowongan:</span>
                      <span className="text-slate-800 dark:text-white">{partner.slots} Mahasiswa</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprovePartner(partner.id, partner.name)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Setujui
                      </button>
                      <button
                        onClick={() => handleRejectPartner(partner.id, partner.name)}
                        className="py-2 px-3 bg-slate-100 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl text-[10px] font-extrabold border border-transparent hover:border-red-200 dark:hover:border-red-900/40 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats Progress Card */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 shadow-sm space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
              Alur Penggunaan Kuota
            </span>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              Ketersediaan Kuota Magang
            </h4>
            
            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white">1,580</span>
                <span className="text-[10px] font-bold text-slate-450 block">Total Kuota Disediakan</span>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-900 border-t-rose-500 border-r-rose-500 flex items-center justify-center rotate-45">
                <span className="text-[10px] font-black text-rose-500 -rotate-45">78%</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-150 dark:border-slate-800/80 text-[11px] font-bold">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block"></span>
                  Terisi (Mahasiswa Aktif)
                </span>
                <span className="text-slate-900 dark:text-white">1,248</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-slate-700 inline-block"></span>
                  Sisa Kuota Kosong
                </span>
                <span className="text-slate-900 dark:text-white">332</span>
              </div>
            </div>

            <Link 
              href="/dashboard/super-admin/program"
              className="mt-2 w-full py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Atur Kuota Program</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
