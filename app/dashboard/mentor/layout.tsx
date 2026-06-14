"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";
import MentorSidebar from "@/components/mentor-sidebar";

import { RoleGuard } from "@/modules/iam/guards";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  // Ambil Judul Halaman secara dinamis dari pathname
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard/mentor":
        return "Dashboard";
      case "/dashboard/mentor/data-mahasiswa":
        return "Data Mahasiswa";
      case "/dashboard/mentor/data-absensi":
        return "Data Absensi";
      case "/dashboard/mentor/data-kegiatan":
        return "Data Kegiatan";
      case "/dashboard/mentor/logbook":
        return "Logbook Mingguan";
      case "/dashboard/mentor/jadwal":
        return "Jadwal Bimbingan";
      case "/dashboard/mentor/penilaian":
        return "Penilaian Magang";
      case "/dashboard/mentor/sertifikat":
        return "Sertifikat Magang";
      case "/dashboard/mentor/surat-keterangan":
        return "Surat Keterangan Magang";
      case "/dashboard/mentor/profil":
        return "Profil Saya";
      default:
        return "Mentor Dashboard";
    }
  };

  // Notifikasi dummy
  const notifications = [
    { id: 1, text: "Budi Santoso mengunggah logbook minggu ke-8.", time: "10 mnt yang lalu", unread: true },
    { id: 2, text: "Amanda Putri memperbarui profil perusahaan magang.", time: "1 jam yang lalu", unread: true },
    { id: 3, text: "Pengingat: Batas pengisian nilai akhir magang adalah 10 Juni.", time: "1 hari yang lalu", unread: false }
  ];

  return (
    <RoleGuard allowedRoles={["mentor"]}>
      <div className="h-screen w-full bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-slate-100 flex relative overflow-hidden">
        
        {/* BACKGROUND DECORATIONS (GLOWING EFFECTS) */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

        {/* MOBILE SIDEBAR OVERLAY */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR ON LEFT */}
        <aside 
          className={`fixed md:sticky top-0 left-0 bottom-0 w-72 h-screen bg-white dark:bg-[#070e24] border-r border-slate-200 dark:border-slate-800/80 z-50 flex flex-col transition-transform duration-300 md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <MentorSidebar onClose={() => setIsSidebarOpen(false)} />
        </aside>

        {/* MAIN CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0 h-screen relative z-10 overflow-y-auto">
          
          {/* HEADER BAR */}
          <header className="sticky top-0 bg-white/80 dark:bg-[#030712]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between z-30">
            <div className="flex items-center gap-4">
              <button 
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 md:hidden transition-colors"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="font-extrabold text-lg md:text-xl text-slate-900 dark:text-white">
                  {getPageTitle()}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Tahun Akademik: 2025/2026 • Semester Genap
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar (Desktop Only) */}
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Cari sesuatu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              </div>

              {/* Notifications Popover */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 relative transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse"></span>
                </button>

                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#070e24] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-40 p-4 animate-float">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <h5 className="font-bold text-xs">Pemberitahuan Terbaru</h5>
                        <button className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                          Tandai sudah dibaca
                        </button>
                      </div>
                      <div className="space-y-3">
                        {notifications.map(notif => (
                          <div key={notif.id} className="flex gap-2.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40 p-1.5 rounded-lg transition-colors">
                            <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.unread ? 'bg-indigo-500' : 'bg-transparent'}`} />
                            <div className="overflow-hidden">
                              <p className="leading-normal font-medium">{notif.text}</p>
                              <span className="text-[9px] text-slate-400 mt-1 block">{notif.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Role Badge */}
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 p-6 space-y-6">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
