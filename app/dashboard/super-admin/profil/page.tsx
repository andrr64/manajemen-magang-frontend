"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Lock, 
  Camera, 
  Save, 
  Key, 
  Database, 
  Calendar, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  X,
  Server
} from "lucide-react";

export default function SuperAdminProfilePage() {
  // Profile Info State
  const [name, setName] = useState("Administrator Utama");
  const [email, setEmail] = useState("super.admin@internflow.ac.id");
  const [phone, setPhone] = useState("0811-2233-4455");
  const [adminId, setAdminId] = useState("99002201");
  const [registeredDate, setRegisteredDate] = useState("12 Januari 2025");
  const [lastLogin, setLastLogin] = useState("Hari ini, 10:45 WIB");

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toast / Banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger Toast Notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Handle Save Info Profile
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Nama dan Surel wajib diisi!");
      return;
    }
    triggerToast("Informasi profil Anda berhasil disimpan!");
  };

  // Handle Save Password Change
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Harap lengkapi semua kolom kata sandi!");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Konfirmasi kata sandi baru tidak cocok!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Kata sandi baru harus minimal 8 karakter!");
      return;
    }
    
    // Simulate successful password change
    triggerToast("Kata sandi Anda berhasil diperbarui!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-slate-800 dark:border-slate-200 animate-float-none animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-lg cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* DYNAMIC TOP PROFILE HEADER COVER CARD */}
      <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 overflow-hidden shadow-sm">
        
        {/* Cover Gradient */}
        <div className="h-32 w-full bg-gradient-to-r from-rose-600 via-violet-600 to-indigo-650 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        </div>

        {/* Profile Identity Info Row */}
        <div className="p-6 pt-0 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 -mt-16 md:mt-0 relative z-10">
            {/* Avatar Frame */}
            <div className="relative group cursor-pointer">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-rose-500 to-violet-500 text-white text-3xl font-black flex items-center justify-center border-4 border-white dark:border-[#030712] shadow-xl relative overflow-hidden">
                SA
              </div>
              <button 
                onClick={() => alert("Mengunggah foto profil baru...")}
                className="absolute inset-0 bg-slate-950/60 text-white rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-all text-[10px] font-bold"
              >
                <Camera className="w-5 h-5" />
                <span>Ubah Foto</span>
              </button>
            </div>

            {/* Name and Designation */}
            <div className="text-center md:text-left space-y-1 pb-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">
                  {name}
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200/40 dark:border-rose-900/55 text-[10px] font-black text-rose-600 dark:text-rose-400 rounded-full uppercase tracking-wider">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-450 dark:text-slate-500 font-semibold">{email}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-550 font-semibold">Registered ID: {adminId}</p>
            </div>
          </div>

          {/* Quick Security Badge */}
          <div className="flex-shrink-0 flex items-center gap-2.5 px-4.5 py-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-250/20 dark:border-emerald-900/40 rounded-2xl">
            <div className="p-1.5 rounded-lg bg-emerald-500 text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Keamanan Akun</span>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">Root & SSL Enkripsi</span>
            </div>
          </div>

        </div>
      </div>

      {/* TWO PANEL SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: EDIT DETAILS PROFILE & CHANGE PASSWORD (2 COLS) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Detail Profil Form */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-150 dark:border-slate-850 mb-5">
              <User className="w-5 h-5 text-rose-500" />
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Detail Kredensial Pengguna</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Perbarui informasi profil utama dan detail kontak kerja Anda.</p>
              </div>
            </div>

            <form onSubmit={handleSaveInfo} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">Nama Lengkap Administrator</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                </div>
                {/* Admin ID (Disabled) */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">ID Administrator (Statis)</label>
                  <input
                    type="text"
                    disabled
                    value={adminId}
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-450 dark:text-slate-550 font-mono focus:outline-none cursor-not-allowed opacity-75"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">Alamat Surel *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                </div>
                {/* Phone WhatsApp */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">No. Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-150 dark:border-slate-850 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-rose-600/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Ganti Kata Sandi Form */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-150 dark:border-slate-850 mb-5">
              <Lock className="w-5 h-5 text-rose-500" />
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Ubah Kata Sandi Akses</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Jaga keamanan akun root dengan memperbarui kata sandi secara berkala.</p>
              </div>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">Kata Sandi Saat Ini *</label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan kata sandi lama Anda"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* New Password */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">Kata Sandi Baru *</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimal 8 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                </div>
                {/* Confirm New Password */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">Konfirmasi Kata Sandi Baru *</label>
                  <input
                    type="password"
                    required
                    placeholder="Ulangi kata sandi baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-150 dark:border-slate-850 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  Perbarui Sandi
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: PRIVILEGES, REGISTRATION DATA & AUDIT SECURITY LOG */}
        <div className="space-y-6">
          
          {/* Privilege Stats Card */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                Hak Istimewa Akun
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                Kredensial & Level Otoritas
              </h4>
            </div>

            <div className="space-y-3 pt-2 text-xs leading-normal">
              
              {/* Registration Date */}
              <div className="flex items-center justify-between py-2 border-b border-slate-150 dark:border-slate-850">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  Terdaftar Sejak
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{registeredDate}</span>
              </div>

              {/* Last Login */}
              <div className="flex items-center justify-between py-2 border-b border-slate-150 dark:border-slate-850">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-500" />
                  Masuk Terakhir
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{lastLogin}</span>
              </div>

              {/* Server Host */}
              <div className="flex items-center justify-between py-2 border-b border-slate-150 dark:border-slate-850">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-rose-500" />
                  Server Host
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">API-PROD-01</span>
              </div>

              {/* Encryption */}
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-rose-500" />
                  Enkripsi Basis Data
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-450">AES-256 Bit</span>
              </div>

            </div>
          </div>

          {/* Security Log Card */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-[#070e24]/40 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-150 dark:border-slate-850">
              <Terminal className="w-4 h-4 text-rose-500" />
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                Log Keamanan Akun Root
              </h4>
            </div>

            <div className="space-y-3.5">
              {/* Log 1 */}
              <div className="flex gap-2.5 text-[11px] leading-normal items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-350">
                    Aktivasi kunci otentikasi baru di perangkat seluler terdaftar.
                  </p>
                  <span className="text-[9px] text-slate-450 block mt-0.5">3 minggu yang lalu</span>
                </div>
              </div>

              {/* Log 2 */}
              <div className="flex gap-2.5 text-[11px] leading-normal items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-350">
                    Kata sandi keamanan akun root berhasil diperbarui secara berkala.
                  </p>
                  <span className="text-[9px] text-slate-450 block mt-0.5">1 bulan yang lalu</span>
                </div>
              </div>

              {/* Log 3 */}
              <div className="flex gap-2.5 text-[11px] leading-normal items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-350">
                    Pemindaian sistem berkala tidak mendeteksi adanya kebocoran data.
                  </p>
                  <span className="text-[9px] text-slate-450 block mt-0.5">2 bulan yang lalu</span>
                </div>
              </div>

              {/* Log 4 */}
              <div className="flex gap-2.5 text-[11px] leading-normal items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-350">
                    Sistem backup audit eksternal berhasil disinkronisasi.
                  </p>
                  <span className="text-[9px] text-slate-450 block mt-0.5">3 bulan yang lalu</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
