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
      }
    ).then((res) => {
      if (true) {
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
