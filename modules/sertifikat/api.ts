import { executeHybridRequest } from "../api-client";
import { API_ROUTES } from "../api-routes";
import { CertificateInfo, VerifyCertificateResponse, SertifikatResponse, SertifikatStatResponse } from "./types";
import { studentsData } from "@/app/dashboard/mentor/data-mahasiswa/studentsData";
import { mediaAPI } from "../media/api";

export function mapBackendSertifikatToFrontend(item: any): CertificateInfo {
  const student = studentsData.find(s => s.nim === item.nim || s.name === item.namaMahasiswa);
  
  return {
    number: item.id ? `CERT/IF/UI-GTN/2026/05/${item.nim.substring(item.nim.length - 4)}` : "CERT/IF/UI-GTN/2026/05/0021",
    issueDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "29 Mei 2026",
    grade: student?.grade ? `${student.grade} (${student.grade >= 85 ? "Sangat Memuaskan" : "Memuaskan"})` : "A (Sangat Memuaskan)",
    recipient: item.namaMahasiswa || "Budi Santoso",
    company: student?.company || "PT. Global Teknologi Nusantara",
    role: student?.role || "Software Engineering Intern",
    fileSize: "2.8 MB",
    fileFormat: "PDF Document",
    status: item.statusSertifikat === "Sudah Diunggah" ? "Issued" : "Pending",
    downloadUrl: item.url && item.url !== "-" ? mediaAPI.getFileUrl(item.url) : undefined
  };
}

export const sertifikatAPI = {
  // Student - Get their own certificate (raw SertifikatResponse)
  getCertificate: async (): Promise<{ data: SertifikatResponse | null }> => {
    try {
      const res = await executeHybridRequest<SertifikatResponse>(
        "Get student certificate details",
        API_ROUTES.SERTIFIKAT_MAHASISWA,
        { method: "GET" }
      );
      return { data: res.data as unknown as SertifikatResponse };
    } catch (err: any) {
      if (err?.status === 404) return { data: null };
      throw err;
    }
  },

  // Mentor - List all student certificates
  getCertificateList: async (status?: string, namaMahasiswa?: string) => {
    const params = new URLSearchParams();
    if (status && status !== "Semua") params.append("status", status);
    if (namaMahasiswa) params.append("namaMahasiswa", namaMahasiswa);

    const queryStr = params.toString() ? `?${params.toString()}` : "";

    return executeHybridRequest<SertifikatResponse[]>(
      "List all student certificates",
      `${API_ROUTES.SERTIFIKAT_LIST}${queryStr}`,
      {
        method: "GET"
      }
    );
  },

  // Mentor - Get certificate statistics
  getCertificateStatistics: async (namaMahasiswa?: string) => {
    const query = namaMahasiswa ? `?namaMahasiswa=${encodeURIComponent(namaMahasiswa)}` : "";
    
    return executeHybridRequest<SertifikatStatResponse>(
      "Get certificate statistics",
      `${API_ROUTES.SERTIFIKAT_STATISTIK}${query}`,
      {
        method: "GET"
      }
    );
  },

  // Verify Certificate Code
  verifyCode: async (code: string) => {
    return executeHybridRequest<VerifyCertificateResponse>(
      `Verify certificate code: ${code}`,
      API_ROUTES.SERTIFIKAT_LIST,
      {
        method: "GET"
      }
    ).then((res) => {
      if (true) {
        const list = res.data as unknown as any[];
        const cleanCode = code.toUpperCase().trim();
        const matched = list.find(item => item.nim.includes(cleanCode) || item.namaMahasiswa.toUpperCase().includes(cleanCode));
        
        if (matched) {
          return {
            ...res,
            data: {
              isValid: true,
              certificate: mapBackendSertifikatToFrontend(matched),
              message: "Sertifikat VALID dan Terdaftar Secara Resmi di Sistem InternFlow!"
            }
          };
        }

        return {
          ...res,
          data: {
            isValid: false,
            certificate: null,
            message: "Kode sertifikat tidak terdaftar atau tidak valid. Silakan periksa kembali."
          }
        };
      }
      return res;
    });
  },

  // Save / Update certificate
  uploadSertifikat: async (periodeMagangId: string, url: string) => {
    return executeHybridRequest<SertifikatResponse>(
      `Upload certificate for period ${periodeMagangId}`,
      API_ROUTES.SERTIFIKAT_LIST,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          periodeMagangId,
          url
        })
      }
    );
  },

  // Backwards compatible issueCertificate
  issueCertificate: async (payload: Partial<CertificateInfo>) => {
    return executeHybridRequest<CertificateInfo>(
      `Issue certificate to ${payload.recipient}`,
      API_ROUTES.SERTIFIKAT_LIST,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          periodeMagangId: "5c1a8d9b-2e9c-4aa4-8f7b-23fcd10d9e81",
          url: payload.downloadUrl || "https://storage.internflow.com/certificates/completion-cert.pdf"
        })
      }
    ).then((res) => {
      if (true) {
        return {
          ...res,
          data: mapBackendSertifikatToFrontend(res.data)
        };
      }
      return res;
    });
  }
};
