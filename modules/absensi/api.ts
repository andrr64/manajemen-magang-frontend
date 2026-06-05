import { executeHybridRequest, mockDB } from "../api-client";
import {
  AttendanceLog,
  AttendanceSummary,
  AbsensiMahasiswaStat,
  CheckInRequest,
  SubmitAbsensiRequest,
} from "./types";

// =====================================================================
// MOCK DATA
// =====================================================================

const INITIAL_ATTENDANCE: AttendanceLog[] = [
  { id: 1, date: "Kamis, 28 Mei 2026", type: "Hadir",  checkIn: "07:45 WIB", checkOut: "17:05 WIB", document: null,                        status: "Diverifikasi", studentId: 1, studentName: "Angelika Eve",    studentNim: "12220999" },
  { id: 2, date: "Kamis, 28 Mei 2026", type: "Hadir",  checkIn: "08:00 WIB", checkOut: "17:15 WIB", document: null,                        status: "Diverifikasi", studentId: 2, studentName: "Muhammad Rizky", studentNim: "12220456" },
  { id: 3, date: "Kamis, 28 Mei 2026", type: "Hadir",  checkIn: "07:30 WIB", checkOut: "16:45 WIB", document: null,                        status: "Diverifikasi", studentId: 3, studentName: "Siti Rahma",      studentNim: "12220789" },
  { id: 4, date: "Kamis, 28 Mei 2026", type: "Izin",   checkIn: "-- : --",   checkOut: "-- : --",   document: "surat_izin_semnas.pdf",     documentSize: "1.2 MB", notes: "Sakit gigi, izin berobat.", status: "Menunggu", studentId: 4, studentName: "Budi Santoso",   studentNim: "12220123" },
  { id: 5, date: "Kamis, 28 Mei 2026", type: "Hadir",  checkIn: "07:55 WIB", checkOut: "17:00 WIB", document: null,                        status: "Diverifikasi", studentId: 5, studentName: "Dewi Lestari",   studentNim: "12220234" },
  { id: 6, date: "Kamis, 28 Mei 2026", type: "Sakit",  checkIn: "-- : --",   checkOut: "-- : --",   document: "surat_dokter_klinik.pdf",   documentSize: "850 KB", notes: "Demam tinggi.", status: "Menunggu", studentId: 6, studentName: "Fajar Nugraha",  studentNim: "12220345" },
  { id: 7, date: "Kamis, 28 Mei 2026", type: "Hadir",  checkIn: "08:15 WIB", checkOut: "Pending",   document: null,                        status: "Diverifikasi", studentId: 7, studentName: "Larasati Putri", studentNim: "12220567" },
  { id: 8, date: "Kamis, 28 Mei 2026", type: "Hadir",  checkIn: "07:50 WIB", checkOut: "17:02 WIB", document: null,                        status: "Diverifikasi", studentId: 8, studentName: "Hendra Wijaya",  studentNim: "12220678" },
];

// =====================================================================
// MAPPERS — backend → frontend shape
// =====================================================================

function mapBackendAbsensiToFrontend(item: any): AttendanceLog {
  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "-- : --";
    try {
      const parts = timeStr.split("T");
      return parts.length > 1 ? parts[1].substring(0, 5) + " WIB" : timeStr;
    } catch (_) { return timeStr; }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });
    } catch (_) { return dateStr; }
  };

  const typeMap: Record<string, AttendanceLog["type"]> = {
    hadir: "Hadir", izin: "Izin", sakit: "Sakit", alpha: "Alpha",
  };

  const statusMap: Record<string, AttendanceLog["status"]> = {
    DISETUJUI: "Diverifikasi",
    PENDING:   "Menunggu",
    DITOLAK:   "Ditolak",
  };

  return {
    id:          item.id,
    date:        formatDate(item.tanggal),
    type:        typeMap[item.status?.toLowerCase()] ?? "Hadir",
    checkIn:     formatTime(item.waktuMasuk),
    checkOut:    formatTime(item.waktuKeluar),
    document:    item.attachmentUrl ?? null,
    status:      statusMap[item.statusVerifikasi?.toUpperCase()] ?? "Menunggu",
    studentId:   item.mahasiswaId,
    studentName: item.namaMahasiswa,
    studentNim:  item.nim,
  };
}

