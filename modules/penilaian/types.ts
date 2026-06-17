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



export interface PenilaianResponse {
  id: string | null;
  periodeMagangId: string;
  mahasiswaId: string;
  nim: string;
  namaMahasiswa: string;
  tanggalMulai: string | null;   // YYYY-MM-DD
  tanggalBerakhir: string | null;
  mentorId: string | null;
  namaMentor: string | null;
  kinerja: number | null;
  kedisiplinan: number | null;
  tanggungJawab: number | null;
  komunikasi: number | null;
  sikap: number | null;
  kerapihan: number | null;
  absensi: number | null;
  kerjasama: number | null;
  nilaiTotal: number | null;
  catatan: string | null;
  statusPenilaian: "SUDAH_DINILAI" | "BELUM_DINILAI";
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
