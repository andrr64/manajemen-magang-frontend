import { executeHybridRequest, mockDB } from "../api-client";
import { CertificateInfo, VerifyCertificateResponse, SertifikatResponse, SertifikatStatResponse } from "./types";
import { studentsData } from "@/app/dashboard/mentor/data-mahasiswa/studentsData";

const INITIAL_CERTIFICATE: CertificateInfo = {
  number: "CERT/IF/UI-GTN/2026/05/0021",
  issueDate: "29 Mei 2026",
  grade: "A (Sangat Memuaskan)",
  recipient: "Budi Santoso",
  company: "PT. Global Teknologi Nusantara",
  role: "Software Engineering Intern",
  fileSize: "2.8 MB",
  fileFormat: "PDF Document",
  status: "Issued"
};

const INITIAL_MOCK_LIST: SertifikatResponse[] = [
  { id: "cert-1", periodeMagangId: "5c1a8d9b-2e9c-4aa4-8f7b-23fcd10d9e81", mahasiswaId: "mahasiswa-1", nim: "2201012001", namaMahasiswa: "Budi Santoso", url: "https://storage.internflow.com/certificates/completion-cert.pdf", statusSertifikat: "Sudah Diunggah", createdAt: "2026-05-29T10:00:00Z" },
  { id: null, periodeMagangId: "period-2", mahasiswaId: "mahasiswa-2", nim: "2201012042", namaMahasiswa: "Siti Rahmawati", url: "-", statusSertifikat: "belum diunggah", createdAt: null },
  { id: "cert-3", periodeMagangId: "period-3", mahasiswaId: "mahasiswa-3", nim: "2201012015", namaMahasiswa: "Rian Hidayat", url: "https://storage.internflow.com/certificates/completion-cert.pdf", statusSertifikat: "Sudah Diunggah", createdAt: "2026-05-29T10:00:00Z" },
  { id: null, periodeMagangId: "period-4", mahasiswaId: "mahasiswa-4", nim: "2201012088", namaMahasiswa: "Amanda Putri", url: "-", statusSertifikat: "belum diunggah", createdAt: null },
  { id: "cert-5", periodeMagangId: "period-5", mahasiswaId: "mahasiswa-5", nim: "2201012009", namaMahasiswa: "Dedi Kurniawan", url: "https://storage.internflow.com/certificates/completion-cert.pdf", statusSertifikat: "Sudah Diunggah", createdAt: "2026-05-29T10:00:00Z" },
  { id: null, periodeMagangId: "period-6", mahasiswaId: "mahasiswa-6", nim: "2201012033", namaMahasiswa: "Aditya Pratama", url: "-", statusSertifikat: "belum diunggah", createdAt: null },
  { id: null, periodeMagangId: "period-7", mahasiswaId: "mahasiswa-7", nim: "2201012071", namaMahasiswa: "Fitri Handayani", url: "-", statusSertifikat: "belum diunggah", createdAt: null },
  { id: "cert-8", periodeMagangId: "period-8", mahasiswaId: "mahasiswa-8", nim: "2201012095", namaMahasiswa: "Andi Pratama", url: "https://storage.internflow.com/certificates/completion-cert.pdf", statusSertifikat: "Sudah Diunggah", createdAt: "2026-05-29T10:00:00Z" }
];

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
    downloadUrl: item.url !== "-" ? item.url : undefined
  };
}

