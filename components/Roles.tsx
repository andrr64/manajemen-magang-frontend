"use client";

import { useState } from "react";
import { User, ShieldCheck, Briefcase, GraduationCap, CheckCircle2, ChevronRight } from "lucide-react";

type RoleType = "mahasiswa" | "dosen" | "mitra";

export default function Roles() {
  const [activeTab, setActiveTab] = useState<RoleType>("mahasiswa");

  const rolesContent = {
    mahasiswa: {
      badge: "Untuk Mahasiswa",
      title: "Wujudkan Potensi Terbaikmu di Dunia Kerja",
      description: "Nikmati kemudahan dalam menempuh program magang. Dari administrasi awal hingga laporan akhir, semua tersusun rapi untuk menunjang kariermu.",
      features: [
        "Akses lowongan magang eksklusif dari ratusan mitra resmi perguruan tinggi.",
        "Pengisian logbook harian instan dan absensi berbasis GPS / unggah foto bukti.",
        "Bimbingan laporan langsung dari aplikasi tanpa perlu bertatap muka fisik.",
        "Notifikasi status pendaftaran, persetujuan logbook, dan nilai secara real-time.",
      ],
      ctaText: "Daftar sebagai Mahasiswa",
      icon: GraduationCap,
      color: "indigo",
      bgGradient: "from-indigo-600 to-indigo-500",
      themeColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40",
    },
    dosen: {
      badge: "Untuk Dosen Pembimbing",
      title: "Monitoring Perkembangan Mahasiswa dengan Akurat",
      description: "Dukung bimbingan magang mahasiswa secara efektif. Lakukan pemantauan jurnal harian dan berikan penilaian kompetensi secara efisien.",
      features: [
        "Dashboard pantauan aktivitas logbook harian seluruh mahasiswa bimbingan.",
        "Pemberian feedback instan pada catatan laporan berkala mahasiswa.",
        "Rubrik penilaian akhir digital yang terintegrasi standar akademik kampus.",
        "Komunikasi terpusat dan tanda tangan berkas laporan secara elektronik.",
      ],
      ctaText: "Masuk Portal Dosen",
      icon: ShieldCheck,
      color: "violet",
      bgGradient: "from-violet-600 to-violet-500",
      themeColor: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40",
    },
    mitra: {
      badge: "Untuk Mitra Industri",
      title: "Temukan & Kembangkan Talenta Terbaik untuk Bisnis Anda",
      description: "Dapatkan akses langsung ke ribuan mahasiswa bertalenta siap kerja. Kelola rekrutmen magang dan evaluasi kinerja secara transparan.",
      features: [
        "Unggah lowongan magang, kualifikasi, dan benefit instansi dengan mudah.",
        "Seleksi berkas administrasi dan kelola penjadwalan interview langsung.",
        "Validasi absensi harian dan rekap performa mahasiswa magang.",
        "Pengisian lembar evaluasi kerja industri mahasiswa secara terstruktur.",
      ],
      ctaText: "Gabung Kemitraan",
      icon: Briefcase,
      color: "cyan",
      bgGradient: "from-cyan-600 to-cyan-500",
      themeColor: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40",
    },
  };

  const currentRole = rolesContent[activeTab];
  const ActiveIcon = currentRole.icon;

  return (
    <section id="peran" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute bottom-1/10 right-1/10 w-96 h-96 bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">
            Portal Peran
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Satu Sistem Terpadu untuk Tiga Aktor Utama
          </p>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
            Sinergi optimal antara akademisi dan industri untuk kelancaran program magang mahasiswa.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
            {(["mahasiswa", "dosen", "mitra"] as RoleType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md shadow-slate-200/50 dark:shadow-none"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab === "mahasiswa" && <GraduationCap className="w-4 h-4" />}
                {tab === "dosen" && <ShieldCheck className="w-4 h-4" />}
                {tab === "mitra" && <Briefcase className="w-4 h-4" />}
                <span className="capitalize">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800/80 transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Description Column (Left) */}
            <div className="lg:col-span-7">
              {/* Role Badge */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${currentRole.themeColor}`}>
                <ActiveIcon className="w-3.5 h-3.5" />
                <span>{currentRole.badge}</span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mb-4 leading-snug">
                {currentRole.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                {currentRole.description}
              </p>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {currentRole.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`p-0.5 rounded-full mt-1 ${currentRole.themeColor}`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div>
                <a
                  href={`#${activeTab}-register`}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-gradient-to-r ${currentRole.bgGradient} px-6 py-3.5 rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5`}
                >
                  {currentRole.ctaText}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Graphic/Visual Showcase (Right) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/85 p-6 flex flex-col justify-between overflow-hidden shadow-inner group">
                {/* Visual design elements */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${currentRole.bgGradient} opacity-5 rounded-bl-full pointer-events-none`} />

                {/* Simulated App Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentRole.bgGradient}`} />
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Dashboard Portal</span>
                  </div>
                  <div className="w-8 h-2 rounded bg-slate-200 dark:bg-slate-800" />
                </div>

                {/* Simulated App Body (Card content change depending on role) */}
                <div className="flex-1 py-6 flex flex-col gap-4 justify-center">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-transform duration-300 hover:scale-[1.03]">
                    <div className={`p-2 rounded-lg ${currentRole.themeColor}`}>
                      <ActiveIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="w-20 h-2 bg-slate-300 dark:bg-slate-700 rounded mb-1.5" />
                      <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-transform duration-300 hover:scale-[1.03]">
                    <div className={`p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="w-28 h-2 bg-slate-300 dark:bg-slate-700 rounded mb-1.5" />
                      <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                </div>

                {/* Simulated App Footer */}
                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  <span>STATUS: ELEGAN</span>
                  <span className="uppercase text-indigo-500">{activeTab} mode</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
