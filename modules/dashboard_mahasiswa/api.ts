import { executeHybridRequest } from "../api-client";
import { API_ROUTES } from "../api-routes";
import { DashboardMahasiswaStatResponse } from "./types";

export const dashboardMahasiswaAPI = {
  /**
   * Mengambil data statistik untuk dashboard mahasiswa berdasarkan ID Mahasiswa.
   */
  getDashboardStats: async (mahasiswaId: string | number) => {
    return executeHybridRequest<DashboardMahasiswaStatResponse>(
      `Get dashboard stats for mahasiswa ${mahasiswaId}`,
      `${API_ROUTES.DASHBOARD_MAHASISWA_STATISTIK}?mahasiswaId=${mahasiswaId}`,
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
