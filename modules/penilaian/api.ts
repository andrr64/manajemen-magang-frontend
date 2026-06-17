import { executeHybridRequest, APIError } from "../api-client";
import { API_ROUTES } from "../api-routes";
import { AssessmentItem, PenilaianResponse, PenilaianRequest, PenilaianStatResponse } from "./types";

const KRITERIA: { key: keyof PenilaianResponse; name: string; desc: string }[] = [
  { key: "kinerja",       name: "Kinerja Pekerjaan",  desc: "Kualitas hasil pengerjaan tugas dan proyek magang." },
  { key: "kedisiplinan",  name: "Kedisiplinan",        desc: "Ketepatan waktu dan kepatuhan terhadap aturan." },
  { key: "tanggungJawab", name: "Tanggung Jawab",      desc: "Komitmen menyelesaikan tugas yang diberikan." },
  { key: "komunikasi",    name: "Komunikasi",          desc: "Kemampuan berkomunikasi dengan tim dan mentor." },
  { key: "sikap",         name: "Sikap & Etika Kerja", desc: "Perilaku profesional di lingkungan kerja." },
  { key: "kerapihan",     name: "Kerapihan",           desc: "Kerapihan dokumen, kode, dan hasil pekerjaan." },
  { key: "absensi",       name: "Kehadiran",           desc: "Konsistensi kehadiran dan ketepatan check-in." },
  { key: "kerjasama",     name: "Kerjasama Tim",       desc: "Kontribusi kolaboratif bersama anggota tim." },
];

export function mapPenilaianToAssessmentItems(item: PenilaianResponse): AssessmentItem[] {
  return KRITERIA.map(k => ({
    id:         k.key,
    name:       k.name,
    desc:       k.desc,
    score:      Number(item[k.key] ?? 0),
    weight:     12.5,
    feedback:   item.catatan || "",
    attachment: null,
  }));
}

export const penilaianAPI = {
  getMahasiswaNilai: async (): Promise<{ data: PenilaianResponse | null }> => {
    try {
      const res = await executeHybridRequest<PenilaianResponse>(
        "Get mahasiswa own assessment",
        API_ROUTES.PENILAIAN_MAHASISWA,
        { method: "GET" }
      );
      return { data: res.data };
    } catch (err: any) {
      if (err instanceof APIError && err.status === 404) return { data: null };
      throw err;
    }
  },

  getStudentAssessmentList: async (status?: string, namaMahasiswa?: string) => {
    const q = new URLSearchParams();
    if (status && status !== "Semua") q.append("status", status);
    if (namaMahasiswa) q.append("namaMahasiswa", namaMahasiswa);
    return executeHybridRequest<PenilaianResponse[]>(
      "Get student assessment list with filters",
      `${API_ROUTES.PENILAIAN_LIST}?${q.toString()}`,
      { method: "GET" }
    );
  },

  submitStudentGrades: async (payload: PenilaianRequest) => {
    return executeHybridRequest<PenilaianResponse>(
      `Submit grades`,
      API_ROUTES.PENILAIAN_LIST,
      { method: "POST", body: JSON.stringify(payload) }
    );
  },

  getPenilaianStatistics: async (namaMahasiswa?: string) => {
    const q = new URLSearchParams();
    if (namaMahasiswa) q.append("namaMahasiswa", namaMahasiswa);
    return executeHybridRequest<PenilaianStatResponse>(
      "Get assessment statistics",
      `${API_ROUTES.PENILAIAN_STATISTIK}?${q.toString()}`,
      { method: "GET" }
    );
  },
};
