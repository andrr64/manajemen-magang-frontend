"use client";

import { useState } from "react";
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validasi sederhana
    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi!");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password minimal terdiri dari 6 karakter!");
      return;
    }

    setIsLoading(true);

    // Simulasi loading selama 1.5 detik
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Login berhasil! Mengalihkan ke dashboard...");
      // Simulasi redirect
      setTimeout(() => {
        window.location.href = "/dashboard/mentor";
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-grid-pattern relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* Tombol Kembali ke Beranda */}
      <div className="absolute top-6 left-6 z-10">
        <a
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </a>
      </div>

      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Login Card (Centered) */}
      <div className="w-full max-w-md glass-card rounded-3xl p-8 md:p-10 shadow-2xl relative border border-slate-200/60 dark:border-slate-800/80 z-10 transition-all duration-300">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20 mb-4 animate-float">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-1">
            Intern<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Masuk untuk mengakses sistem magang terpadu
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-900/50 text-xs font-semibold text-red-600 dark:text-red-400">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/50 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {successMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                disabled={isLoading}
                className="block w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-indigo-600 dark:focus:border-indigo-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Kata Sandi
              </label>
              <a
                href="#forgot"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Lupa Password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="block w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-indigo-600 dark:focus:border-indigo-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me checkbox */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-900 dark:border-slate-800"
            />
            <label htmlFor="remember-me" className="ml-2.5 block text-sm font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
              Ingat saya di perangkat ini
            </label>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex justify-center items-center w-full py-4 px-6 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Memproses Masuk...
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </div>
        </form>

        {/* Separator */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800/80"></div>
          </div>
          <div className="relative flex justify-center text-xs font-semibold uppercase">
            <span className="bg-white dark:bg-[#060b26] px-3 text-slate-400 dark:text-slate-500">
              Atau masuk dengan
            </span>
          </div>
        </div>

        {/* Google SSO simulated */}
        <button
          type="button"
          onClick={() => {
            setErrorMsg("Masuk dengan Google sedang disiapkan oleh administrator!");
          }}
          disabled={isLoading}
          className="flex justify-center items-center w-full py-3.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-sm font-bold text-slate-700 dark:text-slate-300 transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.19-2.78-6.19-6.19s2.78-6.19 6.19-6.19c1.54 0 2.94.57 4.03 1.505l3.07-3.07C19.1 2.215 15.89 1 12.24 1 5.48 1 0 6.48 0 13.24s5.48 12.24 12.24 12.24c6.82 0 12.24-5.42 12.24-12.24 0-.79-.08-1.57-.23-2.325l-12.01.37z"
            />
          </svg>
          Google Workspace
        </button>

        {/* Sign up simulated */}
        <div className="mt-8 text-center text-sm font-semibold text-slate-500">
          Belum terdaftar?{" "}
          <a href="/#daftar" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Buat akun program magang
          </a>
        </div>
      </div>
    </div>
  );
}
