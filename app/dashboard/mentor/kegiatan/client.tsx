"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Check,
  RefreshCw,
  Eye,
  Sparkles,
  Activity,
  Trash2,
  ChevronRight,
  XCircle,
  RotateCcw,
  Download,
  Loader2
} from "lucide-react";
import { useDownloadKegiatanMentorPDF } from "./useDownloadKegiatanMentorPDF";
import ttdImage from "../../mahasiswa/absensi/assets/ttd-pak-agus.png";
import { useMentorActivities, useRekapKegiatan } from "../../../../modules/data_kegiatan/hooks";
import { useStudents } from "../../../../modules/data_mahasiswa/hooks";
import { DataTable } from "@/components/ui/data-table";
import { SuccessToast, PageHeader, StatsGrid, StatItem } from "@/components/shared";

export interface ActivityLog {
  id: number;
  studentId: number;
  activityName: string;
  category: "Software Engineering" | "UI/UX Design" | "Data Analytics" | "Business Development" | "Administration";
  year: string;
  month: string;
  day: string;
  status: "Disetujui" | "Dalam Review";
  attachment: string | null;
}

export default function MentorActivitiesPage() {
  const [activeTab, setActiveTab] = useState<"data" | "ekspor">("data");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [eksporFilter, setEksporFilter] = useState<"Hari ini" | "Minggu ini" | "Bulan ini" | "Tahun ini">("Bulan ini");

  const { tanggalAwal, tanggalAkhir } = useMemo(() => {
    const today = new Date();
    let start = new Date(today);
    if (eksporFilter === "Hari ini") {
      start = new Date(today);
    } else if (eksporFilter === "Minggu ini") {
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      start = new Date(today.setDate(diff));
    } else if (eksporFilter === "Bulan ini") {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    } else {
      start = new Date(today.getFullYear(), 0, 1);
    }
    
    const formatDate = (date: Date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
    
    return {
      tanggalAwal: formatDate(start),
      tanggalAkhir: formatDate(new Date())
    };
  }, [eksporFilter]);

  const [showToast, setShowToast] = useState("");
  const [viewingActivityFile, setViewingActivityFile] = useState<{ studentName: string; activityName: string; fileUrls: string[] } | null>(null);

  const { activities, isLoading, approveActivity, revokeActivity, rejectActivity, getFileUrls } = useMentorActivities();
  const { rawStudents } = useStudents();
  const studentsList = rawStudents;

  const enrichedActivities = useMemo(() => {
    return activities?.map(act => {
      const student = studentsList.find(s => String(s.id) === String(act.studentId));
      return {
        ...act,
        studentName: student ? student.name : "Mahasiswa Tidak Dikenal",
        studentNim: student ? student.nim : "-",
        studentAvatar: student ? student.avatarColor : "from-slate-400 to-slate-500",
        studentUniv: student ? student.university : "-"
      };
    });
  }, [activities, studentsList]);

  const filteredActivities = useMemo(() => {
    return enrichedActivities.filter(act => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        act.studentName.toLowerCase().includes(q) ||
        act.studentNim.includes(q) ||
        act.activityName.toLowerCase().includes(q) ||
        act.studentUniv.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "Semua" || act.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enrichedActivities, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = enrichedActivities.length;
    const approved = enrichedActivities.filter(a => a.status === "Disetujui").length;
    const pending = enrichedActivities.filter(a => a.status === "Dalam Review").length;
    const ratio = total > 0 ? ((approved / total) * 100).toFixed(1) : "0.0";
    return { total, approved, pending, ratio };
  }, [enrichedActivities]);

  const [ttdBase64, setTtdBase64] = useState<string | null>(null);
  useEffect(() => {
    const src = typeof ttdImage === "string" ? ttdImage : (ttdImage as any).src;
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      setTtdBase64(canvas.toDataURL("image/png"));
    };
  }, []);

  const { data: rekapData } = useRekapKegiatan(tanggalAwal, tanggalAkhir);
  
  const { download: downloadPDF, isGenerating: isGeneratingPDF } = useDownloadKegiatanMentorPDF(
    rekapData, ttdBase64, stats, tanggalAwal, tanggalAkhir
  );

  const handleExportCSV = () => {
    if (!rekapData || rekapData.length === 0) return;
    const csvRows = ["No;Nama Mahasiswa;Kegiatan;Waktu"];
    rekapData.forEach((act, index) => {
      const formattedDate = new Date(act.waktu.split("T")[0]).toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });
      csvRows.push(`${index + 1};${act.namaMahasiswa};${act.namaKegiatan};${formattedDate}`);
    });
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `rekap_kegiatan_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCeklisActivity = async (actId: any, studentName: string) => {
    try {
      await approveActivity(actId);
      setShowToast(`Kegiatan mahasiswa ${studentName} berhasil disetujui (ceklis)!`);
      setTimeout(() => setShowToast(""), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal menyetujui kegiatan.");
    }
  };

  const handleRevokeActivity = async (actId: any, studentName: string) => {
    if (confirm(`Cabut persetujuan kegiatan ${studentName}? Status akan kembali ke "Menunggu".`)) {
      try {
        await revokeActivity(actId);
        setShowToast(`Persetujuan kegiatan ${studentName} berhasil dicabut.`);
        setTimeout(() => setShowToast(""), 4000);
      } catch (err: any) {
        alert(err.message || "Gagal mencabut persetujuan.");
      }
    }
  };

  const handleHapusActivity = async (actId: any, studentName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus log kegiatan dari ${studentName}?`)) {
      try {
        await rejectActivity(actId);
        setShowToast(`Log kegiatan ${studentName} berhasil dihapus dari sistem.`);
        setTimeout(() => setShowToast(""), 4000);
      } catch (err: any) {
        alert(err.message || "Gagal menghapus kegiatan.");
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#232F72] dark:text-white flex items-center gap-2">
            Kegiatan Mahasiswa
            {stats.pending > 0 && (
              <span className="flex h-5 w-5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-500 items-center justify-center text-[10px] text-white">!</span>
              </span>
            )}
          </h2>
          <p className="text-[#2F578A]/80 dark:text-[#F1F5F9]/60 text-sm mt-1 font-semibold max-w-xl">
            Tinjau dan setujui laporan kegiatan harian yang diajukan oleh mahasiswa.
          </p>
        </div>
      </div>

      <div className="flex border-b border-[#2F578A]/20 dark:border-[#2F578A]/50 mt-4">
        <button
          onClick={() => setActiveTab("data")}
          className={`pb-3 px-4 text-sm font-extrabold uppercase tracking-wide transition-all ${
            activeTab === "data"
              ? "border-b-2 border-[#36ADA3] text-[#232F72] dark:text-white"
              : "text-[#2F578A]/60 dark:text-[#F1F5F9]/40 hover:text-[#232F72] dark:hover:text-[#F1F5F9]"
          }`}
        >
          Data Kegiatan
        </button>
        <button
          onClick={() => setActiveTab("ekspor")}
          className={`pb-3 px-4 text-sm font-extrabold uppercase tracking-wide transition-all ${
            activeTab === "ekspor"
              ? "border-b-2 border-[#36ADA3] text-[#232F72] dark:text-white"
              : "text-[#2F578A]/60 dark:text-[#F1F5F9]/40 hover:text-[#232F72] dark:hover:text-[#F1F5F9]"
          }`}
        >
          Ekspor Rekap
        </button>
      </div>

      {/* FILE LIST MODAL */}
      {viewingActivityFile !== null && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setViewingActivityFile(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-[#121358] border border-[#2F578A]/50 dark:border-[#2F578A] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#2F578A]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#F8FAFC] dark:bg-[#232F72] border border-[#2F578A]/30 text-[#232F72] dark:text-white rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#232F72] dark:text-white leading-tight">Berkas Lampiran</h4>
                  <p className="text-[10px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold mt-0.5">{viewingActivityFile.studentName} · {viewingActivityFile.activityName}</p>
                </div>
              </div>
              <button onClick={() => setViewingActivityFile(null)} className="p-1.5 hover:bg-[#F8FAFC] dark:hover:bg-[#232F72] rounded-xl text-[#2F578A]/80 dark:text-[#F1F5F9]/50 cursor-pointer transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {viewingActivityFile.fileUrls.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-[#2F578A]/60 mx-auto" />
                <p className="text-xs font-bold text-[#232F72] dark:text-white">Tidak ada lampiran</p>
              </div>
            ) : (
              <div className="space-y-2">
                {viewingActivityFile.fileUrls.map((url, i) => {
                  const name = url.split("/").pop() || `berkas-${i + 1}`;
                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] dark:bg-[#232F72]/40 border border-[#2F578A]/20 dark:border-[#2F578A]/50 rounded-2xl hover:border-[#36ADA3] hover:bg-[#36ADA3]/5 transition-all group"
                    >
                      <div className="p-2 bg-[#36ADA3]/10 text-[#36ADA3] rounded-xl flex-shrink-0">
                        <Eye className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#232F72] dark:text-white truncate group-hover:text-[#36ADA3] transition-colors">{name}</span>
                    </a>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button onClick={() => setViewingActivityFile(null)} className="px-5 py-2 bg-[#232F72] hover:brightness-110 text-white font-extrabold rounded-xl text-xs shadow-md active:scale-95 transition-all cursor-pointer">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOAT SUCCESS TOAST */}
      <SuccessToast show={!!showToast} message={showToast} />
      
      {activeTab === "data" && (
        <div className="space-y-6">
          {/* ACTIVITY STATISTICS */}
          {(() => {
            const statsConfig: StatItem[] = [
              { label: "Total Kegiatan", value: stats.total, desc: "Tercatat Minggu Ini", colorClass: "text-[#232F72] dark:text-[#FFFFFF] bg-[#F8FAFC] dark:bg-[#232F72] border-[#2F578A]/30", icon: Activity },
              { label: "Disetujui Mentor", value: stats.approved, desc: "Ceklis Validasi", colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40", icon: CheckCircle },
              { label: "Perlu Tinjauan", value: stats.pending, desc: "Menunggu Approval", colorClass: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-900/40", icon: Clock },
            ];
            return <StatsGrid stats={statsConfig} gridClass="grid-cols-2 lg:grid-cols-3" />;
          })()}

          {/* FILTER & SEARCH PANEL */}
          <div className="glass-card border border-[#2F578A]/30 dark:border-[#2F578A] rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#121358]/40 dark:backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#232F72] dark:text-[#FFFFFF]" />
                <h4 className="font-extrabold text-sm text-[#232F72] dark:text-[#FFFFFF]">Panel Penyaringan Laporan Kegiatan</h4>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-9">
                <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mb-1.5">
                  Cari Berdasarkan Keyword
                </label>
                <div className="relative">
                  <input
                    type="text"
                placeholder="Cari nama mahasiswa, NIM, nama kegiatan, atau universitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
              />
              <Search className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-3.5 top-3" />
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mb-1.5">
              Status Validasi
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#232F72] text-[#232F72]/80 dark:text-[#F1F5F9]"
            >
              <option value="Semua">Semua Status</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Dalam Review">Dalam Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* MAIN DATA TABLE */}
      <DataTable
        data={filteredActivities ?? []}
        loading={isLoading}
        emptyMessage="Tidak ada log kegiatan yang cocok. Coba reset filter."
        className="rounded-3xl"
        columns={[
          {
            key: "no",
            label: "No.",
            render: (_, idx) => (
              <span className="font-bold text-slate-500 dark:text-slate-400">{idx + 1}</span>
            ),
          },
          {
            key: "nama",
            label: "Nama",
            render: (act) => (
              <Link href={`/dashboard/mentor/kegiatan/${act.studentId}`} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${act.studentAvatar} text-white font-extrabold flex items-center justify-center text-xs shadow-inner shadow-[#232F72]/10 group-hover:scale-105 transition-transform`}>
                  {(act?.studentName || "U").split(" ").map(n => n[0]).join("").substring(0, 2)}
                </div>
                <div>
                  <p className="font-extrabold text-[#232F72] dark:text-[#FFFFFF] leading-tight">
                    {act.studentName}
                  </p>
                  <span className="text-[10px] font-bold text-[#2F578A]/80 dark:text-[#F1F5F9]/50 block mt-0.5">
                    {act.studentUniv}
                  </span>
                </div>
              </Link>
            ),
          },
          {
            key: "nim",
            label: "ID Mahasiswa",
            render: (act) => (
              <Link href={`/dashboard/mentor/kegiatan/${act.studentId}`} className="font-bold text-[#232F72]/80 dark:text-[#F1F5F9] block py-1">
                {act.studentNim}
              </Link>
            ),
          },
          {
            key: "activityName",
            label: "Nama Kegiatan",
            render: (act) => (
              <Link href={`/dashboard/mentor/kegiatan/${act.studentId}`} className="font-bold text-[#232F72] dark:text-[#F1F5F9] block max-w-[240px]">
                {act.activityName}
              </Link>
            ),
          },
          {
            key: "waktu",
            label: "Waktu",
            render: (act) => (
              <div className="space-y-0.5 text-[#2F578A] dark:text-[#F1F5F9]/80 font-bold">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#232F72] dark:text-[#FFFFFF]" />
                  <span>Thn: {act.year}</span>
                </div>
                <p className="text-[10px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold pl-5">
                  Bln: {act.month} • Hari: {act.day}
                </p>
              </div>
            ),
          },
          {
            key: "attachment",
            label: "File Kegiatan",
            align: "center",
            render: (act) => {
              const fileUrls = getFileUrls(act);
              return (
                <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
                  {fileUrls.length > 0 ? (
                    <button
                      onClick={() => setViewingActivityFile({ studentName: act.studentName, activityName: act.activityName, fileUrls })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#232F72] dark:bg-[#232F72]/40 hover:text-white dark:hover:bg-[#121358] text-[#232F72] dark:text-white border border-[#2F578A]/30 rounded-xl font-bold transition-all text-[10px] hover:scale-[1.02] active:scale-95 shadow-sm cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{fileUrls.length} berkas</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-500 px-2 py-1 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/20 rounded-lg">
                      <AlertCircle className="w-3 h-3" />
                      Belum Diunggah
                    </span>
                  )}
                </div>
              );
            },
          },
          {
            key: "aksi",
            label: "AKSI",
            align: "center",
            render: (act) => (
              <div className="inline-flex items-center justify-center gap-1.5">
                {act.status === "Dalam Review" ? (
                  <button
                    onClick={() => handleCeklisActivity(act.id, act.studentName)}
                    className="p-1.5 bg-white hover:bg-emerald-50 border border-[#2F578A]/50 dark:bg-slate-900 dark:border-[#2F578A] text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                    title="Setujui Kegiatan"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleRevokeActivity(act.id, act.studentName)}
                    className="p-1.5 bg-amber-50 hover:bg-amber-500 dark:bg-amber-950/20 hover:text-white border border-amber-200/50 dark:border-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                    title="Cabut Persetujuan"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleHapusActivity(act.id, act.studentName)}
                  className="p-1.5 bg-white hover:bg-rose-50 border border-[#2F578A]/50 dark:bg-slate-900 dark:border-[#2F578A] text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                  title="Hapus Log Kegiatan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ),
          },
          {
            key: "status",
            label: "Status",
            align: "right",
            render: (act) => (
              <div className="flex items-center justify-end gap-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${
                  act.status === "Disetujui"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40"
                    : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/40 animate-pulse"
                }`}>
                  {act.status}
                </span>
                <Link href={`/dashboard/mentor/kegiatan/${act.studentId}`} className="p-1 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 hover:text-[#232F72] dark:hover:text-[#FFFFFF] transition-colors ml-1">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ),
          },
        ]}
      />

      {/* GEOLOCATION NOTES */}
      <div className="p-4 bg-slate-50 dark:bg-[#121358]/40 dark:backdrop-blur-md border border-[#2F578A]/50/40 dark:border-[#2F578A] rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#232F72] dark:text-[#FFFFFF] flex-shrink-0 mt-0.5" />
        <div className="text-[10px] text-[#2F578A]/80 dark:text-[#F1F5F9]/50 font-semibold leading-relaxed">
          <strong>Petunjuk Penggunaan Verifikasi Kegiatan:</strong> Gunakan tombol tindakan pada kolom <strong>AKSI</strong> untuk memverifikasi kesesuaian tugas mahasiswa bimbingan secara cepat tanpa membuka detail, atau menolak log kegiatan yang tidak sesuai dengan kurikulum magang akademik.
        </div>
      </div>
      </div>
      )}

      {activeTab === "ekspor" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex bg-[#F8FAFC] dark:bg-[#121358]/60 p-1 rounded-2xl border border-[#2F578A]/20 dark:border-[#2F578A]/40 w-max overflow-x-auto max-w-full">
              {["Hari ini", "Minggu ini", "Bulan ini", "Tahun ini"].map(filter => (
                <button
                  key={filter}
                  onClick={() => setEksporFilter(filter as any)}
                  className={`whitespace-nowrap px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                    eksporFilter === filter
                      ? "bg-white dark:bg-[#232F72] text-[#232F72] dark:text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-[#232F72] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#232F72]/50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                disabled={!rekapData || rekapData.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-extrabold
                           bg-emerald-600 dark:bg-emerald-500 text-white
                           hover:bg-emerald-700 dark:hover:bg-emerald-600
                           disabled:opacity-60 disabled:cursor-not-allowed
                           shadow-[0_0_14px_rgba(5,150,105,0.25)] dark:shadow-[0_0_14px_rgba(16,185,129,0.3)]
                           transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
              <button
                onClick={downloadPDF}
                disabled={isGeneratingPDF || !rekapData || rekapData.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-extrabold
                           bg-[#232F72] dark:bg-[#36ADA3] text-white
                           hover:bg-[#1a2256] dark:hover:bg-[#2eb1a6]
                           disabled:opacity-60 disabled:cursor-not-allowed
                           shadow-[0_0_14px_rgba(35,47,114,0.25)] dark:shadow-[0_0_14px_rgba(54,173,163,0.3)]
                           transition-all active:scale-95 cursor-pointer"
              >
                {isGeneratingPDF
                  ? <><Loader2 className="w-4 h-4 animate-spin"/> Membuat PDF...</>
                  : <><Download className="w-4 h-4" /> Download PDF</>
                }
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f1535] border border-[#2F578A]/20 dark:border-[#2F578A]/40 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12 space-y-8 text-[#1a1a2e] dark:text-[#e8eaf6]">
              {/* KOP */}
              <div className="text-center space-y-1 border-b-4 border-double border-[#232F72]/30 dark:border-[#36ADA3]/30 pb-6">
                <h2 className="font-black text-base md:text-lg uppercase tracking-widest text-[#232F72] dark:text-white">
                  Rekapitulasi Kegiatan Magang
                </h2>
                <h3 className="font-bold text-sm uppercase tracking-widest text-[#232F72] dark:text-white opacity-80">
                  Direktorat Wilayah 1
                </h3>
              </div>

              {/* INFO FILTER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 text-[12px]">
                <div className="flex gap-2">
                  <span className="font-bold text-[#2F578A] dark:text-[#36ADA3] w-36 flex-shrink-0">Tipe Laporan</span>
                  <span className="font-semibold text-[#232F72] dark:text-white">:&nbsp;Rekap Kegiatan Seluruh Mahasiswa</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-[#2F578A] dark:text-[#36ADA3] w-36 flex-shrink-0">Periode Kegiatan</span>
                  <span className="font-semibold text-[#232F72] dark:text-white">:&nbsp;
                    {new Date(tanggalAwal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} - {new Date(tanggalAkhir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="border-t border-dashed border-[#2F578A]/25 dark:border-[#2F578A]/40" />

              {/* TABEL */}
              <div className="overflow-x-auto rounded-2xl border border-[#2F578A]/20 dark:border-[#2F578A]/30">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-[#232F72] dark:bg-[#0d1a4a] text-white">
                      <th className="py-3 px-4 text-center font-extrabold uppercase tracking-wider border-r border-white/10 w-12">No.</th>
                      <th className="py-3 px-5 text-left font-extrabold uppercase tracking-wider border-r border-white/10">Nama Mahasiswa</th>
                      <th className="py-3 px-5 text-left font-extrabold uppercase tracking-wider border-r border-white/10">Nama Kegiatan</th>
                      <th className="py-3 px-5 text-center font-extrabold uppercase tracking-wider">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!rekapData || rekapData.length === 0 ? (
                      <tr><td colSpan={4} className="py-12 text-center text-[#2F578A]/80">Tidak ada data rekap kegiatan.</td></tr>
                    ) : (
                      rekapData.map((act, idx) => {
                        const d = new Date(act.waktu.split("T")[0]).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric",
                        });
                        return (
                          <tr key={idx} className="border-b border-[#2F578A]/10 dark:border-[#2F578A]/20 hover:bg-[#F8FAFC] dark:hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4 text-center border-r border-[#2F578A]/10 dark:border-[#2F578A]/20">{idx + 1}</td>
                            <td className="py-3 px-5 border-r border-[#2F578A]/10 dark:border-[#2F578A]/20 font-bold">{act.namaMahasiswa || "-"}</td>
                            <td className="py-3 px-5 border-r border-[#2F578A]/10 dark:border-[#2F578A]/20 font-semibold">{act.namaKegiatan}</td>
                            <td className="py-3 px-5 text-center font-semibold">{d}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* TANDA TANGAN */}
              <div className="flex justify-end pt-8">
                <div className="text-center space-y-1">
                  <p className="text-[11px] font-semibold text-[#2F578A]/80 dark:text-[#F1F5F9]/60">Jakarta, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                  <div className="h-20 flex items-center justify-center">
                    {ttdBase64 && <img src={ttdBase64} alt="Tanda Tangan" className="h-16 object-contain" />}
                  </div>
                  <p className="font-extrabold text-[#232F72] dark:text-white underline underline-offset-4">Agus Joko Saptono</p>
                  <p className="text-[11px] font-bold text-[#2F578A]/80 dark:text-[#36ADA3]">(Direktur Wilayah 1)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
