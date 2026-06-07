// =====================================================================
// Backend fields reference (StudentResponse.java):
//   id, userId, email, nim, nama, noHp, gender, universitas,
//   periodeId, tanggalMulai, tanggalBerakhir, statusPeriode,
//   mentorId, namaMentor
//
// Backend stats (StudentStatResponse.java):
//   totalAktif, totalSelesai, totalAktifTanpaPenilaian
//
// Backend request (StudentRequest.java):
//   email, password, nim, nama, noHp, gender, universitas,
//   tanggalMulai, tanggalBerakhir, periodeStatus
//
// Backend update (UpdateStudentRequest.java):
//   email, nim, nama, noHp, gender, universitas,
//   periode: { tanggalMulai, tanggalBerakhir, status }
// =====================================================================

// =====================================================================
// BACKEND SCHEMAS
// =====================================================================
export interface StudentResponse {
  id: string;
  userId: string;
  email: string;
  nim: string;
  nama: string;
  noHp: string;
  gender: string;
  universitas: string;
  periodeId: string | null;
  tanggalMulai: string | null;
  tanggalBerakhir: string | null;
  statusPeriode: string | null;
  mentorId: string | null;
  namaMentor: string | null;
}

export interface StudentStatResponse {
  totalAktif: number;
  totalSelesai: number;
  totalAktifTanpaPenilaian: number;
}

// =====================================================================
// STUDENT — shape yang dipakai komponen UI
// =====================================================================
export interface Student {
  id: string | number;
  name: string;
  nim: string;
  email: string;
  university: string;
  phone: string;
  gender: "Laki-laki" | "Perempuan";
  program: string;
  company: string;
  role: string;
  status: "Aktif" | "Dalam Review" | "Selesai" | "Belum Penempatan";
  progress: number;
  lastActive: string;
  avatarColor: string;
  address: string;
  period: string;
  grade: number | null;
  logbooksCount: number;
  logbooksPending: number;
  attendance: {
    present: number;
    sick: number;
    leave: number;
    absent: number;
  };
  // Raw backend fields (tersedia saat dari backend nyata)
  periodeId?: string | null;
  tanggalMulai?: string | null;
  tanggalBerakhir?: string | null;
  statusPeriode?: string | null;
  mentorId?: string | null;
  namaMentor?: string | null;
  userId?: string | null;
}

// =====================================================================
// STATISTIK
// =====================================================================
export interface StudentStat {
  totalAktif: number;
  totalSelesai: number;
  totalAktifTanpaPenilaian: number;
}

// =====================================================================
// REQUEST — tambah mahasiswa baru (POST /api/mahasiswa)
// =====================================================================
export interface CreateStudentRequest {
  // Wajib
  email: string;
  password?: string;
  nim: string;
  name: string;         // → dikirim ke backend sebagai "nama"
  gender: "Laki-laki" | "Perempuan";
  university: string;   // → "universitas"
  // Opsional
  phone?: string;       // → "noHp"
  program?: string;     // (hanya UI, tidak ada di backend)
  company?: string;     // (hanya UI)
  role?: string;        // (hanya UI)
  address?: string;     // (hanya UI)
  period?: string;      // format "DD Bulan YYYY - DD Bulan YYYY" (hanya UI)
  // Periode magang (dikirim ke backend)
  tanggalMulai?: string;     // "YYYY-MM-DD"
  tanggalBerakhir?: string;  // "YYYY-MM-DD"
  periodeStatus?: string;    // "aktif" | "selesai" | "batal"
}

// =====================================================================
// REQUEST — update mahasiswa (PUT /api/mahasiswa/:id)
// =====================================================================
export interface UpdateStudentRequest {
  email?: string;
  nim?: string;
  name?: string;        // → "nama"
  phone?: string;       // → "noHp"
  gender?: "Laki-laki" | "Perempuan";
  university?: string;  // → "universitas"
  // UI-only fields
  program?: string;
  company?: string;
  role?: string;
  status?: "Aktif" | "Dalam Review" | "Selesai" | "Belum Penempatan";
  progress?: number;
  grade?: number | null;
  period?: string;      // "DD Bulan YYYY - DD Bulan YYYY"
  address?: string;
  // Nested periode update
  periode?: {
    tanggalMulai?: string;    // "YYYY-MM-DD"
    tanggalBerakhir?: string; // "YYYY-MM-DD"
    status?: string;          // "aktif" | "selesai" | "batal"
  };
}

// =====================================================================
// FILTER PARAMS untuk listStudents
// =====================================================================
export interface StudentFilterParams {
  gender?: string;
  universitas?: string;
  status?: string;      // "aktif" | "selesai" | "Belum Penempatan"
}

// =====================================================================
// Legacy — dipakai komponen lama, jangan hapus
// =====================================================================
export interface StudentPeriod {
  id: number;
  name: string;
  nim: string;
  university: string;
  periodStart: string;
  periodEnd: string;
  totalWeeks: number;
  status: "Aktif" | "Selesai" | "Ditangguhkan";
}

export interface StudentRecord {
  id: number;
  name: string;
  nim: string;
  email: string;
  university: string;
  program: string;
  company: string;
  role: string;
  status: "Aktif" | "Selesai" | "Review";
}
