import { executeHybridRequest, mockDB } from "../api-client";
import { AssessmentItem, GradeSummary, SubmitGradeRequest } from "./types";

const INITIAL_ASSESSMENTS: AssessmentItem[] = [
  { 
    id: "absensi", 
    name: "Kedisiplinan Absensi", 
    desc: "Ketepatan waktu kehadiran harian, kepatuhan toleransi keterlambatan, dan pengumpulan izin formal.", 
    score: 92, 
    weight: 15, 
    feedback: "Kehadiran sangat konsisten, selalu check-in tepat waktu sebelum jam 08:00.", 
    attachment: "bukti_absen_rekap.pdf" 
  },
  { 
    id: "kinerja", 
    name: "Kinerja Proyek", 
    desc: "Kualitas hasil pengerjaan proyek magang, efisiensi kerja teknis, dan pencapaian target mingguan.", 
    score: 88, 
    weight: 20, 
    feedback: "Kualitas penulisan kode sangat bersih, dokumentasi teratur, dan tanggap menyelesaikan bug backend.", 
    attachment: "bukti_tugas_laporan.pdf" 
  },
  { 
    id: "tanggungjawab", 
    name: "Bertanggung Jawab", 
    desc: "Komitmen menyelesaikan tugas yang diberikan, kesiapan menanggung risiko teknis, dan inisiatif tinggi.", 
    score: 88, 
    weight: 15, 
    feedback: "Menuntaskan tugas backend API sesuai target sprint dengan komitmen yang tinggi.", 
    attachment: null 
  },
  { 
    id: "sikap", 
    name: "Etika & Sikap Kerja", 
    desc: "Sopan santun dalam berkomunikasi, kepatuhan terhadap regulasi perusahaan, dan integritas profesional.", 
    score: 95, 
    weight: 10, 
    feedback: "Sangat sopan, ramah, dan beradaptasi dengan budaya korporat dengan sangat baik.", 
    attachment: null 
  },
  { 
    id: "keaktifan", 
    name: "Keaktifan & Komunikasi", 
    desc: "Partisipasi aktif dalam sesi daily stand-up, inisiatif memberikan ide solusi, dan koordinasi tim.", 
    score: 86, 
    weight: 15, 
    feedback: "Aktif berkomunikasi di Discord tim dan tanggap dalam memberikan update harian.", 
    attachment: null 
  },
  { 
    id: "laporan", 
    name: "Laporan Akhir Magang", 
    desc: "Sistematika penulisan laporan magang, kedalaman analisis bab per bab, dan orisinalitas isi laporan.", 
    score: 84, 
    weight: 25, 
    feedback: "Penulisan bab 1-3 sudah sangat detail. Perlu sedikit penajaman analisis performa query di bab 4.", 
    attachment: "laporan_akhir_draft_puncak.docx" 
  }
];

function mapBackendPenilaianToFrontend(item: any): AssessmentItem[] {
  // Back-map from flat entity model properties back to multi-criteria array objects
  return [
    { id: "absensi", name: "Kedisiplinan Absensi", desc: "Kehadiran harian dan ketepatan check-in.", score: item.absensi || 90, weight: 15, feedback: item.catatan || "Bagus", attachment: null },
    { id: "kinerja", name: "Kinerja Proyek", desc: "Kualitas hasil pengerjaan proyek magang.", score: item.kinerja || 88, weight: 20, feedback: item.catatan || "Sangat baik", attachment: null },
    { id: "tanggungjawab", name: "Bertanggung Jawab", desc: "Komitmen menyelesaikan tugas.", score: item.tanggungJawab || 85, weight: 15, feedback: item.catatan || "Komit", attachment: null },
    { id: "sikap", name: "Etika & Sikap Kerja", desc: "Sikap kerja profesional.", score: item.sikap || 92, weight: 10, feedback: item.catatan || "Sopan", attachment: null },
    { id: "keaktifan", name: "Keaktifan & Komunikasi", desc: "Daily stand-up koordinasi tim.", score: item.komunikasi || 85, weight: 15, feedback: item.catatan || "Aktif", attachment: null },
    { id: "laporan", name: "Laporan Akhir Magang", desc: "Sistematika penulisan laporan magang.", score: item.nilaiTotal || 86, weight: 25, feedback: item.catatan || "Rapih", attachment: null }
  ];
}

