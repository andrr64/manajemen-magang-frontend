"use client";

import { useState, useMemo } from "react";
import {
  FileText, UploadCloud, AlertCircle, FileCheck,
  X, File as FileIcon, CheckCircle2, TrendingUp,
  CalendarDays, UserX, Stethoscope,
} from "lucide-react";
import { useSubmitAbsensi, useRiwayatAbsensi } from "@/modules/data_absensi/hooks";
import { useFileUpload } from "@/modules/media/hooks";
import { useMyStudentProfile } from "@/modules/data_mahasiswa/hooks";
import { SuccessToast } from "@/components/shared";
import { AttendanceLog } from "@/modules/data_absensi/types";

type IzinSakitStatus = "izin" | "sakit";

function localDateISO(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayISO() {
  return localDateISO();
}

function formatDateShort(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

function generateDateRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const cur = new Date(from + "T00:00:00");
  const end = new Date(to + "T00:00:00");
  while (cur <= end) {
    dates.push(localDateISO(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function StatusBadge({ type }: { type: AttendanceLog["type"] }) {
  const cfg: Record<AttendanceLog["type"], { cls: string; label: string }> = {
    Hadir:  { cls: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40", label: "Hadir" },
    Izin:   { cls: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/40", label: "Izin" },
    Sakit:  { cls: "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200/50 dark:border-sky-900/40", label: "Sakit" },
    Alpha:  { cls: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/40", label: "Tidak Hadir" },
  };
  const { cls, label } = cfg[type] ?? cfg.Alpha;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${cls}`}>
      {label}
    </span>
  );
}

export default function StudentAttendancePage() {
  const [status, setStatus] = useState<IzinSakitStatus>("izin");
  const [notes, setNotes]   = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [attachmentKey, setAttachmentKey] = useState<string | null>(null);
  const [dragActive, setDragActive]       = useState(false);
  const [showToast, setShowToast]         = useState(false);

  const { submit, isSubmitting }                        = useSubmitAbsensi();
  const { riwayat, isLoading: isLoadingRiwayat, refreshRiwayat } = useRiwayatAbsensi();
  const { profile }                                     = useMyStudentProfile();
  const { upload, isUploading, error: uploadError }     = useFileUpload({
    maxSizeMB: 10,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  });

  const today = todayISO();

  // Cek sudah absen hari ini
  const todayRecord = useMemo(
    () => riwayat.find(r => r.tanggalISO === today),
    [riwayat, today]
  );
  const sudahAbsen = !!todayRecord;

  // Bangun riwayat lengkap dari tanggalMulai s/d hari ini
  const fullHistory = useMemo(() => {
    const start = profile?.tanggalMulai;
    if (!start) return [...riwayat].reverse();

    const allDates = generateDateRange(start, today);
    const byDate   = new Map(riwayat.map(r => [r.tanggalISO!, r]));

    const result: AttendanceLog[] = allDates.map(date => {
      const rec = byDate.get(date);
      if (rec) return rec;
      return {
        id: `alpha-${date}`,
        date: formatDateShort(date),
        tanggalISO: date,
        type: "Alpha",
        checkIn: "-- : --",
        checkOut: "-- : --",
        document: null,
        status: "Diverifikasi",
      };
    });

    return result.reverse(); // terbaru di atas
  }, [profile, riwayat, today]);

  // Statistik client-side
  const stats = useMemo(() => {
    const total      = fullHistory.length;
    const hadir      = fullHistory.filter(r => r.type === "Hadir").length;
    const izin       = fullHistory.filter(r => r.type === "Izin").length;
    const sakit      = fullHistory.filter(r => r.type === "Sakit").length;
    const tidakHadir = fullHistory.filter(r => r.type === "Alpha").length;
    const pct        = total > 0 ? Math.round((hadir / total) * 100) : 0;
    const pctHadirTermasukIzin = total > 0 ? Math.round(((hadir + izin + sakit) / total) * 100) : 0;
    return { total, hadir, izin, sakit, tidakHadir, pct, pctHadirTermasukIzin };
  }, [fullHistory]);

  // File handlers
  const handleFile = async (file: File) => {
    setUploadedFile(file);
    setAttachmentKey(null);
    try {
      const result = await upload(file);
      setAttachmentKey(result.key);
    } catch (err: any) {
      setUploadedFile(null);
      alert(err.message || "Gagal mengunggah berkas.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const removeFile = () => { setUploadedFile(null); setAttachmentKey(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachmentKey) { alert("Silakan unggah dokumen pendukung terlebih dahulu."); return; }
    if (!notes.trim())  { alert("Keterangan wajib diisi."); return; }
    try {
      await submit({ status, keterangan: notes, attachmentUrl: attachmentKey });
      refreshRiwayat();
      setShowToast(true);
      setNotes(""); setUploadedFile(null); setAttachmentKey(null);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal mengirimkan laporan presensi.");
    }
  };

  return (
    <div className="space-y-6 relative pb-10">

      <SuccessToast
        variant="mahasiswa"
        show={showToast}
        message="Laporan presensi Anda hari ini telah tersimpan."
        title="Presensi Berhasil Dikirim"
        icon={<FileCheck className="w-5 h-5 text-white" />}
      />

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Hadir",       value: stats.hadir,      icon: CheckCircle2,  color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40" },
          { label: "Izin",        value: stats.izin,       icon: FileText,       color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-900/40" },
          { label: "Sakit",       value: stats.sakit,      icon: Stethoscope,   color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border-sky-200/50 dark:border-sky-900/40" },
          { label: "Tidak Hadir", value: stats.tidakHadir, icon: UserX,         color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200/50 dark:border-rose-900/40" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`p-5 rounded-3xl border ${color} flex items-center gap-4 shadow-sm`}>
            <div className={`p-3 rounded-2xl border ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-80">{label}</span>
              <p className="text-xl font-black leading-none mt-1">{value} <span className="text-xs font-bold opacity-70">hari</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* PERSENTASE KEHADIRAN */}
      <div className="border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 bg-white dark:bg-[#121358]/40 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#36ADA3]" />
            <span className="font-extrabold text-sm text-[#232F72] dark:text-white">Persentase Kehadiran</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-[#232F72] dark:text-white">{stats.pct}%</span>
            <span className="text-[10px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold block">dari {stats.total} hari</span>
          </div>
        </div>
        <div className="w-full h-3 bg-[#F1F5F9] dark:bg-[#232F72] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#232F72] to-[#36ADA3] rounded-full transition-all duration-700"
            style={{ width: `${stats.pct}%` }}
          />
        </div>
        <div className="flex items-center gap-4 text-[10px] font-semibold text-[#2F578A]/80 dark:text-[#F1F5F9]/50">
          <span>Termasuk izin & sakit: <strong className="text-[#232F72] dark:text-white">{stats.pctHadirTermasukIzin}%</strong></span>
          {profile?.tanggalMulai && (
            <span>Magang sejak: <strong className="text-[#232F72] dark:text-white">{formatDateShort(profile.tanggalMulai)}</strong></span>
          )}
        </div>
      </div>

      {/* TWO PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT: FORM IZIN / SAKIT */}
        <div className="lg:col-span-7">
          <div className="border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-6 md:p-8 shadow-xl bg-white dark:bg-[#121358] space-y-6">

            <div className="flex items-center justify-between pb-3.5 border-b border-[#2F578A]/20 dark:border-[#2F578A]/40">
              <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#36ADA3]" />
                Laporan Izin / Sakit
              </h4>
              <span className="text-[10px] font-extrabold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 uppercase tracking-wide">
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>

            {sudahAbsen ? (
              /* Sudah ada absensi hari ini */
              <div className="py-8 flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-black text-sm text-[#232F72] dark:text-white">Absensi Hari Ini Sudah Tercatat</p>
                  <p className="text-xs text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold mt-1">
                    Status: <StatusBadge type={todayRecord!.type} />
                  </p>
                </div>
                <p className="text-[11px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 max-w-xs">
                  Laporan presensi Anda untuk hari ini sudah tersimpan. Kembali besok untuk melaporkan izin atau sakit.
                </p>
              </div>
            ) : (
              /* Form izin / sakit */
              <form onSubmit={handleSubmit} className="space-y-6 text-xs font-bold text-[#232F72] dark:text-[#F1F5F9]">

                {/* Pilih status */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-[#2F578A] dark:text-[#F1F5F9]/50 tracking-wider">
                    Jenis Laporan <span className="text-[#36ADA3]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { val: "izin",  label: "Izin",  icon: FileText,      desc: "Keperluan resmi / kegiatan kampus" },
                      { val: "sakit", label: "Sakit", icon: Stethoscope,   desc: "Dengan surat keterangan dokter" },
                    ] as const).map(({ val, label, icon: Icon, desc }) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setStatus(val)}
                        className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer text-center ${
                          status === val
                            ? "bg-[#36ADA3]/10 border-[#36ADA3] text-[#36ADA3] shadow-[0_0_15px_rgba(54,173,163,0.2)] scale-[1.02]"
                            : "bg-[#F8FAFC]/50 border-[#2F578A]/30 dark:bg-[#232F72]/30 dark:border-[#2F578A] text-[#2F578A] dark:text-[#F1F5F9]/70 hover:bg-[#F8FAFC] dark:hover:bg-[#232F72]"
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${status === val ? "text-[#36ADA3]" : "text-[#2F578A] dark:text-[#F1F5F9]/50"}`} />
                        <span className="text-xs font-black uppercase tracking-wider">{label}</span>
                        <span className="text-[9px] font-semibold opacity-70">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload dokumen */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-[#2F578A] dark:text-[#F1F5F9]/50 tracking-wider flex items-center gap-1">
                      Dokumen Pendukung ({status === "izin" ? "Surat Tugas/Izin" : "Surat Sakit Dokter"}) <span className="text-[#36ADA3]">*</span>
                    </label>
                    <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/40">PDF, JPG, PNG — maks 10MB</span>
                  </div>

                  {!uploadedFile ? (
                    <div
                      onDragEnter={handleDrag} onDragOver={handleDrag}
                      onDragLeave={handleDrag} onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all ${
                        dragActive
                          ? "border-[#36ADA3] bg-[#36ADA3]/5"
                          : "border-[#2F578A]/50 dark:border-[#2F578A] bg-[#F8FAFC]/40 dark:bg-[#232F72]/20 hover:border-[#36ADA3]"
                      }`}
                    >
                      <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="p-3 bg-[#36ADA3]/10 text-[#36ADA3] rounded-2xl border border-[#36ADA3]/20 shadow-sm mb-3">
                        <UploadCloud className="w-6 h-6 animate-pulse" />
                      </div>
                      <p className="text-xs text-[#232F72] dark:text-[#F1F5F9] font-extrabold">
                        Tarik & Lepas, atau <span className="text-[#36ADA3] hover:underline">Pilih Berkas</span>
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-[#F8FAFC] dark:bg-[#232F72]/40 border border-[#2F578A]/30 dark:border-[#2F578A] rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl border border-[#36ADA3]/20">
                          <FileIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-[#232F72] dark:text-white truncate">{uploadedFile.name}</p>
                          <span className="text-[9px] text-[#2F578A] dark:text-[#F1F5F9]/50 block mt-0.5">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB · {isUploading ? "Mengunggah..." : attachmentKey ? "Berhasil Diunggah ✓" : "Berkas Terpilih"}
                          </span>
                        </div>
                      </div>
                      <button type="button" onClick={removeFile} className="p-1.5 bg-[#2F578A]/10 hover:bg-rose-500 text-[#2F578A] dark:text-[#F1F5F9]/70 hover:text-white rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {uploadError && <p className="text-[10px] text-rose-500 font-bold">{uploadError}</p>}
                </div>

                {/* Keterangan */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#2F578A] dark:text-[#F1F5F9]/50 tracking-wider">
                    Keterangan / Alasan <span className="text-[#36ADA3]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    required
                    placeholder={status === "izin" ? "Jelaskan keperluan izin Anda..." : "Jelaskan kondisi sakit / rujukan dokter..."}
                    className="w-full px-4 py-3.5 bg-[#F8FAFC] focus:bg-white dark:bg-[#232F72]/30 border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#36ADA3] focus:ring-1 focus:ring-[#36ADA3] rounded-2xl text-xs focus:outline-none transition-all dark:text-white font-semibold shadow-inner resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-[#2F578A]/20 dark:border-[#2F578A]/40 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading || !attachmentKey}
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#36ADA3] hover:bg-[#2eb1a6] disabled:bg-[#36ADA3]/50 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-[0_0_15px_rgba(54,173,163,0.3)] hover:shadow-[0_0_20px_rgba(54,173,163,0.5)] disabled:shadow-none transition-all text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    {isSubmitting
                      ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> Mengirim...</>
                      : !attachmentKey 
                        ? <><UploadCloud className="w-4 h-4" /> Unggah Dokumen Dahulu</>
                        : <><FileCheck className="w-4 h-4" /> Kirim Laporan {status === "izin" ? "Izin" : "Sakit"}</>
                    }
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>

        {/* RIGHT: RIWAYAT LENGKAP */}
        <div className="lg:col-span-5 border border-[#2F578A]/30 dark:border-[#2F578A]/50 rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#121358] space-y-4">
          <div>
            <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white">Riwayat Absensi</h4>
            <p className="text-[11px] text-[#2F578A] dark:text-[#F1F5F9]/70 font-semibold mt-0.5">
              Sejak awal magang hingga hari ini · {stats.total} hari total
            </p>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
            {isLoadingRiwayat ? (
              <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/50 font-semibold text-center py-8">Memuat riwayat...</p>
            ) : fullHistory.length === 0 ? (
              <p className="text-xs text-[#2F578A] dark:text-[#F1F5F9]/50 font-semibold text-center py-8">Belum ada riwayat absensi.</p>
            ) : fullHistory.map((item, idx) => (
              <div
                key={String(item.id) + idx}
                className={`px-3.5 py-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  item.type === "Alpha"
                    ? "bg-rose-50/60 dark:bg-rose-950/20 border-rose-100/60 dark:border-rose-900/30"
                    : item.type === "Hadir"
                    ? "bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-100/40 dark:border-emerald-900/20"
                    : "bg-[#F8FAFC] dark:bg-[#232F72]/30 border-[#2F578A]/20 dark:border-[#2F578A]/40"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[9px] font-black flex-shrink-0 ${
                    item.type === "Hadir"  ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                    : item.type === "Izin"  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                    : item.type === "Sakit" ? "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400"
                    : "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400"
                  }`}>
                    {item.tanggalISO ? new Date(item.tanggalISO + "T00:00:00").getDate() : "–"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold text-[#232F72] dark:text-white leading-tight truncate">{item.date}</p>
                    {item.notes && <p className="text-[9px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 mt-0.5 truncate">{item.notes}</p>}
                  </div>
                </div>
                <StatusBadge type={item.type} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
