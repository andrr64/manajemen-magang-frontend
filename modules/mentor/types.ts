export interface Mentor {
  id: number;
  name: string;
  type: "Akademik" | "Industri"; // Akademik = Dosen Pembimbing, Industri = Mentor Lapangan
  identityNo: string; // NIDN for Akademik, NIK/Employee ID for Industri
  email: string;
  phone: string;
  departmentOrCompany: string; // Fakultas/Prodi for Akademik, Company Name for Industri
  studentsCount: number;
  status: "Aktif" | "Nonaktif";
}

export interface CreateMentorRequest {
  name: string;
  type: "Akademik" | "Industri";
  identityNo: string;
  email: string;
  phone: string;
  departmentOrCompany: string;
}

export interface UpdateMentorRequest {
  name?: string;
  email?: string;
  phone?: string;
  departmentOrCompany?: string;
  status?: "Aktif" | "Nonaktif";
  studentsCount?: number;
}
