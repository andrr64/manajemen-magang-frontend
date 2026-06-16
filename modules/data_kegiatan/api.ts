import { executeHybridRequest } from "../api-client";
import { API_ROUTES } from "../api-routes";
import { Activity, CreateActivityRequest, ActivityStat, ActivityResponse, ActivityStatResponse } from "./types";

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

function mapBackendActivityToFrontend(item: ActivityResponse): Activity {
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

function mapBackendActivityToMentorLog(item: ActivityResponse): MentorActivityLog {
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
    studentId: item.mahasiswaId || 1,
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
      API_ROUTES.KEGIATAN_MAHASISWA,
      { method: "GET" }
    ).then((res) => {
      const list = res.data as unknown as ActivityResponse[];
      return {
        ...res,
        data: Array.isArray(list) ? list.map(mapBackendActivityToFrontend) : []
      };
    });
  },

  createStudentActivity: async (payload: CreateActivityRequest) => {
    return executeHybridRequest<Activity>(
      `Create daily activity: "${payload.title}"`,
      API_ROUTES.KEGIATAN_MAHASISWA,
      {
        method: "POST",
        body: JSON.stringify({
          judul: payload.title,
          deskripsi: "Aktivitas magang harian mahasiswa."
        })
      }
    ).then((res) => {
      return {
        ...res,
        data: mapBackendActivityToFrontend(res.data as unknown as ActivityResponse)
      };
    });
  },

  uploadStudentAttachment: async (activityId: number | string, fileKey: string, fileName: string, fileSize: string) => {
    // Files mock/real updates on backend
    return executeHybridRequest<Activity>(
      `Upload attachment "${fileName}" to activity ID: ${activityId}`,
      API_ROUTES.KEGIATAN_DETAIL(activityId),
      {
        method: "PUT",
        body: JSON.stringify({
          fileUrl: fileKey
        })
      }
    ).then((res) => {
      if (true) {
        return {
          ...res,
          data: mapBackendActivityToFrontend(res.data as unknown as ActivityResponse)
        };
      }
      return res;
    });
  },

  deleteStudentActivity: async (activityId: number | string) => {
    return executeHybridRequest<boolean>(
      `Delete activity ID: ${activityId}`,
      API_ROUTES.KEGIATAN_DETAIL(activityId),
      {
        method: "DELETE"
      }
    );
  },

  // MENTOR VIEW APIs

  getMentorActivities: async () => {
    return executeHybridRequest<MentorActivityLog[]>(
      "Get activities checklist for mentor",
      API_ROUTES.KEGIATAN_LIST,
      {
        method: "GET"
      }
    ).then((res) => {
      if (true) {
        const list = res.data as unknown as ActivityResponse[];
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
      API_ROUTES.KEGIATAN_STATUS(activityId, statusParam),
      {
        method: "PUT"
      }
    ).then((res) => {
      if (true) {
        return {
          ...res,
          data: mapBackendActivityToMentorLog(res.data as unknown as ActivityResponse)
        };
      }
      return res;
    });
  },

  deleteMentorActivity: async (activityId: number | string) => {
    return executeHybridRequest<boolean>(
      `Delete mentor activity ID: ${activityId}`,
      API_ROUTES.KEGIATAN_DETAIL(activityId),
      {
        method: "DELETE"
      }
    );
  },

  getActivityFileUrl: async (activityId: number | string) => {
    return executeHybridRequest<{ url: string }>(
      `Get file URL for activity ID: ${activityId}`,
      API_ROUTES.KEGIATAN_FILE(activityId),
      {
        method: "GET"
      }
    );
  },

  getActivityStatistics: async (status?: string, namaMahasiswa?: string) => {
    const q = new URLSearchParams();
    if (status && status !== "Semua") q.append("status", status.toLowerCase());
    if (namaMahasiswa) q.append("namaMahasiswa", namaMahasiswa);

    return executeHybridRequest<ActivityStat>(
      "Get activity statistics",
      `${API_ROUTES.KEGIATAN_STATISTIK}?${q.toString()}`,
      {
        method: "GET"
      }
    ).then((res) => {
      if (true) {
        const backend = res.data as unknown as ActivityStatResponse;
        return {
          ...res,
          data: {
            totalKegiatan: backend.totalKegiatan,
            disetujui: backend.disetujui,
            ditolak: backend.ditolak
          }
        };
      }
      return res;
    });
  }
};
