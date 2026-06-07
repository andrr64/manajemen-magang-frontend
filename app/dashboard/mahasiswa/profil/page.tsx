"use client";

import { useState, useEffect } from "react";
import { useIam } from "@/modules/iam/hooks";
import { 
  User, 
  Mail, 
  Phone, 
  Check, 
  Sparkles, 
  Shield, 
  BookOpen, 
  Bookmark, 
  Building, 
  MapPin, 
  GraduationCap 
} from "lucide-react";

export default function StudentProfilePage() {
  const { user, updateProfile } = useIam();

  const [profile, setProfile] = useState({
    name: "Loading...",
    nim: "-",
    email: "Loading...",
    phone: "-",
    role: "Loading..."
  });

  const [formData, setFormData] = useState({ ...profile });
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.nama || "",
        nim: user.nim || "-",
        email: user.email || "",
        phone: user.noHp || "",
        role: user.role || "Mahasiswa"
      };
      setProfile(userData);
      setFormData(userData);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateProfile({
        nama: formData.name,
        email: formData.email,
        noHp: formData.phone
      });
      setProfile({ ...formData });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 relative pb-10">
      
      {/* GLOWING FLOATING TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-50 p-4 bg-emerald-550 dark:bg-[#062419] border border-emerald-450 dark:border-emerald-850 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-float max-w-sm">
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
      <div className="relative rounded-3xl bg-gradient-to-r from-violet-950 via-indigo-900 to-[#091129] border border-slate-200/20 dark:border-slate-800/40 p-6 md:p-8 text-white overflow-hidden shadow-xl">
        {/* Abstract Glowing Spheres */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[70px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-violet-500 to-indigo-400 rounded-2xl blur-sm opacity-60 animate-pulse" />
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-white font-extrabold text-2xl shadow-inner">
                {profile.name.split(" ").map(n=>n[0]).join("").substring(0, 2)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] uppercase font-black tracking-widest text-violet-300 bg-violet-900/60 border border-violet-750 px-2.5 py-1 rounded-lg">
                  Mahasiswa Magang
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Verified Intern
                </span>
              </div>
              <h3 className="text-lg md:text-2xl font-black tracking-tight mt-2 leading-tight">
                {profile.name}
              </h3>
              <p className="text-xs text-violet-200 leading-normal font-semibold mt-1 opacity-90">
                NIM. {profile.nim}
              </p>
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
                <Bookmark className="w-4 h-4 text-violet-500" />
                Kartu Identitas Mahasiswa
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/20" title="Koneksi Aman" />
            </div>

            {/* Visual Lists */}
            <div className="space-y-4">
              
              {/* Field: NAMA */}
              <div className="group relative p-3 bg-slate-50 hover:bg-slate-100/50 dark:bg-[#070e24]/60 dark:hover:bg-[#0a1538]/60 border border-slate-200/40 dark:border-slate-850 rounded-2xl flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
                <div className="p-2.5 bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 rounded-xl transition-colors duration-300">
                  <User className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 font-extrabold block uppercase tracking-wider">Nama Lengkap</span>
                  <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 leading-snug truncate">{profile.name}</p>
                </div>
              </div>

              {/* Field: EMAIL */}
              <div className="group relative p-3 bg-slate-50 hover:bg-slate-100/50 dark:bg-[#070e24]/60 dark:hover:bg-[#0a1538]/60 border border-slate-200/40 dark:border-slate-850 rounded-2xl flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
                <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 rounded-xl transition-colors duration-300">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 font-extrabold block uppercase tracking-wider">Alamat Email</span>
                  <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 truncate leading-snug">{profile.email}</p>
                </div>
              </div>

              {/* Field: NO TELP */}
              <div className="group relative p-3 bg-slate-50 hover:bg-slate-100/50 dark:bg-[#070e24]/60 dark:hover:bg-[#0a1538]/60 border border-slate-200/40 dark:border-slate-850 rounded-2xl flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl transition-colors duration-300">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 font-extrabold block uppercase tracking-wider">Nomor Telepon</span>
                  <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 leading-snug">{profile.phone}</p>
                </div>
              </div>

              {/* Field: ROLE */}
              <div className="group relative p-3 bg-slate-50 hover:bg-slate-100/50 dark:bg-[#070e24]/60 dark:hover:bg-[#0a1538]/60 border border-slate-200/40 dark:border-slate-850 rounded-2xl flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
                <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl transition-colors duration-300">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 font-extrabold block uppercase tracking-wider">Status Otorisasi (Role)</span>
                  <p className="font-black text-violet-650 dark:text-violet-400 mt-0.5 leading-snug tracking-wider">{profile.role}</p>
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
                <Sparkles className="w-4 h-4 text-violet-500" />
                Ubah Profil Mahasiswa
              </h4>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-bold text-slate-600 dark:text-slate-400">
              
              {/* Form Input: NAMA */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Nama Lengkap Mahasiswa <span className="text-rose-500">*</span>
                </label>
                <div className="relative group/input">
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                    placeholder="Masukkan nama lengkap Anda..."
                  />
                  <User className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-4 group-focus-within/input:text-violet-500 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Form Input: EMAIL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    Alamat Email Mahasiswa <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group/input">
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                      placeholder="Masukkan alamat email resmi..."
                    />
                    <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-4 group-focus-within/input:text-violet-500 transition-colors" />
                  </div>
                </div>

                {/* Form Input: NO TELP */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    Nomor Telepon Aktif (WhatsApp) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group/input">
                    <input 
                      type="text" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                      placeholder="Masukkan nomor handphone..."
                    />
                    <Phone className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-4 group-focus-within/input:text-violet-500 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* NIM (Locked) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-550 flex items-center gap-1">
                    NIM Mahasiswa (Terkunci)
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      disabled
                      value={formData.nim}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-850 rounded-2xl text-xs focus:outline-none dark:text-slate-450 cursor-not-allowed font-extrabold tracking-wider"
                    />
                    <BookOpen className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-4" />
                  </div>
                </div>

                {/* Role (Locked) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-550 flex items-center gap-1">
                    Status Keanggotaan (Role)
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      disabled
                      value={formData.role}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-850 rounded-2xl text-xs focus:outline-none dark:text-slate-450 cursor-not-allowed font-extrabold"
                    />
                    <Shield className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-4" />
                  </div>
                </div>
              </div>

              {/* Actions & Submit */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-500/70 text-white font-black rounded-2xl shadow-lg shadow-violet-650/15 hover:shadow-violet-650/25 transition-all text-xs flex items-center gap-2 cursor-pointer active:scale-95 hover:scale-[1.01]"
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
