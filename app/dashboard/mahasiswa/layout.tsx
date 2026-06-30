"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import MahasiswaSidebar from "@/components/mahasiswa-sidebar";

import { RoleGuard } from "@/modules/iam/guards";

export default function MahasiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Get Page Title dynamically
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard/mahasiswa":
        return "Dashboard Mahasiswa";
      case "/dashboard/mahasiswa/absensi":
        return "Absensi Harian";
      case "/dashboard/mahasiswa/absensi/rekap":
        return "Rekap Absensi";
      case "/dashboard/mahasiswa/kegiatan":
        return "Kegiatan Harian";
      case "/dashboard/mahasiswa/logbook":
        return "Logbook Mingguan";
      case "/dashboard/mahasiswa/penilaian":
        return "Penilaian Magang";
      case "/dashboard/mahasiswa/sertifikat":
        return "Sertifikat Magang";
      case "/dashboard/mahasiswa/surat-keterangan":
        return "Surat Keterangan Magang";
      case "/dashboard/mahasiswa/profil":
        return "Profil Saya";
      default:
        return "Student Dashboard";
    }
  };



  return (
    <RoleGuard allowedRoles={["mahasiswa"]}>
      <div className="h-screen w-full bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-slate-100 flex relative overflow-hidden">
        
        {/* BACKGROUND DECORATIONS (GLOWING EFFECTS) */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

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
          <MahasiswaSidebar onClose={() => setIsSidebarOpen(false)} />
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

              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Header Right Items Removed */}
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

