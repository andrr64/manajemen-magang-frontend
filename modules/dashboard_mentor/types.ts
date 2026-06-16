export interface DashboardStatResponse {
  jumlahMahasiswaAktif: number;
  jumlahMahasiswaSelesai: number;
  rekapAbsensi: Record<string, number>;
}

export interface RegisterStudentRequest {
  email: string;
  password?: string;
  nim: string;
  nama: string;
  noHp?: string;
  gender: "Laki-laki" | "Perempuan" | string;
  universitas: string;
  tanggalMulai?: string; // Format: YYYY-MM-DD
  tanggalBerakhir?: string; // Format: YYYY-MM-DD
}

export interface SearchStudentResponse {
  id: string;
  userId: string;
  email: string;
  nim: string;
  nama: string;
  noHp: string;
  gender: string;
  universitas: string;
  periodeId: string;
  tanggalMulai: string;
  tanggalBerakhir: string;
  statusPeriode: string;
}
