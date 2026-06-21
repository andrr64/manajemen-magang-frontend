"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Check,
  Sparkles,
  Shield,
  Lock,
  Bookmark,
  Loader2,
  Eye,
  EyeOff,
  KeyRound
} from "lucide-react";
import { useIam } from "@/modules/iam/hooks";
import { SuccessToast } from "@/components/shared";

export default function MentorProfilePage() {
  const { user, isLoading, updateProfile } = useIam();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
  });
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Populate form once user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.nama ?? "",
        email: user.email ?? "",
        phone: user.noHp ?? "",
        oldPassword: "",
        newPassword: "",
      });
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
        ...(formData.newPassword ? {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        } : {}),
      });
      setFormData(prev => ({ ...prev, oldPassword: "", newPassword: "" }));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch {
      // error already toasted by updateProfile
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-[#232F72] dark:text-white" />
      </div>
    );
  }

  const displayName = user?.nama || user?.email || "Mentor";
  const displayRole = (user?.role ?? "mentor").toUpperCase();

  return (
    <div className="space-y-6 relative pb-10">

      {/* TOAST */}
      <SuccessToast show={showToast} message="Profil Anda berhasil diperbarui di sistem!" title="Pembaruan Sukses" />

      {/* HERO BANNER */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0d1637] via-[#102058] to-[#091129] border border-[#2F578A]/20 dark:border-[#2F578A]/40 p-6 md:p-8 text-white overflow-hidden shadow-xl shadow-[#232F72]/10">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[70px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#2F578A] to-cyan-400 rounded-2xl blur-sm opacity-60 animate-pulse" />
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#121358] border border-[#2F578A]/30 flex items-center justify-center text-white font-extrabold text-2xl shadow-inner">
                {displayName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div>


              <h3 className="text-lg md:text-2xl font-black tracking-tight mt-2 leading-tight">
                {displayName}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT: IDENTITY CARD */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md relative overflow-hidden space-y-6">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3.5 border-b border-[#2F578A]/30 dark:border-[#2F578A]">
              <span className="text-xs font-black text-[#232F72] dark:text-[#FFFFFF] uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-4 h-4" />
                Kartu Identitas Mentor
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/20" title="Koneksi Aman" />
            </div>

            <div className="space-y-4">
              {[
                { icon: User, label: "Nama Lengkap", value: user?.nama || "-", color: "bg-[#F8FAFC] dark:bg-[#232F72]/60 text-[#232F72] dark:text-[#FFFFFF]" },
                { icon: Mail, label: "Alamat Email", value: user?.email || "-", color: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400" },
                { icon: Phone, label: "Nomor Telepon", value: user?.noHp || "-", color: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400" },
                { icon: Shield, label: "Status", value: displayRole, color: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="group relative p-3 bg-slate-50 hover:bg-[#F1F5F9]/50 dark:bg-[#121358]/60 dark:hover:bg-[#0a1538]/60 border border-[#2F578A]/20 dark:border-[#2F578A] rounded-2xl flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
                  <div className={`p-2.5 rounded-xl ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-extrabold block uppercase tracking-wider">{label}</span>
                    <p className="font-extrabold text-[#232F72] dark:text-[#FFFFFF] mt-0.5 truncate leading-snug">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: EDIT FORM */}
        <div className="lg:col-span-7">
          <div className="glass-card border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md space-y-6">

            <div className="flex items-center justify-between pb-3.5 border-b border-[#2F578A]/30 dark:border-[#2F578A]">
              <h4 className="font-extrabold text-sm text-[#232F72] dark:text-[#FFFFFF] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Ubah Profil Mentor
              </h4>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-bold text-[#2F578A] dark:text-[#F1F5F9]/80">

              {/* Nama */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 flex items-center gap-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <div className="relative group/input">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F1F5F9] focus:bg-white dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] focus:ring-1 focus:ring-[#232F72] rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                    placeholder="Nama lengkap..."
                  />
                  <User className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-4 top-4" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 flex items-center gap-1">
                  Alamat Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative group/input">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F1F5F9] focus:bg-white dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] focus:ring-1 focus:ring-[#232F72] rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                    placeholder="Email aktif..."
                  />
                  <Mail className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-4 top-4" />
                </div>
              </div>

              {/* No. Telp */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 flex items-center gap-1">
                  Nomor Telepon
                </label>
                <div className="relative group/input">
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F1F5F9] focus:bg-white dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] focus:ring-1 focus:ring-[#232F72] rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                    placeholder="Nomor HP / WhatsApp..."
                  />
                  <Phone className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-4 top-4" />
                </div>
              </div>

              {/* Password lama */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 flex items-center gap-1">
                  Password Lama
                  <span className="ml-1 text-[9px] font-semibold normal-case text-slate-400">(isi hanya jika ingin ganti password)</span>
                </label>
                <div className="relative">
                  <input
                    type={showOldPw ? "text" : "password"}
                    value={formData.oldPassword}
                    onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                    autoComplete="current-password"
                    className="w-full pl-11 pr-10 py-3.5 bg-[#F1F5F9] focus:bg-white dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] focus:ring-1 focus:ring-[#232F72] rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                    placeholder="Password saat ini..."
                  />
                  <KeyRound className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-4 top-4" />
                  <button type="button" onClick={() => setShowOldPw(v => !v)} className="absolute right-3 top-3.5 text-[#2F578A]/60 hover:text-[#232F72] dark:text-[#F1F5F9]/40 dark:hover:text-white">
                    {showOldPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password baru */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 flex items-center gap-1">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    autoComplete="new-password"
                    className="w-full pl-11 pr-10 py-3.5 bg-[#F1F5F9] focus:bg-white dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] focus:ring-1 focus:ring-[#232F72] rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner"
                    placeholder="Minimal 8 karakter..."
                  />
                  <KeyRound className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-4 top-4" />
                  <button type="button" onClick={() => setShowNewPw(v => !v)} className="absolute right-3 top-3.5 text-[#2F578A]/60 hover:text-[#232F72] dark:text-[#F1F5F9]/40 dark:hover:text-white">
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role (locked) */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50">
                  Status / Role
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value={displayRole}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F1F5F9] dark:bg-[#232F72]/60 border border-slate-200 dark:border-[#2F578A] rounded-2xl text-xs focus:outline-none dark:text-slate-400 cursor-not-allowed font-extrabold tracking-wider"
                  />
                  <Shield className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-4 top-4" />
                </div>
                <div className="p-3 bg-[#F1F5F9] dark:bg-[#232F72]/80 border border-[#2F578A]/20 dark:border-[#2F578A] rounded-2xl flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[9.5px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold leading-relaxed">
                    Kolom status dikunci demi keamanan. Hubungi administrator untuk mengubah hak akses.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-[#2F578A]/30 dark:border-[#2F578A] flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3.5 bg-[#232F72] hover:opacity-90 disabled:opacity-60 text-white font-black rounded-2xl shadow-lg shadow-[#232F72]/15 transition-all text-xs flex items-center gap-2 cursor-pointer active:scale-95 hover:scale-[1.01]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Simpan Perubahan
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
