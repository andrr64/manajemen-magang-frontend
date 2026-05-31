"use client";
 
import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Shield, 
  Users, 
  CheckCircle, 
  Award,
  Calendar,
  Lock,
  Bookmark,
  ChevronRight
} from "lucide-react";
 
export default function MentorProfilePage() {
  // Live State with Dummy Data
  const [profile, setProfile] = useState({
    name: "Dr. Ahmad Hidayat, M.T.",
    email: "ahmad.hidayat@lecturer.ac.id",
    phone: "+62 812-3456-7890",
    status: "MENTOR"
  });
 
  // Temporary form state
  const [formData, setFormData] = useState({ ...profile });
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate premium API saving
    setTimeout(() => {
      setProfile({ ...formData });
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }, 1000);
  };
 
  return (
    <div className="space-y-6 relative pb-10">
      
      {/* GLOWING FLOATING TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-50 p-4 bg-emerald-550 dark:bg-[#062419] border border-emerald-450 dark:border-emerald-800 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-float max-w-sm">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xs font-black block">Pembaruan Sukses</span>
            <span className="text-[10px] opacity-90 font-bold block mt-0.5">Profil Anda berhasil diperbarui di sistem!</span>
          </div>
        </div>
      )}
 
      {/* STUNNING TOP PROFILE HERO BANNER */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0d1637] via-[#102058] to-[#091129] border border-slate-200/20 dark:border-slate-800/40 p-6 md:p-8 text-white overflow-hidden shadow-xl shadow-indigo-950/10">
        {/* Abstract Glowing Spheres */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[70px] pointer-events-none" />
 
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-2xl blur-sm opacity-60 animate-pulse" />
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-white font-extrabold text-2xl shadow-inner">
                {profile.name.split(" ").map(n=>n[0]).join("").substring(0, 2)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Verified Mentor
                </span>
              </div>
              <h3 className="text-lg md:text-2xl font-black tracking-tight mt-2 leading-tight">
                {profile.name}
              </h3>
            </div>
          </div>
 
        </div>
      </div>
 
      {/* MAIN LAYOUT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT CARD: HIGH-END PREVIEW CARD (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#070e24]/40 relative overflow-hidden space-y-6">
            
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
 
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-indigo-500" />
                Kartu Identitas Mentor
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/20" title="Koneksi Aman" />
            </div>
 
            {/* Visual Lists */}
            <div className="space-y-4">
              
              {/* Field: NAMA */}
              <div className="group relative p-3 bg-slate-50 hover:bg-slate-100/50 dark:bg-[#070e24]/60 dark:hover:bg-[#0a1538]/60 border border-slate-200/40 dark:border-slate-850 rounded-2xl flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl transition-colors duration-300">
                  <User className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold block uppercase tracking-wider">Nama Lengkap</span>
                  <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 leading-snug">{profile.name}</p>
                </div>
              </div>
 
              {/* Field: EMAIL */}
              <div className="group relative p-3 bg-slate-50 hover:bg-slate-100/50 dark:bg-[#070e24]/60 dark:hover:bg-[#0a1538]/60 border border-slate-200/40 dark:border-slate-850 rounded-2xl flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
                <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 rounded-xl transition-colors duration-300">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold block uppercase tracking-wider">Alamat Email</span>
                  <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 truncate leading-snug">{profile.email}</p>
                </div>
              </div>
 
              {/* Field: NO TELP */}
              <div className="group relative p-3 bg-slate-50 hover:bg-slate-100/50 dark:bg-[#070e24]/60 dark:hover:bg-[#0a1538]/60 border border-slate-200/40 dark:border-slate-850 rounded-2xl flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl transition-colors duration-300">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold block uppercase tracking-wider">Nomor Telepon</span>
                  <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 leading-snug">{profile.phone}</p>
                </div>
              </div>
 
              {/* Field: STATUS */}
              <div className="group relative p-3 bg-slate-50 hover:bg-slate-100/50 dark:bg-[#070e24]/60 dark:hover:bg-[#0a1538]/60 border border-slate-200/40 dark:border-slate-850 rounded-2xl flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
                <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl transition-colors duration-300">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold block uppercase tracking-wider">STATUS</span>
                  <p className="font-black text-indigo-650 dark:text-indigo-400 mt-0.5 leading-snug tracking-wider">{profile.status}</p>
                </div>
              </div>
 
            </div>
 
          </div>
 
        </div>
 
        {/* RIGHT CARD: POLISHED INTERACTIVE FORM (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#070e24]/40 space-y-6">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Ubah Profil Mentor
              </h4>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-bold text-slate-600 dark:text-slate-400">
              
              {/* Form Input: NAMA */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Nama Lengkap & Gelar Akademik <span className="text-rose-500">*</span>
                </label>
                <div className="relative group/input">
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                    placeholder="Masukkan nama lengkap beserta gelar..."
                  />
                  <User className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-4 group-focus-within/input:text-indigo-500 transition-colors" />
                </div>
              </div>
 
              {/* Form Input: EMAIL */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Alamat Email Kampus Resmi <span className="text-rose-500">*</span>
                </label>
                <div className="relative group/input">
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                    placeholder="Masukkan alamat email resmi..."
                  />
                  <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-4 group-focus-within/input:text-indigo-500 transition-colors" />
                </div>
              </div>
 
              {/* Form Input: NO TELP */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Nomor Handphone / WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                <div className="relative group/input">
                  <input 
                    type="text" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                    placeholder="Masukkan nomor handphone..."
                  />
                  <Phone className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-4 group-focus-within/input:text-indigo-500 transition-colors" />
                </div>
              </div>
 
              {/* Form Input: STATUS (Locked / Disabled) */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Status Pengguna Pembimbing (Role)
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    disabled
                    value={formData.status}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-850 rounded-2xl text-xs focus:outline-none dark:text-slate-450 cursor-not-allowed font-extrabold tracking-wider"
                  />
                  <Shield className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-4" />
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/80 rounded-2xl flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[9.5px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
                    Kolom status otorisasi dikunci demi keamanan otentikasi. Silakan ajukan permohonan ke Admin Fakultas apabila ingin merubah hak akses pembimbing Anda.
                  </p>
                </div>
              </div>
 
              {/* Actions & Submit */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-500/70 text-white font-black rounded-2xl shadow-lg shadow-indigo-650/15 hover:shadow-indigo-650/25 transition-all text-xs flex items-center gap-2 cursor-pointer active:scale-95 hover:scale-[1.01]"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Menyimpan Perubahan...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 font-black" />
                      Simpan Perubahan Profil
                    </>
                  )}
                </button>
              </div>
 
            </form>
 
          </div>
        </div>
 
      </div>
 
    </div>
  );
}
