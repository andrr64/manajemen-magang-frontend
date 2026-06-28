import { executeHybridRequest } from "../api-client";
import { API_ROUTES } from "../api-routes";
import { Activity, CreateActivityRequest, ActivityStat, ActivityResponse, ActivityStatResponse, ActivityRekapResponse } from "./types";

export interface MentorActivityLog {
  id: number | string;
  studentId: number | string;
  activityName: string;
  deskripsi: string;
  year: string;
  month: string;
  day: string;
  status: "Disetujui" | "Dalam Review";
  attachments: string[];
}

function mapBackendActivityToFrontend(item: ActivityResponse): Activity {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch (_) { return dateStr; }
  };

  const statusMap: Record<string, Activity["status"]> = {
    disetujui:       "Disetujui",
    "belum disetujui": "Belum Disetujui",
    ditolak:         "Ditolak",
  };

  return {
    id:         item.id,
    title:      item.judul || "Kegiatan",
    deskripsi:  item.deskripsi || "",
    date:       formatDate(item.waktu || new Date().toISOString()),
    fileUrls:   item.fileUrls ?? [],
    status:     statusMap[item.status?.toLowerCase()] ?? "Belum Disetujui",
    namaMentor: item.namaMentor ?? null,
  };
}

function mapBackendActivityToMentorLog(item: ActivityResponse): MentorActivityLog {
  const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const d = new Date(item.waktu || new Date().toISOString());

  const statusMap: Record<string, "Disetujui" | "Dalam Review"> = {
    DISETUJUI:         "Disetujui",
    "BELUM DISETUJUI": "Dalam Review",
    DITOLAK:           "Dalam Review",
  };

  return {
    id:           item.id,
    studentId:    item.mahasiswaId || 1,
    activityName: item.judul || "Kegiatan",
    deskripsi:    item.deskripsi || "",
    year:         String(d.getFullYear()),
    month:        `${months[d.getMonth()]} (${String(d.getMonth() + 1).padStart(2, "0")})`,
    day:          String(d.getDate()),
    status:       statusMap[item.status?.toUpperCase()] ?? "Dalam Review",
    attachments:  item.fileUrls ?? [],
  };
}

export const kegiatanAPI = {
  // ── MAHASISWA ─────────────────────────────────────────────────────────

  getStudentActivities: async () => {
    return executeHybridRequest<Activity[]>(
      "Get student daily activities list",
      API_ROUTES.KEGIATAN_MAHASISWA,
      { method: "GET" }
    ).then((res) => ({
      ...res,
      data: Array.isArray(res.data)
        ? (res.data as unknown as ActivityResponse[]).map(mapBackendActivityToFrontend)
        : [],
    }));
  },

  createStudentActivity: async (payload: CreateActivityRequest) => {
    return executeHybridRequest<Activity>(
      `Create daily activity: "${payload.title}"`,
      API_ROUTES.KEGIATAN_MAHASISWA,
      {
        method: "POST",
        body: JSON.stringify({
          judul:     payload.title,
          deskripsi: payload.keterangan?.trim() || "",
          fileUrls:  payload.fileKeys ?? [],
        }),
      }
    ).then((res) => ({
      ...res,
      data: mapBackendActivityToFrontend(res.data as unknown as ActivityResponse),
    }));
  },

  addFilesToActivity: async (activityId: number | string, fileKeys: string[]) => {
    return executeHybridRequest<void>(
      `Add ${fileKeys.length} file(s) to activity ID: ${activityId}`,
      API_ROUTES.KEGIATAN_FILE(activityId),
      {
        method: "POST",
        body: JSON.stringify({ fileUrls: fileKeys }),
      }
    );
  },

  deleteStudentActivity: async (activityId: number | string) => {
    return executeHybridRequest<boolean>(
      `Delete activity ID: ${activityId}`,
      API_ROUTES.KEGIATAN_DETAIL(activityId),
      { method: "DELETE" }
    );
  },

  // ── MENTOR ────────────────────────────────────────────────────────────

  getMentorActivities: async () => {
    return executeHybridRequest<MentorActivityLog[]>(
      "Get activities checklist for mentor",
      API_ROUTES.KEGIATAN_LIST,
      { method: "GET" }
    ).then((res) => ({
      ...res,
      data: (res.data as unknown as ActivityResponse[]).map(mapBackendActivityToMentorLog),
    }));
  },

  approveMentorActivity: async (activityId: number | string, status: "Disetujui" | "Dalam Review") => {
    const statusParam = status === "Disetujui" ? "disetujui" : "belum disetujui";
    return executeHybridRequest<MentorActivityLog>(
      `Approve activity ID: ${activityId} to ${status}`,
      API_ROUTES.KEGIATAN_STATUS(activityId, statusParam),
      { method: "PUT" }
    ).then((res) => ({
      ...res,
      data: mapBackendActivityToMentorLog(res.data as unknown as ActivityResponse),
    }));
  },

  deleteMentorActivity: async (activityId: number | string) => {
    return executeHybridRequest<boolean>(
      `Delete mentor activity ID: ${activityId}`,
      API_ROUTES.KEGIATAN_DETAIL(activityId),
      { method: "DELETE" }
    );
  },

  getActivityFiles: async (activityId: number | string) => {
    return executeHybridRequest<{ urls: string[] }>(
      `Get files for activity ID: ${activityId}`,
      API_ROUTES.KEGIATAN_FILE(activityId),
      { method: "GET" }
    );
  },

  getActivityStatistics: async (status?: string, namaMahasiswa?: string) => {
    const q = new URLSearchParams();
    if (status && status !== "Semua") q.append("status", status.toLowerCase());
    if (namaMahasiswa) q.append("namaMahasiswa", namaMahasiswa);
    return executeHybridRequest<ActivityStat>(
      "Get activity statistics",
      `${API_ROUTES.KEGIATAN_STATISTIK}?${q.toString()}`,
      { method: "GET" }
    ).then((res) => {
      const backend = res.data as unknown as ActivityStatResponse;
      return { ...res, data: { totalKegiatan: backend.totalKegiatan, disetujui: backend.disetujui, ditolak: backend.ditolak } };
    });
  },

  getRekapActivities: async () => {
    return executeHybridRequest<ActivityRekapResponse[]>(
      "Get all rekap activities",
      API_ROUTES.KEGIATAN_REKAP,
      { method: "GET" }
    );
  },

  getRekapActivitiesByMahasiswaId: async (mahasiswaId: string) => {
    return executeHybridRequest<ActivityRekapResponse[]>(
      `Get rekap activities for mahasiswa ${mahasiswaId}`,
      `${API_ROUTES.KEGIATAN_REKAP}/${mahasiswaId}`,
      { method: "GET" }
    );
  },
};