function mapBackendStatMahasiswa(data: any): AbsensiMahasiswaStat {
  return {
    totalHadir: data.totalHadir ?? 0,
    totalIzin:  data.totalIzin  ?? 0,
    totalSakit: data.totalSakit ?? 0,
    totalAlfa:  data.totalAlfa  ?? 0,
  };
}

/** Ambil userId dari localStorage token (ditulis saat login) */
function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("internflow_user_id");
}

// =====================================================================
// API — MENTOR SIDE
// =====================================================================

export const absensiAPI = {
  // -------------------------------------------------------------------
  // 1. List absensi semua mahasiswa (mentor)
  // -------------------------------------------------------------------
  getHistory: async (status?: string, namaMahasiswa?: string) => {
    const q = new URLSearchParams();
    if (status && status !== "Semua") q.append("status", status.toLowerCase());
    if (namaMahasiswa) q.append("namaMahasiswa", namaMahasiswa);

    return executeHybridRequest<AttendanceLog[]>(
      "Get attendance history list",
      `/api/absensi?${q.toString()}`,
      { method: "GET" },
      () => {
        let history = mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
        if (status && status !== "Semua")
          history = history.filter(h => h.type.toLowerCase() === status.toLowerCase());
        if (namaMahasiswa)
          history = history.filter(h =>
            h.studentName?.toLowerCase().includes(namaMahasiswa.toLowerCase())
          );
        return history;
      }
    ).then(res => {
      if (res.message.includes("Real")) {
        return { ...res, data: (res.data as any[]).map(mapBackendAbsensiToFrontend) };
      }
      return res;
    });
  },

  // -------------------------------------------------------------------
  // 2. Statistik absensi mentor (semua / filter nama)
  // -------------------------------------------------------------------
  getSummary: async (namaMahasiswa?: string) => {
    const q = new URLSearchParams();
    if (namaMahasiswa) q.append("namaMahasiswa", namaMahasiswa);

    return executeHybridRequest<AttendanceSummary>(
      "Calculate attendance statistics",
      `/api/absensi/statistik?${q.toString()}`,
      { method: "GET" },
      () => {
        const history = mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
        const present = history.filter(h => h.type === "Hadir").length;
        const sick    = history.filter(h => h.type === "Sakit").length;
        const leave   = history.filter(h => h.type === "Izin").length;
        const absent  = history.filter(h => h.type === "Alpha").length;
        const totalDays = 80;
        const percentage = parseFloat((((present + sick + leave) / Math.max(history.length, 1)) * 100).toFixed(1));
        return { present, sick, leave, absent, totalDays, percentage };
      }
    ).then(res => {
      if (res.message.includes("Real")) {
        const d = res.data as any;
        return {
          ...res,
          data: {
            present:    d.totalHadir      ?? 0,
            sick:       d.totalIzinSakit  ?? 0,
            leave:      0,
            absent:     0,
            totalDays:  80,
            percentage: parseFloat((((d.totalHadir ?? 0) / 80) * 100).toFixed(1)),
          } satisfies AttendanceSummary,
        };
      }
      return res;
    });
  },

  // -------------------------------------------------------------------
  // 3. Verifikasi absensi (mentor)
  // -------------------------------------------------------------------
  verifyAttendance: async (id: string | number, status: "Diverifikasi" | "Ditolak") => {
    const action = status === "Diverifikasi" ? "setujui" : "tolak";
    return executeHybridRequest<AttendanceLog>(
      `Verify attendance ID: ${id} → ${status}`,
      `/api/absensi/${id}/verifikasi?action=${action}`,
      { method: "POST" },
      () => {
        const history = mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
        const idx = history.findIndex(h => h.id === id);
        if (idx === -1) throw new Error("Log absensi tidak ditemukan.");
        history[idx].status = status;
        mockDB.set("attendance_history", history);
        return history[idx];
      }
    ).then(res => {
      if (res.message.includes("Real")) return { ...res, data: mapBackendAbsensiToFrontend(res.data) };
      return res;
    });
  },

  // -------------------------------------------------------------------
  // 4. Hapus absensi (mentor)
  // -------------------------------------------------------------------
  deleteAttendance: async (id: string | number) => {
    return executeHybridRequest<void>(
      `Delete attendance ID: ${id}`,
      `/api/absensi/${id}`,
      { method: "DELETE" },
      () => {
        const filtered = mockDB
          .get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE)
          .filter(h => h.id !== id);
        mockDB.set("attendance_history", filtered);
      }
    );
  },

  // -------------------------------------------------------------------
  // 5. Ekspor CSV (mentor)
  // -------------------------------------------------------------------
  exportAbsensi: async (status?: string, namaMahasiswa?: string) => {
    const q = new URLSearchParams();
    if (status && status !== "Semua") q.append("status", status.toLowerCase());
    if (namaMahasiswa) q.append("namaMahasiswa", namaMahasiswa);

    return executeHybridRequest<string>(
      "Export attendance records",
      `/api/absensi/ekspor?${q.toString()}`,
      { method: "GET" },
      () => {
        let list = mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
        if (status && status !== "Semua")
          list = list.filter(h => h.type.toLowerCase() === status.toLowerCase());
        const header = "No;Tanggal;NIM;Nama Mahasiswa;Jam Masuk;Jam Keluar;Status Presensi;Status Verifikasi;URL Lampiran\n";
        const rows = list
          .map((h, i) =>
            `${i + 1};${h.date};${h.studentNim ?? "-"};${h.studentName ?? "-"};${h.checkIn};${h.checkOut};${h.type.toUpperCase()};${h.status.toUpperCase()};${h.document ?? "-"}`
          )
          .join("\n");
        return header + rows;
      }
    );
  },

  // -------------------------------------------------------------------
  // 6. Lihat surat keterangan (mentor)
  // -------------------------------------------------------------------
  getSuratKeterangan: async (id: string | number) => {
    return executeHybridRequest<{ url: string }>(
      `Get surat keterangan ID: ${id}`,
      `/api/absensi/${id}/surat-keterangan`,
      { method: "GET" },
      () => {
        const history = mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
        const record = history.find(h => h.id === id);
        if (!record || !record.document)
          throw new Error("Tidak ada lampiran untuk absensi ini.");
        return { url: record.document };
      }
    );
  },

  // =====================================================================
  // API — MAHASISWA SIDE
  // =====================================================================

  // -------------------------------------------------------------------
  // 7. Submit absensi harian mahasiswa  (POST multipart/form-data)
  //    POST /api/absensi/mahasiswa/submit?userId=...
  // -------------------------------------------------------------------
  submitAbsensi: async (payload: SubmitAbsensiRequest) => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("Sesi tidak ditemukan. Silakan login ulang.");

    // Kirim sebagai multipart/form-data agar bisa membawa File
    const formData = new FormData();
    formData.append("userId",    userId);
    formData.append("status",    payload.status);
    if (payload.keterangan) formData.append("keterangan", payload.keterangan);
    if (payload.file)        formData.append("file",       payload.file);

    return executeHybridRequest<AttendanceLog>(
      "Submit absensi harian mahasiswa",
      "/api/absensi/mahasiswa/submit",
      {
        method: "POST",
        body:   formData,
        // Jangan set Content-Type manual — browser otomatis menambahkan boundary
      },
      () => {
        // ---- MOCK FALLBACK ----
        const history = mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
        const todayStr = new Date().toLocaleDateString("id-ID", {
          weekday: "long", day: "numeric", month: "long", year: "numeric",
        });

        if (history.some(h => h.date === todayStr))
          throw new Error("Anda sudah mengirimkan absensi hari ini!");

        const typeMap = { hadir: "Hadir", izin: "Izin", sakit: "Sakit" } as const;
        const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

        const newRecord: AttendanceLog = {
          id:           Date.now(),
          date:         todayStr,
          type:         typeMap[payload.status],
          checkIn:      payload.status === "hadir" ? `${now} WIB` : "-- : --",
          checkOut:     "Pending",
          document:     payload.file ? payload.file.name : null,
          documentSize: payload.file ? `${(payload.file.size / 1024).toFixed(0)} KB` : undefined,
          notes:        payload.keterangan,
          status:       payload.status === "hadir" ? "Diverifikasi" : "Menunggu",
        };

        history.unshift(newRecord);
        mockDB.set("attendance_history", history);
        return newRecord;
      }
    ).then(res => {
      if (res.message.includes("Real")) return { ...res, data: mapBackendAbsensiToFrontend(res.data) };
      return res;
    });
  },

  // -------------------------------------------------------------------
  // 8. Riwayat absensi 30 hari terakhir milik mahasiswa
  //    GET /api/absensi/mahasiswa/riwayat?userId=...
  // -------------------------------------------------------------------
  getRiwayatAbsensi: async () => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("Sesi tidak ditemukan. Silakan login ulang.");

    return executeHybridRequest<AttendanceLog[]>(
      "Get riwayat absensi mahasiswa",
      `/api/absensi/mahasiswa/riwayat?userId=${userId}`,
      { method: "GET" },
      () => {
        // Mock: kembalikan semua history milik user ini
        return mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
      }
    ).then(res => {
      if (res.message.includes("Real")) {
        return { ...res, data: (res.data as any[]).map(mapBackendAbsensiToFrontend) };
      }
      return res;
    });
  },

  // -------------------------------------------------------------------
  // 9. Statistik absensi pribadi mahasiswa
  //    GET /api/absensi/mahasiswa/statistik?userId=...
  // -------------------------------------------------------------------
  getMahasiswaStat: async () => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("Sesi tidak ditemukan. Silakan login ulang.");

    return executeHybridRequest<AbsensiMahasiswaStat>(
      "Get statistik absensi mahasiswa",
      `/api/absensi/mahasiswa/statistik?userId=${userId}`,
      { method: "GET" },
      () => {
        const history = mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
        return {
          totalHadir: history.filter(h => h.type === "Hadir").length,
          totalIzin:  history.filter(h => h.type === "Izin").length,
          totalSakit: history.filter(h => h.type === "Sakit").length,
          totalAlfa:  history.filter(h => h.type === "Alpha").length,
        };
      }
    ).then(res => {
      if (res.message.includes("Real")) return { ...res, data: mapBackendStatMahasiswa(res.data) };
      return res;
    });
  },

  // -------------------------------------------------------------------
  // 10. Legacy checkIn (alias ke submitAbsensi, untuk kompatibilitas komponen lama)
  // -------------------------------------------------------------------
  checkIn: async (payload: CheckInRequest) => {
    return absensiAPI.submitAbsensi({
      status:     payload.status,
      keterangan: payload.notes,
      file:       null,
    });
  },

  // -------------------------------------------------------------------
  // 11. Legacy checkOut — belum ada di backend, tetap mock only
  // -------------------------------------------------------------------
  checkOut: async () => {
    return executeHybridRequest<AttendanceLog>(
      "Check-out for today",
      "/api/absensi/mahasiswa/checkout",
      { method: "POST" },
      () => {
        const history = mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
        const todayStr = new Date().toLocaleDateString("id-ID", {
          weekday: "long", day: "numeric", month: "long", year: "numeric",
        });
        const idx = history.findIndex(h => h.date === todayStr);
        if (idx === -1) throw new Error("Anda belum check-in hari ini!");
        if (history[idx].type !== "Hadir") throw new Error("Check-out hanya untuk status Hadir.");
        if (history[idx].checkOut !== "Pending") throw new Error("Anda sudah check-out hari ini.");
        history[idx].checkOut = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
        mockDB.set("attendance_history", history);
        return history[idx];
      }
    );
  },
};
