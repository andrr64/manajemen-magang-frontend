export interface CertificateInfo {
  number: string;
  issueDate: string;
  grade: string;
  recipient: string;
  company: string;
  role: string;
  fileSize: string;
  fileFormat: string;
  status: "Issued" | "Pending" | "Rejected";
  downloadUrl?: string;
}

export interface VerifyCertificateRequest {
  code: string;
}

export interface VerifyCertificateResponse {
  isValid: boolean;
  certificate: CertificateInfo | null;
  message: string;
}

// Real Backend Response Types
export interface SertifikatResponse {
  id: string | null;
  periodeMagangId: string;
  mahasiswaId: string;
  nim: string;
  namaMahasiswa: string;
  url: string;
  statusSertifikat: string;
  createdAt: string | null;
}

export interface SertifikatStatResponse {
  totalSertifikatDiunggah: number;
  totalSertifikatBelumDiunggah: number;
  totalJumlahSertifikat: number;
}
