import { executeHybridRequest, mockDB } from "../api-client";
import { Activity, CreateActivityRequest, ActivityStat } from "./types";

export interface MentorActivityLog {
  id: number | string;
  studentId: number | string;
  activityName: string;
  category: "Software Engineering" | "UI/UX Design" | "Data Analytics" | "Business Development" | "Administration";
  year: string;
  month: string;
  day: string;
  status: "Disetujui" | "Dalam Review";
  attachment: string | null;
}

const INITIAL_STUDENT_ACTIVITIES: Activity[] = [
  { id: 1, title: "Slicing Figma UI Dashboard Mahasiswa & Mentor", date: "29 Mei 2026", time: "08:00 - 17:00 WIB", fileName: "dashboard_slicing_v1.zip", fileSize: "12.4 MB", status: "Sudah Diunggah" },
  { id: 2, title: "Integrasi API Absensi Harian dengan Geofence", date: "28 Mei 2026", time: "08:00 - 17:00 WIB", fileName: "api_integration_docs.pdf", fileSize: "2.1 MB", status: "Sudah Diunggah" },
  { id: 3, title: "Unit Testing & Security Audit Modul Auth", date: "27 Mei 2026", time: "08:00 - 17:00 WIB", fileName: null, fileSize: null, status: "Belum Unggah" },
  { id: 4, title: "Refactoring Database Schema & Indexing", date: "26 Mei 2026", time: "08:00 - 17:00 WIB", fileName: "db_refactor_script.sql", fileSize: "450 KB", status: "Sudah Diunggah" },
  { id: 5, title: "Penyusunan Dokumentasi Laporan Bab 3 Magang", date: "25 Mei 2026", time: "08:00 - 16:30 WIB", fileName: null, fileSize: null, status: "Belum Unggah" }
];

const INITIAL_MENTOR_ACTIVITIES: MentorActivityLog[] = [
  { id: 1, studentId: 1, activityName: "Implementasi Payment Gateway API Midtrans", category: "Software Engineering", year: "2026", month: "Mei (05)", day: "28", status: "Dalam Review", attachment: "midtrans_integration_doc.pdf" },
  { id: 2, studentId: 2, activityName: "Visualisasi Data Transaksi Menggunakan Chart.js", category: "Data Analytics", year: "2026", month: "Mei (05)", day: "28", status: "Disetujui", attachment: "chart_analytics_draft.png" },
  { id: 3, studentId: 3, activityName: "Slicing Landing Page & Setup Tailwind Config", category: "Software Engineering", year: "2026", month: "Mei (05)", day: "27", status: "Disetujui", attachment: "tailwind_slicing_v2.zip" },
  { id: 4, studentId: 4, activityName: "Riset User Journey & Figma Wireframing Dashboard", category: "UI/UX Design", year: "2026", month: "Mei (05)", day: "26", status: "Dalam Review", attachment: null },
  { id: 5, studentId: 5, activityName: "Penyusunan Laporan Proyek Akhir Magang Bab 1-3", category: "Administration", year: "2026", month: "Mei (05)", day: "26", status: "Disetujui", attachment: "laporan_akhir_draft1.docx" },
  { id: 6, studentId: 6, activityName: "Wiring Diagram Listrik Gardu Induk & ETAP", category: "Software Engineering", year: "2026", month: "Mei (05)", day: "25", status: "Dalam Review", attachment: "diagram_wiring_gardu.pdf" },
  { id: 7, studentId: 7, activityName: "Refactoring Relasional Database Query Optimization", category: "Data Analytics", year: "2026", month: "Mei (05)", day: "25", status: "Dalam Review", attachment: null },
  { id: 8, studentId: 8, activityName: "Konfigurasi Terraform Script untuk AWS VPC", category: "Software Engineering", year: "2026", month: "Mei (05)", day: "24", status: "Disetujui", attachment: "aws_vpc_terraform.tf" }
];

function mapBackendActivityToFrontend(item: any): Activity {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch (_) {
      return dateStr;
    }
  };

  return {
    id: item.id,
    title: item.judul || "Kegiatan",
    date: formatDate(item.waktu || new Date().toISOString()),
    time: "08:00 - 17:00 WIB",
    fileName: item.fileUrl ? item.fileUrl.split("/").pop() || "bukti.pdf" : null,
    fileSize: item.fileUrl ? "1.5 MB" : null,
    status: item.fileUrl ? "Sudah Diunggah" : "Belum Unggah"
  };
}

