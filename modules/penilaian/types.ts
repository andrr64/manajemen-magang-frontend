export interface AssessmentItem {
  id: string;
  name: string;
  desc: string;
  score: number;
  weight: number;
  feedback: string;
  attachment: string | null;
}

export interface CriteriaItem {
  id: number;
  criteriaName: string;
  weight: number;
  score: number;
  feedback: string;
}

export interface GradeSummary {
  overallScore: number;
  gradeLetter: string;
  status: "Lulus" | "Tidak Lulus" | "Pending";
}

export interface SubmitGradeRequest {
  studentId: string | number;
  periodeMagangId?: string;
  mentorId?: string;
  grades: {
    criteriaId: string | number;
    score: number;
    feedback: string;
  }[];
}

export interface PenilaianResponse {
  id: string;
  periodeMagangId: string;
  mahasiswaId: string;
  nim: string;
  namaMahasiswa: string;
  mentorId: string;
  namaMentor: string;
  kinerja: number;
  kedisiplinan: number;
  tanggungJawab: number;
  komunikasi: number;
  sikap: number;
  kerapihan: number;
  absensi: number;
  kerjasama: number;
  nilaiTotal: number;
  catatan: string;
  statusPenilaian: string;
}

export interface PenilaianRequest {
  periodeMagangId: string;
  mentorId: string;
  kinerja: number;
  kedisiplinan: number;
  tanggungJawab: number;
  komunikasi: number;
  sikap: number;
  kerapihan: number;
  absensi: number;
  kerjasama: number;
  catatan: string;
}

export interface PenilaianStatResponse {
  totalPenilaian: number;
  totalSudahDinilai: number;
  totalBelumDinilai: number;
}
