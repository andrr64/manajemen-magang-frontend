import { executeHybridRequest } from "../api-client";
import { API_ROUTES } from "../api-routes";
import { LetterInfo, RequestLetterPayload, VerifyLetterResponse, SuratKeteranganResponse, SuratKeteranganStatResponse } from "./types";
import { mediaAPI } from "../media/api";

function mapBackendLetterToFrontend(item: any): LetterInfo {
  return {
    number: "GTN/HRD-INTERN/V/2026/0892",
    issueDate: "29 Mei 2026",
    recipient: item.namaMahasiswa || "Budi Santoso",
    company: "PT. Global Teknologi Nusantara",
    role: "Software Engineering Intern",
    fileSize: "1.4 MB",
    fileFormat: "PDF Document",
    status: item.statusSurat === "Sudah Diunggah" ? "Issued" : "Pending",
    downloadUrl: item.url && item.url !== "-" ? mediaAPI.getFileUrl(item.url) : undefined,
    hasSignature: item.statusSurat === "Sudah Diunggah",
    hrName: "Siti Amelia, M.Psi."
  };
}

export const suratKeteranganAPI = {
  getLetter: async () => {
    return executeHybridRequest<LetterInfo>(
      "Get student reference letter details",
      API_ROUTES.SURAT_KETERANGAN_MAHASISWA,
      { method: "GET" }
    ).then((res) => {
      const item = res.data as any;
      return {
        ...res,
        data: item ? mapBackendLetterToFrontend(item) : null as any
      };
    });
  },

  requestLetter: async (payload: RequestLetterPayload) => {
    return executeHybridRequest<LetterInfo>(
      `Request new reference letter for ${payload.recipientName}`,
      API_ROUTES.SURAT_KETERANGAN_LIST,
      {
        method: "POST",
        body: JSON.stringify({
          periodeMagangId: "5c1a8d9b-2e9c-4aa4-8f7b-23fcd10d9e81",
          url: "https://storage.internflow.com/letters/completion-letter.pdf"
        })
      }
    ).then((res) => {
      if (true) {
        return {
          ...res,
          data: mapBackendLetterToFrontend(res.data)
        };
      }
      return res;
    });
  },

  verifyCode: async (code: string) => {
    return executeHybridRequest<VerifyLetterResponse>(
      `Verify letter security code: ${code}`,
      API_ROUTES.SURAT_KETERANGAN_LIST,
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
              letter: mapBackendLetterToFrontend(matched),
              message: "Surat Keterangan Magang VALID dan Terdaftar Secara Resmi di Sistem InternFlow!"
            }
          };
        }

        return {
          ...res,
          data: {
            isValid: false,
            letter: null,
            message: "Kode surat keterangan tidak terdaftar atau tidak valid. Silakan periksa kembali."
          }
        };
      }
      return res;
    });
  },

  signLetter: async (payload: Partial<LetterInfo>) => {
    return executeHybridRequest<LetterInfo>(
      "Issue and digitally sign reference letter",
      API_ROUTES.SURAT_KETERANGAN_LIST,
      {
        method: "POST",
        body: JSON.stringify({
          periodeMagangId: "5c1a8d9b-2e9c-4aa4-8f7b-23fcd10d9e81",
          url: payload.downloadUrl || "https://storage.internflow.com/letters/completion-letter.pdf"
        })
      }
    ).then((res) => {
      if (true) {
        return {
          ...res,
          data: mapBackendLetterToFrontend(res.data)
        };
      }
      return res;
    });
  },

  getLetterList: async (status?: string, namaMahasiswa?: string) => {
    const queryParams = new URLSearchParams();
    if (status && status !== "Semua") queryParams.append("status", status);
    if (namaMahasiswa) queryParams.append("namaMahasiswa", namaMahasiswa);

    const url = `${API_ROUTES.SURAT_KETERANGAN_LIST}?${queryParams.toString()}`;
    return executeHybridRequest<SuratKeteranganResponse[]>(
      "Get student reference letter list with filters",
      url,
      {
        method: "GET"
      }
    );
  },

  getLetterStatistics: async (namaMahasiswa?: string) => {
    const queryParams = new URLSearchParams();
    if (namaMahasiswa) queryParams.append("namaMahasiswa", namaMahasiswa);

    const url = `${API_ROUTES.SURAT_KETERANGAN_STATISTIK}?${queryParams.toString()}`;
    return executeHybridRequest<SuratKeteranganStatResponse>(
      "Get reference letter statistics",
      url,
      {
        method: "GET"
      }
    );
  },

  uploadSuratKeterangan: async (periodeMagangId: string, url: string) => {
    return executeHybridRequest<SuratKeteranganResponse>(
      "Upload reference letter",
      API_ROUTES.SURAT_KETERANGAN_LIST,
      {
        method: "POST",
        body: JSON.stringify({
          periodeMagangId,
          url
        })
      }
    );
  }
};
