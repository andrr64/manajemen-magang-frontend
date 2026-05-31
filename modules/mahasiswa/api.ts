import { executeHybridRequest, mockDB } from "../api-client";
import { Student, CreateStudentRequest, UpdateStudentRequest } from "./types";

const INITIAL_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Budi Santoso",
    nim: "2201012001",
    email: "budi.santoso@student.ui.ac.id",
    university: "Universitas Indonesia",
    phone: "+62 812-9876-5432",
    gender: "Laki-laki",
    program: "S1 Teknik Informatika",
    company: "PT. Global Teknologi Nusantara",
    role: "Software Engineering Intern",
    status: "Aktif",
    progress: 85,
    lastActive: "Hari ini, 09:30",
    avatarColor: "from-blue-500 to-indigo-500",
    address: "Jl. Margonda Raya No. 100, Depok, Jawa Barat",
    period: "1 Februari 2026 - 31 Juli 2026",
    grade: 88,
    logbooksCount: 8,
    logbooksPending: 2,
    attendance: { present: 76, sick: 2, leave: 1, absent: 0 }
  },
  {
    id: 2,
    name: "Siti Rahmawati",
    nim: "2201012042",
    email: "siti.rahma@student.itb.ac.id",
    university: "Institut Teknologi Bandung",
    phone: "+62 856-1234-5678",
    gender: "Perempuan",
    program: "S1 Sistem Informasi",
    company: "Bank Central Indonesia Tbk.",
    role: "Data Analyst Intern",
    status: "Aktif",
    progress: 60,
    lastActive: "Kemarin, 14:15",
    avatarColor: "from-pink-500 to-rose-500",
    address: "Jl. Ganesha No. 10, Bandung, Jawa Barat",
    period: "1 Februari 2026 - 31 Juli 2026",
    grade: 82,
    logbooksCount: 8,
    logbooksPending: 4,
    attendance: { present: 74, sick: 1, leave: 2, absent: 1 }
  },
  {
    id: 3,
    name: "Rian Hidayat",
    nim: "2201012015",
    email: "rian.h@student.ugm.ac.id",
    university: "Universitas Gadjah Mada",
    phone: "+62 878-5555-4433",
    gender: "Laki-laki",
    program: "S1 Teknik Informatika",
    company: "Shopee Indonesia",
    role: "Frontend Developer Intern",
    status: "Aktif",
    progress: 90,
    lastActive: "23 Mei 2026",
    avatarColor: "from-cyan-500 to-blue-500",
    address: "Jl. Kaliurang KM 5, Sleman, DI Yogyakarta",
    period: "1 Februari 2026 - 31 Juli 2026",
    grade: 92,
    logbooksCount: 8,
    logbooksPending: 0,
    attendance: { present: 79, sick: 0, leave: 0, absent: 0 }
  },
  {
    id: 4,
    name: "Amanda Putri",
    nim: "2201012088",
    email: "amanda.putri@binus.ac.id",
    university: "Universitas Bina Nusantara",
    phone: "+62 813-8888-9999",
    gender: "Perempuan",
    program: "S1 Desain Komunikasi Visual",
    company: "Gojek Tokopedia (GoTo)",
    role: "UI/UX Designer Intern",
    status: "Dalam Review",
    progress: 40,
    lastActive: "20 Mei 2026",
    avatarColor: "from-purple-500 to-indigo-500",
    address: "Jl. Palmerah Barat No. 29, Jakarta Barat",
    period: "1 Maret 2026 - 31 Agustus 2026",
    grade: null,
    logbooksCount: 6,
    logbooksPending: 5,
    attendance: { present: 54, sick: 3, leave: 1, absent: 0 }
  },
  {
    id: 5,
    name: "Dedi Kurniawan",
    nim: "2201012102",
    email: "dedi.k@student.undip.ac.id",
    university: "Universitas Diponegoro",
    phone: "+62 821-2233-4455",
    gender: "Laki-laki",
    program: "S1 Sistem Informasi",
    company: "PT. Pertamina (Persero)",
    role: "Business Analyst Intern",
    status: "Selesai",
    progress: 100,
    lastActive: "Hari ini, 08:00",
    avatarColor: "from-emerald-500 to-teal-500",
    address: "Jl. Prof. Soedarto, Tembalang, Semarang, Jawa Tengah",
    period: "1 Januari 2026 - 30 Juni 2026",
    grade: 95,
    logbooksCount: 12,
    logbooksPending: 0,
    attendance: { present: 118, sick: 1, leave: 1, absent: 0 }
  }
];