function mapBackendActivityToMentorLog(item: any): MentorActivityLog {
  const parseDay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return String(d.getDate());
    } catch (_) {
      return "28";
    }
  };

  const parseMonth = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const mNum = String(d.getMonth() + 1).padStart(2, "0");
      return `${months[d.getMonth()]} (${mNum})`;
    } catch (_) {
      return "Juni (06)";
    }
  };

  const parseYear = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return String(d.getFullYear());
    } catch (_) {
      return "2026";
    }
  };

  const statusMap: Record<string, "Disetujui" | "Dalam Review"> = {
    "DISETUJUI": "Disetujui",
    "BELUM DISETUJUI": "Dalam Review",
    "DIREVIEW": "Dalam Review",
    "DRAFT": "Dalam Review",
    "DITOLAK": "Dalam Review" // Fallback to pending review in UI
  };

  return {
    id: item.id,
    studentId: item.mahasiswaId || item.studentId || 1,
    activityName: item.judul || "Kegiatan",
    category: "Software Engineering",
    year: parseYear(item.waktu || new Date().toISOString()),
    month: parseMonth(item.waktu || new Date().toISOString()),
    day: parseDay(item.waktu || new Date().toISOString()),
    status: statusMap[item.status?.toUpperCase()] || "Dalam Review",
    attachment: item.fileUrl ? item.fileUrl.split("/").pop() || "bukti.pdf" : null
  };
}

