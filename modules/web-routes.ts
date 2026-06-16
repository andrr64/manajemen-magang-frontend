export const WEB_ROUTES = {
  // ─── Auth ─────────────────────────────────────────────────────────────────
  HOME:      "/",
  LOGIN:     "/login",
  REGISTER:  "/register",
  DASHBOARD: "/dashboard",

  // ─── Mahasiswa ────────────────────────────────────────────────────────────
  MAHASISWA_DASHBOARD:       "/dashboard/mahasiswa",
  MAHASISWA_ABSENSI:         "/dashboard/mahasiswa/absensi",
  MAHASISWA_KEGIATAN:        "/dashboard/mahasiswa/kegiatan",
  MAHASISWA_PENILAIAN:       "/dashboard/mahasiswa/penilaian",
  MAHASISWA_SERTIFIKAT:      "/dashboard/mahasiswa/sertifikat",
  MAHASISWA_SURAT_KETERANGAN: "/dashboard/mahasiswa/surat-keterangan",
  MAHASISWA_PROFIL:          "/dashboard/mahasiswa/profil",

  // ─── Mentor ───────────────────────────────────────────────────────────────
  MENTOR_DASHBOARD:        "/dashboard/mentor",
  MENTOR_DATA_MAHASISWA:   "/dashboard/mentor/data-mahasiswa",
  MENTOR_TAMBAH_MAHASISWA: "/dashboard/mentor/data-mahasiswa/tambah-mahasiswa",
  MENTOR_PERIODE_MAGANG:   "/dashboard/mentor/data-mahasiswa/periode-magang",
  MENTOR_DATA_KEGIATAN:    "/dashboard/mentor/data-kegiatan",
  MENTOR_DATA_ABSENSI:     "/dashboard/mentor/data-absensi",
  MENTOR_PENILAIAN:        "/dashboard/mentor/penilaian",
  MENTOR_SERTIFIKAT:       "/dashboard/mentor/sertifikat",
  MENTOR_SURAT_KETERANGAN: "/dashboard/mentor/surat-keterangan",
  MENTOR_PROFIL:           "/dashboard/mentor/profil",

  MENTOR_MAHASISWA_DETAIL:       (id: string | number) => `/dashboard/mentor/data-mahasiswa/${id}`,
  MENTOR_PENILAIAN_DETAIL:       (id: string | number) => `/dashboard/mentor/penilaian/${id}`,
  MENTOR_SERTIFIKAT_DETAIL:      (id: string | number) => `/dashboard/mentor/sertifikat/${id}`,
  MENTOR_SURAT_KETERANGAN_DETAIL: (id: string | number) => `/dashboard/mentor/surat-keterangan/${id}`,
  MENTOR_KEGIATAN_DETAIL:        (id: string | number) => `/dashboard/mentor/data-kegiatan/${id}`,

  // ─── Super Admin ──────────────────────────────────────────────────────────
  SUPER_ADMIN_DASHBOARD:        "/dashboard/super-admin",
  SUPER_ADMIN_KELOLA_MAHASISWA: "/dashboard/super-admin/kelola-mahasiswa",
  SUPER_ADMIN_KELOLA_MENTOR:    "/dashboard/super-admin/kelola-mentor",
  SUPER_ADMIN_PROFIL:           "/dashboard/super-admin/profil",
} as const;
