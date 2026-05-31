import { ArrowRight, Sparkles, Users, Building2, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="beranda"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern"
    >
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-indigo-500/15 dark:bg-indigo-500/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
      <div className="absolute top-1/3 right-1/10 w-80 h-80 bg-cyan-500/15 dark:bg-cyan-500/10 rounded-full blur-[120px] animate-float pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-6 animate-float">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Sistem Informasi Manajemen Magang #1</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-8 leading-[1.15]">
            Transformasi Pengalaman Magang
            <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              Lebih Cerdas & Terintegrasi
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Menghubungkan Mahasiswa, Dosen Pembimbing, dan Mitra Industri dalam satu platform digital. 
            Kelola logbook harian, bimbingan berkala, hingga evaluasi akhir secara praktis.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#daftar"
              className="flex items-center gap-2 w-full sm:w-auto justify-center text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Mulai Sekarang
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#alur"
              className="flex items-center justify-center w-full sm:w-auto text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-200 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
            >
              Pelajari Alur
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Card 1 */}
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-950 dark:text-white">1,500+</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Mahasiswa Aktif</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-3 rounded-xl bg-cyan-550/10 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-950 dark:text-white">85+</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Mitra Kerja Sama</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-950 dark:text-white">96%</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Kepuasan Pengguna</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
