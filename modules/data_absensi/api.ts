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
  AbsensiHarianMentorResponse,
  AbsensiMentorRequest,
  RekapAbsensiResponse,
} from "./types";

// =====================================================================
// MOCK DATA
// =====================================================================
// =====================================================================
// MAPPERS — backend → frontend shape
// =====================================================================

function mapBackendAbsensiToFrontend(item: AbsensiResponse): AttendanceLog {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });
    } catch (_) { return dateStr; }
  };

  const typeMap: Record<string, AttendanceLog["type"]> = {
    hadir: "Hadir", izin: "Izin", sakit: "Sakit", alpha: "Alpha",
  };

  // izin/sakit tanpa mentor_id = belum diverifikasi mentor
  const deriveStatus = (status: string, mentorId: string | null): AttendanceLog["status"] => {
    if ((status === "izin" || status === "sakit") && !mentorId) return "Menunggu";
    return "Diverifikasi";
  };

  return {
    id:          item.id,
    date:        formatDate(item.tanggal),
    tanggalISO:  item.tanggal,
    type:        typeMap[item.status?.toLowerCase()] ?? "Hadir",
    checkIn:     "-- : --",
    checkOut:    "-- : --",
    document:    item.attachmentUrl ?? null,
    status:      deriveStatus(item.status, item.mentorId),
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
  try {
    const storage = localStorage.getItem("iam-storage");
    if (storage) {
      const parsed = JSON.parse(storage);
      return parsed?.state?.user?.id || null;
    }
  } catch (e) {}
  return null;
}

// =====================================================================
// API — MENTOR SIDE
// =====================================================================

export const absensiAPI = {
  // -------------------------------------------------------------------
  // MENTOR — fitur baru
  // -------------------------------------------------------------------

  /**
   * GET /api/absensi/mentor/harian
   * Semua mahasiswa bimbingan dengan periode mencakup `tanggal`.
   * Status = hadir/izin/sakit jika sudah dicatat, "alpha" jika belum ada record.
   */
  getAbsensiHarianMentor: async (
    tanggal?: string,
    index: number = 1,
    size: number = 5
  ) => {
    const q = new URLSearchParams();
    if (tanggal) q.append("tanggal", tanggal);
    q.append("index", String(index));
    q.append("size", String(size));

    return executeHybridRequest<AbsensiHarianMentorResponse[]>(
      "Get absensi harian mentor",
      `${API_ROUTES.ABSENSI_MENTOR_HARIAN}?${q.toString()}`,
      { method: "GET" }
    );
  },

  /**
   * GET /api/absensi/mentor/harian/statistik
   * Dapatkan statistik (hadir, alfa, off)
   */
  getAbsensiHarianMentorStatistik: async (tanggal?: string) => {
    const q = new URLSearchParams();
    if (tanggal) q.append("tanggal", tanggal);

    return executeHybridRequest<{ hadir: number, alfa: number, off: number }>(
      "Get statistik harian mentor",
      `${API_ROUTES.ABSENSI_MENTOR_HARIAN_STATISTIK}?${q.toString()}`,
      { method: "GET" }
    );
  },

  /**
   * POST /api/absensi/mentor/submit
   * Mentor mencatat absensi untuk salah satu mahasiswa bimbingannya.
   */
  submitAbsensiMentor: async (payload: AbsensiMentorRequest) => {
    return executeHybridRequest<AbsensiResponse>(
      `Submit absensi mentor untuk mahasiswa ${payload.mahasiswaId}`,
      API_ROUTES.ABSENSI_MENTOR_SUBMIT,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mahasiswaId:   payload.mahasiswaId,
          status:        payload.status,
          tanggal:       payload.tanggal ?? null,
          attachmentUrl: payload.attachmentUrl ?? null,
        }),
      }
    ).then(res => ({
      ...res,
      data: mapBackendAbsensiToFrontend(res.data),
    }));
  },

  // -------------------------------------------------------------------
  // 1. List absensi semua mahasiswa (mentor)
  // -------------------------------------------------------------------
  getHistory: async (status?: string, namaMahasiswa?: string, tanggal?: string, page: number = 1, size: number = 10) => {
    const q = new URLSearchParams();
    if (status && status !== "Semua") q.append("status", status.toLowerCase());
    if (namaMahasiswa) q.append("namaMahasiswa", namaMahasiswa);
    if (tanggal) q.append("tanggal", tanggal);
    q.append("index", String(page));
    q.append("size", String(size));

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

  // -------------------------------------------------------------------
  // 6.5. Get Rekap Absensi (mentor/admin)
  // -------------------------------------------------------------------
  getRekapAbsensi: async (tanggalAwal: string, tanggalAkhir: string, mahasiswaId?: string) => {
    const q = new URLSearchParams();
    q.append("tanggalAwal", tanggalAwal);
    q.append("tanggalAkhir", tanggalAkhir);
    if (mahasiswaId) q.append("mahasiswaId", mahasiswaId);

    return executeHybridRequest<RekapAbsensiResponse[]>(
      "Get rekap absensi",
      `${API_ROUTES.ABSENSI_REKAP}?${q.toString()}`,
      { method: "GET" }
    );
  },

  getRekapDetailAbsensi: async (tanggalAwal: string, tanggalAkhir: string, mahasiswaId: string) => {
    const q = new URLSearchParams();
    q.append("tanggalAwal", tanggalAwal);
    q.append("tanggalAkhir", tanggalAkhir);
    q.append("mahasiswaId", mahasiswaId);

    return executeHybridRequest<import("./types").RekapDetailAbsensiResponse[]>(
      "Get rekap detail absensi",
      `${API_ROUTES.ABSENSI_REKAP}/detail?${q.toString()}`,
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
      status:        payload.status,
      attachmentUrl: payload.document ?? null,
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
