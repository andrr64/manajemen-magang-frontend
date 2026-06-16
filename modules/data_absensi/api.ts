import { executeHybridRequest } from "../api-client";
import { API_ROUTES } from "../api-routes";
import {
  AttendanceLog,
  AttendanceSummary,
  AbsensiMahasiswaStat,
  CheckInRequest,
  SubmitAbsensiRequest,
  AbsensiResponse,
  AbsensiStatResponse,
  AbsensiMahasiswaStatResponse,
} from "./types";

// =====================================================================
// MOCK DATA
// =====================================================================
// =====================================================================
// MAPPERS — backend → frontend shape
// =====================================================================

function mapBackendAbsensiToFrontend(item: AbsensiResponse): AttendanceLog {
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
    checkIn:     "-- : --",
    checkOut:    "-- : --",
    document:    item.attachmentUrl ?? null,
    status:      "Diverifikasi",
    studentId:   item.mahasiswaId,
    studentName: item.namaMahasiswa,
    studentNim:  item.nim,
  };
}

function mapBackendStatMahasiswa(data: AbsensiMahasiswaStatResponse): AbsensiMahasiswaStat {
  return {
    totalHadir: Number(data.totalHadir ?? 0),
    totalIzin:  Number(data.totalIzin  ?? 0),
    totalSakit: Number(data.totalSakit ?? 0),
    totalAlfa:  Number(data.totalAlfa  ?? 0),
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

    return executeHybridRequest<AbsensiResponse[]>(
      "Get attendance history list",
      `${API_ROUTES.ABSENSI_LIST}?${q.toString()}`,
      { method: "GET" }
    ).then(res => {
      return {
        ...res,
        data: res.data.map(mapBackendAbsensiToFrontend)
      };
    });
  },

  // -------------------------------------------------------------------
  // 2. Statistik absensi mentor (semua / filter nama)
  // -------------------------------------------------------------------
  getSummary: async (namaMahasiswa?: string) => {
    const q = new URLSearchParams();
    if (namaMahasiswa) q.append("namaMahasiswa", namaMahasiswa);

    return executeHybridRequest<AbsensiStatResponse>(
      "Calculate attendance statistics",
      `${API_ROUTES.ABSENSI_STATISTIK}?${q.toString()}`,
      { method: "GET" }
    ).then(res => {
      const d = res.data;
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
    });
  },

  // -------------------------------------------------------------------
  // 3. Verifikasi absensi (mentor)
  // -------------------------------------------------------------------
  verifyAttendance: async (id: string | number, status: "Diverifikasi" | "Ditolak") => {
    const action = status === "Diverifikasi" ? "setujui" : "tolak";
    return executeHybridRequest<AbsensiResponse>(
      `Verify attendance ID: ${id} → ${status}`,
      `${API_ROUTES.ABSENSI_VERIFY(id)}?action=${action}`,
      { method: "POST" }
    ).then(res => {
      return {
        ...res,
        data: mapBackendAbsensiToFrontend(res.data)
      };
    });
  },

  // -------------------------------------------------------------------
  // 4. Hapus absensi (mentor)
  // -------------------------------------------------------------------
  deleteAttendance: async (id: string | number) => {
    return executeHybridRequest<void>(
      `Delete attendance ID: ${id}`,
      API_ROUTES.ABSENSI_DELETE(id),
      { method: "DELETE" }
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
      `${API_ROUTES.ABSENSI_EKSPOR}?${q.toString()}`,
      { method: "GET" }
    );
  },

  // -------------------------------------------------------------------
  // 6. Lihat surat keterangan (mentor)
  // -------------------------------------------------------------------
  getSuratKeterangan: async (id: string | number) => {
    return executeHybridRequest<{ url: string }>(
      `Get surat keterangan ID: ${id}`,
      API_ROUTES.ABSENSI_SURAT_KET(id),
      { method: "GET" }
    );
  },

  // =====================================================================
  // API — MAHASISWA SIDE
  // =====================================================================

  // -------------------------------------------------------------------
  // 7. Submit absensi harian mahasiswa  (POST JSON)
  //    POST /api/absensi/mahasiswa/submit?userId=...
  // -------------------------------------------------------------------
  submitAbsensi: async (payload: SubmitAbsensiRequest) => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("Sesi tidak ditemukan. Silakan login ulang.");

    // Kirim userId via query param
    const q = new URLSearchParams();
    q.append("userId", userId);

    return executeHybridRequest<AbsensiResponse>(
      "Submit absensi harian mahasiswa",
      `${API_ROUTES.ABSENSI_SUBMIT}?${q.toString()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: payload.status,
          keterangan: payload.keterangan,
          attachmentUrl: payload.attachmentUrl ?? null,
        }),
      }
    ).then(res => {
      return {
        ...res,
        data: mapBackendAbsensiToFrontend(res.data)
      };
    });
  },

  // -------------------------------------------------------------------
  // 8. Riwayat absensi 30 hari terakhir milik mahasiswa
  //    GET /api/absensi/mahasiswa/riwayat?userId=...
  // -------------------------------------------------------------------
  getRiwayatAbsensi: async () => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("Sesi tidak ditemukan. Silakan login ulang.");

    return executeHybridRequest<AbsensiResponse[]>(
      "Get riwayat absensi mahasiswa",
      `${API_ROUTES.ABSENSI_RIWAYAT}?userId=${userId}`,
      { method: "GET" }
    ).then(res => {
      return {
        ...res,
        data: res.data.map(mapBackendAbsensiToFrontend)
      };
    });
  },

  // -------------------------------------------------------------------
  // 9. Statistik absensi pribadi mahasiswa
  //    GET /api/absensi/mahasiswa/statistik?userId=...
  // -------------------------------------------------------------------
  getMahasiswaStat: async () => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("Sesi tidak ditemukan. Silakan login ulang.");

    return executeHybridRequest<AbsensiMahasiswaStatResponse>(
      "Get statistik absensi mahasiswa",
      `${API_ROUTES.ABSENSI_MAHASISWA_STATISTIK}?userId=${userId}`,
      { method: "GET" }
    ).then(res => {
      return {
        ...res,
        data: mapBackendStatMahasiswa(res.data)
      };
    });
  },

  // -------------------------------------------------------------------
  // 9.5. Total Kehadiran
  // -------------------------------------------------------------------
  getTotalKehadiran: async (overrideUserId?: string | number) => {
    const userId = overrideUserId ? String(overrideUserId) : getCurrentUserId();
    if (!userId) throw new Error("Sesi tidak ditemukan. Silakan login ulang.");

    return executeHybridRequest<number>(
      "Get total kehadiran",
      API_ROUTES.ABSENSI_TOTAL_KEHADIRAN,
      { method: "GET" }
    );
  },

  // -------------------------------------------------------------------
  // 9.6. Statistik Kehadiran Harian (Hadir, Izin, Sakit)
  // -------------------------------------------------------------------
  getStatistikKehadiran: async () => {
    return executeHybridRequest<{ totalHadir: number; totalIzin: number; totalSakit: number }>(
      "Get statistik kehadiran harian",
      API_ROUTES.ABSENSI_STATISTIK_KEHADIRAN,
      { method: "GET" }
    );
  },

  // -------------------------------------------------------------------
  // 10. Legacy checkIn (alias ke submitAbsensi, untuk kompatibilitas komponen lama)
  // -------------------------------------------------------------------
  checkIn: async (payload: CheckInRequest) => {
    return absensiAPI.submitAbsensi({
      status:     payload.status,
      keterangan: payload.notes,
      attachmentUrl: null,
    });
  },

  // -------------------------------------------------------------------
  // 11. Legacy checkOut — belum ada di backend, tetap mock only
  // -------------------------------------------------------------------
  checkOut: async () => {
    return executeHybridRequest<AttendanceLog>(
      "Check-out for today",
      API_ROUTES.ABSENSI_CHECKOUT,
      { method: "POST" }
    );
  },
};
