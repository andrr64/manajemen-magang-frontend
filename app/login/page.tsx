"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useIam } from "@/modules/iam/hooks";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useIam();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Identitas login (Email dan Sandi) wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Akses ditolak. Kredensial tidak valid.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#050505] text-slate-50 font-sans relative px-4 overflow-hidden selection:bg-cyan-500/30">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        
        {/* Orbs */}
        <div className="absolute top-0 right-[10%] w-[500px] h-[500px] rounded-full bg-cyan-900/20 blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-0 left-[10%] w-[500px] h-[500px] rounded-full bg-blue-900/20 blur-[150px] mix-blend-screen" />
      </div>

      {/* Back Button */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/"
          className="group flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <div className="p-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md group-hover:bg-white/[0.1] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Kembali
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm z-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-6 animate-float">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-4 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">Portal Keamanan</span>
          </div>
          <h1 className="text-2xl font-black tracking-widest text-white mb-2">
            DW<span className="text-cyan-400"> 1</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Masuk untuk mengakses sistem terpadu</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
          
          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              <p className="text-[11px] font-bold text-red-400">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                Identitas / Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dirwil1.go.id"
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-white/[0.05] rounded-2xl text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.02] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                Kata Sandi
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-11 py-3.5 bg-[#0a0a0a] border border-white/[0.05] rounded-2xl text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.02] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4 rounded border border-white/10 bg-[#0a0a0a] group-hover:border-cyan-500/50 transition-colors">
                  <input type="checkbox" className="peer opacity-0 absolute inset-0 cursor-pointer" />
                  <div className="w-2 h-2 rounded-sm bg-cyan-400 opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-300">Ingat Saya</span>
              </label>
              <a href="#" className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                Lupa Sandi?
              </a>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative flex items-center justify-center w-full py-4 rounded-2xl bg-white text-black font-bold text-xs overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Masuk Ke Sistem"
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-medium text-slate-500">
            Akses terbatas untuk personil DIREKTORAT WILAYAH 1. <br className="mt-1" />
            <Link href="/register" className="text-cyan-400 hover:text-white font-bold transition-colors">
              Permohonan Akses Baru
            </Link>
          </p>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
