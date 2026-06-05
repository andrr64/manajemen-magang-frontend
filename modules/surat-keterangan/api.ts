import { executeHybridRequest, mockDB } from "../api-client";
import { LetterInfo, RequestLetterPayload, VerifyLetterResponse, SuratKeteranganResponse, SuratKeteranganStatResponse } from "./types";

const INITIAL_LETTER: LetterInfo = {
  number: "GTN/HRD-INTERN/V/2026/0892",
  issueDate: "29 Mei 2026",
  recipient: "Budi Santoso",
  company: "PT. Global Teknologi Nusantara",
  role: "Software Engineering Intern",
  fileSize: "1.4 MB",
  fileFormat: "PDF Document",
  status: "Issued",
  hasSignature: true,
  hrName: "Siti Amelia, M.Psi."
};

const INITIAL_MOCK_LIST: SuratKeteranganResponse[] = [
  { id: "cert-1", periodeMagangId: "5c1a8d9b-2e9c-4aa4-8f7b-23fcd10d9e81", mahasiswaId: "1", nim: "2201012001", namaMahasiswa: "Budi Santoso", url: "https://storage.internflow.com/letters/completion-letter.pdf", statusSurat: "Sudah Diunggah", createdAt: "2026-05-29T10:00:00Z" },
  { id: null, periodeMagangId: "period-2", mahasiswaId: "2", nim: "2201012042", namaMahasiswa: "Siti Rahmawati", url: "-", statusSurat: "belum diunggah", createdAt: null },
  { id: "cert-3", periodeMagangId: "period-3", mahasiswaId: "3", nim: "2201012015", namaMahasiswa: "Rian Hidayat", url: "https://storage.internflow.com/letters/completion-letter.pdf", statusSurat: "Sudah Diunggah", createdAt: "2026-05-29T10:00:00Z" },
  { id: null, periodeMagangId: "period-4", mahasiswaId: "4", nim: "2201012088", namaMahasiswa: "Amanda Putri", url: "-", statusSurat: "belum diunggah", createdAt: null },
  { id: null, periodeMagangId: "period-5", mahasiswaId: "5", nim: "2201012102", namaMahasiswa: "Dedi Kurniawan", url: "-", statusSurat: "belum diunggah", createdAt: null },
  { id: null, periodeMagangId: "period-6", mahasiswaId: "6", nim: "2201012110", namaMahasiswa: "Fajar Nugroho", url: "-", statusSurat: "belum diunggah", createdAt: null },
  { id: null, periodeMagangId: "period-7", mahasiswaId: "7", nim: "2201012123", namaMahasiswa: "Lina Marlina", url: "-", statusSurat: "belum diunggah", createdAt: null },
  { id: "cert-8", periodeMagangId: "period-8", mahasiswaId: "8", nim: "2201012134", namaMahasiswa: "Andi Pratama", url: "https://storage.internflow.com/letters/completion-letter.pdf", statusSurat: "Sudah Diunggah", createdAt: "2026-05-29T10:00:00Z" }
];

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
    downloadUrl: item.url || undefined,
    hasSignature: item.statusSurat === "Sudah Diunggah",
    hrName: "Siti Amelia, M.Psi."
  };
}

