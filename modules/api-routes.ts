export const API_ROUTES = {
  // ─── IAM ──────────────────────────────────────────────────────────────────
  IAM_LOGIN:    "/api/iam/login",
  IAM_REGISTER: "/api/iam/register",
  IAM_ME:       "/api/iam/me",
  IAM_UPDATE:   "/api/iam/update",
  IAM_LOGOUT:   "/api/iam/logout",

  // ─── ABSENSI ──────────────────────────────────────────────────────────────
  ABSENSI_LIST:                "/api/absensi",
  ABSENSI_STATISTIK:           "/api/absensi/statistik",
  ABSENSI_EKSPOR:              "/api/absensi/ekspor",
  ABSENSI_REKAP:               "/api/absensi/rekap",
  ABSENSI_VERIFY:    (id: string | number) => `/api/absensi/${id}/verifikasi`,
  ABSENSI_DELETE:    (id: string | number) => `/api/absensi/${id}`,
  ABSENSI_SURAT_KET: (id: string | number) => `/api/absensi/${id}/surat-keterangan`,
  ABSENSI_SUBMIT:              "/api/absensi/mahasiswa/submit",
  ABSENSI_RIWAYAT:             "/api/absensi/mahasiswa/riwayat",
  ABSENSI_MAHASISWA_STATISTIK: "/api/absensi/mahasiswa/statistik",
  ABSENSI_TOTAL_KEHADIRAN:     "/api/absensi/total-kehadiran",
  ABSENSI_STATISTIK_KEHADIRAN: "/api/absensi/statistik-kehadiran",
  ABSENSI_CHECKOUT:            "/api/absensi/mahasiswa/checkout",
  ABSENSI_MENTOR_HARIAN: "/api/absensi/mentor/harian",
  ABSENSI_MENTOR_SUBMIT: "/api/absensi/mentor/submit",

  // ─── KEGIATAN ─────────────────────────────────────────────────────────────
  KEGIATAN_LIST:       "/api/kegiatan",
  KEGIATAN_REKAP:      "/api/kegiatan/rekap",
  KEGIATAN_STATISTIK:  "/api/kegiatan/statistik",
  KEGIATAN_DETAIL:   (id: string | number) => `/api/kegiatan/${id}`,
  KEGIATAN_FILE:     (id: string | number) => `/api/kegiatan/${id}/file`,
  KEGIATAN_STATUS:   (id: string | number, status: string) => `/api/kegiatan/${id}/status?status=${encodeURIComponent(status)}`,
  KEGIATAN_MAHASISWA: "/api/kegiatan/mahasiswa",

  // ─── MAHASISWA ────────────────────────────────────────────────────────────
  MAHASISWA_LIST:       "/api/mahasiswa",
  MAHASISWA_STATISTIK:  "/api/mahasiswa/statistik",
  MAHASISWA_SISA_WAKTU: "/api/mahasiswa/sisa-waktu-magang",
  MAHASISWA_DETAIL:  (id: string | number) => `/api/mahasiswa/${id}`,
  MAHASISWA_EDIT_BY_MENTOR: (id: string | number) => `/api/mahasiswa/edit-by-mentor/${id}`,

  // ─── PENILAIAN ────────────────────────────────────────────────────────────
  PENILAIAN_LIST:        "/api/penilaian",
  PENILAIAN_STATISTIK:   "/api/penilaian/statistik",
  PENILAIAN_MAHASISWA:   "/api/penilaian/mahasiswa/nilai",

  // ─── SERTIFIKAT ───────────────────────────────────────────────────────────
  SERTIFIKAT_LIST:        "/api/sertifikat",
  SERTIFIKAT_STATISTIK:   "/api/sertifikat/statistik",
  SERTIFIKAT_MAHASISWA:   "/api/sertifikat/mahasiswa",

  // ─── SURAT KETERANGAN ─────────────────────────────────────────────────────
  SURAT_KETERANGAN_LIST:        "/api/surat-keterangan",
  SURAT_KETERANGAN_STATISTIK:   "/api/surat-keterangan/statistik",
  SURAT_KETERANGAN_MAHASISWA:   "/api/surat-keterangan/mahasiswa",

  // ─── UNIVERSITAS ──────────────────────────────────────────────────────────
  UNIVERSITAS_LIST:   "/api/universitas",
  UNIVERSITAS_DETAIL: (id: string | number) => `/api/universitas/${id}`,

  // ─── DASHBOARD ────────────────────────────────────────────────────────────
  DASHBOARD_MAHASISWA_STATISTIK: "/api/dashboard-mahasiswa/statistik",
  DASHBOARD_MENTOR_STATISTIK:    "/api/dashboard-mentor/statistik",
  DASHBOARD_MENTOR_STATISTIK_KEHADIRAN: "/api/dashboard-mentor/statistik-kehadiran",
  DASHBOARD_MENTOR_MAHASISWA:    "/api/dashboard-mentor/mahasiswa",

  // ─── MEDIA ────────────────────────────────────────────────────────────────
  MEDIA_UPLOAD: "/api/media/upload",
  MEDIA_FILE:   (key: string) => `/api/media/${key}`,
} as const;
