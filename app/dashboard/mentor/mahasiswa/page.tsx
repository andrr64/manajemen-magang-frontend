"use client";

import { useState } from "react";
import { Search, Clock, Users } from "lucide-react";

export default function MentorStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const students = [
    {
      id: 1,
      name: "Budi Santoso",
      nim: "2201012001",
      program: "S1 Teknik Informatika",
      company: "PT. Global Teknologi Nusantara",
      progress: 85,
      status: "Aktif",
      logbooksPending: 2,
      lastActive: "Hari ini, 09:30"
    },
    {
      id: 2,
      name: "Siti Rahmawati",
      nim: "2201012042",
      program: "S1 Sistem Informasi",
      company: "Bank Central Indonesia Tbk.",
      progress: 60,
      status: "Aktif",
      logbooksPending: 4,
      lastActive: "Kemarin, 14:15"
    },
    {
      id: 3,
      name: "Rian Hidayat",
      nim: "2201012015",
      program: "S1 Teknik Informatika",
      company: "Shopee Indonesia",
      progress: 90,
      status: "Aktif",
      logbooksPending: 0,
      lastActive: "23 Mei 2026"
    },
    {
      id: 4,
      name: "Amanda Putri",
      nim: "2201012088",
      program: "S1 Desain Komunikasi Visual",
      company: "Gojek Tokopedia (GoTo)",
      progress: 40,
      status: "Dalam Review",
      logbooksPending: 5,
      lastActive: "20 Mei 2026"
    },
    {
      id: 5,
      name: "Dedi Kurniawan",
      nim: "2201012102",
      program: "S1 Sistem Informasi",
      company: "PT. Pertamina (Persero)",
      progress: 95,
      status: "Selesai",
      logbooksPending: 0,
      lastActive: "Hari ini, 08:00"
    }
  ];

  // Filter pencarian
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.nim.includes(searchQuery) ||
    student.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="glass-card border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-6 bg-white dark:bg-[#070e24]/40">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Daftar Lengkap Mahasiswa Bimbingan</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total terdaftar: {students.length} Mahasiswa Aktif di Semester Genap</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Cari nama, nim, atau perusahaan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-900 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-left">
              <th className="pb-3.5 font-bold">Mahasiswa</th>
              <th className="pb-3.5 font-bold">Program Studi</th>
              <th className="pb-3.5 font-bold">Lokasi Magang / Industri</th>
              <th className="pb-3.5 font-bold">Progres Kumulatif</th>
              <th className="pb-3.5 font-bold">Status</th>
              <th className="pb-3.5 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-xs">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-colors">
                <td className="py-4.5">
                  <p className="font-bold text-slate-900 dark:text-white">{student.name}</p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{student.nim}</span>
                </td>
                <td className="py-4.5">
                  <p className="font-semibold text-slate-600 dark:text-slate-300">{student.program}</p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Kelas Reguler</span>
                </td>
                <td className="py-4.5">
                  <p className="font-bold text-indigo-600 dark:text-indigo-400">{student.company}</p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" /> Terakhir aktif: {student.lastActive}
                  </span>
                </td>
                <td className="py-4.5 w-48">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <span>Logbook: {8 - student.logbooksPending}/8</span>
                      <span>{student.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-4.5">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${
                    student.status === "Selesai" 
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-900/40" 
                      : student.status === "Dalam Review"
                        ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/40 dark:border-amber-900/40"
                        : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-900/40"
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="py-4.5 text-right space-x-1.5">
                  <button onClick={() => alert(`Membuka chat bimbingan dengan ${student.name}`)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-[11px] font-bold rounded-xl transition-all">
                    Chat
                  </button>
                  <button onClick={() => alert(`Mengelola detail bimbingan ${student.name}`)} className="px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 hover:text-white text-[11px] font-bold text-white rounded-xl transition-all">
                    Kelola
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
