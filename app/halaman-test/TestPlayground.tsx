"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Volume2,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  Check,
  Terminal,
  Sliders,
  Code,
  Copy,
  Play,
  Moon,
  Sun,
  RefreshCw,
  SlidersHorizontal,
  Cpu,
  BookmarkCheck,
  GraduationCap
} from "lucide-react";

// Greeting languages definition
interface Greeting {
  lang: string;
  flag: string;
  text: string;
  sub: string;
  hue: string;
}

const GREETINGS: Greeting[] = [
  { lang: "Spanish", flag: "🇪🇸", text: "Hola amigios!", sub: "¡Bienvenidos al laboratorio interactivo!", hue: "from-amber-400 via-orange-500 to-rose-500" },
  { lang: "English", flag: "🇬🇧", text: "Hello friends!", sub: "Welcome to the interactive sandbox playground!", hue: "from-indigo-400 via-purple-500 to-pink-500" },
  { lang: "Indonesian", flag: "🇮🇩", text: "Halo teman-teman!", sub: "Selamat datang di laboratorium interaktif InternFlow!", hue: "from-emerald-400 via-teal-500 to-cyan-500" },
  { lang: "Japanese", flag: "🇯🇵", text: "こんにちは、友達！", sub: "インタラクティブな開発サンドボックスへようこそ！", hue: "from-pink-400 via-rose-500 to-red-500" },
  { lang: "French", flag: "🇫🇷", text: "Bonjour les amis!", sub: "Bienvenue dans le laboratoire de test interactif !", hue: "from-cyan-400 via-blue-500 to-indigo-500" },
];