export const sertifikatAPI = {
  // Student - Get their own certificate
  getCertificate: async () => {
    return executeHybridRequest<CertificateInfo>(
      "Get student certificate details",
      "/api/sertifikat",
      {
        method: "GET"
      },
      () => {
        return mockDB.get<CertificateInfo>("certificate", INITIAL_CERTIFICATE);
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        const list = res.data as unknown as any[];
        const budiCert = list.find(item => item.namaMahasiswa === "Budi Santoso" || item.nim === "2201012001") || list[0];
        return {
          ...res,
          data: budiCert ? mapBackendSertifikatToFrontend(budiCert) : INITIAL_CERTIFICATE
        };
      }
      return res;
    });
  },

  // Mentor - List all student certificates
  getCertificateList: async (status?: string, namaMahasiswa?: string) => {
    const params = new URLSearchParams();
    if (status && status !== "Semua") params.append("status", status);
    if (namaMahasiswa) params.append("namaMahasiswa", namaMahasiswa);

    const queryStr = params.toString() ? `?${params.toString()}` : "";

    return executeHybridRequest<SertifikatResponse[]>(
      "List all student certificates",
      `/api/sertifikat${queryStr}`,
      {
        method: "GET"
      },
      () => {
        let list = mockDB.get<SertifikatResponse[]>("certificate_list", INITIAL_MOCK_LIST);
        
        if (status && status !== "Semua") {
          list = list.filter(item => item.statusSertifikat.toLowerCase() === status.toLowerCase());
        }
        if (namaMahasiswa) {
          const q = namaMahasiswa.toLowerCase().trim();
          list = list.filter(item => item.namaMahasiswa.toLowerCase().includes(q) || item.nim.includes(q));
        }
        return list;
      }
    );
  },

  // Mentor - Get certificate statistics
  getCertificateStatistics: async (namaMahasiswa?: string) => {
    const query = namaMahasiswa ? `?namaMahasiswa=${encodeURIComponent(namaMahasiswa)}` : "";
    
    return executeHybridRequest<SertifikatStatResponse>(
      "Get certificate statistics",
      `/api/sertifikat/statistik${query}`,
      {
        method: "GET"
      },
      () => {
        const list = mockDB.get<SertifikatResponse[]>("certificate_list", INITIAL_MOCK_LIST);
        
        const filtered = namaMahasiswa 
          ? list.filter(item => item.namaMahasiswa.toLowerCase().includes(namaMahasiswa.toLowerCase().trim())) 
          : list;

        const totalSertifikatDiunggah = filtered.filter(item => item.statusSertifikat === "Sudah Diunggah").length;
        const totalJumlahSertifikat = filtered.length;
        const totalSertifikatBelumDiunggah = totalJumlahSertifikat - totalSertifikatDiunggah;

        return {
          totalSertifikatDiunggah,
          totalSertifikatBelumDiunggah,
          totalJumlahSertifikat
        } as SertifikatStatResponse;
      }
    );
  },

  // Verify Certificate Code
  verifyCode: async (code: string) => {
    return executeHybridRequest<VerifyCertificateResponse>(
      `Verify certificate code: ${code}`,
      "/api/sertifikat",
      {
        method: "GET"
      },
      () => {
        const cert = mockDB.get<CertificateInfo>("certificate", INITIAL_CERTIFICATE);
        const cleanCode = code.toUpperCase().trim();
        const cleanCertNum = cert.number.toUpperCase();

        if (cleanCertNum.includes(cleanCode) || cleanCode === "0021" || cleanCode === "BUDI") {
          return {
            isValid: true,
            certificate: cert,
            message: "Sertifikat VALID dan Terdaftar Secara Resmi di Sistem InternFlow!"
          } as VerifyCertificateResponse;
        }

        return {
          isValid: false,
          certificate: null,
          message: "Kode sertifikat tidak terdaftar atau tidak valid. Silakan periksa kembali."
        } as VerifyCertificateResponse;
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
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
      "/api/sertifikat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          periodeMagangId,
          url
        })
      },
      () => {
        const list = mockDB.get<SertifikatResponse[]>("certificate_list", INITIAL_MOCK_LIST);
        const matchedIndex = list.findIndex(item => item.periodeMagangId === periodeMagangId);

        let updatedItem: SertifikatResponse;
        if (matchedIndex > -1) {
          updatedItem = {
            ...list[matchedIndex],
            id: list[matchedIndex].id || `cert-${Date.now()}`,
            url,
            statusSertifikat: "Sudah Diunggah",
            createdAt: new Date().toISOString()
          };
          list[matchedIndex] = updatedItem;
        } else {
          updatedItem = {
            id: `cert-${Date.now()}`,
            periodeMagangId,
            mahasiswaId: "mahasiswa-temp",
            nim: "123456",
            namaMahasiswa: "Mahasiswa Baru",
            url,
            statusSertifikat: "Sudah Diunggah",
            createdAt: new Date().toISOString()
          };
          list.push(updatedItem);
        }

        mockDB.set<SertifikatResponse[]>("certificate_list", list);
        return updatedItem;
      }
    );
  },

  // Backwards compatible issueCertificate
  issueCertificate: async (payload: Partial<CertificateInfo>) => {
    return executeHybridRequest<CertificateInfo>(
      `Issue certificate to ${payload.recipient}`,
      "/api/sertifikat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          periodeMagangId: "5c1a8d9b-2e9c-4aa4-8f7b-23fcd10d9e81",
          url: payload.downloadUrl || "https://storage.internflow.com/certificates/completion-cert.pdf"
        })
      },
      () => {
        const current = mockDB.get<CertificateInfo>("certificate", INITIAL_CERTIFICATE);
        const updated: CertificateInfo = {
          ...current,
          ...payload,
          status: "Issued"
        };
        mockDB.set<CertificateInfo>("certificate", updated);
        return updated;
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        return {
          ...res,
          data: mapBackendSertifikatToFrontend(res.data)
        };
      }
      return res;
    });
  }
};
