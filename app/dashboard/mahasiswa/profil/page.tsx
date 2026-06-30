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
  GraduationCap,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { SuccessToast } from "@/components/shared";

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
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
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
        noHp: formData.phone,
        oldPassword: oldPassword || undefined,
        newPassword: newPassword || undefined
      });
      setProfile({ ...formData });
      setOldPassword("");
      setNewPassword("");
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
      <SuccessToast variant="mahasiswa" show={showToast} message="Profil Anda berhasil diperbarui di sistem!" title="Pembaruan Sukses" />

      {/* STUNNING TOP PROFILE HERO BANNER */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#232F72] via-[#121358] to-[#121358] border-2 border-[#2F578A]/30 dark:border-[#2F578A]/50 p-6 md:p-8 text-white overflow-hidden shadow-xl shadow-[#121358]/20">
        {/* Abstract Glowing Spheres */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#36ADA3]/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-64 h-64 bg-[#2F578A]/20 rounded-full blur-[70px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#36ADA3] to-[#2F578A] rounded-2xl blur-sm opacity-60 animate-pulse" />
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#232F72] border-2 border-[#36ADA3]/30 flex items-center justify-center text-white font-extrabold text-2xl shadow-inner">
                {profile.name.split(" ").map(n=>n[0]).join("").substring(0, 2)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] uppercase font-black tracking-widest text-[#36ADA3] bg-[#36ADA3]/10 border-2 border-[#36ADA3]/20 px-2.5 py-1 rounded-lg">
                  Mahasiswa Magang
                </span>
              </div>
              <h3 className="text-lg md:text-2xl font-black tracking-tight mt-2 leading-tight text-white">
                {profile.name}
              </h3>
              <p className="text-xs text-[#F1F5F9]/80 leading-normal font-semibold mt-1">
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
          
          <div className="border-2 border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#121358] relative overflow-hidden space-y-6">
            
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#36ADA3]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#2F578A]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3.5 border-b border-[#2F578A]/20 dark:border-[#2F578A]/40">
              <span className="text-xs font-black text-[#232F72] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-[#36ADA3]" />
                Kartu Identitas Mahasiswa
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/20" title="Koneksi Aman" />
            </div>

            {/* Visual Lists */}
            <div className="space-y-4">
              
              {/* Field: NAMA */}
              <div className="group relative p-3 bg-[#F8FAFC] hover:bg-[#2F578A]/5 dark:bg-[#232F72]/30 dark:hover:bg-[#232F72]/50 border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-2xl flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
                <div className="p-2.5 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl transition-colors duration-300 border-2 border-[#36ADA3]/20">
                  <User className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/60 font-extrabold block uppercase tracking-wider">Nama Lengkap</span>
                  <p className="font-extrabold text-[#232F72] dark:text-white mt-0.5 leading-snug truncate">{profile.name}</p>
                </div>
              </div>

              {/* Field: EMAIL */}
              <div className="group relative p-3 bg-[#F8FAFC] hover:bg-[#2F578A]/5 dark:bg-[#232F72]/30 dark:hover:bg-[#232F72]/50 border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-2xl flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
                <div className="p-2.5 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl transition-colors duration-300 border-2 border-[#36ADA3]/20">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/60 font-extrabold block uppercase tracking-wider">Alamat Email</span>
                  <p className="font-extrabold text-[#232F72] dark:text-white mt-0.5 truncate leading-snug">{profile.email}</p>
                </div>
              </div>

              {/* Field: NO TELP */}
              <div className="group relative p-3 bg-[#F8FAFC] hover:bg-[#2F578A]/5 dark:bg-[#232F72]/30 dark:hover:bg-[#232F72]/50 border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-2xl flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
                <div className="p-2.5 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl transition-colors duration-300 border-2 border-[#36ADA3]/20">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/60 font-extrabold block uppercase tracking-wider">Nomor Telepon</span>
                  <p className="font-extrabold text-[#232F72] dark:text-white mt-0.5 leading-snug">{profile.phone}</p>
                </div>
              </div>

              {/* Field: ROLE */}
              <div className="group relative p-3 bg-[#F8FAFC] hover:bg-[#2F578A]/5 dark:bg-[#232F72]/30 dark:hover:bg-[#232F72]/50 border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-2xl flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
                <div className="p-2.5 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl transition-colors duration-300 border-2 border-[#36ADA3]/20">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/60 font-extrabold block uppercase tracking-wider">Status Otorisasi (Role)</span>
                  <p className="font-black text-[#36ADA3] mt-0.5 leading-snug tracking-wider">{profile.role}</p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT CARD: POLISHED INTERACTIVE FORM (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="border-2 border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#121358] space-y-6">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-[#2F578A]/20 dark:border-[#2F578A]/40">
              <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#36ADA3]" />
                Ubah Profil Mahasiswa
              </h4>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-bold text-[#232F72] dark:text-[#F1F5F9]/80">
              
              {/* Form Input: NAMA */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-[#2F578A] dark:text-[#F1F5F9]/60 flex items-center gap-1">
                  Nama Lengkap Mahasiswa <span className="text-rose-500">*</span>
                </label>
                <div className="relative group/input">
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] focus:bg-white dark:bg-[#232F72]/30 border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 focus:border-[#36ADA3] focus:ring-1 focus:ring-[#36ADA3] rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                    placeholder="Masukkan nama lengkap Anda..."
                  />
                  <User className="w-4.5 h-4.5 text-[#2F578A] dark:text-[#F1F5F9]/50 absolute left-4 top-4 group-focus-within/input:text-[#36ADA3] transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Form Input: EMAIL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase text-[#2F578A] dark:text-[#F1F5F9]/60 flex items-center gap-1">
                    Alamat Email Mahasiswa <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group/input">
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] focus:bg-white dark:bg-[#232F72]/30 border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 focus:border-[#36ADA3] focus:ring-1 focus:ring-[#36ADA3] rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                      placeholder="Masukkan alamat email resmi..."
                    />
                    <Mail className="w-4.5 h-4.5 text-[#2F578A] dark:text-[#F1F5F9]/50 absolute left-4 top-4 group-focus-within/input:text-[#36ADA3] transition-colors" />
                  </div>
                </div>

                {/* Form Input: NO TELP */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase text-[#2F578A] dark:text-[#F1F5F9]/60 flex items-center gap-1">
                    Nomor Telepon Aktif (WhatsApp) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group/input">
                    <input 
                      type="text" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] focus:bg-white dark:bg-[#232F72]/30 border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 focus:border-[#36ADA3] focus:ring-1 focus:ring-[#36ADA3] rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                      placeholder="Masukkan nomor handphone..."
                    />
                    <Phone className="w-4.5 h-4.5 text-[#2F578A] dark:text-[#F1F5F9]/50 absolute left-4 top-4 group-focus-within/input:text-[#36ADA3] transition-colors" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* NIM (Locked) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase text-[#2F578A] dark:text-[#F1F5F9]/60 flex items-center gap-1">
                    NIM Mahasiswa (Terkunci)
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      disabled
                      value={formData.nim}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-[#232F72]/50 border-2 border-[#2F578A]/10 dark:border-[#2F578A]/30 rounded-2xl text-xs focus:outline-none dark:text-[#F1F5F9]/40 cursor-not-allowed font-extrabold tracking-wider"
                    />
                    <BookOpen className="w-4.5 h-4.5 text-[#2F578A] dark:text-[#F1F5F9]/40 absolute left-4 top-4" />
                  </div>
                </div>

                {/* Role (Locked) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase text-[#2F578A] dark:text-[#F1F5F9]/60 flex items-center gap-1">
                    Status Keanggotaan (Role)
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      disabled
                      value={formData.role}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-[#232F72]/50 border-2 border-[#2F578A]/10 dark:border-[#2F578A]/30 rounded-2xl text-xs focus:outline-none dark:text-[#F1F5F9]/40 cursor-not-allowed font-extrabold"
                    />
                    <Shield className="w-4.5 h-4.5 text-[#2F578A] dark:text-[#F1F5F9]/40 absolute left-4 top-4" />
                  </div>
                </div>
              </div>

              {/* Password Change Section */}
              <div className="pt-4 border-t border-[#2F578A]/20 dark:border-[#2F578A]/40 space-y-4">
                <p className="text-[10px] font-extrabold uppercase text-[#2F578A] dark:text-[#F1F5F9]/60 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#36ADA3]" />
                  Ubah Password (Opsional)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase text-[#2F578A] dark:text-[#F1F5F9]/60">Password Lama</label>
                    <div className="relative group/input">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full pl-11 pr-10 py-3.5 bg-[#F8FAFC] focus:bg-white dark:bg-[#232F72]/30 border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 focus:border-[#36ADA3] focus:ring-1 focus:ring-[#36ADA3] rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                        placeholder="Masukkan password lama..."
                      />
                      <Lock className="w-4.5 h-4.5 text-[#2F578A] dark:text-[#F1F5F9]/50 absolute left-4 top-4 group-focus-within/input:text-[#36ADA3] transition-colors" />
                      <button type="button" onClick={() => setShowOldPassword(v => !v)} className="absolute right-3 top-4 text-[#2F578A] dark:text-[#F1F5F9]/50 hover:text-[#36ADA3] transition-colors">
                        {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase text-[#2F578A] dark:text-[#F1F5F9]/60">Password Baru</label>
                    <div className="relative group/input">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-11 pr-10 py-3.5 bg-[#F8FAFC] focus:bg-white dark:bg-[#232F72]/30 border-2 border-[#2F578A]/20 dark:border-[#2F578A]/40 focus:border-[#36ADA3] focus:ring-1 focus:ring-[#36ADA3] rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                        placeholder="Min. 8 karakter..."
                      />
                      <Lock className="w-4.5 h-4.5 text-[#2F578A] dark:text-[#F1F5F9]/50 absolute left-4 top-4 group-focus-within/input:text-[#36ADA3] transition-colors" />
                      <button type="button" onClick={() => setShowNewPassword(v => !v)} className="absolute right-3 top-4 text-[#2F578A] dark:text-[#F1F5F9]/50 hover:text-[#36ADA3] transition-colors">
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions & Submit */}
              <div className="pt-4 border-t border-[#2F578A]/20 dark:border-[#2F578A]/40 flex justify-end">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3.5 bg-[#36ADA3] hover:bg-[#2eb1a6] disabled:bg-[#36ADA3]/70 text-white font-black rounded-2xl shadow-[0_0_15px_rgba(54,173,163,0.3)] hover:shadow-[0_0_20px_rgba(54,173,163,0.5)] transition-all text-xs flex items-center gap-2 cursor-pointer active:scale-95 hover:scale-[1.01]"
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

