export interface LetterInfo {
  number: string;
  issueDate: string;
  recipient: string;
  company: string;
  role: string;
  fileSize: string;
  fileFormat: string;
  status: "Issued" | "Pending" | "Rejected";
  downloadUrl?: string;
  hasSignature: boolean;
  hrName: string;
}

export interface RequestLetterPayload {
  recipientName: string;
  role: string;
  company: string;
  purpose: string;
}

export interface VerifyLetterResponse {
  isValid: boolean;
  letter: LetterInfo | null;
  message: string;
}

// Real Backend Response Types
export interface SuratKeteranganResponse {
  id: string | null;
  periodeMagangId: string;
  mahasiswaId: string;
  nim: string;
  namaMahasiswa: string;
  url: string;
  statusSurat: string;
  createdAt: string | null;
}

export interface SuratKeteranganStatResponse {
  totalSuratDiunggah: number;
  totalSuratBelumDiunggah: number;
  totalJumlahSurat: number;
}
