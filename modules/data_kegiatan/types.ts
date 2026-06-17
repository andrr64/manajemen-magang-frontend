// =====================================================================
// BACKEND SCHEMAS
// =====================================================================

export interface ActivityResponse {
  id: string;
  mahasiswaId: string;
  namaMahasiswa: string;
  judul: string;
  deskripsi: string;
  waktu: string;
  fileUrls: string[];
  status: string;
  namaMentor: string | null;
}

export interface ActivityStatResponse {
  totalKegiatan: number;
  disetujui: number;
  ditolak: number;
}

// =====================================================================
// FRONTEND SHAPES
// =====================================================================

export interface Activity {
  id: number | string;
  title: string;
  deskripsi: string;
  date: string;
  time: string;
  fileUrls: string[];
  status: "Disetujui" | "Belum Disetujui" | "Ditolak";
  namaMentor: string | null;
}

export interface ActivityLog {
  id: number | string;
  studentId?: string | number;
  studentName: string;
  studentNim: string;
  date: string;
  week: string;
  topic: string;
  title: string;
  hours: number;
  fileUrls: string[];
  status: "Menunggu" | "Disetujui" | "Ditolak";
}

export interface CreateActivityRequest {
  title: string;
  keterangan?: string;
  date: string;
  time: string;
  fileKeys?: string[];
}

export interface ApproveActivityRequest {
  id: number | string;
  status: "Disetujui" | "Ditolak";
}

export interface ActivityStat {
  totalKegiatan: number;
  disetujui: number;
  ditolak: number;
}
