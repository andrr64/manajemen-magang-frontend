import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8 relative overflow-hidden">
      {/* Visual glowing effects */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-600/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Intern<span className="text-indigo-400">Flow</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Sistem Informasi Manajemen Magang terpadu untuk mempermudah kolaborasi sinergis antara Mahasiswa, Dosen Pembimbing, dan Mitra Kerja Sama Industri.
            </p>
            {/* Socials */}
            <div className="flex items-center space-x-3.5 pt-2">
              <a
                href="#facebook"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#twitter"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="#linkedin"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="#github"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Column 1: Fitur (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Akses Portal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#mahasiswa-register" className="hover:text-indigo-400 transition-colors">
                  Portal Mahasiswa
                </a>
              </li>
              <li>
                <a href="#dosen-register" className="hover:text-indigo-400 transition-colors">
                  Portal Dosen
                </a>
              </li>
              <li>
                <a href="#mitra-register" className="hover:text-indigo-400 transition-colors">
                  Portal Mitra Industri
                </a>
              </li>
              <li>
                <a href="#admin" className="hover:text-indigo-400 transition-colors">
                  Akses Administrator
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Navigasi (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#beranda" className="hover:text-indigo-400 transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#fitur" className="hover:text-indigo-400 transition-colors">
                  Fitur Utama
                </a>
              </li>
              <li>
                <a href="#peran" className="hover:text-indigo-400 transition-colors">
                  Portal Peran
                </a>
              </li>
              <li>
                <a href="#alur" className="hover:text-indigo-400 transition-colors">
                  Alur Program
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-indigo-400 transition-colors">
                  Tanya Jawab
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Kontak & Alamat</h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Gedung Rektorat Kampus Pusat, Jl. Pendidikan No. 45, Jakarta Selatan, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span>+62 (21) 7890-1234</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span>support@internflow.ac.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} InternFlow. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#privacy" className="hover:text-indigo-400 transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#terms" className="hover:text-indigo-400 transition-colors">
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
