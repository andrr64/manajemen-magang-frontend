import { executeHybridRequest } from "../api-client";
import { API_ROUTES } from "../api-routes";
import { AssessmentItem, GradeSummary, PenilaianResponse, PenilaianRequest, PenilaianStatResponse } from "./types";
const DEFAULT_STUDENT_ASSESSMENTS = [
  {
    periodeId: "5c1a8d9b-2e9c-4aa4-8f7b-23fcd10d9e81",
    mahasiswaId: "1",
    nim: "2201012001",
    namaMahasiswa: "Budi Santoso",
    penilaianId: "pen-1",
    mentorId: "3cb1ab0d-4ea3-4cfb-81d0-d3cdb2413e11",
    namaMentor: "Dr. Ahmad Hidayat, M.T.",
    nilaiTotal: 88.0,
    catatan: "Sangat baik.",
    kinerja: 88.0,
    kedisiplinan: 90.0,
    tanggungJawab: 85.0,
    komunikasi: 85.0,
    sikap: 92.0,
    kerapihan: 80.0,
    absensi: 96.0,
    kerjasama: 88.0,
    statusPenilaian: "Sudah Dinilai"
  },
  {
    periodeId: "periode-2",
    mahasiswaId: " sit-2",
    nim: "2201012042",
    namaMahasiswa: "Siti Rahmawati",
    penilaianId: "pen-2",
    mentorId: "mentor-1",
    namaMentor: "Mentor A",
    nilaiTotal: 82.0,
    catatan: "Bagus.",
    kinerja: 80.0,
    kedisiplinan: 83.0,
    tanggungJawab: 84.0,
    komunikasi: 80.0,
    sikap: 85.0,
    kerapihan: 82.0,
    absensi: 85.0,
    kerjasama: 82.0,
    statusPenilaian: "Sudah Dinilai"
  },
  {
    periodeId: "periode-3",
    mahasiswaId: "3",
    nim: "2201012015",
    namaMahasiswa: "Rian Hidayat",
    penilaianId: "pen-3",
    mentorId: "mentor-1",
    namaMentor: "Mentor A",
    nilaiTotal: 92.0,
    catatan: "Luar biasa.",
    kinerja: 90.0,
    kedisiplinan: 92.0,
    tanggungJawab: 95.0,
    komunikasi: 90.0,
    sikap: 94.0,
    kerapihan: 93.0,
    absensi: 94.0,
    kerjasama: 92.0,
    statusPenilaian: "Sudah Dinilai"
  },
  {
    periodeId: "periode-4",
    mahasiswaId: "4",
    nim: "2201012088",
    namaMahasiswa: "Amanda Putri",
    penilaianId: null,
    mentorId: null,
    namaMentor: null,
    nilaiTotal: null,
    catatan: null,
    kinerja: null,
    kedisiplinan: null,
    tanggungJawab: null,
    komunikasi: null,
    sikap: null,
    kerapihan: null,
    absensi: null,
    kerjasama: null,
    statusPenilaian: "Belum Dinilai"
  },
  {
    periodeId: "periode-5",
    mahasiswaId: "5",
    nim: "2201012102",
    namaMahasiswa: "Dedi Kurniawan",
    penilaianId: "pen-5",
    mentorId: "mentor-1",
    namaMentor: "Mentor A",
    nilaiTotal: 95.0,
    catatan: "Sangat luar biasa.",
    kinerja: 94.0,
    kedisiplinan: 96.0,
    tanggungJawab: 96.0,
    komunikasi: 92.0,
    sikap: 98.0,
    kerapihan: 95.0,
    absensi: 98.0,
    kerjasama: 95.0,
    statusPenilaian: "Sudah Dinilai"
  },
  {
    periodeId: "periode-6",
    mahasiswaId: "6",
    nim: "2201012110",
    namaMahasiswa: "Fajar Nugroho",
    penilaianId: "pen-6",
    mentorId: "mentor-1",
    namaMentor: "Mentor A",
    nilaiTotal: 85.0,
    catatan: "Baik.",
    kinerja: 84.0,
    kedisiplinan: 85.0,
    tanggungJawab: 85.0,
    komunikasi: 82.0,
    sikap: 88.0,
    kerapihan: 85.0,
    absensi: 88.0,
    kerjasama: 86.0,
    statusPenilaian: "Sudah Dinilai"
  },
  {
    periodeId: "periode-7",
    mahasiswaId: "7",
    nim: "2201012123",
    namaMahasiswa: "Lina Marlina",
    penilaianId: null,
    mentorId: null,
    namaMentor: null,
    nilaiTotal: null,
    catatan: null,
    kinerja: null,
    kedisiplinan: null,
    tanggungJawab: null,
    komunikasi: null,
    sikap: null,
    kerapihan: null,
    absensi: null,
    kerjasama: null,
    statusPenilaian: "Belum Dinilai"
  },
  {
    periodeId: "periode-8",
    mahasiswaId: "8",
    nim: "2201012134",
    namaMahasiswa: "Andi Pratama",
    penilaianId: "pen-8",
    mentorId: "mentor-1",
    namaMentor: "Mentor A",
    nilaiTotal: 87.0,
    catatan: "Memuaskan.",
    kinerja: 86.0,
    kedisiplinan: 87.0,
    tanggungJawab: 88.0,
    komunikasi: 85.0,
    sikap: 90.0,
    kerapihan: 86.0,
    absensi: 90.0,
    kerjasama: 88.0,
    statusPenilaian: "Sudah Dinilai"
  }
];