function mapBackendStudentToFrontend(item: any): Student {
  const formatDate = (start: string | null, end: string | null) => {
    if (!start || !end) return "1 Februari 2026 - 31 Juli 2026";
    try {
      const parse = (s: string) => {
        const d = new Date(s);
        return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      };
      return `${parse(start)} - ${parse(end)}`;
    } catch (_) {
      return "1 Februari 2026 - 31 Juli 2026";
    }
  };

  const statusMap: Record<string, "Aktif" | "Dalam Review" | "Selesai"> = {
    "AKTIF": "Aktif",
    "REVIEW": "Dalam Review",
    "DALAM REVIEW": "Dalam Review",
    "SELESAI": "Selesai"
  };

  return {
    id: item.id, // numeric or string id
    name: item.nama || "Mahasiswa",
    nim: item.nim || "2201012001",
    email: item.email || "",
    university: item.universitas || "Universitas Indonesia",
    phone: item.noHp || "081234567890",
    gender: item.gender || "Laki-laki",
    program: "S1 Teknik Informatika",
    company: "PT. Global Teknologi Nusantara",
    role: "Software Engineering Intern",
    status: statusMap[item.statusPeriode?.toUpperCase()] || "Aktif",
    progress: item.progress || 85,
    lastActive: "Hari ini, 09:30",
    avatarColor: "from-blue-500 to-indigo-500",
    address: item.address || "Jakarta, Indonesia",
    period: formatDate(item.tanggalMulai, item.tanggalBerakhir),
    grade: item.grade || 88,
    logbooksCount: 8,
    logbooksPending: 2,
    attendance: { present: 76, sick: 2, leave: 1, absent: 0 }
  };
}

