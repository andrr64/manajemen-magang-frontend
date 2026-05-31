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

export interface AttendanceSummary {
  present: number;
  sick: number;
  leave: number;
  absent: number;
  totalDays: number;
  percentage: number;
}

export interface CheckInRequest {
  status: "hadir" | "izin" | "sakit";
  notes?: string;
  document?: string | null; // Filename for permissions
  documentSize?: string;
}

export interface CheckOutRequest {
  logId: string | number;
  checkOutTime?: string;
}
