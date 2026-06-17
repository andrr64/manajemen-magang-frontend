// =====================================================================
// BACKEND SCHEMAS (Matches Spring Boot records exactly)
// =====================================================================

export interface AbsensiResponse {
  id: string; // UUID
  periodeMagangId: string; // UUID
  mahasiswaId: string; // UUID
  nim: string;
  namaMahasiswa: string;
  tanggal: string; // LocalDate (YYYY-MM-DD)
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

// =====================================================================
// SHARED / COMMON
// =====================================================================

export interface AttendanceLog {
  id: string | number;
  date: string;
  tanggalISO?: string; // YYYY-MM-DD — untuk perbandingan tanggal
  type: "Hadir" | "Izin" | "Sakit" | "Alpha";
  checkIn: string;
  checkOut: string;
  document: string | null;
  documentSize?: string;
  notes?: string;
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
  /** YYYY-MM-DD — opsional, backend default hari ini */
  tanggal?: string;
  keterangan?: string;
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
  /** "hadir" | "izin" | "sakit" */
  status: "hadir" | "izin" | "sakit";
  /** Keterangan/alasan (wajib untuk izin & sakit) */
  keterangan?: string;
  /** Key media hasil upload modul media (untuk izin & sakit) */
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
  notes?: string;
  document?: string | null;
  documentSize?: string;
}

export interface CheckOutRequest {
  logId: string | number;
  checkOutTime?: string;
}
