import { executeHybridRequest } from "../api-client";
import { DashboardMahasiswaStatResponse } from "./types";

export const dashboardMahasiswaAPI = {
  /**
   * Mengambil data statistik untuk dashboard mahasiswa berdasarkan ID Mahasiswa.
   */
  getDashboardStats: async (mahasiswaId: string | number) => {
    return executeHybridRequest<DashboardMahasiswaStatResponse>(
      `Get dashboard stats for mahasiswa ${mahasiswaId}`,
      `/api/dashboard-mahasiswa/statistik?mahasiswaId=${mahasiswaId}`,
      {
        method: "GET"
      },
      () => {
        // Fallback Mock Data jika tidak ada backend
        return {
          totalKehadiran: 24,
          sisaWaktuMagangDays: 60,
          sisaWaktuMagangFormatted: "2 Bulan Lagi"
        };
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        // Asumsikan data dari backend sesuai secara langsung dengan struktur interface TypeScript.
        return {
          ...res,
          data: res.data as unknown as DashboardMahasiswaStatResponse
        };
      }
      return res;
    });
  }
};
