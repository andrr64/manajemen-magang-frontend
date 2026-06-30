"use client";
import { WEB_ROUTES } from "@/modules/web-routes";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useIam } from "@/modules/iam/hooks";
import { RegisterRequest } from "@/modules/iam/types";
import { Building2, GraduationCap, ArrowRight, Loader2, Mail, Lock, User, Phone, CreditCard } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useIam();
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [role, setRole] = useState<"mahasiswa" | "mentor">("mahasiswa");
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    noHp: "",
    nim: "",
    gender: "",
    universitas: "",
    secretKey: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const payload: RegisterRequest = {
        nama: formData.nama,
        email: formData.email,
        password: formData.password,
        role: role,
        noHp: formData.noHp || undefined,
        nim: role === "mahasiswa" ? formData.nim : undefined,
        gender: (formData.gender as "Laki-laki" | "Perempuan" | "-") || undefined,
        universitas: formData.universitas || undefined,
        secretKey: role === "mentor" ? formData.secretKey : undefined,
      };

      await register(payload);
      
      // After successful registration & automatic login inside the hook
      // Redirect to root dispatcher to centralize logic
      router.push(WEB_ROUTES.DASHBOARD);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat mendaftar.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex font-sans text-neutral-100">
      {/* Left side: Artistic graphic / Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-900 to-indigo-950 p-12 overflow-hidden flex-col justify-between">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-blue-600/20 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] rounded-full bg-indigo-500/20 blur-[100px]"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-xl shadow-blue-900/50">
              <Image src="/favicon.ico" alt="Logo" width={48} height={48} className="object-contain w-full h-full p-1" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white whitespace-nowrap">
              Direktorat <span className="text-cyan-400">Wilayah 1</span>
            </span>
          </div>
        </div>

        <div className="relative z-10 mt-auto">
          <h1 className="text-5xl font-extrabold leading-tight text-white mb-6">
            Mulai Perjalanan <br />Karir Anda di Sini.
          </h1>
          <p className="text-blue-200 text-lg max-w-md leading-relaxed">
            Platform manajemen magang terpadu yang mempertemukan mahasiswa berbakat dengan mentor profesional di industri.
          </p>
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        {/* Subtle background glow for mobile */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] bg-blue-600/10 blur-[100px] lg:hidden rounded-full pointer-events-none"></div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
              <Image src="/favicon.ico" alt="Logo" width={40} height={40} className="object-contain w-full h-full p-1" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white whitespace-nowrap">
              Direktorat <span className="text-cyan-400">Wilayah 1</span>
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Buat Akun Baru</h2>
            <p className="text-neutral-400">Silakan lengkapi data diri Anda di bawah ini.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-300">Daftar Sebagai</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("mahasiswa")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${
                    role === "mahasiswa" 
                      ? "bg-blue-600/10 border-blue-500 text-blue-400" 
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-medium">Mahasiswa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("mentor")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${
                    role === "mentor" 
                      ? "bg-indigo-600/10 border-indigo-500 text-indigo-400" 
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">Mentor</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  name="nama"
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Alamat Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Kata Sandi (min. 6 karakter)"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
                />
              </div>

              {role === "mahasiswa" && (
                <>
                  <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-neutral-500" />
                    </div>
                    <input
                      name="noHp"
                      type="tel"
                      placeholder="Nomor Handphone (opsional)"
                      value={formData.noHp}
                      onChange={handleChange}
                      className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
                    />
                  </div>

                  <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-neutral-500" />
                    </div>
                    <input
                      name="nim"
                      type="text"
                      required
                      placeholder="Nomor Induk Mahasiswa (NIM)"
                      value={formData.nim}
                      onChange={handleChange}
                      className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
                    />
                  </div>

                  <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange as any}
                      required
                      className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
                    >
                      <option value="" disabled className="text-neutral-600">Pilih Jenis Kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-neutral-500" />
                    </div>
                    <input
                      name="universitas"
                      type="text"
                      required
                      placeholder="Asal Universitas / Instansi"
                      value={formData.universitas}
                      onChange={handleChange}
                      className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
                    />
                  </div>
                </>
              )}

              {role === "mentor" && (
                <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    name="secretKey"
                    type="password"
                    required
                    placeholder="Kunci Rahasia Mentor (Secret Key)"
                    value={formData.secretKey}
                    onChange={handleChange}
                    className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
                  />
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white hover:bg-neutral-200 text-neutral-950 font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-neutral-400 text-sm mt-8">
              Sudah memiliki akun?{" "}
              <button 
                type="button" 
                onClick={() => router.push(WEB_ROUTES.LOGIN)}
                className="text-white hover:text-blue-400 font-medium hover:underline transition-colors"
              >
                Masuk di sini
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
