import { executeHybridRequest } from "../api-client";
import { API_ROUTES } from "../api-routes";
import { Student, CreateStudentRequest, UpdateStudentRequest, StudentResponse, StudentStatResponse, StudentDetailResponse } from "./types";
import { mediaAPI } from "../media/api";

function mapBackendStudentToFrontend(item: StudentResponse): Student {
  const formatDate = (start: string | null, end: string | null) => {
    if (!start || !end) return "-";
    try {
      const parse = (s: string) => {
        const d = new Date(s);
        return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      };
      return `${parse(start)} - ${parse(end)}`;
    } catch (_) {
      return "-";
    }
  };

  const statusPeriodeUpper = item.statusPeriode?.toUpperCase();
  const status: "Aktif" | "Dalam Review" | "Selesai" | "Belum Penempatan" = 
    !statusPeriodeUpper ? "Belum Penempatan" :
    (statusPeriodeUpper === "SELESAI" ? "Selesai" : 
     (statusPeriodeUpper === "BATAL" ? "Belum Penempatan" :
      (statusPeriodeUpper === "REVIEW" || statusPeriodeUpper === "DALAM REVIEW" ? "Dalam Review" : "Aktif")));

  const isPlaced = status !== "Belum Penempatan";

  return {
    id: item.id, // numeric or string id
    name: item.nama || "Mahasiswa",
    nim: item.nim || "2201012001",
    email: item.email || "",
    university: item.universitas || "-",
    idUniversity: item.idUniversity || undefined,
    phone: item.noHp || "-",
    gender: (item.gender as "Laki-laki" | "Perempuan" | "-") || "-",
    program: "S1 Teknik Informatika",
    role: isPlaced ? "Software Engineering Intern" : "-",
    status: status,
    progress: status === "Selesai" ? 100 : (status === "Belum Penempatan" ? 0 : (status === "Dalam Review" ? 95 : 85)),
    lastActive: "Hari ini, 09:30",
    avatarColor: "from-blue-500 to-indigo-500",
    address: "Jakarta, Indonesia",
    period: formatDate(item.tanggalMulai, item.tanggalBerakhir),
    grade: status === "Selesai" ? 90 : null,
    logbooksCount: isPlaced ? 8 : 0,
    logbooksPending: isPlaced ? 2 : 0,
    attendance: isPlaced ? { present: 76, sick: 2, leave: 1, absent: 0 } : { present: 0, sick: 0, leave: 0, absent: 0 },
    periodeId: item.periodeId,
    tanggalMulai: item.tanggalMulai,
    tanggalBerakhir: item.tanggalBerakhir,
    statusPeriode: item.statusPeriode,
    mentorId: item.mentorId,
    namaMentor: item.namaMentor,
    userId: item.userId,
    isActive: item.isActive
  };
}