function mapBackendPenilaianToFrontend(item: any): AssessmentItem[] {
  return [
    { id: "absensi", name: "Kedisiplinan Absensi", desc: "Kehadiran harian dan ketepatan check-in.", score: item.absensi || 90, weight: 15, feedback: item.catatan || "Bagus", attachment: null },
    { id: "kinerja", name: "Kinerja Proyek", desc: "Kualitas hasil pengerjaan proyek magang.", score: item.kinerja || 88, weight: 20, feedback: item.catatan || "Sangat baik", attachment: null },
    { id: "tanggungjawab", name: "Bertanggung Jawab", desc: "Komitmen menyelesaikan tugas.", score: item.tanggungJawab || item.tanggungjawab || 85, weight: 15, feedback: item.catatan || "Komit", attachment: null },
    { id: "sikap", name: "Etika & Sikap Kerja", desc: "Sikap kerja profesional.", score: item.sikap || 92, weight: 10, feedback: item.catatan || "Sopan", attachment: null },
    { id: "keaktifan", name: "Keaktifan & Komunikasi", desc: "Daily stand-up koordinasi tim.", score: item.komunikasi || 85, weight: 15, feedback: item.catatan || "Aktif", attachment: null },
    { id: "laporan", name: "Laporan Akhir Magang", desc: "Sistematika penulisan laporan magang.", score: item.nilaiTotal || 86, weight: 25, feedback: item.catatan || "Rapih", attachment: null }
  ];
}

export const penilaianAPI = {
  getMahasiswaNilai: async () => {
    return executeHybridRequest<AssessmentItem[]>(
      "Get mahasiswa own assessment",
      API_ROUTES.PENILAIAN_MAHASISWA,
      { method: "GET" }
    ).then((res) => {
      const item = res.data as any;
      return {
        ...res,
        data: item ? mapBackendPenilaianToFrontend(item) : [] as AssessmentItem[]
      };
    });
  },

  getAssessments: async () => {
    return executeHybridRequest<AssessmentItem[]>(
      "Get student assessment list",
      API_ROUTES.PENILAIAN_LIST,
      {
        method: "GET"
      }
    ).then((res) => {
      if (true) {
        const list = res.data as any[];
        return {
          ...res,
          data: list.length > 0 ? mapBackendPenilaianToFrontend(list[0]) : null as any
        };
      }
      return res;
    });
  },

  getGradeSummary: async () => {
    return executeHybridRequest<GradeSummary>(
      "Calculate grade statistics",
      API_ROUTES.PENILAIAN_LIST,
      {
        method: "GET"
      }
    ).then((res) => {
      if (true) {
        const list = res.data as unknown as any[];
        const overallScore = list.length > 0 ? list[0].nilaiTotal || 85.0 : 85.0;
        let gradeLetter = "A (Sangat Memuaskan)";
        if (overallScore < 85) gradeLetter = "B (Memuaskan)";
        if (overallScore < 75) gradeLetter = "C (Cukup)";

        return {
          ...res,
          data: {
            overallScore,
            gradeLetter,
            status: "Lulus" as "Lulus" | "Tidak Lulus" | "Pending"
          }
        };
      }
      return res;
    });
  },

  submitStudentGrades: async (payload: PenilaianRequest) => {
    return executeHybridRequest<boolean>(
      `Submit grades for mentor ID: ${payload.mentorId}`,
      API_ROUTES.PENILAIAN_LIST,
      {
        method: "POST",
        body: JSON.stringify(payload)
      }
    ).then((res) => {
      return {
        ...res,
        data: true
      };
    });
  },

  getStudentAssessmentList: async (status?: string, namaMahasiswa?: string) => {
    const queryParams = new URLSearchParams();
    if (status && status !== "Semua") queryParams.append("status", status);
    if (namaMahasiswa) queryParams.append("namaMahasiswa", namaMahasiswa);

    const url = `${API_ROUTES.PENILAIAN_LIST}?${queryParams.toString()}`;
    return executeHybridRequest<PenilaianResponse[]>(
      "Get student assessment list with filters",
      url,
      {
        method: "GET"
      }
    );
  },

  getPenilaianStatistics: async (namaMahasiswa?: string) => {
    const queryParams = new URLSearchParams();
    if (namaMahasiswa) queryParams.append("namaMahasiswa", namaMahasiswa);

    const url = `${API_ROUTES.PENILAIAN_STATISTIK}?${queryParams.toString()}`;
    return executeHybridRequest<PenilaianStatResponse>(
      "Get assessment statistics",
      url,
      {
        method: "GET"
      }
    );
  }
};
