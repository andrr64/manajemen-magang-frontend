export interface ActivityResponse {
  id: string;
  mahasiswaId: string;
  namaMahasiswa: string;
  judul: string;
  deskripsi: string;
  waktu: string;
  fileUrl: string | null;
  status: string;
}

export interface ActivityStatResponse {
  totalKegiatan: number;
  disetujui: number;
  ditolak: number;
}

export interface Activity {
  id: number | string;
  title: string;
  date: string;
  time: string;
  fileName: string | null;
  fileSize: string | null;
  status: "Belum Unggah" | "Sudah Diunggah";
}

export interface ActivityLog {
  id: number | string;
  studentId?: string | number;
  studentName: string;
  studentNim: string;
  date: string;
  week: string;
  topic: string; // matches topic in StudentDashboardHome
  title: string; // matches title in StudentActivitiesPage
  hours: number;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: string | null;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  notes?: string;
}

export interface CreateActivityRequest {
  title: string;
  date: string;
  time: string;
  fileName?: string | null;
  fileSize?: string | null;
}

export interface ApproveActivityRequest {
  id: number | string;
  status: "Disetujui" | "Ditolak";
  notes?: string;
}

export interface ActivityStat {
  totalKegiatan: number;
  disetujui: number;
  ditolak: number;
}
