import { executeHybridRequest, mockDB } from "../api-client";
import { AttendanceLog, AttendanceSummary, CheckInRequest } from "./types";

const INITIAL_ATTENDANCE: AttendanceLog[] = [
  { id: 1, date: "Kamis, 28 Mei 2026", type: "Hadir", checkIn: "07:45 WIB", checkOut: "17:05 WIB", document: null, status: "Diverifikasi", studentId: 1, studentName: "Angelika Eve", studentNim: "12220999" },
  { id: 2, date: "Kamis, 28 Mei 2026", type: "Hadir", checkIn: "08:00 WIB", checkOut: "17:15 WIB", document: null, status: "Diverifikasi", studentId: 2, studentName: "Muhammad Rizky", studentNim: "12220456" },
  { id: 3, date: "Kamis, 28 Mei 2026", type: "Hadir", checkIn: "07:30 WIB", checkOut: "16:45 WIB", document: null, status: "Diverifikasi", studentId: 3, studentName: "Siti Rahma", studentNim: "12220789" },
  { id: 4, date: "Kamis, 28 Mei 2026", type: "Izin", checkIn: "-- : --", checkOut: "-- : --", document: "surat_izin_semnas.pdf", documentSize: "1.2 MB", notes: "Sakit gigi, izin berobat ke dokter gigi.", status: "Menunggu", studentId: 4, studentName: "Budi Santoso", studentNim: "12220123" },
  { id: 5, date: "Kamis, 28 Mei 2026", type: "Hadir", checkIn: "07:55 WIB", checkOut: "17:00 WIB", document: null, status: "Diverifikasi", studentId: 5, studentName: "Dewi Lestari", studentNim: "12220234" },
  { id: 6, date: "Kamis, 28 Mei 2026", type: "Sakit", checkIn: "-- : --", checkOut: "-- : --", document: "surat_dokter_klinik.pdf", documentSize: "850 KB", notes: "Sakit demam tinggi, melampirkan surat dokter.", status: "Menunggu", studentId: 6, studentName: "Fajar Nugraha", studentNim: "12220345" },
  { id: 7, date: "Kamis, 28 Mei 2026", type: "Hadir", checkIn: "08:15 WIB", checkOut: "Pending", document: null, status: "Diverifikasi", studentId: 7, studentName: "Larasati Putri", studentNim: "12220567" },
  { id: 8, date: "Kamis, 28 Mei 2026", type: "Hadir", checkIn: "07:50 WIB", checkOut: "17:02 WIB", document: null, status: "Diverifikasi", studentId: 8, studentName: "Hendra Wijaya", studentNim: "12220678" }
];

function mapBackendAbsensiToFrontend(item: any): AttendanceLog {
  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "Pending";
    try {
      const parts = timeStr.split("T");
      if (parts.length > 1) {
        return parts[1].substring(0, 5) + " WIB";
      }
      return timeStr;
    } catch (_) {
      return timeStr;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch (_) {
      return dateStr;
    }
  };

  const typeMap: Record<string, "Hadir" | "Izin" | "Sakit" | "Alpha"> = {
    "HADIR": "Hadir",
    "IZIN": "Izin",
    "SAKIT": "Sakit",
    "ALPHA": "Alpha"
  };

  const statusMap: Record<string, "Diverifikasi" | "Menunggu" | "Ditolak"> = {
    "DISETUJUI": "Diverifikasi",
    "DIPROSES": "Menunggu",
    "DRAFT": "Menunggu",
    "DITOLAK": "Ditolak"
  };

  return {
    id: item.id,
    date: formatDate(item.tanggal),
    type: typeMap[item.status?.toUpperCase()] || "Hadir",
    checkIn: formatTime(item.waktuMasuk),
    checkOut: formatTime(item.waktuKeluar),
    document: item.attachmentUrl || null,
    status: statusMap[item.statusVerifikasi?.toUpperCase()] || "Diverifikasi",
    studentId: item.mahasiswaId,
    studentName: item.namaMahasiswa,
    studentNim: item.nim
  };
}

