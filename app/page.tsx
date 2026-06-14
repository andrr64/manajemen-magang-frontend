import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Hexagon, Shield, Sparkles, Building2, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "DIREKTORAT WILAYAH 1",
  description: "Portal Akses Resmi Direktorat Wilayah 1",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* 1. ULTRA PREMIUM BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/40 blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-cyan-900/30 blur-[150px] mix-blend-screen animate-pulse-slow animation-delay-500" />
        <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-indigo-600/20 blur-[100px] mix-blend-screen" />
      </div>

      {/* 2. FLOATING PILL NAVBAR */}
      <nav className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 animate-fade-in-down">
        <div className="flex items-center justify-between w-full max-w-5xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl rounded-full px-6 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          {/* Logo */}
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:rotate-12 transition-transform duration-500">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-widest text-white">
              DIRWIL<span className="text-cyan-400">1</span>
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-xs font-bold tracking-widest uppercase text-white/90 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-[1px] after:bg-cyan-400 after:scale-x-100 after:transition-transform">
              Beranda
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="text-xs font-bold text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="text-xs font-bold bg-white text-black hover:bg-cyan-50 px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)]"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen max-w-6xl mx-auto px-6 text-center pt-20">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 mb-8 animate-fade-in-up shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Sistem Informasi Terpusat</span>
        </div>

        {/* Massive Typography */}
        <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] mb-8 animate-fade-in-up animation-delay-100">
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500">
            DIREKTORAT
          </span>
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 drop-shadow-[0_0_40px_rgba(6,182,212,0.4)]">
            WILAYAH 1
          </span>
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl text-base md:text-lg text-slate-400 font-medium mb-12 leading-relaxed animate-fade-in-up animation-delay-200">usat kendali dan layanan digital eksklusif untuk jajaran Direktorat Wilayah 1. Dirancang dengan tingkat keamanan tinggi, cepat, dan terintegrasi penuh.
        </p>

        {/* Call To Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up animation-delay-300 w-full sm:w-auto">
          <Link 
            href="/login" 
            className="group relative flex items-center justify-center gap-2 h-14 px-8 w-full sm:w-auto rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(6,182,212,0.6)] border border-white/10"
          >
            <Lock className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Akses Portal Server</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 h-full w-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </Link>
          
          <Link 
            href="/register" 
            className="flex items-center justify-center h-14 px-8 w-full sm:w-auto rounded-full bg-white/[0.03] border border-white/[0.1] text-white font-bold text-sm hover:bg-white/[0.08] transition-all duration-300 hover:border-white/30 active:scale-95 backdrop-blur-md"
          >
            Registrasi Anggota
          </Link>
        </div>

        {/* Bottom Decorative Glass Panels */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl animate-fade-in-up animation-delay-400">
          {[
            { icon: Building2, title: "Layanan Terpadu", desc: "Akses seluruh layanan wilayah dalam satu pintu." },
            { icon: Shield, title: "Keamanan Tingkat Tinggi", desc: "Enkripsi end-to-end untuk seluruh data anggota." },
            { icon: Hexagon, title: "Sistem Terintegrasi", desc: "Sinkronisasi data real-time antar departemen." }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-lg hover:bg-white/[0.04] transition-colors">
              <item.icon className="w-6 h-6 text-cyan-400 mb-4 opacity-80" />
              <h3 className="text-sm font-bold text-slate-200 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </main>

      {/* Global CSS injected */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-fade-in-down {
          animation: fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-pulse-slow {
          animation: pulseSlow 8s ease-in-out infinite;
        }
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
      `}} />
    </div>
  );
}