export const kegiatanAPI = {
  // STUDENT VIEW APIs
  
  getStudentActivities: async () => {
    return executeHybridRequest<Activity[]>(
      "Get student daily activities list",
      "/api/kegiatan",
      {
        method: "GET"
      },
      () => {
        return mockDB.get<Activity[]>("student_activities", INITIAL_STUDENT_ACTIVITIES);
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        const list = res.data as any[];
        return {
          ...res,
          data: list.map(mapBackendActivityToFrontend)
        };
      }
      return res;
    });
  },

  createStudentActivity: async (payload: CreateActivityRequest) => {
    return executeHybridRequest<Activity>(
      `Create daily activity: "${payload.title}"`,
      "/api/kegiatan",
      {
        method: "POST",
        body: JSON.stringify({
          judul: payload.title,
          deskripsi: "Aktivitas magang harian mahasiswa.",
          waktu: new Date().toISOString(),
          fileUrl: payload.fileName || null
        })
      },
      () => {
        const activities = mockDB.get<Activity[]>("student_activities", INITIAL_STUDENT_ACTIVITIES);
        
        const newAct: Activity = {
          id: Date.now(),
          title: payload.title,
          date: payload.date,
          time: payload.time,
          fileName: payload.fileName || null,
          fileSize: payload.fileSize || null,
          status: payload.fileName ? "Sudah Diunggah" : "Belum Unggah"
        };

        activities.unshift(newAct);
        mockDB.set<Activity[]>("student_activities", activities);
        return newAct;
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        return {
          ...res,
          data: mapBackendActivityToFrontend(res.data)
        };
      }
      return res;
    });
  },

  uploadStudentAttachment: async (activityId: number | string, fileName: string, fileSize: string) => {
    // Files mock/real updates on backend
    return executeHybridRequest<Activity>(
      `Upload attachment "${fileName}" to activity ID: ${activityId}`,
      `/api/kegiatan/${activityId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          fileUrl: `https://storage.internflow.com/logbook/${fileName}`
        })
      },
      () => {
        const activities = mockDB.get<Activity[]>("student_activities", INITIAL_STUDENT_ACTIVITIES);
        const index = activities.findIndex(a => String(a.id) === String(activityId));

        if (index === -1) {
          throw new Error("Kegiatan tidak ditemukan.");
        }

        activities[index].fileName = fileName;
        activities[index].fileSize = fileSize;
        activities[index].status = "Sudah Diunggah";

        mockDB.set<Activity[]>("student_activities", activities);
        return activities[index];
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        return {
          ...res,
          data: mapBackendActivityToFrontend(res.data)
        };
      }
      return res;
    });
  },

  deleteStudentActivity: async (activityId: number | string) => {
    return executeHybridRequest<boolean>(
      `Delete activity ID: ${activityId}`,
      `/api/kegiatan/${activityId}`,
      {
        method: "DELETE"
      },
      () => {
        const activities = mockDB.get<Activity[]>("student_activities", INITIAL_STUDENT_ACTIVITIES);
        const updated = activities.filter(a => String(a.id) !== String(activityId));
        mockDB.set<Activity[]>("student_activities", updated);
        return true;
      }
    );
  },

  // MENTOR VIEW APIs

  getMentorActivities: async () => {
    return executeHybridRequest<MentorActivityLog[]>(
      "Get activities checklist for mentor",
      "/api/kegiatan",
      {
        method: "GET"
      },
      () => {
        return mockDB.get<MentorActivityLog[]>("mentor_activities", INITIAL_MENTOR_ACTIVITIES);
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        const list = res.data as any[];
        return {
          ...res,
          data: list.map(mapBackendActivityToMentorLog)
        };
      }
      return res;
    });
  },

  approveMentorActivity: async (activityId: number | string, status: "Disetujui" | "Dalam Review") => {
    const statusParam = status === "Disetujui" ? "disetujui" : "belum disetujui";
    return executeHybridRequest<MentorActivityLog>(
      `Approve activity ID: ${activityId} to ${status}`,
      `/api/kegiatan/${activityId}/status?status=${statusParam}`,
      {
        method: "PUT"
      },
      () => {
        const activities = mockDB.get<MentorActivityLog[]>("mentor_activities", INITIAL_MENTOR_ACTIVITIES);
        const index = activities.findIndex(a => String(a.id) === String(activityId));

        if (index === -1) {
          throw new Error("Laporan kegiatan tidak ditemukan.");
        }

        activities[index].status = status;
        mockDB.set<MentorActivityLog[]>("mentor_activities", activities);
        return activities[index];
      }
    ).then((res) => {
      if (res.message.includes("Real")) {
        return {
          ...res,
          data: mapBackendActivityToMentorLog(res.data)
        };
      }
      return res;
    });
  },

  deleteMentorActivity: async (activityId: number | string) => {
    return executeHybridRequest<boolean>(
      `Delete mentor activity ID: ${activityId}`,
      `/api/kegiatan/${activityId}`,
      {
        method: "DELETE"
      },
      () => {
        const activities = mockDB.get<MentorActivityLog[]>("mentor_activities", INITIAL_MENTOR_ACTIVITIES);
        const updated = activities.filter(a => String(a.id) !== String(activityId));
        mockDB.set<MentorActivityLog[]>("mentor_activities", updated);
        return true;
      }
    );
  },

  getActivityFileUrl: async (activityId: number | string) => {
    return executeHybridRequest<{ url: string }>(
      `Get file URL for activity ID: ${activityId}`,
      `/api/kegiatan/${activityId}/file`,
      {
        method: "GET"
      },
      () => {
        const activities = mockDB.get<MentorActivityLog[]>("mentor_activities", INITIAL_MENTOR_ACTIVITIES);
        const act = activities.find(a => String(a.id) === String(activityId));
        if (!act || !act.attachment) {
          throw new Error("Berkas lampiran tidak ditemukan.");
        }
        return { url: `https://storage.internflow.com/logbook/${act.attachment}` };
      }
    );
  },

  getActivityStatistics: async (status?: string, namaMahasiswa?: string) => {
    const q = new URLSearchParams();
    if (status && status !== "Semua") q.append("status", status.toLowerCase());
    if (namaMahasiswa) q.append("namaMahasiswa", namaMahasiswa);

    return executeHybridRequest<ActivityStat>(
      "Get activity statistics",
      `/api/kegiatan/statistik?${q.toString()}`,
      {
        method: "GET"
      },
      () => {
        const activities = mockDB.get<MentorActivityLog[]>("mentor_activities", INITIAL_MENTOR_ACTIVITIES);
        const filtered = activities.filter(a => {
          const matchStatus = !status || status === "Semua" || a.status === status;
          const matchName = !namaMahasiswa || a.activityName.toLowerCase().includes(namaMahasiswa.toLowerCase());
          return matchStatus && matchName;
        });

        const totalKegiatan = filtered.length;
        const disetujui = filtered.filter(a => a.status === "Disetujui").length;
        const ditolak = filtered.filter(a => (a.status as any) === "Ditolak").length;

        return {
          totalKegiatan,
          disetujui,
          ditolak
        };
      }
    );
  }
};
