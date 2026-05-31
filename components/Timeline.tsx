import { Search, UserCheck, CalendarDays, BookHeart, Award } from "lucide-react";

export default function Timeline() {
  const steps = [
    {
      num: "01",
      icon: Search,
      title: "Pendaftaran & Seleksi",
      description: "Mahasiswa melamar posisi magang yang tersedia di portal mitra industri resmi.",
      color: "from-blue-500 to-indigo-500",
    },
    {
      num: "02",
      icon: UserCheck,
      title: "Persetujuan & Dosen",
      description: "Persetujuan koordinator magang dan penetapan dosen pembimbing akademik.",
      color: "from-indigo-500 to-violet-500",
    },
    {
      num: "03",
      icon: CalendarDays,
      title: "Pelaksanaan & Logbook",
      description: "Menjalani magang sambil mencatat presensi dan logbook aktivitas harian digital.",
      color: "from-violet-500 to-purple-500",
    },
    {
      num: "04",
      icon: BookHeart,
      title: "Bimbingan Berkala",
      description: "Asistensi laporan berkala secara daring bersama dosen pembimbing akademik.",
      color: "from-purple-500 to-cyan-500",
    },
    {
      num: "05",
      icon: Award,
      title: "Penilaian & Sertifikat",
      description: "Evaluasi kompetensi industri, penilaian laporan, dan unduh sertifikat resmi.",
      color: "from-cyan-500 to-teal-500",
    },
  ];

  return (
    <section id="alur" className="py-20 bg-slate-50 dark:bg-slate-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">
            Alur Program
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            5 Langkah Mudah Pelaksanaan Magang
          </p>
          <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-600 to-cyan-500 mx-auto mt-5 rounded-full" />
        </div>

        {/* Timeline Layout */}
        <div className="relative mt-12 max-w-5xl mx-auto">
          {/* Central Line for desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 transform -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-16">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`flex flex-col lg:flex-row items-center relative ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Visual Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-20 hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-slate-950 border-4 border-slate-100 dark:border-slate-800 shadow-md">
                    <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${step.color} animate-pulse-slow`} />
                  </div>

                  {/* Empty Spacer Column for Desktop */}
                  <div className="w-full lg:w-1/2" />

                  {/* Content Column */}
                  <div className="w-full lg:w-1/2 px-4 sm:px-8">
                    <div className="glass-card p-8 rounded-3xl relative shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 dark:border-slate-800/80">
                      {/* Step Number Badge */}
                      <span className={`absolute top-6 right-8 text-3xl font-black bg-gradient-to-br ${step.color} bg-clip-text text-transparent opacity-30 select-none`}>
                        {step.num}
                      </span>

                      {/* Header Content */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-r ${step.color} text-white shadow-md`}>
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white">
                          {step.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