export const suratKeteranganAPI = {
  getLetter: async () => {
    return executeHybridRequest<LetterInfo>(
      "Get student reference letter details",
      "/api/surat-keterangan",
      {
        method: "GET"
      },
      () => {
        return mockDB.get<LetterInfo>("reference_letter", INITIAL_LETTER);
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        const list = res.data as unknown as any[];
        return {
          ...res,
          data: list.length > 0 ? mapBackendLetterToFrontend(list[0]) : INITIAL_LETTER
        };
      }
      return res;
    });
  },

  requestLetter: async (payload: RequestLetterPayload) => {
    return executeHybridRequest<LetterInfo>(
      `Request new reference letter for ${payload.recipientName}`,
      "/api/surat-keterangan",
      {
        method: "POST",
        body: JSON.stringify({
          periodeMagangId: "5c1a8d9b-2e9c-4aa4-8f7b-23fcd10d9e81",
          url: "https://storage.internflow.com/letters/completion-letter.pdf"
        })
      },
      () => {
        const newLetter: LetterInfo = {
          number: `GTN/HRD-INTERN/V/2026/${Math.floor(1000 + Math.random() * 9000)}`,
          issueDate: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }),
          recipient: payload.recipientName,
          company: payload.company,
          role: payload.role,
          fileSize: "1.4 MB",
          fileFormat: "PDF Document",
          status: "Pending",
          hasSignature: false,
          hrName: "Siti Amelia, M.Psi."
        };

        mockDB.set<LetterInfo>("reference_letter", newLetter);
        return newLetter;
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
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
      "/api/surat-keterangan",
      {
        method: "GET"
      },
      () => {
        const letter = mockDB.get<LetterInfo>("reference_letter", INITIAL_LETTER);
        const cleanCode = code.toUpperCase().trim();
        const cleanLetterNum = letter.number.toUpperCase();

        if (cleanLetterNum.includes(cleanCode) || cleanCode === "0892") {
          return {
            isValid: true,
            letter: letter,
            message: "Surat Keterangan Magang VALID dan Terdaftar Secara Resmi di Sistem InternFlow!"
          } as VerifyLetterResponse;
        }

        return {
          isValid: false,
          letter: null,
          message: "Kode surat keterangan tidak terdaftar atau tidak valid. Silakan periksa kembali."
        } as VerifyLetterResponse;
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
      "/api/surat-keterangan",
      {
        method: "POST",
        body: JSON.stringify({
          periodeMagangId: "5c1a8d9b-2e9c-4aa4-8f7b-23fcd10d9e81",
          url: payload.downloadUrl || "https://storage.internflow.com/letters/completion-letter.pdf"
        })
      },
      () => {
        const current = mockDB.get<LetterInfo>("reference_letter", INITIAL_LETTER);
        const updated: LetterInfo = {
          ...current,
          ...payload,
          status: "Issued",
          hasSignature: true
        };
        mockDB.set<LetterInfo>("reference_letter", updated);
        return updated;
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
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

    const url = `/api/surat-keterangan?${queryParams.toString()}`;
    return executeHybridRequest<SuratKeteranganResponse[]>(
      "Get student reference letter list with filters",
      url,
      {
        method: "GET"
      },
      () => {
        const list = mockDB.get<SuratKeteranganResponse[]>("letters_list", INITIAL_MOCK_LIST);
        return list.filter(item => {
          const isUploaded = item.id !== null;
          const statusMatch = status === "Semua" || !status ||
            (status === "Sudah Diunggah" && isUploaded) ||
            (status === "Belum Diunggah" && !isUploaded);
          const nameMatch = !namaMahasiswa ||
            item.namaMahasiswa.toLowerCase().includes(namaMahasiswa.toLowerCase()) ||
            item.nim.includes(namaMahasiswa);
          return statusMatch && nameMatch;
        });
      }
    );
  },

  getLetterStatistics: async (namaMahasiswa?: string) => {
    const queryParams = new URLSearchParams();
    if (namaMahasiswa) queryParams.append("namaMahasiswa", namaMahasiswa);

    const url = `/api/surat-keterangan/statistik?${queryParams.toString()}`;
    return executeHybridRequest<SuratKeteranganStatResponse>(
      "Get reference letter statistics",
      url,
      {
        method: "GET"
      },
      () => {
        const list = mockDB.get<SuratKeteranganResponse[]>("letters_list", INITIAL_MOCK_LIST);
        const filtered = list.filter(item => {
          if (!namaMahasiswa) return true;
          return item.namaMahasiswa.toLowerCase().includes(namaMahasiswa.toLowerCase()) || item.nim.includes(namaMahasiswa);
        });

        const totalSuratDiunggah = filtered.filter(item => item.id !== null).length;
        const totalJumlahSurat = filtered.length;
        const totalSuratBelumDiunggah = totalJumlahSurat - totalSuratDiunggah;

        return {
          totalSuratDiunggah,
          totalSuratBelumDiunggah,
          totalJumlahSurat
        };
      }
    );
  },

  uploadSuratKeterangan: async (periodeMagangId: string, url: string) => {
    return executeHybridRequest<SuratKeteranganResponse>(
      "Upload reference letter",
      "/api/surat-keterangan",
      {
        method: "POST",
        body: JSON.stringify({
          periodeMagangId,
          url
        })
      },
      () => {
        const list = mockDB.get<SuratKeteranganResponse[]>("letters_list", INITIAL_MOCK_LIST);
        const idx = list.findIndex(item => item.periodeMagangId === periodeMagangId);
        let updated: SuratKeteranganResponse;
        if (idx !== -1) {
          updated = {
            ...list[idx],
            id: list[idx].id || `letter-${Date.now()}`,
            url,
            statusSurat: "Sudah Diunggah",
            createdAt: new Date().toISOString()
          };
          list[idx] = updated;
        } else {
          updated = {
            id: `letter-${Date.now()}`,
            periodeMagangId,
            mahasiswaId: "new-student",
            nim: "2201012999",
            namaMahasiswa: "Mahasiswa Baru",
            url,
            statusSurat: "Sudah Diunggah",
            createdAt: new Date().toISOString()
          };
          list.push(updated);
        }
        mockDB.set<SuratKeteranganResponse[]>("letters_list", list);
        return updated;
      }
    );
  }
};
