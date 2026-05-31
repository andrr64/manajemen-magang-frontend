import { BookOpen, ClipboardCheck, Briefcase, MessageSquare } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Briefcase,
      title: "Pendaftaran Praktis",
      description: "Cari lowongan magang dari berbagai mitra industri terpercaya, unggah berkas, dan ajukan lamaran dalam satu dashboard terpusat.",
      colorClass: "from-blue-500 to-indigo-500",
      bgColorClass: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
    },
    {
      icon: ClipboardCheck,
      title: "Logbook & Presensi",
      description: "Catat jurnal aktivitas harian secara terstruktur lengkap dengan dokumentasi kegiatan, serta verifikasi kehadiran real-time.",
      colorClass: "from-emerald-500 to-teal-500",
      bgColorClass: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: MessageSquare,
      title: "Bimbingan Online",
      description: "Komunikasi berkala dengan Dosen Pembimbing mengenai kemajuan magang, asistensi penyusunan laporan, dan koordinasi terarah.",
      colorClass: "from-violet-500 to-purple-500",
      bgColorClass: "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400",
    },
    {
      icon: BookOpen,
      title: "Evaluasi & Nilai",
      description: "Sistem penilaian transparan berdasarkan rubrik instansi mitra dan perguruan tinggi, lengkap dengan sertifikat kelulusan digital.",
      colorClass: "from-cyan-500 to-sky-500",
      bgColorClass: "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400",
    },
  ];

  return (
    <section id="fitur" className="py-20 bg-slate-50 dark:bg-slate-900/30 relative">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/5 dark:bg-indigo-500/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">
            Fitur Utama
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
            Segala Kebutuhan Manajemen Magang dalam Satu Aplikasi
          </p>
          <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-600 to-cyan-500 mx-auto mt-5 rounded-full" />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative glass-card p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 dark:border-slate-800/80"
              >
                {/* Accent line on top of card on hover */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r ${feature.colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Icon Container */}
                <div className={`inline-flex p-4 rounded-2xl ${feature.bgColorClass} mb-6 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
