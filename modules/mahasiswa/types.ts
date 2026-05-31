export interface Student {
  id: number;
  name: string;
  nim: string;
  email: string;
  university: string;
  phone: string;
  gender: "Laki-laki" | "Perempuan";
  program: string;
  company: string;
  role: string;
  status: "Aktif" | "Dalam Review" | "Selesai";
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
}

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

export interface CreateStudentRequest {
  name: string;
  nim: string;
  email: string;
  university: string;
  program: string;
  company?: string;
  role?: string;
  gender: "Laki-laki" | "Perempuan";
  phone: string;
  address: string;
  period: string;
}

export interface UpdateStudentRequest {
  name?: string;
  email?: string;
  university?: string;
  program?: string;
  company?: string;
  role?: string;
  status?: "Aktif" | "Dalam Review" | "Selesai";
  progress?: number;
  grade?: number | null;
  period?: string;
  nim?: string;
}
