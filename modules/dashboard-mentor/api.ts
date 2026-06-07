import { executeHybridRequest } from "../api-client";
import { DashboardStatResponse, RegisterStudentRequest, SearchStudentResponse } from "./types";

const BASE_URL = "/api/dashboard-mentor";

export const dashboardMentorAPI = {
  /**
   * Mengambil data statistik dashboard mentor.
   */
  getDashboardStats: async (mentorId?: string | number) => {
    const url = mentorId ? `${BASE_URL}/statistik?mentorId=${mentorId}` : `${BASE_URL}/statistik`;
    return executeHybridRequest<DashboardStatResponse>(
      "Get dashboard stats for mentor",
      url,
      { method: "GET" },
      () => {
        // Fallback Mock Data
        return {
          jumlahMahasiswaAktif: 4,
          jumlahMahasiswaSelesai: 2,
          rekapAbsensi: {
            "Hadir": 120,
            "Sakit": 5,
            "Izin": 2,
            "Alfa": 0
          }
        };
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        return {
          ...res,
          data: res.data as unknown as DashboardStatResponse
        };
      }
      return res;
    });
  },

  /**
   * Mencari mahasiswa bimbingan berdasarkan nama.
   */
  searchStudents: async (name?: string) => {
    const url = name ? `${BASE_URL}/mahasiswa?nama=${encodeURIComponent(name)}` : `${BASE_URL}/mahasiswa`;
    return executeHybridRequest<SearchStudentResponse[]>(
      `Search students with name: ${name || 'all'}`,
      url,
      { method: "GET" },
      () => {
        // Fallback Mock Data
        return [];
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        return {
          ...res,
          data: res.data as unknown as SearchStudentResponse[]
        };
      }
      return res;
    });
  },

  /**
   * Mendaftarkan mahasiswa bimbingan baru.
   */
  registerStudent: async (payload: RegisterStudentRequest) => {
    return executeHybridRequest<SearchStudentResponse>(
      `Register new student: ${payload.nama}`,
      `${BASE_URL}/mahasiswa`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      () => {
        // Fallback Mock Data
        return {
          id: String(Date.now()),
          userId: `usr-${Date.now()}`,
          email: payload.email,
          nim: payload.nim,
          nama: payload.nama,
          noHp: payload.noHp || "-",
          gender: payload.gender,
          universitas: payload.universitas,
          periodeId: `per-${Date.now()}`,
          tanggalMulai: payload.tanggalMulai || "2026-02-01",
          tanggalBerakhir: payload.tanggalBerakhir || "2026-07-31",
          statusPeriode: "aktif"
        } as SearchStudentResponse;
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        return {
          ...res,
          data: res.data as unknown as SearchStudentResponse
        };
      }
      return res;
    });
  }
};