export default function TestPlayground() {
  // Navigation & Interactive Tabs
  const [activeTab, setActiveTab] = useState<"ui" | "status" | "synth" | "micro">("ui");
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Customizer State
  const [cardBlur, setCardBlur] = useState(16);
  const [borderOpacity, setBorderOpacity] = useState(15);
  const [glowIntensity, setGlowIntensity] = useState(40);
  const [selectedAccent, setSelectedAccent] = useState<"indigo" | "emerald" | "violet" | "rose" | "cyan">("indigo");
  const [cardScale, setCardScale] = useState(1);
  const [showGrid, setShowGrid] = useState(true);

  // Status Badge Sandbox State
  const [selectedStatus, setSelectedStatus] = useState<"draft" | "review" | "approved" | "rejected" | "completed">("review");
  const [logMessages, setLogMessages] = useState<string[]>([
    "System: Lab initialized successfully.",
    "System: UI rendering optimized in 1.2ms."
  ]);

  // Micro-interactions State
  const [progressVal, setProgressVal] = useState(65);
  const [isRotating, setIsRotating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [buttonStatus, setButtonStatus] = useState<"idle" | "loading" | "success">("idle");

  // Web Audio Synth Function
  const playSound = (type: "success" | "error" | "bell" | "click") => {
    if (typeof window === "undefined") return;
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "success") {
        const playNote = (freq: number, delay: number, dur: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
          gain.gain.setValueAtTime(0.06, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + dur);
        };
        playNote(523.25, 0, 0.12); // C5
        playNote(659.25, 0.06, 0.12); // E5
        playNote(783.99, 0.12, 0.12); // G5
        playNote(1046.50, 0.18, 0.25); // C6
      } else if (type === "error") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "bell") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn("Web Audio is restricted or not supported by browser", e);
    }
  };

  // Add Log Message helper
  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogMessages(prev => [`[${time}] ${msg}`, ...prev.slice(0, 7)]);
  };

  // Cycle through greetings
  const handleGreetingCycle = () => {
    playSound("click");
    const nextIdx = (greetingIndex + 1) % GREETINGS.length;
    setGreetingIndex(nextIdx);
    addLog(`Greeting changed to: ${GREETINGS[nextIdx].lang}`);
  };

  // Copy simulated code
  const handleCopyCode = () => {
    playSound("success");
    setCopied(true);
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(`// InternFlow Premium Glassmorphism Card
<div className="relative p-12 bg-white/5 backdrop-blur-[${cardBlur}px] border border-white/[0.${borderOpacity}] rounded-2xl shadow-2xl">
  <div className="absolute inset-0 bg-indigo-500/${glowIntensity / 100} rounded-2xl filter blur-xl pointer-events-none" />
  <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
    Hola amigios!
  </h1>
</div>`);
    }
    addLog("Component code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulating status change
  const handleStatusChange = (status: typeof selectedStatus) => {
    playSound("click");
    setSelectedStatus(status);
    addLog(`Status simulated: ${status.toUpperCase()}`);
  };

  // Simulating async submission button
  const triggerDemoButton = () => {
    if (buttonStatus !== "idle") return;
    playSound("click");
    setButtonStatus("loading");
    addLog("Submitting mockup internship application...");
    
    setTimeout(() => {
      setButtonStatus("success");
      playSound("success");
      addLog("Mockup Application submitted successfully! (DITERIMA)");
      
      setTimeout(() => {
        setButtonStatus("idle");
      }, 2500);
    }, 2000);
  };

  // Accent Tailwind color mapping
  const accentColors = {
    indigo: {
      primary: "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700",
      text: "text-indigo-400",
      border: "border-indigo-500/30",
      glow: "bg-indigo-500",
      ring: "focus:ring-indigo-500"
    },
    emerald: {
      primary: "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      glow: "bg-emerald-500",
      ring: "focus:ring-emerald-500"
    },
    violet: {
      primary: "bg-violet-600 hover:bg-violet-500 active:bg-violet-700",
      text: "text-violet-400",
      border: "border-violet-500/30",
      glow: "bg-violet-500",
      ring: "focus:ring-violet-500"
    },
    rose: {
      primary: "bg-rose-600 hover:bg-rose-500 active:bg-rose-700",
      text: "text-rose-400",
      border: "border-rose-500/30",
      glow: "bg-rose-500",
      ring: "focus:ring-rose-500"
    },
    cyan: {
      primary: "bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700",
      text: "text-cyan-400",
      border: "border-cyan-500/30",
      glow: "bg-cyan-500",
      ring: "focus:ring-cyan-500"
    }
  };

  const currAccent = accentColors[selectedAccent];

  return (
    <div className={`relative min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex flex-col items-center justify-start overflow-hidden font-sans select-none`}>
      {/* Background Visual Grid */}
      {showGrid && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />
      )}

      {/* Floating Neon Background Orbs */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full filter blur-[120px] opacity-25 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, rgba(${selectedAccent === 'indigo' ? '99,102,241' : selectedAccent === 'emerald' ? '16,185,129' : selectedAccent === 'violet' ? '139,92,246' : selectedAccent === 'rose' ? '244,63,94' : '6,182,212'}, 0.8) 0%, rgba(0,0,0,0) 70%)`
        }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full filter blur-[120px] opacity-25 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, rgba(${selectedAccent === 'rose' ? '99,102,241' : '168,85,247'}, 0.8) 0%, rgba(0,0,0,0) 70%)`
        }}
      />

      {/* Header Bar */}
      <header className="relative z-20 w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-12 border border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Intern<span className="text-indigo-400 font-extrabold">Flow</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Lab
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Premium Component Interactive Lab</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4 text-xs text-slate-400 bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800/50">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Online</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>WebAudio: Ready</span>
          </div>
        </div>

        {/* Back button */}
        <Link
          href="/"
          onClick={() => playSound("click")}
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/50 text-slate-200 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
          <span>Ke Beranda</span>
        </Link>
      </header>

      {/* Main Grid Content */}
      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: The Interactive Greeting Card */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div 
            className="flex flex-col items-center justify-center p-8 bg-slate-900/50 border border-slate-800/80 rounded-3xl shadow-2xl relative overflow-hidden group transition-all duration-300"
            style={{ 
              transform: `scale(${cardScale})`,
              transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {/* Real-time configured glow intensity */}
            <div 
              className={`absolute -inset-1 rounded-3xl opacity-20 filter blur-xl transition-all duration-500 group-hover:opacity-30 ${currAccent.glow}`} 
              style={{ opacity: glowIntensity / 150 }}
            />

            {/* Custom Blur Inner Card container */}
            <div 
              className="absolute inset-0 bg-slate-900/70 pointer-events-none rounded-3xl border transition-all duration-300"
              style={{ 
                backdropFilter: `blur(${cardBlur}px)`,
                borderColor: `rgba(255, 255, 255, ${borderOpacity / 100})`
              }}
            />

            {/* Floating particles inside the card */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
              <span className="absolute top-10 left-10 w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
              <span className="absolute bottom-10 right-10 w-2 h-2 rounded-full bg-white/10 animate-pulse delay-500" />
              <span className="absolute top-1/2 right-12 w-1 h-1 rounded-full bg-white/30 animate-pulse delay-300" />
            </div>

            {/* Card Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Interactive Floating Smiley Orb */}
              <button
                onClick={handleGreetingCycle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-950/80 text-white mb-6 border transition-all duration-300 cursor-pointer transform hover:scale-110 active:scale-95 shadow-xl ${currAccent.border} group-hover:border-slate-500`}
                title="Klik untuk ganti sapaan!"
              >
                <div className={`relative w-12 h-12 flex items-center justify-center text-3xl transition-transform duration-500 ${isHovered ? 'scale-125 rotate-12' : ''}`}>
                  {GREETINGS[greetingIndex].flag}
                </div>
              </button>

              <h1 
                className={`text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${GREETINGS[greetingIndex].hue} mb-4 transition-all duration-300 min-h-[50px] flex items-center justify-center`}
              >
                {GREETINGS[greetingIndex].text}
              </h1>

              <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-sm">
                {GREETINGS[greetingIndex].sub}
              </p>

              {/* Dynamic Badges in Card */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
                <span className="text-[11px] px-3 py-1.5 rounded-full bg-slate-950/60 text-slate-300 border border-slate-800">
                  ⚡ Premium Glassmorphism
                </span>
                <span className={`text-[11px] px-3 py-1.5 rounded-full bg-slate-950/60 border border-slate-800 transition-colors duration-300 ${currAccent.text}`}>
                  ⭐ Active Theme: {selectedAccent.toUpperCase()}
                </span>
              </div>

              {/* Cycle / Shuffle CTA */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGreetingCycle}
                  className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-slate-200 hover:text-white font-medium text-xs rounded-xl border border-slate-700/50 shadow-lg transition-all duration-200 cursor-pointer`}
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Sapaan Berikutnya ({GREETINGS[greetingIndex].lang})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Sandbox Stats / Info */}
          <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Console Log & Auditing</span>
            </h3>
            
            <div className="font-mono text-[10px] text-slate-400 bg-slate-950 p-4 rounded-xl border border-slate-900 min-h-[140px] max-h-[140px] overflow-y-auto flex flex-col gap-1.5">
              {logMessages.map((msg, idx) => (
                <div key={idx} className={`border-l-2 pl-2 ${idx === 0 ? 'border-indigo-500 text-slate-200' : 'border-slate-800 text-slate-500'}`}>
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Side: Configuration & Testing Tabs */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Tab Selection */}
          <div className="flex items-center p-1 bg-slate-900/60 border border-slate-800/80 rounded-2xl w-full">
            <button
              onClick={() => { playSound("click"); setActiveTab("ui"); addLog("Opened UI Customizer tab"); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium rounded-xl transition-all duration-200 ${
                activeTab === "ui"
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Glass Customizer</span>
            </button>
            <button
              onClick={() => { playSound("click"); setActiveTab("status"); addLog("Opened Status Simulator tab"); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium rounded-xl transition-all duration-200 ${
                activeTab === "status"
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Badge Simulator</span>
            </button>
            <button
              onClick={() => { playSound("click"); setActiveTab("synth"); addLog("Opened Retro Synth tab"); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium rounded-xl transition-all duration-200 ${
                activeTab === "synth"
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Synth & Sound</span>
            </button>
            <button
              onClick={() => { playSound("click"); setActiveTab("micro"); addLog("Opened Micro-interactions tab"); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium rounded-xl transition-all duration-200 ${
                activeTab === "micro"
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Micro Interactive</span>
            </button>
          </div>

          {/* Tab 1: Glass Customizer Content */}
          {activeTab === "ui" && (
            <div className="p-8 bg-slate-900/50 border border-slate-800/80 rounded-3xl flex flex-col gap-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                  <span>Interactive Glassmorphism Customizer</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Uji estetika glassmorphism kartu sapaan sebelah kiri secara real-time. Gerakkan slider di bawah untuk melihat perubahannya secara langsung!
                </p>
              </div>

              {/* Theme selection circles */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-300">Accent Theme Color</label>
                <div className="flex items-center gap-3">
                  {(["indigo", "emerald", "violet", "rose", "cyan"] as const).map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        playSound("click");
                        setSelectedAccent(color);
                        addLog(`Theme color set to: ${color}`);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center cursor-pointer ${
                        selectedAccent === color 
                          ? 'border-white scale-110 shadow-lg' 
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                      style={{
                        backgroundColor: 
                          color === "indigo" ? "#4f46e5" : 
                          color === "emerald" ? "#10b981" : 
                          color === "violet" ? "#8b5cf6" : 
                          color === "rose" ? "#f43f5e" : "#06b6d4"
                      }}
                    >
                      {selectedAccent === color && <Check className="w-4 h-4 text-white font-bold" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Slider: Blur Amount */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">Glass Blur Radius</span>
                    <span className="text-xs font-mono text-indigo-400">{cardBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={cardBlur}
                    onChange={(e) => setCardBlur(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Sharp (0px)</span>
                    <span>Ultra Blur (40px)</span>
                  </div>
                </div>

                {/* Slider: Border Opacity */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">White Border Opacity</span>
                    <span className="text-xs font-mono text-indigo-400">{borderOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={borderOpacity}
                    onChange={(e) => setBorderOpacity(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Ghost (5%)</span>
                    <span>Solid (80%)</span>
                  </div>
                </div>

                {/* Slider: Ambient Glow */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">Background Glow Intensity</span>
                    <span className="text-xs font-mono text-indigo-400">{glowIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={glowIntensity}
                    onChange={(e) => setGlowIntensity(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Off (0%)</span>
                    <span>Blazing Glow (100%)</span>
                  </div>
                </div>

                {/* Slider: Card Scale */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">Interactive Card Scale</span>
                    <span className="text-xs font-mono text-indigo-400">x{cardScale}</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.1"
                    step="0.05"
                    value={cardScale}
                    onChange={(e) => setCardScale(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Compact (0.8x)</span>
                    <span>Enlarged (1.1x)</span>
                  </div>
                </div>
              </div>

              {/* Grid Toggle Switch */}
              <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Grid Pattern Background</h4>
                    <p className="text-[10px] text-slate-500">Aktifkan pola dot-grid estetis di latar belakang</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playSound("click");
                    setShowGrid(!showGrid);
                    addLog(`Grid Background toggled: ${!showGrid ? "ON" : "OFF"}`);
                  }}
                  className={`w-11 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer ${
                    showGrid ? "bg-indigo-600" : "bg-slate-800"
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    showGrid ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Simulated Code block & Copy action */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-300">React Component Code</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-all active:scale-95 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Tersalin!" : "Salin Kode"}</span>
                  </button>
                </div>

                <div className="relative font-mono text-[10px] text-indigo-300 bg-slate-950 p-4 rounded-xl border border-slate-900 leading-relaxed overflow-x-auto">
                  <span className="text-slate-500">{"// Real-time Generated CSS & Glass Tailwind classes"}</span><br/>
                  <span className="text-purple-400">className</span>=<span className="text-emerald-300">&quot;bg-white/5 backdrop-blur-[{cardBlur}px] border border-white/[0.{borderOpacity}] rounded-2xl shadow-2xl scale-[{cardScale}]&quot;</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Status Badge Simulator Content */}
          {activeTab === "status" && (
            <div className="p-8 bg-slate-900/50 border border-slate-800/80 rounded-3xl flex flex-col gap-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5 text-indigo-400" />
                  <span>InternFlow Status Badge Sandbox</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Uji status lamaran magang mahasiswa dengan palet warna premium bertaraf aplikasi global. Klik status di bawah untuk mensimulasikan kartu!
                </p>
              </div>

              {/* Status selector buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: "draft", label: "Draft", color: "bg-slate-600/20 text-slate-300 border-slate-700" },
                  { id: "review", label: "Direview", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                  { id: "approved", label: "Diterima", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                  { id: "rejected", label: "Ditolak", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
                  { id: "completed", label: "Selesai", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" }
                ].map(status => (
                  <button
                    key={status.id}
                    onClick={() => handleStatusChange(status.id as typeof selectedStatus)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      selectedStatus === status.id 
                        ? `${status.color} ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950 scale-105` 
                        : "bg-slate-950/40 text-slate-500 border-slate-900 hover:text-slate-300 hover:border-slate-800"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>

              {/* High-fidelity simulated dashboard card preview */}
              <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-850 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none" />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">ID LAMARAN: IF-2026-9812</span>
                    <h3 className="text-base font-bold text-white mt-1">Magang UI/UX Designer - GoTo Group</h3>
                  </div>

                  {/* Simulated Badge */}
                  {selectedStatus === "draft" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 text-xs font-semibold">
                      <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
                      <span>Draft Tersimpan</span>
                    </span>
                  )}
                  {selectedStatus === "review" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      <span>Sedang Direview</span>
                    </span>
                  )}
                  {selectedStatus === "approved" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Diterima Magang</span>
                    </span>
                  )}
                  {selectedStatus === "rejected" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border-rose-500/20 text-xs font-semibold">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Lamaran Ditolak</span>
                    </span>
                  )}
                  {selectedStatus === "completed" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                      <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                      <span>Magang Selesai</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <p className="text-slate-500">Tanggal Apply</p>
                    <p className="font-semibold text-slate-200 mt-1">28 Mei 2026</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Periode Magang</p>
                    <p className="font-semibold text-slate-200 mt-1">3 Bulan (Juni - Ags)</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Mentor Lapangan</p>
                    <p className="font-semibold text-indigo-400 mt-1">Faisal A. (Senior Designer)</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Sertifikasi & Nilai</p>
                    <p className="font-semibold text-slate-200 mt-1">
                      {selectedStatus === "completed" ? "Grade: A (94/100)" : "Belum Tersedia"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {selectedStatus === "draft" && "✏️ Silakan kirim lamaran Anda agar dapat diverifikasi oleh admin."}
                    {selectedStatus === "review" && "⏳ Lamaran Anda sedang ditinjau oleh HR Mitra GoTo Group."}
                    {selectedStatus === "approved" && "🎉 Selamat! Silakan unduh LoA dan hubungi mentor lapangan."}
                    {selectedStatus === "rejected" && "❌ Maaf, Anda belum cocok dengan kualifikasi magang ini."}
                    {selectedStatus === "completed" && "🏆 Hebat! Anda telah menyelesaikan program magang secara resmi."}
                  </span>
                  
                  <button
                    onClick={() => {
                      playSound("success");
                      addLog(`LoA PDF mock downloaded for status: ${selectedStatus}`);
                    }}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Detail Selengkapnya &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Synth & Retro Audio Feedback */}
          {activeTab === "synth" && (
            <div className="p-8 bg-slate-900/50 border border-slate-800/80 rounded-3xl flex flex-col gap-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-indigo-400" />
                  <span>WebAudio Digital Synth & Sound Feedback</span>
                </h2>
                <p className="text-xs text-slate-400">
                  InternFlow menggunakan umpan balik suara digital yang lembut untuk menyempurnakan micro-interactions (interaksi tombol). Ketuk pad di bawah untuk menguji efek gelombang audio sintesis murni!
                </p>
              </div>

              {/* Sound synth pads grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: "click", label: "Button Click", desc: "Sine wave (600hz)", icon: Play, sound: "click" as const, color: "hover:border-slate-500 active:bg-slate-800" },
                  { id: "success", label: "Success Arpeggio", desc: "4-note major chord", icon: CheckCircle2, sound: "success" as const, color: "hover:border-emerald-500 active:bg-emerald-950/20" },
                  { id: "error", label: "Error Frequency", desc: "Sawtooth sweep down", icon: XCircle, sound: "error" as const, color: "hover:border-rose-500 active:bg-rose-950/20" },
                  { id: "bell", label: "Notification Bell", desc: "Decaying high ring", icon: Clock, sound: "bell" as const, color: "hover:border-cyan-500 active:bg-cyan-950/20" },
                ].map(pad => (
                  <button
                    key={pad.id}
                    onClick={() => {
                      playSound(pad.sound);
                      addLog(`Sound played: ${pad.label}`);
                    }}
                    className={`p-5 rounded-2xl bg-slate-950/70 border border-slate-850 flex flex-col items-center justify-center text-center gap-3 transition-all duration-200 hover:-translate-y-1 active:translate-y-0 cursor-pointer ${pad.color}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
                      <pad.icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{pad.label}</h4>
                      <p className="text-[9px] text-slate-500 mt-1 font-mono">{pad.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-850 text-xs text-slate-400">
                💡 <span className="font-semibold text-slate-200">Bagaimana ini bekerja?</span> Kami tidak menggunakan file audio eksternal (`.mp3` atau `.wav`) yang memperlambat pemuatan halaman. Semuanya disintesis secara dinamis langsung dari kode browser Anda menggunakan <span className="font-mono text-indigo-300">window.AudioContext</span>! Sangat cepat, modern, dan hemat kuota internet.
              </div>
            </div>
          )}

          {/* Tab 4: Micro-interactions Showcase */}
          {activeTab === "micro" && (
            <div className="p-8 bg-slate-900/50 border border-slate-800/80 rounded-3xl flex flex-col gap-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  <span>Premium Micro-interactions Playground</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Uji tombol interaktif dengan animasi premium dan transisi cair untuk memanjakan mata mahasiswa dan mentor yang menggunakannya.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Micro interaction 1: Dynamic liquid stepper slider */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-850 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Dynamic Liquid Circular Fill</h3>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{progressVal}%</span>
                  </div>

                  <div className="flex items-center justify-center p-4">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      {/* Outer neon border */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          className="stroke-slate-900"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          className="stroke-cyan-500 transition-all duration-300"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 48}
                          strokeDashoffset={2 * Math.PI * 48 * (1 - progressVal / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Percentage label in circle */}
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-lg font-extrabold text-white">{progressVal}%</span>
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Progress</span>
                      </div>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressVal}
                    onChange={(e) => {
                      setProgressVal(Number(e.target.value));
                      if (Number(e.target.value) % 10 === 0) playSound("click");
                    }}
                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                {/* Micro interaction 2: Simulated interactive internship submitter */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-850 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Simulated Submission Button</h3>
                    <p className="text-[11px] text-slate-400">
                      Uji visual transisi status tombol dari normal ke pemuatan asinkron (loading) hingga berhasil dikirim!
                    </p>
                  </div>

                  <div className="flex items-center justify-center py-6">
                    <button
                      onClick={triggerDemoButton}
                      disabled={buttonStatus !== "idle"}
                      className={`relative min-w-[200px] h-12 flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 select-none cursor-pointer shadow-lg ${
                        buttonStatus === "idle"
                          ? "bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-indigo-600/20"
                          : buttonStatus === "loading"
                          ? "bg-indigo-900/60 text-indigo-400 border border-indigo-700/30 cursor-wait"
                          : "bg-emerald-600 text-white shadow-emerald-600/20 animate-bounce"
                      }`}
                    >
                      {buttonStatus === "idle" && (
                        <span className="flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          <span>Kirim Lamaran</span>
                        </span>
                      )}
                      
                      {buttonStatus === "loading" && (
                        <span className="flex items-center gap-2.5">
                          <svg className="animate-spin h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Memproses lamaran...</span>
                        </span>
                      )}

                      {buttonStatus === "success" && (
                        <span className="flex items-center gap-2">
                          <Check className="w-4 h-4 font-extrabold animate-scaleUp" />
                          <span>Berhasil Dikirim!</span>
                        </span>
                      )}
                    </button>
                  </div>

                  <p className="text-[9px] text-slate-500 text-center">
                    Klik tombol di atas untuk melihat alur animasi transisi state yang premium.
                  </p>
                </div>
              </div>
            </div>
          )}

        </section>

      </main>

      {/* Aesthetic Footer Info */}
      <footer className="relative z-10 w-full max-w-6xl mt-12 py-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span>Dibuat dengan dedikasi penuh estetika untuk Skripsi Manajemen Magang: </span>
          <span className="font-semibold text-slate-300">InternFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-slate-300 transition-colors">Lab Docs</a>
          <span>&middot;</span>
          <a href="#" className="hover:text-slate-300 transition-colors">Component Specifications</a>
        </div>
      </footer>
    </div>
  );
}