export const penilaianAPI = {
  getAssessments: async () => {
    return executeHybridRequest<AssessmentItem[]>(
      "Get student assessment list",
      "/api/penilaian",
      {
        method: "GET"
      },
      () => {
        return mockDB.get<AssessmentItem[]>("assessments", INITIAL_ASSESSMENTS);
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        const list = res.data as any[];
        return {
          ...res,
          data: list.length > 0 ? mapBackendPenilaianToFrontend(list[0]) : INITIAL_ASSESSMENTS
        };
      }
      return res;
    });
  },

  getGradeSummary: async () => {
    return executeHybridRequest<GradeSummary>(
      "Calculate grade statistics",
      "/api/penilaian",
      {
        method: "GET"
      },
      () => {
        const list = mockDB.get<AssessmentItem[]>("assessments", INITIAL_ASSESSMENTS);
        
        let weightedSum = 0;
        list.forEach(item => {
          weightedSum += item.score * (item.weight / 100);
        });

        const overallScore = parseFloat((weightedSum).toFixed(1)) || 0;
        let gradeLetter = "A (Sangat Memuaskan)";
        let status: "Lulus" | "Tidak Lulus" | "Pending" = "Lulus";

        if (overallScore < 85) gradeLetter = "B (Memuaskan)";
        if (overallScore < 75) gradeLetter = "C (Cukup)";

        return {
          overallScore,
          gradeLetter,
          status
        } as GradeSummary;
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
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

  submitStudentGrades: async (payload: SubmitGradeRequest) => {
    // Collect specific rubric points from payload array values
    const getVal = (id: string) => {
      const g = payload.grades.find(item => String(item.criteriaId).toLowerCase().includes(id));
      return g ? g.score : 85.0;
    };

    return executeHybridRequest<boolean>(
      `Submit grades for student ID: ${payload.studentId}`,
      "/api/penilaian",
      {
        method: "POST",
        body: JSON.stringify({
          periodeMagangId: payload.periodeMagangId || "5c1a8d9b-2e9c-4aa4-8f7b-23fcd10d9e81",
          mentorId: payload.mentorId || "3cb1ab0d-4ea3-4cfb-81d0-d3cdb2413e11",
          kinerja: getVal("kinerja"),
          kedisiplinan: getVal("kedisiplinan") || getVal("absensi"),
          tanggungJawab: getVal("tanggungjawab"),
          komunikasi: getVal("komunikasi") || getVal("keaktifan"),
          sikap: getVal("sikap"),
          kerapihan: getVal("penampilan") || 85.0,
          absensi: getVal("absensi"),
          kerjasama: getVal("kerjasama") || 85.0,
          catatan: payload.grades[0]?.feedback || "Performa magang sangat memuaskan."
        })
      },
      () => {
        const current = mockDB.get<AssessmentItem[]>("assessments", INITIAL_ASSESSMENTS);
        
        payload.grades.forEach(g => {
          const index = current.findIndex(item => item.id === String(g.criteriaId) || item.name.toLowerCase().includes(String(g.criteriaId).toLowerCase()));
          if (index !== -1) {
            current[index].score = g.score;
            current[index].feedback = g.feedback;
          }
        });

        mockDB.set<AssessmentItem[]>("assessments", current);
        return true;
      }
    ).then(() => {
      return {
        data: true,
        status: 200,
        message: "Grades submitted successfully",
        timestamp: new Date().toISOString()
      };
    });
  },

  getStudentAssessmentList: async (status?: string, namaMahasiswa?: string) => {
    const queryParams = new URLSearchParams();
    if (status && status !== "Semua") queryParams.append("status", status);
    if (namaMahasiswa) queryParams.append("namaMahasiswa", namaMahasiswa);

    const url = `/api/penilaian?${queryParams.toString()}`;
    return executeHybridRequest<any[]>(
      "Get student assessment list with filters",
      url,
      {
        method: "GET"
      },
      () => {
        return [
          {
            periodeId: "5c1a8d9b-2e9c-4aa4-8f7b-23fcd10d9e81",
            mahasiswaId: "1",
            nim: "2201012001",
            namaMahasiswa: "Budi Santoso",
            penilaianId: "pen-1",
            mentorId: "3cb1ab0d-4ea3-4cfb-81d0-d3cdb2413e11",
            namaMentor: "Mentor A",
            nilaiTotal: 88.0,
            catatan: "Sangat baik."
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
            catatan: "Bagus."
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
            catatan: "Luar biasa."
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
            catatan: null
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
            catatan: "Sangat luar biasa."
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
            catatan: "Baik."
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
            catatan: null
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
            catatan: "Memuaskan."
          }
        ].filter(item => {
          const isGraded = item.penilaianId !== null;
          const matchesStatus =
            status === "Semua" ||
            !status ||
            (status === "Sudah Dinilai" && isGraded) ||
            (status === "Belum Dinilai" && !isGraded);

          const matchesName =
            !namaMahasiswa ||
            item.namaMahasiswa.toLowerCase().includes(namaMahasiswa.toLowerCase()) ||
            item.nim.includes(namaMahasiswa);

          return matchesStatus && matchesName;
        });
      }
    );
  }
};
