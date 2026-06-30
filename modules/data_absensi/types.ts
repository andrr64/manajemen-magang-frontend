// =====================================================================
// BACKEND SCHEMAS (Matches Spring Boot records exactly)
// =====================================================================

export interface AbsensiResponse {
  id: string;
  periodeMagangId: string;
  mahasiswaId: string;
  mentorId: string | null; // null = belum diverifikasi mentor
  nim: string;
  namaMahasiswa: string;
  tanggal: string; // YYYY-MM-DD
  status: "hadir" | "izin" | "sakit" | "alpha";
  attachmentUrl: string | null;
}

export interface AbsensiStatResponse {
  totalHadir: number;
  totalIzinSakit: number;
}

export interface AbsensiMahasiswaStatResponse {
  totalHadir: number;
  totalIzin: number;
  totalSakit: number;
  totalAlfa: number;
}

export type RekapAbsensiResponse = [string, string, string];

export interface RekapDetailAbsensiResponse {
  id: string | null;
  namaMahasiswa: string;
  tanggal: string; // YYYY-MM-DD
  status: string;
  createdAt: string | null; // ISO DateTime
  attachmentUrl: string | null;
}

// =====================================================================
// SHARED / COMMON
// =====================================================================

export interface AttendanceLog {
  id: string | number;
  date: string;
  tanggalISO?: string;
  type: "Hadir" | "Izin" | "Sakit" | "Alpha";
  checkIn: string;
  checkOut: string;
  document: string | null;
  status: "Diverifikasi" | "Menunggu" | "Ditolak";
  studentId?: string | number;
  studentName?: string;
  studentNim?: string;
}

// =====================================================================
// MENTOR-SIDE
// =====================================================================

/**
 * Matches backend AbsensiHarianMentorResponse.
 * Satu baris per mahasiswa bimbingan yang periode magangnya mencakup tanggal tsb.
 * absensiStatus = "alpha" jika belum ada record absensi.
 */
export interface AbsensiHarianMentorResponse {
  mahasiswaId: string;
  nim: string;
  nama: string;
  noHp: string | null;
  periodeMagangId: string;
  tanggalMulai: string;    // YYYY-MM-DD
  tanggalBerakhir: string; // YYYY-MM-DD
  absensiId: string | null;
  absensiStatus: "hadir" | "izin" | "sakit" | "alpha";
}

/** Request body for POST /api/absensi/mentor/submit */
export interface AbsensiMentorRequest {
  mahasiswaId: string;
  status: "hadir" | "izin" | "sakit";
  tanggal?: string;
  attachmentUrl?: string | null;
}

/** Statistik absensi untuk mentor (semua mahasiswa / filter nama) */
export interface AttendanceSummary {
  present: number;
  sick: number;
  leave: number;
  absent: number;
  totalDays: number;
  percentage: number;
}

// =====================================================================
// MAHASISWA-SIDE
// =====================================================================

/** Request submit absensi harian mahasiswa */
export interface SubmitAbsensiRequest {
  status: "hadir" | "izin" | "sakit";
  attachmentUrl?: string | null;
}

/** Statistik absensi pribadi mahasiswa */
export interface AbsensiMahasiswaStat {
  totalHadir: number;
  totalIzin: number;
  totalSakit: number;
  totalAlfa: number;
}

// =====================================================================
// LEGACY — masih dipakai beberapa komponen lama
// =====================================================================

export interface CheckInRequest {
  status: "hadir" | "izin" | "sakit";
  document?: string | null;
}

export interface CheckOutRequest {
  logId: string | number;
  checkOutTime?: string;
}