export const mahasiswaAPI = {
  listStudents: async (filters?: any, index: number = 1, size: number = 10) => {
    const params = new URLSearchParams();
    if (filters?.gender && filters.gender !== "Semua") {
      params.append("gender", filters.gender);
    }
    if (filters?.universitas && filters.universitas !== "Semua") {
      params.append("universitas", filters.universitas);
    }
    if (filters?.status && filters.status !== "Semua") {
      const backendStatus = filters.status === "Dalam Review" || filters.status === "Aktif" 
        ? "aktif" 
        : (filters.status === "Selesai" ? "selesai" : filters.status);
      params.append("status", backendStatus);
    }
    if (index) params.append("index", String(index));
    if (size) params.append("size", String(size));
    const queryString = params.toString() ? `?${params.toString()}` : "";

    return executeHybridRequest<Student[]>(
      "List all students",
      `${API_ROUTES.MAHASISWA_LIST}${queryString}`,
      {
        method: "GET"
      }
    ).then((res) => {
      if (true) {
        const list = res.data as unknown as StudentResponse[];
        return {
          ...res,
          data: list.map(mapBackendStudentToFrontend)
        };
      }
      return res;
    });
  },

  getStudentStatistics: async (filters?: { gender?: string; universitas?: string }) => {
    const params = new URLSearchParams();
    if (filters?.gender && filters.gender !== "Semua") {
      params.append("gender", filters.gender);
    }
    if (filters?.universitas && filters.universitas !== "Semua") {
      params.append("universitas", filters.universitas);
    }
    const queryString = params.toString() ? `?${params.toString()}` : "";

    return executeHybridRequest<any>(
      "Get student statistics",
      `${API_ROUTES.MAHASISWA_STATISTIK}${queryString}`,
      {
        method: "GET"
      }
    ).then((res) => {
      if (true) {
        const stats = res.data as unknown as StudentStatResponse;
        return {
          ...res,
          data: {
            totalMahasiswa: stats.totalMahasiswa,
            totalAktif: stats.totalAktif,
            totalSelesai: stats.totalSelesai,
            totalAktifTanpaPenilaian: stats.totalAktifTanpaPenilaian
          }
        };
      }
      return res;
    });
  },

  getStudentById: async (id: number | string) => {
    return executeHybridRequest<Student>(
      `Get student details for ID: ${id}`,
      API_ROUTES.MAHASISWA_DETAIL(id),
      {
        method: "GET"
      }
    ).then((res) => {
      if (true) {
        const detail = res.data as unknown as StudentDetailResponse;
        
        // Handle case where backend might return StudentResponse instead of StudentDetailResponse in older cache
        // but since we just updated it, it should be StudentDetailResponse
        const isDetailResponse = detail && "rekapitulasiKehadiran" in detail;
        
        const rawStudent = isDetailResponse ? detail.mahasiswa : (res.data as unknown as StudentResponse);
        const student = mapBackendStudentToFrontend(rawStudent);
        
        if (isDetailResponse) {
          student.grade = detail.totalNilai;
          student.attendance = {
            present: detail.rekapitulasiKehadiran.hadir,
            sick: detail.rekapitulasiKehadiran.sakit,
            leave: detail.rekapitulasiKehadiran.izin,
            absent: detail.rekapitulasiKehadiran.tidakHadir,
          };
          student.dataKegiatan = detail.dataKegiatan?.map(act => ({
            ...act,
            fileUrls: (act.fileUrls || []).map(key => key.startsWith("http") ? key : mediaAPI.getFileUrl(key))
          })) || [];
          student.logbooksCount = student.dataKegiatan.length || 0;
          student.logbooksPending = student.dataKegiatan.filter(k => k.status?.toLowerCase() === 'belum disetujui' || k.status?.toLowerCase() === 'dalam review').length || 0;
        }

        return {
          ...res,
          data: student
        };
      }
      return res;
    });
  },

  createStudent: async (payload: CreateStudentRequest) => {
    return executeHybridRequest<Student>(
      `Create student account: ${payload.name}`,
      API_ROUTES.MAHASISWA_LIST,
      {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password || "temporarysecurepassword",
          nim: payload.nim,
          nama: payload.name,
          noHp: payload.phone || "-",
          gender: payload.gender,
          idUniversity: payload.idUniversity || 1, // Defaulting to 1 if not provided, assuming frontend provides it
          tanggalMulai: payload.tanggalMulai || "2026-02-01",
          tanggalBerakhir: payload.tanggalBerakhir || "2026-07-31",
          periodeStatus: payload.periodeStatus || "aktif"
        })
      }
    ).then((res) => {
      if (true) {
        return {
          ...res,
          data: mapBackendStudentToFrontend(res.data as unknown as StudentResponse)
        };
      }
      return res;
    });
  },

  updateStudent: async (id: number | string, payload: UpdateStudentRequest) => {
    const resolvedPeriode = payload.periode ? {
      tanggalMulai: payload.periode.tanggalMulai,
      tanggalBerakhir: payload.periode.tanggalBerakhir,
      status: payload.periode.status ? payload.periode.status.toUpperCase() : undefined
    } : undefined;

    return executeHybridRequest<Student>(
      `Update student details for ID: ${id}`,
      API_ROUTES.MAHASISWA_EDIT_BY_MENTOR(id),
      {
        method: "PUT",
        body: JSON.stringify({
          email: payload.email,
          nim: payload.nim,
          nama: payload.nama,
          gender: (payload.gender && payload.gender !== "-") ? payload.gender : undefined,
          noHp: payload.noHp,
          idUniversity: payload.idUniversity,
          periode: resolvedPeriode
        })
      }
    ).then((res) => {
      if (true) {
        return {
          ...res,
          data: mapBackendStudentToFrontend(res.data as unknown as StudentResponse)
        };
      }
      return res;
    });
  },

  deleteStudent: async (id: number | string) => {
    return executeHybridRequest<boolean>(
      `Delete student ID: ${id}`,
      API_ROUTES.MAHASISWA_DETAIL(id),
      {
        method: "DELETE"
      }
    );
  },

  getSisaWaktuMagang: async () => {
    return executeHybridRequest<number>(
      "Get Sisa Waktu Magang",
      API_ROUTES.MAHASISWA_SISA_WAKTU,
      {
        method: "GET"
      }
    );
  }
};
