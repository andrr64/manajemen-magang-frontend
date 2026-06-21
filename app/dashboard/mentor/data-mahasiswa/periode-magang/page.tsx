"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  School,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Edit2,
  Check,
  X,
  Loader2,
  ArrowRight,
  Briefcase
} from "lucide-react";
import { useStudents } from "@/modules/data_mahasiswa/hooks";
import { mahasiswaAPI } from "@/modules/data_mahasiswa/api";

interface StudentPeriod {
  studentId: number;
  startDate: string; // Format: YYYY-MM-DD
  endDate: string;   // Format: YYYY-MM-DD
}

export default function MentorInternshipPeriodPage() {
  const { rawStudents, refreshStudents, updateStudent } = useStudents();
  const studentsList = rawStudents;

  const [searchQuery, setSearchQuery] = useState("");
  const [showToast, setShowToast] = useState("");
  
  // Map student info with periods directly from studentsList
  const enrichedPeriods = useMemo(() => {
    return studentsList?.map(student => {
      return {
        studentId: student.id,
        startDate: student.tanggalMulai || "2026-02-01",
        endDate: student.tanggalBerakhir || "2026-07-31",
        studentName: student.name,
        studentNim: student.nim,
        studentAvatar: student.avatarColor,
        studentUniv: student.university,
        studentCompany: student.company
      };
    });
  }, [studentsList]);

  // States for Edit Modal Dialog
  const [editingStudentId, setEditingStudentId] = useState<number | string | null>(null);
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Filter student periods
  const filteredPeriods = enrichedPeriods.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    return (
      q === "" ||
      p.studentName.toLowerCase().includes(q) ||
      p.studentNim.includes(q) ||
      (p.studentCompany || "").toLowerCase().includes(q) ||
      p.studentUniv.toLowerCase().includes(q)
    );
  });

  // Automatically calculate status based on dates
  const calculatePeriodStatus = (startStr: string, endStr: string) => {
    const today = new Date();
    const start = new Date(startStr);
    const end = new Date(endStr);
    
    // Clear hours for accurate calendar comparison
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
 
    if (today < start) {
      return { label: "Belum Mulai", color: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/40" };
    } else if (today > end) {
      return { label: "Magang Selesai", color: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40" };
    } else {
      return { label: "Magang Aktif", color: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/40" };
    }
  };

  // Open Edit Modal Dialog
  const handleOpenEditModal = (studentId: number | string, start: string, end: string) => {
    setEditingStudentId(studentId);
    setEditStartDate(start);
    setEditEndDate(end);
  };

  // Save Period Edits
  const handleSavePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStartDate || !editEndDate) {
      alert("Harap lengkapi tanggal awal dan akhir kegiatan.");
      return;
    }

    if (new Date(editStartDate) > new Date(editEndDate)) {
      alert("Tanggal awal kegiatan tidak boleh melampaui tanggal akhir kegiatan.");
      return;
    }

    setIsSaving(true);

    try {
      // Format period string
      const formatIndoDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      };
      const periodStr = `${formatIndoDate(editStartDate)} - ${formatIndoDate(editEndDate)}`;

      await updateStudent(editingStudentId!, {
        periode: {
          tanggalMulai: editStartDate,
          tanggalBerakhir: editEndDate,
          status: "aktif"
        }
      });
      await refreshStudents();

      const studentName = studentsList.find(s => s.id === editingStudentId)?.name || "Mahasiswa";
      
      setIsSaving(false);
      setEditingStudentId(null);
      setShowToast(`Periode magang untuk ${studentName} sukses diperbarui!`);
      setTimeout(() => setShowToast(""), 3000);
    } catch (err) {
      setIsSaving(false);
      alert("Gagal menyimpan perubahan.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto relative">

      {/* FLOAT SUCCESS TOAST */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-2xl shadow-xl flex items-center gap-3 animate-float max-w-sm">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs font-bold leading-normal">{showToast}</span>
        </div>
      )}

      {/* EDIT MODAL DIALOG (YYYY-MM-DD Date picker) */}
      {editingStudentId !== null && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleSavePeriod}
            className="bg-white dark:bg-[#070e24] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-float"
          >
            {/* Modal Header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/35 text-indigo-600 rounded-xl">
                <Calendar className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                  Atur Periode Magang
                </h4>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">
                  Mahasiswa: {studentsList.find(s => s.id === editingStudentId)?.name}
                </p>
              </div>
            </div>

            {/* Modal Inputs (Awal & Akhir Kegiatan) */}
            <div className="space-y-4">
              
              {/* Tanggal Awal Kegiatan */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Awal Kegiatan (Tahun-Bulan-Tanggal) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Tanggal Akhir Kegiatan */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  Akhir Kegiatan (Tahun-Bulan-Tanggal) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <button
                type="button"
                onClick={() => setEditingStudentId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                Batal
              </button>
              
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-500/70 text-white font-extrabold rounded-xl shadow-md active:scale-95 flex items-center gap-1.5"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TOP NAVIGATION */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/mentor/data-mahasiswa"
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#070e24]/40 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Data Mahasiswa
        </Link>
        
        <span className="text-xs text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Atur Jangka Waktu Kegiatan Magang
        </span>
      </div>

      {/* HEADER TITLE */}
      <div>
        <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Kelola Periode Magang Industri
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
          Sesuaikan tanggal awal pelaksanaan dan akhir penugasan magang industri (MBKM) untuk memvalidasi pemenuhan target program akademik.
        </p>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm bg-white dark:bg-[#070e24]/40 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari mahasiswa bimbingan berdasarkan nama, NIM, universitas asal, atau perusahaan mitra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* TABLE DATA LISTING */}
      <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm bg-white dark:bg-[#070e24]/40 flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">
                <th className="pb-3.5 pl-4 font-bold">Mahasiswa</th>
                <th className="pb-3.5 font-bold">ID Mahasiswa (NIM)</th>
                <th className="pb-3.5 font-bold">Perusahaan Magang</th>
                <th className="pb-3.5 font-bold">Periode Magang (Awal s.d. Akhir)</th>
                <th className="pb-3.5 font-bold text-center">Status</th>
                <th className="pb-3.5 pr-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredPeriods?.map((p) => {
                const status = calculatePeriodStatus(p.startDate, p.endDate);
                
                return (
                  <tr key={p.studentId} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors group">
                    
                    {/* Column 1: Student info */}
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${p.studentAvatar} text-white font-extrabold flex items-center justify-center text-xs shadow-inner shadow-indigo-500/10`}>
                          {(p?.studentName || "U").split(" ").map(n=>n[0]).join("").substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-white leading-tight">
                            {p.studentName}
                          </p>
                          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block mt-0.5">
                            {p.studentUniv}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: NIM */}
                    <td className="py-4 font-bold text-slate-700 dark:text-slate-300">
                      {p.studentNim}
                    </td>

                    {/* Column 3: Company */}
                    <td className="py-4 text-slate-600 dark:text-slate-400 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{p.studentCompany}</span>
                      </div>
                    </td>

                    {/* Column 4: Periode Magang */}
                    <td className="py-4 text-slate-850 dark:text-slate-200 font-bold">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                        <span className="font-mono text-[11px]">{p.startDate}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase">s.d.</span>
                        <span className="font-mono text-[11px]">{p.endDate}</span>
                      </div>
                    </td>

                    {/* Column 5: Automatic Date Status */}
                    <td className="py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${status.color}`}>
                        {status.label}
                      </span>
                    </td>

                    {/* Column 6: Actions (Edit) */}
                    <td className="py-4 pr-4 text-right">
                      <button
                        onClick={() => handleOpenEditModal(p.studentId, p.startDate, p.endDate)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-indigo-650 hover:text-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-transparent text-[10px] font-black rounded-xl transition-all cursor-pointer hover:scale-[1.02] active:scale-95 shadow-sm"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit Periode
                      </button>
                    </td>

                  </tr>
                );
              })}

              {filteredPeriods.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-slate-400 font-extrabold">
                    Tidak ada data bimbingan yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
