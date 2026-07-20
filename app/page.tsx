
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Shield, Sparkles, Building2, Lock, Users, BarChart3, Zap, ChevronDown } from "lucide-react";
import CursorGlow from "./CursorGlow";

export const metadata: Metadata = {
  title: "DW 1 · Sistem Manajemen Magang",
  description: "Portal Resmi Direktorat Wilayah 1 — Platform digital terpadu untuk pengelolaan program magang industri.",
};

export default function Home() {




  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 font-sans overflow-x-hidden selection:bg-cyan-500/30">

      {/* ── CURSOR GLOW ── */}
      <CursorGlow />

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Noise texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:72px_72px]" />

        {/* Animated orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.08),transparent)]" />
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#030712] to-transparent" />
      </div>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-5">
        <div className="navbar-glass flex items-center justify-between w-full max-w-5xl px-5 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/60 group-hover:scale-105 transition-all duration-300">
              <Image
                src="/dw1-logo.png"
                alt="Logo DW 1"
                width={40}
                height={40}
                className="object-contain w-full h-full p-0.5"
              />
            </div>
            <span className="font-black text-sm tracking-[0.2em] text-white">
              DIREKTORAT WILAYAH<span className="text-cyan-400"> 1</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[11px] font-bold text-slate-300 hover:text-white transition-colors px-3 py-2"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="btn-primary text-[11px] font-bold px-5 py-2.5 rounded-xl"
            >
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen max-w-7xl mx-auto px-6 text-center pt-28">

        {/* Badge */}
        <div className="badge mb-10 animate-fade-in">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300">
            Portal Resmi · Direktorat Wilayah 1
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping-slow ml-1" />
        </div>

        {/* Headline */}
        <h1 className="hero-text animate-fade-in-up animation-delay-100">
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/30">
            Sistem Manajemen
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-500">
            Magang Terpadu
          </span>
        </h1>

        {/* Sub */}
        <p className="max-w-xl text-sm md:text-base text-slate-400 font-medium mb-12 leading-relaxed animate-fade-in-up animation-delay-200">
          Platform digital eksklusif untuk pengelolaan program magang industri. Dirancang dengan keamanan tinggi, terintegrasi penuh, dan mudah digunakan.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up animation-delay-300 w-full sm:w-auto mb-20">
          <Link
            href="/login"
            className="btn-cta-primary group w-full sm:w-auto"
          >
            <Lock className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Akses Sekarang</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <span className="btn-shine" />
          </Link>
          <Link
            href="/register"
            className="btn-cta-secondary w-full sm:w-auto"
          >
            Registrasi Anggota
          </Link>
        </div>



      </main>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.05] py-8 text-center">
        <p className="text-[10px] font-medium text-slate-600">
          © 2025 Direktorat Wilayah 1 · Sistem Manajemen Magang ·{" "}
          <span className="text-slate-500">All rights reserved</span>
        </p>
      </footer>

      {/* ── GLOBAL STYLES ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Orbs */
        .orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(120px);
          animation: orbFloat 10s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        .orb-1 {
          top: -15%; left: -10%;
          width: 55vw; height: 55vw;
          background: radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(37,99,235,0.12) 60%, transparent 100%);
          animation-duration: 12s;
        }
        .orb-2 {
          bottom: -20%; right: -10%;
          width: 45vw; height: 45vw;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(6,182,212,0.08) 60%, transparent 100%);
          animation-duration: 15s;
          animation-delay: -5s;
        }
        .orb-3 {
          top: 30%; right: 15%;
          width: 25vw; height: 25vw;
          background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 100%);
          animation-duration: 9s;
          animation-delay: -3s;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          33% { transform: translateY(-4%) scale(1.03); }
          66% { transform: translateY(3%) scale(0.97); }
        }

        /* Navbar */
        .navbar-glass {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        /* Badge */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 9999px;
          background: rgba(6,182,212,0.08);
          border: 1px solid rgba(6,182,212,0.25);
          backdrop-filter: blur(12px);
          box-shadow: 0 0 30px -8px rgba(6,182,212,0.4), inset 0 1px 0 rgba(6,182,212,0.1);
        }

        /* Ping dot */
        @keyframes pingSlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.8); }
        }
        .animate-ping-slow { animation: pingSlow 2s ease-in-out infinite; }

        /* Hero text */
        .hero-text {
          font-size: clamp(3rem, 8vw, 6.5rem);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
        }

        /* Buttons */
        .btn-primary {
          background: linear-gradient(135deg, rgba(6,182,212,0.15), rgba(37,99,235,0.15));
          border: 1px solid rgba(6,182,212,0.3);
          color: white;
          transition: all 0.2s;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, rgba(6,182,212,0.25), rgba(37,99,235,0.25));
          border-color: rgba(6,182,212,0.6);
          box-shadow: 0 0 20px -5px rgba(6,182,212,0.5);
        }

        .btn-cta-primary {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 52px;
          padding: 0 28px;
          border-radius: 14px;
          background: linear-gradient(135deg, #06b6d4, #2563eb);
          color: white;
          font-weight: 700;
          font-size: 13px;
          overflow: hidden;
          transition: all 0.3s;
          box-shadow: 0 0 40px -10px rgba(6,182,212,0.7), inset 0 1px 0 rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.15);
        }
        .btn-cta-primary:hover {
          transform: scale(1.04);
          box-shadow: 0 0 60px -8px rgba(6,182,212,0.9);
        }
        .btn-cta-primary:active { transform: scale(0.97); }
        .btn-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }
        .btn-cta-primary:hover .btn-shine { transform: translateX(100%); }

        .btn-cta-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 52px;
          padding: 0 28px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          font-weight: 700;
          font-size: 13px;
          backdrop-filter: blur(12px);
          transition: all 0.3s;
        }
        .btn-cta-secondary:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.25);
          transform: scale(1.02);
        }

        /* Stats */
        .stats-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(12px);
        }
        @media (max-width: 640px) {
          .stats-bar { grid-template-columns: repeat(2, 1fr); }
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 16px;
          background: rgba(255,255,255,0.02);
          gap: 4px;
          transition: background 0.2s;
        }
        .stat-item:hover { background: rgba(255,255,255,0.05); }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #e2e8f0, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.03em;
        }
        .stat-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #64748b;
        }

        /* Feature cards */
        .feature-card {
          display: flex;
          flex-direction: column;
          padding: 28px;
          border-radius: 20px;
          backdrop-filter: blur(12px);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          animation: fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }
        .feature-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 20px 60px -15px rgba(0,0,0,0.5);
        }
        .icon-wrap {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          transition: transform 0.3s;
        }
        .feature-card:hover .icon-wrap { transform: scale(1.1) rotate(3deg); }

        /* Animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); filter: blur(8px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) both;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.9s cubic-bezier(0.16,1,0.3,1) both;
          opacity: 0;
        }
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 220ms; }
        .animation-delay-300 { animation-delay: 340ms; }
        .animation-delay-400 { animation-delay: 460ms; }

        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        .animate-bounce-slow { animation: bounceSlow 2s ease-in-out infinite; }
      `}} />
    </div>
  );
}
