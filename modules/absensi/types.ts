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
  waktuMasuk: string | null; // OffsetDateTime (ISO-8601 string)
  waktuKeluar: string | null; // OffsetDateTime (ISO-8601 string)
  status: "hadir" | "izin" | "sakit" | "alpha";
  attachmentUrl: string | null;
  statusVerifikasi: "DISETUJUI" | "PENDING" | "DITOLAK";
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
  /** File PDF atau gambar maks 10MB (untuk izin & sakit) */
  file?: File | null;
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