export const absensiAPI = {
  getHistory: async (status?: string, namaMahasiswa?: string) => {
    const queryParams = new URLSearchParams();
    if (status && status !== "Semua") queryParams.append("status", status.toLowerCase());
    if (namaMahasiswa) queryParams.append("namaMahasiswa", namaMahasiswa);

    const url = `/api/absensi?${queryParams.toString()}`;
    return executeHybridRequest<AttendanceLog[]>(
      "Get attendance history list",
      url,
      {
        method: "GET"
      },
      () => {
        let history = mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
        if (status && status !== "Semua") {
          history = history.filter(h => h.type.toLowerCase() === status.toLowerCase());
        }
        if (namaMahasiswa) {
          history = history.filter(h => h.notes?.toLowerCase().includes(namaMahasiswa.toLowerCase()));
        }
        return history;
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        const list = res.data as any[];
        return {
          ...res,
          data: list.map(mapBackendAbsensiToFrontend)
        };
      }
      return res;
    });
  },

  getSummary: async () => {
    return executeHybridRequest<AttendanceSummary>(
      "Calculate attendance statistics",
      "/api/absensi/statistik",
      {
        method: "GET"
      },
      () => {
        const history = mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
        const present = history.filter(h => h.type === "Hadir" && h.status === "Diverifikasi").length;
        const sick = history.filter(h => h.type === "Sakit" && h.status === "Diverifikasi").length;
        const leave = history.filter(h => h.type === "Izin" && h.status === "Diverifikasi").length;
        const absent = history.filter(h => h.type === "Alpha").length;
        const totalDays = 80;
        const percentage = parseFloat((((present + sick + leave) / history.length) * 100).toFixed(1)) || 0;

        return {
          present,
          sick,
          leave,
          absent,
          totalDays,
          percentage
        };
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        const backendStats = res.data as any;
        return {
          ...res,
          data: {
            present: backendStats.totalHadir || 0,
            sick: backendStats.totalIzinSakit || 0,
            leave: 0,
            absent: 0,
            totalDays: 80,
            percentage: parseFloat((((backendStats.totalHadir || 0) / 80) * 100).toFixed(1))
          }
        };
      }
      return res;
    });
  },

  checkIn: async (payload: CheckInRequest) => {
    // If backend is running, we can check-in. Spring Boot check-in can be simulated or sent to POST /api/absensi
    return executeHybridRequest<AttendanceLog>(
      "Check-in for today",
      "/api/absensi",
      {
        method: "POST",
        body: JSON.stringify({
          tanggal: new Date().toISOString().split("T")[0],
          status: payload.status.toUpperCase(),
          notes: payload.notes,
          attachmentUrl: payload.document || null
        })
      },
      () => {
        const history = mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
        const todayStr = new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });

        const alreadyCheckedIn = history.some(h => h.date === todayStr);
        if (alreadyCheckedIn) {
          throw new Error("Anda sudah mengirimkan absensi hari ini!");
        }

        const typeMap = {
          hadir: "Hadir",
          izin: "Izin",
          sakit: "Sakit"
        } as const;

        const newRecord: AttendanceLog = {
          id: Date.now(),
          date: todayStr,
          type: typeMap[payload.status],
          checkIn: payload.status === "hadir" 
            ? new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) + " WIB" 
            : "-- : --",
          checkOut: "Pending",
          document: payload.document || null,
          documentSize: payload.documentSize,
          notes: payload.notes,
          status: payload.status === "hadir" ? "Diverifikasi" : "Menunggu"
        };

        history.unshift(newRecord);
        mockDB.set<AttendanceLog[]>("attendance_history", history);
        return newRecord;
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        return {
          ...res,
          data: mapBackendAbsensiToFrontend(res.data)
        };
      }
      return res;
    });
  },

  checkOut: async () => {
    // Check-out in real backend can be simulated or PUT /api/absensi
    return executeHybridRequest<AttendanceLog>(
      "Check-out for today",
      "/api/absensi",
      {
        method: "POST", // Simulating checkout action
        body: JSON.stringify({
          action: "CHECKOUT",
          waktuKeluar: new Date().toISOString()
        })
      },
      () => {
        const history = mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
        const todayStr = new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });

        const todayIndex = history.findIndex(h => h.date === todayStr);
        if (todayIndex === -1) {
          throw new Error("Anda belum check-in hari ini! Silakan check-in terlebih dahulu.");
        }

        if (history[todayIndex].type !== "Hadir") {
          throw new Error("Check-out hanya berlaku untuk status kehadiran Hadir.");
        }

        if (history[todayIndex].checkOut !== "Pending") {
          throw new Error("Anda sudah melakukan check-out hari ini!");
        }

        const checkOutTime = new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) + " WIB";
        history[todayIndex].checkOut = checkOutTime;
        mockDB.set<AttendanceLog[]>("attendance_history", history);
        return history[todayIndex];
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        return {
          ...res,
          data: mapBackendAbsensiToFrontend(res.data)
        };
      }
      return res;
    });
  },

  verifyAttendance: async (id: string | number, status: "Diverifikasi" | "Ditolak") => {
    const action = status === "Diverifikasi" ? "setujui" : "tolak";
    return executeHybridRequest<AttendanceLog>(
      `Verify attendance ID: ${id} to ${status}`,
      `/api/absensi/${id}/verifikasi?action=${action}`,
      {
        method: "POST"
      },
      () => {
        const history = mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
        const index = history.findIndex(h => h.id === id);

        if (index === -1) {
          throw new Error("Log absensi tidak ditemukan.");
        }

        history[index].status = status;
        mockDB.set<AttendanceLog[]>("attendance_history", history);
        return history[index];
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        return {
          ...res,
          data: mapBackendAbsensiToFrontend(res.data)
        };
      }
      return res;
    });
  },

  deleteAttendance: async (id: string | number) => {
    return executeHybridRequest<void>(
      `Delete attendance ID: ${id}`,
      `/api/absensi/${id}`,
      {
        method: "DELETE"
      },
      () => {
        const history = mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
        const filtered = history.filter(h => h.id !== id);
        mockDB.set<AttendanceLog[]>("attendance_history", filtered);
      }
    );
  },

  exportAbsensi: async (status?: string, namaMahasiswa?: string) => {
    const queryParams = new URLSearchParams();
    if (status && status !== "Semua") queryParams.append("status", status);
    if (namaMahasiswa) queryParams.append("namaMahasiswa", namaMahasiswa);

    const url = `/api/absensi/ekspor?${queryParams.toString()}`;
    return executeHybridRequest<string>(
      "Export attendance records",
      url,
      {
        method: "GET"
      },
      () => {
        const history = mockDB.get<AttendanceLog[]>("attendance_history", INITIAL_ATTENDANCE);
        let list = history;
        if (status && status !== "Semua") {
          list = list.filter(h => h.type.toLowerCase() === status.toLowerCase());
        }
        const headers = "No;Tanggal;NIM;Nama Mahasiswa;Jam Masuk;Jam Keluar;Status Presensi;Status Verifikasi;URL Lampiran\n";
        const rows = list.map((h, i) => `${i + 1};${h.date};NIM00${h.id};Mahasiswa ${h.id};${h.checkIn};${h.checkOut};${h.type.toUpperCase()};${h.status.toUpperCase()};-`).join("\n");
        return headers + rows;
      }
    ).then((res) => {
      // In real mode, backend returns a byte array. In hybrid executor, we'll return the CSV string/content.
      return res;
    });
  }
};
