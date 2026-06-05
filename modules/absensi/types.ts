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