export const mahasiswaAPI = {
  listStudents: async () => {
    return executeHybridRequest<Student[]>(
      "List all students",
      "/api/mahasiswa",
      {
        method: "GET"
      },
      () => {
        return mockDB.get<Student[]>("students", INITIAL_STUDENTS);
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        const list = res.data as any[];
        return {
          ...res,
          data: list.map(mapBackendStudentToFrontend)
        };
      }
      return res;
    });
  },

  getStudentById: async (id: number | string) => {
    return executeHybridRequest<Student>(
      `Get student details for ID: ${id}`,
      `/api/mahasiswa/${id}`,
      {
        method: "GET"
      },
      () => {
        const students = mockDB.get<Student[]>("students", INITIAL_STUDENTS);
        const student = students.find(s => String(s.id) === String(id));
        if (!student) {
          throw new Error("Data mahasiswa tidak ditemukan.");
        }
        return student;
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        return {
          ...res,
          data: mapBackendStudentToFrontend(res.data)
        };
      }
      return res;
    });
  },

  createStudent: async (payload: CreateStudentRequest) => {
    return executeHybridRequest<Student>(
      `Create student account: ${payload.name}`,
      "/api/mahasiswa",
      {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: "temporarysecurepassword",
          nim: payload.nim,
          nama: payload.name,
          noHp: payload.phone,
          gender: payload.gender,
          universitas: payload.university,
          tanggalMulai: "2026-02-01",
          tanggalBerakhir: "2026-07-31",
          periodeStatus: "aktif"
        })
      },
      () => {
        const students = mockDB.get<Student[]>("students", INITIAL_STUDENTS);
        
        const newStudent: Student = {
          id: Date.now(),
          name: payload.name,
          nim: payload.nim,
          email: payload.email,
          university: payload.university,
          phone: payload.phone,
          gender: payload.gender,
          program: payload.program,
          company: payload.company || "PT. Global Teknologi Nusantara",
          role: payload.role || "Intern",
          status: "Aktif",
          progress: 0,
          lastActive: "Baru terdaftar",
          avatarColor: "from-blue-500 to-indigo-500",
          address: payload.address,
          period: payload.period,
          grade: null,
          logbooksCount: 0,
          logbooksPending: 0,
          attendance: { present: 0, sick: 0, leave: 0, absent: 0 }
        };

        students.unshift(newStudent);
        mockDB.set<Student[]>("students", students);
        return newStudent;
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        return {
          ...res,
          data: mapBackendStudentToFrontend(res.data)
        };
      }
      return res;
    });
  },

  updateStudent: async (id: number | string, payload: UpdateStudentRequest) => {
    // Formatting update values
    const dateRange = payload.period ? payload.period.split(" - ") : [];
    const formatDateObj = (indoStr: string) => {
      try {
        const cleanStr = indoStr.trim().replace(/\u00a0/g, " "); // Replace non-breaking spaces
        
        // 1. Check if it is already in yyyy-MM-dd format
        if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStr)) {
          return cleanStr;
        }

        // 2. Check if it is a slash format like "2/1/2026" or "02/01/2026" (month/day/year)
        if (cleanStr.includes("/")) {
          const parts = cleanStr.split("/");
          if (parts.length === 3) {
            if (parts[2].length === 4) {
              const month = parts[0].padStart(2, "0");
              const day = parts[1].padStart(2, "0");
              const year = parts[2];
              return `${year}-${month}-${day}`;
            } else if (parts[0].length === 4) {
              const year = parts[0];
              const month = parts[1].padStart(2, "0");
              const day = parts[2].padStart(2, "0");
              return `${year}-${month}-${day}`;
            }
          }
        }

        // 3. Handle Indonesian textual format like "1 Februari 2026"
        const monthMap: Record<string, string> = { 
          "januari": "01", "februari": "02", "maret": "03", "april": "04", "mei": "05", "juni": "06", 
          "juli": "07", "agustus": "08", "september": "09", "oktober": "10", "november": "11", "desember": "12" 
        };
        const parts = cleanStr.toLowerCase().split(/\s+/);
        if (parts.length > 2) {
          const day = parts[0].padStart(2, "0");
          const month = monthMap[parts[1]] || "01";
          const year = parts[2];
          return `${year}-${month}-${day}`;
        }

        // 4. Fallback to standard JS Date parser
        const parsedDate = new Date(cleanStr);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString().split("T")[0];
        }

        return "2026-02-01";
      } catch (_) {
        return "2026-02-01";
      }
    };

    const isPeriodProvided = dateRange.length > 1;

    return executeHybridRequest<Student>(
      `Update student details for ID: ${id}`,
      `/api/mahasiswa/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          email: payload.email,
          nim: payload.nim,
          nama: payload.name,
          gender: "Laki-laki",
          universitas: payload.university,
          periode: isPeriodProvided ? {
            tanggalMulai: formatDateObj(dateRange[0]),
            tanggalBerakhir: formatDateObj(dateRange[1]),
            status: "Aktif"
          } : undefined
        })
      },
      () => {
        const students = mockDB.get<Student[]>("students", INITIAL_STUDENTS);
        const index = students.findIndex(s => String(s.id) === String(id));

        if (index === -1) {
          throw new Error("Data mahasiswa tidak ditemukan.");
        }

        const updatedStudent: Student = {
          ...students[index],
          ...payload
        };

        students[index] = updatedStudent;
        mockDB.set<Student[]>("students", students);
        return updatedStudent;
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        return {
          ...res,
          data: mapBackendStudentToFrontend(res.data)
        };
      }
      return res;
    });
  },

  deleteStudent: async (id: number | string) => {
    return executeHybridRequest<boolean>(
      `Delete student ID: ${id}`,
      `/api/mahasiswa/${id}`,
      {
        method: "DELETE"
      },
      () => {
        const students = mockDB.get<Student[]>("students", INITIAL_STUDENTS);
        const updated = students.filter(s => String(s.id) !== String(id));
        mockDB.set<Student[]>("students", updated);
        return true;
      }
    );
  }
};
