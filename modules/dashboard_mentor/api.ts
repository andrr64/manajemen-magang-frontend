import { executeHybridRequest } from "../api-client";
import { API_ROUTES } from "../api-routes";
import { DashboardStatResponse, RegisterStudentRequest, SearchStudentResponse, AttendanceStatResponse } from "./types";



export const dashboardMentorAPI = {
  /**
   * Mengambil data statistik dashboard mentor.
   */
  getDashboardStats: async (mentorId?: string | number) => {
    const url = mentorId ? `${API_ROUTES.DASHBOARD_MENTOR_STATISTIK}?mentorId=${mentorId}` : API_ROUTES.DASHBOARD_MENTOR_STATISTIK;
    return executeHybridRequest<DashboardStatResponse>(
      "Get dashboard stats for mentor",
      url,
      { method: "GET" }
    ).then((res) => {
      if (true) {
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
    const url = name ? `${API_ROUTES.DASHBOARD_MENTOR_MAHASISWA}?nama=${encodeURIComponent(name)}` : API_ROUTES.DASHBOARD_MENTOR_MAHASISWA;
    return executeHybridRequest<SearchStudentResponse[]>(
      `Search students with name: ${name || 'all'}`,
      url,
      { method: "GET" }
    ).then((res) => {
      if (true) {
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
      API_ROUTES.DASHBOARD_MENTOR_MAHASISWA,
      {
        method: "POST",
        body: JSON.stringify(payload)
      }
    ).then((res) => {
      if (true) {
        return {
          ...res,
          data: res.data as unknown as SearchStudentResponse
        };
      }
      return res;
    });
  },

  /**
   * Mengambil data statistik kehadiran berdasarkan rentang tanggal.
   */
  getAttendanceStatsByDateRange: async (tanggalAwal: string, tanggalAkhir: string) => {
    const url = `${API_ROUTES.DASHBOARD_MENTOR_STATISTIK_KEHADIRAN}?tanggalAwal=${tanggalAwal}&tanggalAkhir=${tanggalAkhir}`;
    return executeHybridRequest<AttendanceStatResponse>(
      "Get attendance stats by date range",
      url,
      { method: "GET" }
    ).then((res) => {
      if (true) {
        return {
          ...res,
          data: res.data as unknown as AttendanceStatResponse
        };
      }
      return res;
    });
  }
};
